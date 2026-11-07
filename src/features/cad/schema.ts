import { z } from "zod";
import type { CadDrawing } from "./types";

const ptSchema = z.tuple([z.number(), z.number()]);

const entitySchema = z.object({
  id: z.string(),
  type: z.enum(["LINE", "LWPOLYLINE", "ARC", "CIRCLE"]),
  layer: z.string(),
  pts: z.array(ptSchema),
  closed: z.boolean(),
});

const insertSchema = z.object({
  id: z.string(),
  block: z.string(),
  layer: z.string(),
  at: ptSchema,
  scale: ptSchema,
  rotation: z.number(),
  bbox: z.tuple([ptSchema, ptSchema]),
});

const hatchSchema = z.object({
  id: z.string(),
  layer: z.string(),
  paths: z.array(z.array(ptSchema)),
  solid: z.boolean(),
});

const cadTextSchema = z.object({
  id: z.string(),
  layer: z.string(),
  text: z.string(),
  at: ptSchema,
});

const dimensionSchema = z.object({
  id: z.string(),
  layer: z.string(),
  value: z.number(),
  text: z.string(),
  lines: z.array(z.tuple([ptSchema, ptSchema])),
});

export const cadDrawingSchema = z.object({
  version: z.literal(1),
  source: z.object({
    kind: z.enum(["dxf", "dwg", "plugin"]),
    fileName: z.string(),
    units: z.string(),
  }),
  bounds: z.object({ min: ptSchema, max: ptSchema }),
  layers: z.array(
    z.object({
      name: z.string(),
      color: z.number().optional(),
      entityCount: z.number().int().nonnegative(),
    }),
  ),
  entities: z.array(entitySchema),
  inserts: z.array(insertSchema),
  hatches: z.array(hatchSchema),
  texts: z.array(cadTextSchema),
  dimensions: z.array(dimensionSchema),
});

// 編譯期檢查：schema 推導出的型別必須與 types.ts 的 CadDrawing 完全一致，
// 任何一邊改了另一邊沒改，typecheck 就會失敗。
type Equals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Assert<T extends true> = T;
export type CadDrawingSchemaMatchesType = Assert<
  Equals<z.infer<typeof cadDrawingSchema>, CadDrawing>
>;
