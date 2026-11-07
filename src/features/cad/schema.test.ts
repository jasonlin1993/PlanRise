import { describe, expect, it } from "vitest";
import { cadDrawingSchema } from "./schema";
import type { CadDrawing } from "./types";

const valid: CadDrawing = {
  version: 1,
  source: { kind: "plugin", fileName: "1F.json", units: "mm" },
  bounds: { min: [0, 0], max: [5000, 4000] },
  layers: [{ name: "A-WALL", color: 7, entityCount: 1 }],
  entities: [
    {
      id: "e1",
      type: "LWPOLYLINE",
      layer: "A-WALL",
      pts: [
        [0, 0],
        [5000, 0],
        [5000, 4000],
        [0, 4000],
      ],
      closed: true,
    },
  ],
  inserts: [
    {
      id: "i1",
      block: "DOOR-900",
      layer: "A-DOOR",
      at: [1000, 0],
      scale: [1, 1],
      rotation: 0,
      bbox: [
        [1000, 0],
        [1900, 900],
      ],
    },
  ],
  hatches: [],
  texts: [{ id: "t1", layer: "A-TEXT", text: "客廳", at: [2500, 2000] }],
  dimensions: [],
};

describe("cadDrawingSchema", () => {
  it("合法的 CAD JSON 可以通過驗證", () => {
    const result = cadDrawingSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("缺少必要欄位時驗證失敗", () => {
    const missingEntities: Record<string, unknown> = { ...valid };
    delete missingEntities.entities;
    const result = cadDrawingSchema.safeParse(missingEntities);
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.path[0] === "entities")).toBe(true);
  });
});
