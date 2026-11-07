import { describe, expect, it } from "vitest";
import { parseDxf } from "./parse-dxf";

/** 由 [group code, value] 組出 DXF 文字。 */
function dxf(...groups: [number, string | number][]): string {
  return groups.map(([code, value]) => `${code}\n${value}`).join("\n") + "\n";
}

const sample = dxf(
  [0, "SECTION"],
  [2, "HEADER"],
  [9, "$INSUNITS"],
  [70, 4],
  [0, "ENDSEC"],
  [0, "SECTION"],
  [2, "ENTITIES"],
  // LINE
  [0, "LINE"],
  [5, "A1"],
  [8, "A-WALL"],
  [10, 0],
  [20, 0],
  [30, 0],
  [11, 1000],
  [21, 0],
  [31, 0],
  // CIRCLE
  [0, "CIRCLE"],
  [5, "A2"],
  [8, "S-COL"],
  [10, 500],
  [20, 500],
  [30, 0],
  [40, 100],
  // TEXT
  [0, "TEXT"],
  [5, "A3"],
  [8, "A-TEXT"],
  [10, 200],
  [20, 300],
  [30, 0],
  [40, 50],
  [1, "客廳"],
  [0, "ENDSEC"],
  [0, "EOF"],
);

describe("parseDxf", () => {
  it("轉換 LINE、CIRCLE、TEXT 與圖層清單", () => {
    const d = parseDxf(sample, "test.dxf");

    expect(d.source).toEqual({ kind: "dxf", fileName: "test.dxf", units: "mm" });

    const line = d.entities.find((e) => e.type === "LINE");
    expect(line).toMatchObject({
      layer: "A-WALL",
      pts: [
        [0, 0],
        [1000, 0],
      ],
      closed: false,
    });

    const circle = d.entities.find((e) => e.type === "CIRCLE");
    expect(circle?.closed).toBe(true);
    expect(circle?.pts.length).toBeGreaterThan(8);

    expect(d.texts).toEqual([{ id: "A3", layer: "A-TEXT", text: "客廳", at: [200, 300] }]);
    expect(d.layers.map((l) => l.name)).toEqual(["A-TEXT", "A-WALL", "S-COL"]);
    expect(d.bounds.min[0]).toBe(0);
    expect(d.bounds.max[0]).toBe(1000);
  });

  it("無效內容會丟出錯誤", () => {
    expect(() => parseDxf("not a dxf")).toThrow();
  });
});
