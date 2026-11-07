import { ChevronLeft, Download } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { firstParam } from "@/features/editor/types";
import { SHEETS, SheetPreview, type SheetKey } from "@/features/export/components/sheet-preview";

export const metadata: Metadata = {
  title: "匯出 Excel 預覽 | PlanRise",
};

type Props = PageProps<"/projects/[projectId]/export">;

export default function ExportPage(props: Props) {
  return (
    <Suspense fallback={<div className="h-dvh bg-canvas" />}>
      <ExportContent params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

/** 切版狀態：?sheet=conflicts|lengths|settings */
async function ExportContent({ params, searchParams }: Pick<Props, "params" | "searchParams">) {
  const [{ projectId }, sp] = await Promise.all([params, searchParams]);
  const raw = firstParam(sp.sheet);
  const sheet: SheetKey = SHEETS.find((s) => s.key === raw)?.key ?? "conflicts";
  const back = `/projects/${projectId}/drawings/library-1f?tab=mep`;
  const base = `/projects/${projectId}/export`;

  return (
    <div className="flex h-dvh flex-col bg-canvas">
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-border bg-surface px-4 py-3">
        <Link
          href={back}
          aria-label="返回機電模式"
          className="inline-flex size-9 items-center justify-center rounded-md text-fg-muted hover:bg-sunken"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </Link>
        <div className="min-w-0">
          <h1 className="text-base font-semibold">匯出 Excel 預覽</h1>
          <p className="truncate font-mono text-xs text-fg-muted">
            社區圖書館_1F_衝突清單_20261022.xlsx・3 個工作表
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-[13px] text-fg-muted md:inline">
            匯出時的篩選：全部系統・全部狀態
          </span>
          <ButtonLink href={back} size="lg">
            取消
          </ButtonLink>
          <Button variant="primary" size="lg">
            <Download className="size-4" aria-hidden />
            下載 .xlsx
          </Button>
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col p-4 lg:p-8">
        <SheetPreview
          sheet={sheet}
          hrefFor={(key) => (key === "conflicts" ? base : `${base}?sheet=${key}`)}
        />
      </main>
    </div>
  );
}
