import type { Metadata } from "next";
import { Suspense } from "react";
import { firstParam } from "@/features/editor/types";
import { AppHeader } from "@/features/projects/components/app-header";
import {
  AlignmentCard,
  Dropzone,
  ParseError,
  ParseResult,
  ParsingCard,
  UploadOptions,
  type DrawingType,
} from "@/features/upload/components/upload-parts";

export const metadata: Metadata = {
  title: "上傳圖面 | PlanRise",
};

type Props = PageProps<"/projects/[projectId]/upload">;

export default function UploadPage(props: Props) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <AppHeader
        breadcrumb={[
          { label: "專案", href: "/projects" },
          { label: "社區圖書館", href: "/projects/library", strong: true },
          { label: "1F" },
          { label: "上傳圖面" },
        ]}
      />
      <main className="mx-auto w-full max-w-[1080px] flex-1 space-y-6 px-4 py-10">
        <div>
          <h1 className="text-3xl font-bold">上傳圖面</h1>
          <p className="mt-2 text-sm text-fg-muted">
            支援 DXF 與 PlanRise AutoCAD 插件匯出的 JSON（DWG 即將支援），單檔上限 50 MB。
          </p>
        </div>
        <Suspense fallback={null}>
          <UploadContent params={props.params} searchParams={props.searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

const STATES = ["idle", "parsing", "error", "done", "offset"] as const;
type UploadState = (typeof STATES)[number];

/** 切版狀態：?type=arch|mep、?state=idle|parsing|error|done|offset */
async function UploadContent({ params, searchParams }: Pick<Props, "params" | "searchParams">) {
  const [{ projectId }, sp] = await Promise.all([params, searchParams]);
  const rawType = firstParam(sp.type);
  const rawState = firstParam(sp.state);
  const type: DrawingType = rawType === "mep" ? "mep" : "arch";
  const state: UploadState = STATES.find((s) => s === rawState) ?? "idle";
  const base = `/projects/${projectId}/upload`;
  const editorHref = `/projects/${projectId}/drawings/library-1f-plumbing`;

  return (
    <>
      <UploadOptions type={type} hrefFor={{ arch: base, mep: `${base}?type=mep` }} />
      {state === "idle" && (
        <>
          <Dropzone />
          <p className="text-sm text-fg-muted">
            手上只有 DWG？請先在 AutoCAD 另存為 DXF，或用 PlanRise 插件匯出 JSON。
          </p>
        </>
      )}
      {state === "parsing" && <ParsingCard />}
      {state === "error" && (
        <>
          <ParseError />
          <Dropzone retry />
        </>
      )}
      {(state === "done" || state === "offset") && (
        <>
          <ParseResult type={type} changeHref={type === "mep" ? `${base}?type=mep` : base} />
          {type === "mep" && <AlignmentCard offset={state === "offset"} editorHref={editorHref} />}
        </>
      )}
    </>
  );
}
