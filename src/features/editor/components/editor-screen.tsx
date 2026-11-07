import { analysisView } from "@/features/analysis/components/analysis-view";
import { mappingView } from "@/features/mapping/components/mapping-view";
import { CalibrationDialog } from "@/features/mep/components/calibration-dialog";
import { mepMappingView } from "@/features/mep/components/mep-mapping-view";
import { mepView, type ConflictSelection } from "@/features/mep/components/mep-view";
import { viewerView } from "@/features/viewer-3d/components/viewer-view";
import type { EditorTab, ViewParts } from "../types";
import { DemoBanner, DEMO_EXAMPLES, type DemoExampleId } from "./demo-banner";
import { EditorHeader } from "./editor-header";
import { EditorShell } from "./editor-shell";

type Query = Record<string, string | undefined>;

export interface EditorScreenProps {
  mode: "project" | "demo";
  basePath: string;
  tab: EditorTab;
  drawing: "arch" | "plumbing";
  mepAvailable: boolean;
  mepOverlay: boolean;
  selection: ConflictSelection;
  calibrate: boolean;
  example?: DemoExampleId;
  exportHref: string;
  file?: string;
}

function buildHref(basePath: string, query: Query): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined) search.set(k, v);
  }
  const s = search.toString();
  return s ? `${basePath}?${s}` : basePath;
}

/** 編輯器畫面：依 URL 狀態（模式、選取的衝突、對話框）組出對應的面板 */
export function EditorScreen(props: EditorScreenProps) {
  const {
    mode,
    basePath,
    tab,
    drawing,
    mepAvailable,
    mepOverlay,
    selection,
    calibrate,
    example,
    exportHref,
    file,
  } = props;
  const base: Query = { example: mode === "demo" ? example : undefined };
  const href = (q: Query) => buildHref(basePath, { ...base, ...q });

  const tabHref: Record<EditorTab, string> = {
    "2d": href({}),
    "3d": href({ tab: "3d" }),
    analysis: href({ tab: "analysis" }),
    mep: href({ tab: "mep" }),
  };

  const parts: ViewParts = (() => {
    switch (tab) {
      case "3d":
        return viewerView({
          mepAvailable,
          mepOn: mepOverlay,
          toggleMepHref: href({ tab: "3d", mep: mepOverlay ? undefined : "1" }),
        });
      case "analysis":
        return analysisView();
      case "mep":
        return mepView({
          selection,
          conflictHref: (id) => href({ tab: "mep", conflict: id === 1 ? undefined : String(id) }),
          exportHref,
        });
      case "2d":
        return drawing === "plumbing"
          ? mepMappingView({ calibrateHref: href({ calibrate: "1" }), checkHref: tabHref.mep })
          : mappingView({ demo: mode === "demo", generateHref: tabHref["3d"] });
    }
  })();

  const exampleHref = Object.fromEntries(
    DEMO_EXAMPLES.map((ex) => [
      ex.id,
      buildHref(basePath, {
        example: ex.id === "1" ? undefined : ex.id,
        tab: tab === "2d" ? undefined : tab,
      }),
    ]),
  ) as Record<DemoExampleId, string>;

  return (
    <>
      <EditorShell
        header={
          <EditorHeader
            mode={mode}
            tab={tab}
            tabHref={tabHref}
            showMepTab={mepAvailable}
            mepCount={selection === "empty" ? 0 : 3}
            drawing={tab === "mep" ? "overlay" : drawing}
            file={file ?? "library-1F.dxf"}
          />
        }
        banner={
          mode === "demo" && example ? (
            <DemoBanner example={example} hrefFor={exampleHref} />
          ) : undefined
        }
        left={parts.left}
        center={parts.center}
        right={parts.right}
        statusBar={parts.statusBar}
        mobile={parts.mobile}
      />
      {calibrate && <CalibrationDialog closeHref={href({})} />}
    </>
  );
}
