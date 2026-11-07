import { ArrowRight, Pencil, Plus, Upload } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { ConflictSummary, SystemTag } from "@/features/mep/components/primitives";
import { AppHeader } from "@/features/projects/components/app-header";
import { DrawingCard, UploadTile } from "@/features/projects/components/drawing-card";

export const metadata: Metadata = {
  title: "社區圖書館 | PlanRise",
};

type Props = PageProps<"/projects/[projectId]">;

export default function ProjectPage(props: Props) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <AppHeader active="projects" />
      <Suspense fallback={null}>
        <ProjectContent params={props.params} />
      </Suspense>
    </div>
  );
}

function FloorHeading({
  floor,
  summary,
  aside,
}: {
  floor: string;
  summary: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="rounded-md bg-sunken px-2.5 py-1 text-sm font-semibold">{floor}</span>
      <span className="text-sm text-fg-muted">{summary}</span>
      <span aria-hidden className="hidden h-px flex-1 bg-border md:block" />
      {aside}
    </div>
  );
}

async function ProjectContent({ params }: Pick<Props, "params">) {
  const { projectId } = await params;
  const base = `/projects/${projectId}`;

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 lg:px-12">
      <nav aria-label="位置" className="text-[13px] text-fg-muted">
        <Link href="/projects" className="hover:text-fg">
          專案
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-fg">社區圖書館</span>
      </nav>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            社區圖書館
            <button type="button" aria-label="重新命名" className="text-fg-muted hover:text-fg">
              <Pencil className="size-4" aria-hidden />
            </button>
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            2 層・4 張圖面・建立於 2026/10/02・最後修改 3 小時前
          </p>
        </div>
        <div className="flex gap-2 lg:ml-auto">
          <Button size="lg">
            <Plus className="size-4" aria-hidden />
            新增樓層
          </Button>
          <ButtonLink href={`${base}/upload`} variant="primary" size="lg">
            <Upload className="size-4" aria-hidden />
            上傳圖面
          </ButtonLink>
        </div>
      </div>

      <section className="mt-10 space-y-4">
        <FloorHeading
          floor="1F"
          summary="1 張建築圖・2 張水電圖"
          aside={
            <span className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-[13px]">
              <span className="font-semibold">5 個衝突</span>
              <ConflictSummary />
              <Link
                href={`${base}/drawings/library-1f?tab=mep`}
                className="inline-flex items-center gap-1 font-medium text-accent-fg"
              >
                開啟機電模式
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </span>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <DrawingCard
            href={`${base}/drawings/library-1f`}
            badge="建築圖"
            file="library-1F.dxf"
            meta="今天 14:32"
            image="/mock/card-1f-arch.png"
            kind="model"
          />
          <DrawingCard
            href={`${base}/drawings/library-1f-plumbing`}
            badge="給排水"
            file="library-1F-plumbing.dxf"
            meta={
              <>
                <SystemTag system="water" />
                <SystemTag system="drain" />
                <span>・今天 14:40</span>
              </>
            }
            image="/mock/card-1f-plumbing.png"
            kind="plan"
          />
          <DrawingCard
            href={`${base}/drawings/library-1f-electrical`}
            badge="電力弱電"
            file="library-1F-electrical.dxf"
            meta={
              <>
                <SystemTag system="power" />
                <SystemTag system="lowv" />
                <span>・今天 14:41</span>
              </>
            }
            image="/mock/card-1f-electrical.png"
            kind="plan"
          />
          <UploadTile href={`${base}/upload`} label="上傳圖面到 1F" />
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <FloorHeading floor="2F" summary="1 張建築圖・尚未上傳水電圖" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <DrawingCard
            href={`${base}/drawings/library-2f`}
            badge="建築圖"
            file="library-2F.dxf"
            meta="10 月 18 日"
            image="/mock/card-2f-arch.png"
            kind="model"
          />
          <UploadTile href={`${base}/upload?type=mep`} label="上傳水電圖到 2F" />
        </div>
      </section>

      <p className="mt-10 text-[13px] text-fg-muted">
        建築圖縮圖為最近一次 3D 檢視的截圖；水電圖縮圖為套疊在建築圖上的平面
      </p>
    </main>
  );
}
