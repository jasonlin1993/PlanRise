import type { ConflictSelection } from "@/features/mep/components/mep-view";
import type { DemoExampleId } from "./components/demo-banner";
import { firstParam, parseEditorTab, type EditorTab } from "./types";

type SearchParams = Record<string, string | string[] | undefined>;

export interface EditorQuery {
  tab: EditorTab;
  mepOverlay: boolean;
  selection: ConflictSelection;
  calibrate: boolean;
  example: DemoExampleId;
}

/**
 * 切版階段用 URL 參數切換畫面狀態：
 * ?tab=2d|3d|analysis|mep、?mep=1（3D 疊加機電）、?conflict=1|3|none、?calibrate=1、?example=1|2|3
 */
export function parseEditorQuery(sp: SearchParams): EditorQuery {
  const conflict = firstParam(sp.conflict);
  const example = firstParam(sp.example);
  return {
    tab: parseEditorTab(sp.tab),
    mepOverlay: firstParam(sp.mep) === "1",
    selection: conflict === "3" ? 3 : conflict === "none" ? "empty" : 1,
    calibrate: firstParam(sp.calibrate) === "1",
    example: example === "2" || example === "3" ? example : "1",
  };
}
