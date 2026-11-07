import { ArrowRight, Link2, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge, LogoMark, MockImage, ViewCube } from "@/components/ui/misc";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import {
  ConflictMarker,
  ConflictSummary,
  StatusText,
  SystemLine,
  SystemTag,
} from "@/features/mep/components/primitives";
import { AREA_TOTAL, CONFLICTS, SPACES, SYSTEMS, SYSTEM_ORDER } from "@/features/sample/data";

export type ShareTab = "area" | "conflicts";

const VIEWS = ["東南等角", "西南等角", "上方", "前方"] as const;

function SystemChips({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {SYSTEM_ORDER.map((key) => (
        <button
          key={key}
          type="button"
          aria-pressed={false}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-[13px] text-fg-muted opacity-80 hover:opacity-100"
        >
          <SystemLine system={key} className="opacity-50" />
          {SYSTEMS[key].label}
        </button>
      ))}
    </div>
  );
}

function ViewButtons({ className, large }: { className?: string; large?: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {VIEWS.map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={v === "東南等角"}
          className={cn(
            "rounded-md px-3 text-[13px] font-medium",
            large ? "h-11 border text-sm" : "h-9",
            v === "東南等角"
              ? "border-accent bg-accent-soft text-accent-fg"
              : large
                ? "border-border bg-surface text-fg"
                : "text-fg hover:bg-sunken",
          )}
        >
          {v}
        </button>
      ))}
      {!large && (
        <>
          <span aria-hidden className="mx-1 h-5 w-px bg-border" />
          <button
            type="button"
            className="h-9 rounded-md bg-accent-soft px-3 text-[13px] font-medium text-accent-fg"
          >
            剖切 115 cm
          </button>
        </>
      )}
    </div>
  );
}

function AreaPanel({ compact }: { compact?: boolean }) {
  return (
    <div>
      {!compact && (
        <div className="border-b border-border px-6 py-6">
          <p className="text-[13px] text-fg-muted">總面積</p>
          <p className="mt-1 font-mono text-4xl font-medium">
            {AREA_TOTAL.total}
            <span className="ml-1 font-sans text-sm font-normal text-fg-muted">m²</span>
          </p>
          <p className="mt-1 text-[13px] text-fg-muted">
            8 個空間・室內 {AREA_TOTAL.indoor}・戶外 {AREA_TOTAL.outdoor}
          </p>
        </div>
      )}
      <table className="w-full text-[13px]">
        {!compact && (
          <thead className="bg-subtle text-left text-fg-muted">
            <tr>
              <th className="h-12 px-6 font-normal">空間</th>
              <th className="font-normal">類型</th>
              <th className="px-6 text-right font-normal">面積 m²</th>
            </tr>
          </thead>
        )}
        <tbody>
          {SPACES.map((s) => {
            const selected = s.name === "閱覽區";
            return (
              <tr
                key={s.name}
                className={cn(
                  "border-t border-border",
                  selected && "bg-accent-soft text-accent-fg",
                )}
              >
                <td className={cn("h-14 font-medium", compact ? "px-5" : "px-6")}>
                  {s.name}
                  {compact && (
                    <span className="ml-2 text-xs font-normal text-fg-muted">{s.kind}</span>
                  )}
                </td>
                {!compact && <td className={cn(!selected && "text-fg-muted")}>{s.kind}</td>}
                <td className={cn("text-right font-mono", compact ? "px-5" : "px-6")}>
                  {s.area.toFixed(1)}
                </td>
              </tr>
            );
          })}
          {!compact && (
            <tr className="border-t border-border font-semibold">
              <td className="h-14 px-6">合計</td>
              <td />
              <td className="px-6 text-right font-mono">{AREA_TOTAL.total}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ConflictPanel() {
  const first = CONFLICTS[0];
  return (
    <div>
      <div className="border-b border-border px-6 py-5">
        <p className="text-[13px] text-fg-muted">機電衝突</p>
        <p className="mt-1 flex items-center gap-3">
          <span className="font-mono text-3xl font-medium">5</span>
          <ConflictSummary />
        </p>
      </div>
      <ul>
        {CONFLICTS.map((c) => {
          const open = c.id === first?.id;
          return (
            <li key={c.id} className="border-b border-border">
              <div className={cn("flex items-center gap-3 px-6 py-4", open && "bg-accent-soft")}>
                <ConflictMarker id={c.id} status={c.status} selected={open} size="md" />
                <div className="min-w-0 flex-1">
                  <p className={cn("text-[13px] font-semibold", open && "text-accent-fg")}>
                    {c.type}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs">
                    {c.systems.map((s) => (
                      <SystemTag key={s.label ?? s.system} system={s.system} label={s.label} />
                    ))}
                    <span className="text-fg-muted">・{c.space}</span>
                  </p>
                </div>
                <StatusText status={c.status} />
              </div>
              {open && (
                <dl className="space-y-2.5 bg-subtle px-6 py-4 pl-16 text-[13px]">
                  {[
                    ["類型", c.type],
                    ["碰撞對象", c.target],
                    ["座標", `X ${c.x} Y ${c.y}`],
                    ["高程", c.elevationShort],
                    ["備註", c.note],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-2">
                      <dt className="text-fg-muted">{k}</dt>
                      <dd className={cn(k === "座標" || k === "高程" ? "font-mono" : "")}>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </li>
          );
        })}
      </ul>
      <p className="px-6 py-4 text-xs text-fg-muted">唯讀：狀態與備註由專案成員在編輯器中更新。</p>
    </div>
  );
}

export function ShareView({ tab, hrefFor }: { tab: ShareTab; hrefFor: Record<ShareTab, string> }) {
  const tabs = [
    { key: "area", href: hrefFor.area, active: tab === "area" },
    { key: "conflicts", href: hrefFor.conflicts, active: tab === "conflicts" },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-canvas lg:h-dvh">
      <header className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:px-6">
        <LogoMark />
        <h1 className="text-base font-semibold">社區圖書館 1F</h1>
        <Badge className="h-6 gap-1">
          <Lock className="size-3" aria-hidden />
          唯讀
        </Badge>
        <p className="hidden truncate text-[13px] text-fg-muted lg:block">
          林小築 分享・更新於 2026/10/22・衝突檢查於 10/22 14:40
        </p>
        <Button size="lg" className="ml-auto">
          <Link2 className="size-4" aria-hidden />
          複製連結
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="relative h-[48vh] shrink-0 grid-paper lg:h-auto lg:flex-1">
          <div className="absolute top-4 left-4 z-10 hidden items-center gap-2 rounded-lg border border-border bg-surface p-1.5 pl-3 text-[13px] lg:flex">
            機電系統
            <SystemChips />
          </div>
          <div className="absolute top-4 right-4 z-10 lg:top-6 lg:right-8">
            <ViewCube />
          </div>
          <MockImage
            src={
              tab === "conflicts"
                ? "/mock/model-3d-share-conflicts.png"
                : "/mock/model-3d-highlight.png"
            }
            alt={tab === "conflicts" ? "3D 模型標示機電衝突位置" : "3D 模型，閱覽區以藍色標示"}
            preload
            className="absolute inset-x-3 top-12 bottom-4 lg:inset-x-[6%] lg:top-[14%] lg:bottom-[14%]"
          />
          <ViewButtons className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 rounded-lg border border-border bg-surface p-1 lg:flex" />
        </section>

        {/* 手機：視角與系統切換排在畫布下方 */}
        <div className="space-y-3 border-b border-border px-4 py-4 lg:hidden">
          <ViewButtons large />
          <SystemChips />
        </div>

        <aside className="flex min-h-0 w-full flex-col bg-surface lg:w-[460px] lg:border-l lg:border-border">
          <div className="p-4">
            <Segmented
              stretch
              size="lg"
              items={tabs.map((t) => ({
                ...t,
                label:
                  t.key === "area" ? (
                    "面積"
                  ) : (
                    <>
                      衝突・未處理 <span className="font-mono">3</span>
                    </>
                  ),
              }))}
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto border-t border-border">
            {tab === "area" ? (
              <>
                <div className="hidden lg:block">
                  <AreaPanel />
                </div>
                <div className="p-4 lg:hidden">
                  <div className="mb-3 flex items-baseline justify-between">
                    <h2 className="text-lg font-semibold">面積表</h2>
                    <span className="font-mono text-lg">{AREA_TOTAL.total} m²</span>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <AreaPanel compact />
                  </div>
                </div>
              </>
            ) : (
              <ConflictPanel />
            )}
          </div>
        </aside>
      </div>

      <footer className="flex shrink-0 flex-col items-center gap-3 border-t border-border bg-surface px-6 py-5 text-[13px] text-fg-muted lg:h-12 lg:flex-row lg:py-0">
        唯讀檢視・可旋轉與剖切，無法編輯
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-medium text-accent-fg lg:ml-auto"
        >
          用 PlanRise 製作
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </footer>
    </div>
  );
}
