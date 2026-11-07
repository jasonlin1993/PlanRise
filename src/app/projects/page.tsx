import { LayoutPanelLeft, Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { SelectBox } from "@/components/ui/form";
import { EmptyState } from "@/components/ui/empty-state";
import { firstParam } from "@/features/editor/types";
import { AppHeader } from "@/features/projects/components/app-header";
import { DeletedToast, ProjectCard } from "@/features/projects/components/project-card";
import { PROJECTS } from "@/features/sample/data";

export const metadata: Metadata = {
  title: "專案 | PlanRise",
};

export default function ProjectsPage(props: PageProps<"/projects">) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <AppHeader active="projects" />
      <Suspense fallback={null}>
        <ProjectsContent searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

/** 切版狀態：?state=empty（沒有專案）、?state=menu（展開選單＋刪除提示） */
async function ProjectsContent({ searchParams }: Pick<PageProps<"/projects">, "searchParams">) {
  const state = firstParam((await searchParams).state);

  if (state === "empty") {
    return (
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 py-8 lg:px-12">
        <h1 className="text-2xl font-bold">專案</h1>
        <div className="mt-8 flex flex-1 items-center justify-center rounded-xl border border-dashed border-border-strong py-24">
          <EmptyState
            icon={<LayoutPanelLeft className="size-7" aria-hidden />}
            title="還沒有專案"
            description="新增專案並上傳 DXF 或插件匯出的 JSON，就能生成 3D；之後也可以疊上水電圖檢查衝突。"
            actions={
              <>
                <Button variant="primary" size="lg">
                  <Plus className="size-4" aria-hidden />
                  新增專案
                </Button>
                <ButtonLink href="/demo" size="lg">
                  先看 Demo
                </ButtonLink>
              </>
            }
          />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 lg:px-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <h1 className="flex items-baseline gap-3 text-2xl font-bold">
          專案 <span className="text-sm font-normal text-fg-muted">{PROJECTS.length} 個專案</span>
        </h1>
        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-border-strong bg-surface px-3 lg:w-80 lg:flex-none">
            <Search className="size-4 text-fg-muted" aria-hidden />
            <input
              placeholder="搜尋專案"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-fg-subtle"
            />
          </label>
          <SelectBox value="最近修改" size="lg" label="排序" />
          <Button variant="primary" size="lg">
            <Plus className="size-4" aria-hidden />
            新增專案
          </Button>
        </div>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} menuOpen={state === "menu" && i === 0} />
        ))}
      </div>
      {state === "menu" && <DeletedToast />}
    </main>
  );
}
