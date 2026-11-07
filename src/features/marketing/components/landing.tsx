import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { Badge, Logo, MockImage } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

const CONTAINER = "mx-auto w-full max-w-[1232px] px-6";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-canvas">
      <div className={cn(CONTAINER, "flex h-16 items-center gap-10")}>
        <Logo />
        <nav aria-label="主要" className="hidden items-center gap-6 text-sm text-fg-muted md:flex">
          <Link href="/demo" className="hover:text-fg">
            Demo
          </Link>
          <Link href="#how" className="hover:text-fg">
            運作方式
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle className="hidden md:inline-flex" />
          <ButtonLink
            href="/login"
            size="md"
            className="max-md:border-transparent max-md:bg-transparent"
          >
            登入
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

function HeroVisual() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border grid-paper">
      <div className="absolute top-4 left-4 z-10 hidden gap-0.5 rounded-lg border border-border bg-surface p-1 text-xs sm:flex">
        <span className="rounded-md px-2.5 py-1 text-fg-muted">2D 對應</span>
        <span className="rounded-md bg-accent-soft px-2.5 py-1 font-medium text-accent-fg">
          3D 檢視
        </span>
        <span className="rounded-md px-2.5 py-1 text-fg-muted">分析</span>
      </div>
      <div className="absolute top-4 right-4 z-10 rounded-lg border border-border bg-surface px-3 py-2 shadow-sm">
        <p className="flex items-center gap-1.5 text-xs font-medium text-accent-fg">
          <span aria-hidden className="size-2 rounded-xs bg-accent" />
          閱覽區
        </p>
        <p className="font-mono text-lg">118.6 m²</p>
      </div>
      <MockImage
        src="/mock/model-3d-highlight.png"
        alt="社區圖書館的 3D 模型，閱覽區以藍色標示"
        preload
        sizes="(min-width: 1024px) 640px, 100vw"
        className="absolute inset-x-2 top-14 bottom-4"
      />
      <dl className="absolute bottom-4 left-4 z-10 hidden w-56 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs sm:block">
        {[
          ["A-WALL", "牆"],
          ["A-COL", "柱"],
          ["A-WD", "門窗"],
          ["A-FUR", "家具"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-1">
            <dt>{k}</dt>
            <dd className="font-sans text-fg-muted">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Hero() {
  return (
    <section
      className={cn(CONTAINER, "grid items-center gap-12 py-12 lg:grid-cols-[5fr_6fr] lg:py-24")}
    >
      <div>
        <p className="font-mono text-xs tracking-wide text-fg-muted">DXF・AutoCAD JSON → 3D</p>
        <h1 className="mt-6 text-4xl leading-tight font-bold tracking-tight md:text-5xl md:leading-tight">
          把平面圖，
          <br />
          直接升成 3D。
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-fg-muted">
          上傳平面圖，確認每個圖層是牆、柱、門窗還是家具，PlanRise 會自動生成可旋轉、可剖切的 3D
          模型，並算好各空間的面積表。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/demo" variant="primary" size="lg" className="h-12 text-[15px]">
            立即試用
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href="/login" size="lg" className="h-12 text-[15px]">
            登入
          </ButtonLink>
        </div>
        <p className="mt-6 text-center text-[13px] text-fg-muted sm:text-left">
          免登入試用・內含 3 張範例圖（含 1 張水電範例）
        </p>
      </div>
      <HeroVisual />
    </section>
  );
}

function StepCard({
  n,
  title,
  body,
  visual,
}: {
  n: string;
  title: string;
  body: string;
  visual: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="hidden h-52 items-center justify-center border-b border-border bg-subtle p-6 md:flex">
        {visual}
      </div>
      <div className="flex gap-4 p-5 md:block md:p-6">
        <p className="font-mono text-xs text-fg-muted md:mb-3">{n}</p>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{body}</p>
        </div>
      </div>
    </article>
  );
}

export function Steps() {
  return (
    <section id="how" className="border-y border-border bg-surface">
      <div className={cn(CONTAINER, "py-16 lg:py-24")}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-2xl font-bold">
            三個步驟<span className="hidden md:inline">，從線條到空間</span>
          </h2>
          <p className="hidden text-sm text-fg-muted md:block">不需要重畫，也不需要建模軟體</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          <StepCard
            n="01"
            title="上傳"
            body="拖曳 DXF，或用 PlanRise AutoCAD 插件輸出的 JSON。系統自動讀出圖層、圖塊與單位。"
            visual={
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
                  <span className="rounded bg-sunken px-1.5 py-1 font-mono text-[10px] text-fg-muted">
                    DXF
                  </span>
                  <div className="flex-1 space-y-2">
                    <p className="font-mono text-xs">library-1F.dxf</p>
                    <div className="h-1 rounded-full bg-sunken">
                      <div className="h-full w-3/4 rounded-full bg-accent" />
                    </div>
                  </div>
                </div>
                <p className="flex gap-2 font-mono text-[11px] text-fg-muted">
                  <span className="rounded border border-border bg-surface px-1.5 py-0.5">
                    .dxf
                  </span>
                  <span className="rounded border border-border bg-surface px-1.5 py-0.5">
                    .json
                  </span>
                </p>
              </div>
            }
          />
          <StepCard
            n="02"
            title="對應圖層"
            body="確認每個圖層的角色，圖塊依名稱自動配對門窗或家具樣板。常用的對應可存成 preset，下次一鍵套用。"
            visual={
              <ul className="w-full space-y-2 font-mono text-xs">
                {[
                  ["A-WALL", "牆", false],
                  ["A-WD", "門窗", true],
                  ["A-FUR", "家具", false],
                ].map(([k, v, on]) => (
                  <li
                    key={String(k)}
                    className={cn(
                      "flex items-center gap-3 rounded-md border bg-surface px-3 py-2.5",
                      on ? "border-accent bg-accent-soft text-accent-fg" : "border-border",
                    )}
                  >
                    <span className="flex-1">{k}</span>
                    <ArrowRight className="size-3 text-fg-muted" aria-hidden />
                    <span
                      className={cn(
                        "w-20 rounded px-2 py-0.5 font-sans",
                        on ? "bg-surface text-fg" : "bg-sunken",
                      )}
                    >
                      {v}
                    </span>
                  </li>
                ))}
              </ul>
            }
          />
          <StepCard
            n="03"
            title="生成 3D"
            body="得到可旋轉、可剖切的 3D 模型與空間面積表，產生唯讀連結分享給業主或老師。"
            visual={
              <MockImage
                src="/mock/model-3d.png"
                alt="生成的 3D 模型"
                sizes="360px"
                className="h-full w-full"
              />
            }
          />
        </div>
      </div>
    </section>
  );
}

export function MepSection() {
  const points = [
    { title: "疊上水電圖", body: "給排水、電力弱電圖與建築圖自動對齊，偏移時用兩點校正。" },
    { title: "自動找出管線交錯與穿柱", body: "也會標出穿過 RC 牆的位置，每個衝突都有編號。" },
    { title: "匯出 Excel 衝突清單", body: "含座標、高程、所在空間與處理狀態。" },
  ];
  return (
    <section className={cn(CONTAINER, "py-16 lg:py-24")}>
      <div className="grid items-center gap-8 rounded-xl border border-border bg-surface p-5 lg:grid-cols-2 lg:gap-12 lg:border-0 lg:bg-transparent lg:p-0">
        <div>
          <Badge tone="accent">加值功能</Badge>
          <h2 className="mt-4 text-2xl font-bold">機電套疊檢查</h2>
          <p className="mt-4 hidden text-sm leading-relaxed text-fg-muted lg:block">
            建築 3D 建好後，可以在同一樓層再疊上水電圖，施工前先找出管線衝突。
          </p>
          <ul className="mt-6 hidden space-y-4 lg:block">
            {points.map((p) => (
              <li key={p.title} className="flex gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <div>
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="mt-0.5 text-sm text-fg-muted">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <ButtonLink
            href="/demo?example=3&tab=mep"
            size="lg"
            className="mt-8 hidden lg:inline-flex"
          >
            看機電範例 <span className="text-xs font-normal text-fg-muted">Demo 範例 3</span>
          </ButtonLink>
        </div>
        <div className="relative aspect-[5/3] overflow-hidden rounded-xl border border-border grid-paper">
          <MockImage
            src="/mock/model-3d-conflicts-1.png"
            alt="3D 模型疊上水電管線，標出 5 個衝突"
            sizes="(min-width: 1024px) 600px, 100vw"
            className="absolute inset-4 hidden lg:block"
          />
          <MockImage
            src="/mock/plan-mep-1.png"
            alt="平面套疊標出 5 個衝突"
            kind="plan"
            sizes="100vw"
            className="absolute inset-4 lg:hidden"
          />
        </div>
        <div className="lg:hidden">
          <p className="text-sm leading-relaxed text-fg-muted">
            疊上水電圖・自動找出管線交錯與穿柱・匯出 Excel 衝突清單
          </p>
          <ButtonLink href="/demo?example=3&tab=mep" size="lg" className="mt-4 w-full">
            看機電範例
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className={cn(CONTAINER, "flex h-20 items-center gap-4 text-[13px] text-fg-muted")}>
        <span className="font-semibold text-fg">PlanRise</span>
        <span className="hidden md:inline">為建築、室內與機電設計師打造</span>
        <nav aria-label="頁尾" className="ml-auto flex items-center gap-5">
          <Link href="/demo" className="hidden hover:text-fg md:inline">
            Demo
          </Link>
          <Link href="/login" className="hidden hover:text-fg md:inline">
            登入
          </Link>
          <span>© 2026</span>
        </nav>
      </div>
    </footer>
  );
}
