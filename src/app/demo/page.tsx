import type { Metadata } from "next";
import { Suspense } from "react";
import { EditorScreen } from "@/features/editor/components/editor-screen";
import { parseEditorQuery } from "@/features/editor/query";

export const metadata: Metadata = {
  title: "Demo | PlanRise",
};

export default function DemoPage(props: PageProps<"/demo">) {
  return (
    <Suspense fallback={<div className="h-dvh bg-canvas" />}>
      <DemoEditor searchParams={props.searchParams} />
    </Suspense>
  );
}

async function DemoEditor({ searchParams }: Pick<PageProps<"/demo">, "searchParams">) {
  const q = parseEditorQuery(await searchParams);
  // 範例 1、2 只有建築圖，不顯示機電模式；範例 3 才有水電圖
  const mepAvailable = q.example === "3";
  const tab = !mepAvailable && q.tab === "mep" ? "2d" : q.tab;

  return (
    <EditorScreen
      mode="demo"
      basePath="/demo"
      tab={tab}
      drawing="arch"
      mepAvailable={mepAvailable}
      mepOverlay={q.mepOverlay}
      selection={q.selection}
      calibrate={false}
      example={q.example}
      exportHref="/projects/library/export"
    />
  );
}
