/**
 * DXF → CadDrawing 轉換。
 *
 * dxf-parser 已停止維護，之後可能替換，因此整個專案只有這個檔案可以 import 它；
 * 其他程式一律透過 parseDxf() 取得 CadDrawing。
 */
import DxfParser from "dxf-parser";
import type {
  IArcEntity,
  IBlock,
  ICircleEntity,
  IDxf,
  IEntity,
  IInsertEntity,
  ILineEntity,
  ILwpolylineEntity,
  IMtextEntity,
  IPoint,
  ITextEntity,
} from "dxf-parser";
import { cadDrawingSchema } from "./schema";
import type { CadDrawing, CadText, Entity, Insert, Pt } from "./types";

/** 圓弧離散時每段最大角度（弧度）。 */
const ARC_STEP = Math.PI / 32;
/** 完整圓的分段數。 */
const CIRCLE_SEGMENTS = 64;
/** 巢狀圖塊最大展開深度，避免循環參照。 */
const MAX_BLOCK_DEPTH = 8;

/** $INSUNITS 對照表（只列常用值）。 */
const INSUNITS: Record<number, string> = {
  0: "unitless",
  1: "in",
  2: "ft",
  4: "mm",
  5: "cm",
  6: "m",
};

export function parseDxf(text: string, fileName = "drawing.dxf"): CadDrawing {
  const dxf = new DxfParser().parseSync(text);
  if (!dxf) throw new Error("無法解析 DXF 檔案");

  const entities: Entity[] = [];
  const inserts: Insert[] = [];
  const texts: CadText[] = [];
  const layerCounts = new Map<string, number>();
  const blockBoxes = new Map<string, [Pt, Pt] | null>();

  dxf.entities.forEach((e, index) => {
    if (e.inPaperSpace) return;
    const id = e.handle !== undefined ? String(e.handle) : `e${index}`;
    const layer = e.layer ?? "0";
    let converted = true;

    switch (e.type) {
      case "LINE":
      case "LWPOLYLINE":
      case "ARC":
      case "CIRCLE": {
        const geom = toGeometry(e);
        if (geom) entities.push({ id, type: e.type, layer, ...geom });
        else converted = false;
        break;
      }
      case "INSERT": {
        const ins = e as IInsertEntity;
        const at = toPt(ins.position);
        if (!at) {
          converted = false;
          break;
        }
        const scale: Pt = [ins.xScale ?? 1, ins.yScale ?? 1];
        const rotation = ins.rotation ?? 0;
        const local = blockBox(dxf, ins.name, blockBoxes, 0);
        inserts.push({
          id,
          block: ins.name,
          layer,
          at,
          scale,
          rotation,
          bbox: local ? transformBox(local, at, scale, rotation) : [at, at],
        });
        break;
      }
      case "TEXT": {
        const t = e as ITextEntity;
        const at = toPt(t.startPoint);
        if (at && t.text) texts.push({ id, layer, text: t.text, at });
        else converted = false;
        break;
      }
      case "MTEXT": {
        const t = e as IMtextEntity;
        const at = toPt(t.position);
        const content = cleanMtext(t.text ?? "");
        if (at && content) texts.push({ id, layer, text: content, at });
        else converted = false;
        break;
      }
      // TODO: HATCH（dxf-parser 1.x 不解析 HATCH，需要自行讀 group code 或換解析器）
      // TODO: DIMENSION（之後轉成 Dimension，含量測值與尺寸線）
      default:
        converted = false;
    }

    if (converted) layerCounts.set(layer, (layerCounts.get(layer) ?? 0) + 1);
  });

  const drawing: CadDrawing = {
    version: 1,
    source: { kind: "dxf", fileName, units: readUnits(dxf) },
    bounds: computeBounds(entities, inserts, texts),
    layers: collectLayers(dxf, layerCounts),
    entities,
    inserts,
    hatches: [],
    texts,
    dimensions: [],
  };

  return cadDrawingSchema.parse(drawing);
}

// ---------------------------------------------------------------------------
// 幾何轉換

function toPt(p: IPoint | undefined): Pt | null {
  if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) return null;
  return [p.x, p.y];
}

function toGeometry(e: IEntity): { pts: Pt[]; closed: boolean } | null {
  switch (e.type) {
    case "LINE": {
      const v = (e as ILineEntity).vertices ?? [];
      const a = toPt(v[0]);
      const b = toPt(v[1]);
      return a && b ? { pts: [a, b], closed: false } : null;
    }
    case "LWPOLYLINE": {
      const pl = e as ILwpolylineEntity;
      const pts = polylineWithBulges(pl.vertices ?? [], !!pl.shape);
      return pts.length >= 2 ? { pts, closed: !!pl.shape } : null;
    }
    case "ARC": {
      const a = e as IArcEntity;
      const c = toPt(a.center);
      if (!c || !Number.isFinite(a.radius)) return null;
      let sweep = a.endAngle - a.startAngle;
      if (sweep <= 0) sweep += Math.PI * 2;
      return { pts: arcPoints(c, a.radius, a.startAngle, sweep), closed: false };
    }
    case "CIRCLE": {
      const ci = e as ICircleEntity;
      const c = toPt(ci.center);
      if (!c || !Number.isFinite(ci.radius)) return null;
      const pts: Pt[] = [];
      for (let i = 0; i < CIRCLE_SEGMENTS; i++) {
        const t = (i / CIRCLE_SEGMENTS) * Math.PI * 2;
        pts.push([c[0] + ci.radius * Math.cos(t), c[1] + ci.radius * Math.sin(t)]);
      }
      return { pts, closed: true };
    }
    default:
      return null;
  }
}

/** 由起始角沿逆時針掃過 sweep 弧度的離散點（含起點與終點）。 */
function arcPoints(c: Pt, r: number, start: number, sweep: number): Pt[] {
  const n = Math.max(2, Math.ceil(Math.abs(sweep) / ARC_STEP));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = start + (sweep * i) / n;
    pts.push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]);
  }
  return pts;
}

/** 展開 LWPOLYLINE 的 bulge（弧段），回傳離散後的點列。 */
function polylineWithBulges(vertices: ILwpolylineEntity["vertices"], closed: boolean): Pt[] {
  const valid = vertices.filter((v) => Number.isFinite(v.x) && Number.isFinite(v.y));
  const pts: Pt[] = [];
  const segCount = closed ? valid.length : valid.length - 1;
  if (valid.length === 0) return pts;
  pts.push([valid[0].x, valid[0].y]);

  for (let i = 0; i < segCount; i++) {
    const a = valid[i];
    const b = valid[(i + 1) % valid.length];
    const bulge = a.bulge ?? 0;
    if (bulge !== 0) {
      // bulge = tan(θ/4)，θ 為弧的圓心角，正值為逆時針
      const theta = 4 * Math.atan(bulge);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const chord = Math.hypot(dx, dy);
      if (chord > 0) {
        const r = chord / (2 * Math.sin(Math.abs(theta) / 2));
        const mid: Pt = [(a.x + b.x) / 2, (a.y + b.y) / 2];
        const h = r * Math.cos(theta / 2) * Math.sign(bulge);
        const center: Pt = [mid[0] - (dy / chord) * h, mid[1] + (dx / chord) * h];
        const start = Math.atan2(a.y - center[1], a.x - center[0]);
        // 去掉起點（已在 pts 中）
        pts.push(...arcPoints(center, r, start, theta).slice(1));
        continue;
      }
    }
    // 閉合時最後一段回到起點，不重複加入
    if (!(closed && i === segCount - 1)) pts.push([b.x, b.y]);
  }

  // 閉合且最後一段是弧時，最後一點會等於起點，移除重複點
  if (closed && pts.length > 1) {
    const [fx, fy] = pts[0];
    const [lx, ly] = pts[pts.length - 1];
    if (Math.hypot(fx - lx, fy - ly) < 1e-9) pts.pop();
  }
  return pts;
}

// ---------------------------------------------------------------------------
// 圖塊外框

/** 計算圖塊在自身座標（相對基準點）的外框，結果會快取。 */
function blockBox(
  dxf: IDxf,
  name: string,
  cache: Map<string, [Pt, Pt] | null>,
  depth: number,
): [Pt, Pt] | null {
  if (cache.has(name)) return cache.get(name) ?? null;
  const block: IBlock | undefined = dxf.blocks?.[name];
  if (!block || depth > MAX_BLOCK_DEPTH) return null;
  cache.set(name, null); // 先佔位，防止循環參照

  const base = toPt(block.position) ?? [0, 0];
  const pts: Pt[] = [];
  for (const e of block.entities ?? []) {
    if (e.type === "INSERT") {
      const ins = e as IInsertEntity;
      const at = toPt(ins.position);
      const inner = blockBox(dxf, ins.name, cache, depth + 1);
      if (at && inner) {
        pts.push(...transformBox(inner, at, [ins.xScale ?? 1, ins.yScale ?? 1], ins.rotation ?? 0));
      }
      continue;
    }
    const geom = toGeometry(e);
    if (geom) pts.push(...geom.pts);
  }

  const box = pts.length ? boundsOf(pts.map(([x, y]): Pt => [x - base[0], y - base[1]])) : null;
  cache.set(name, box);
  return box;
}

/** 把圖塊本地外框依 scale → rotation（度）→ 平移轉換，回傳世界座標的軸對齊外框。 */
function transformBox(box: [Pt, Pt], at: Pt, scale: Pt, rotationDeg: number): [Pt, Pt] {
  const [[x0, y0], [x1, y1]] = box;
  const rad = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const corners: Pt[] = [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
  ].map(([x, y]): Pt => {
    const sx = x * scale[0];
    const sy = y * scale[1];
    return [at[0] + sx * cos - sy * sin, at[1] + sx * sin + sy * cos];
  });
  return boundsOf(corners);
}

// ---------------------------------------------------------------------------
// 其他

function boundsOf(pts: Pt[]): [Pt, Pt] {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of pts) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return [
    [minX, minY],
    [maxX, maxY],
  ];
}

function computeBounds(
  entities: Entity[],
  inserts: Insert[],
  texts: CadText[],
): CadDrawing["bounds"] {
  const pts: Pt[] = [
    ...entities.flatMap((e) => e.pts),
    ...inserts.flatMap((i) => i.bbox),
    ...texts.map((t) => t.at),
  ];
  if (pts.length === 0) return { min: [0, 0], max: [0, 0] };
  const [min, max] = boundsOf(pts);
  return { min, max };
}

function readUnits(dxf: IDxf): string {
  const v = dxf.header?.["$INSUNITS"];
  return typeof v === "number" ? (INSUNITS[v] ?? `insunits:${v}`) : "unitless";
}

/** 圖層清單：圖層表中的圖層 + 實體用到但圖層表沒列的圖層。color 為 RGB 整數。 */
function collectLayers(dxf: IDxf, counts: Map<string, number>): CadDrawing["layers"] {
  const table = dxf.tables?.layer?.layers ?? {};
  const names = new Set([...Object.keys(table), ...counts.keys()]);
  return [...names].sort().map((name) => {
    const color = table[name]?.color;
    return {
      name,
      ...(Number.isFinite(color) ? { color } : {}),
      entityCount: counts.get(name) ?? 0,
    };
  });
}

/** 移除 MTEXT 格式碼，保留純文字。 */
function cleanMtext(raw: string): string {
  return raw
    .replace(/\\P/g, "\n")
    .replace(/\\[ACcFfHhQTWp][^;]*;/g, "")
    .replace(/\\[LlOoKk]/g, "")
    .replace(/\\S([^;]*?)[#^/]([^;]*);/g, "$1/$2")
    .replace(/[{}]/g, "")
    .trim();
}
