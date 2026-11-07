export type Pt = [number, number];

export interface CadDrawing {
  version: 1;
  source: { kind: "dxf" | "dwg" | "plugin"; fileName: string; units: string };
  bounds: { min: Pt; max: Pt };
  layers: { name: string; color?: number; entityCount: number }[];
  entities: Entity[];
  inserts: Insert[];
  hatches: Hatch[];
  texts: CadText[];
  dimensions: Dimension[];
}

export interface Entity {
  id: string;
  type: "LINE" | "LWPOLYLINE" | "ARC" | "CIRCLE";
  layer: string;
  pts: Pt[];
  closed: boolean;
}
export interface Insert {
  id: string;
  block: string;
  layer: string;
  at: Pt;
  scale: Pt;
  rotation: number;
  bbox: [Pt, Pt];
}
export interface Hatch {
  id: string;
  layer: string;
  paths: Pt[][];
  solid: boolean;
}
export interface CadText {
  id: string;
  layer: string;
  text: string;
  at: Pt;
}
export interface Dimension {
  id: string;
  layer: string;
  value: number;
  text: string;
  lines: [Pt, Pt][];
}
