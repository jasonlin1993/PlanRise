import type { Metadata } from "next";
import { Suspense } from "react";
import { EditorScreen } from "@/features/editor/components/editor-screen";
import { parseEditorQuery } from "@/features/editor/query";

export const metadata: Metadata = {
  title: "編輯器 | PlanRise",
};

type Props = PageProps<"/projects/[projectId]/drawings/[drawingId]">;

export default function DrawingPage(props: Props) {
  return (
    <Suspense fallback={<div className="h-dvh bg-canvas" />}>
      <DrawingEditor params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

async function DrawingEditor({ params, searchParams }: Pick<Props, "params" | "searchParams">) {
  const [{ projectId, drawingId }, sp] = await Promise.all([params, searchParams]);
  const q = parseEditorQuery(sp);
  // 切版：plumbing／electrical 視為水電圖，2D 對應顯示系統設定
  const drawing = /plumbing|electrical/.test(drawingId) ? "plumbing" : "arch";
  const file = `${drawingId.replace(/^library-(\d)f/, "library-$1F")}.dxf`;

  return (
    <EditorScreen
      mode="project"
      basePath={`/projects/${projectId}/drawings/${drawingId}`}
      tab={q.tab}
      drawing={drawing}
      file={file}
      mepAvailable
      mepOverlay={q.mepOverlay}
      selection={q.selection}
      calibrate={drawing === "plumbing" && q.calibrate}
      exportHref={`/projects/${projectId}/export`}
    />
  );
}
