import {
  ArrowLeftRight,
  ChevronDown,
  CircleCheck,
  Download,
  RotateCw,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Checkbox, NumberField, SelectBox } from "@/components/ui/form";
import { MockImage, SectionLabel } from "@/components/ui/misc";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import { ChipSwatch, PaneHeader } from "@/features/editor/components/canvas-parts";
import { PanelHeader, StatusGroup } from "@/features/editor/components/editor-shell";
import type { ViewParts } from "@/features/editor/types";
import { CONFLICTS, type Conflict } from "@/features/sample/data";
import {
  ConflictMarker,
  ConflictSummary,
  MepLegend,
  StatusDot,
  StatusText,
  SystemTag,
} from "./primitives";

export type ConflictSelection = 1 | 3 | "empty";

interface MepViewOptions {
  selection: ConflictSelection;
  conflictHref: (id: number) => string;
  exportHref: string;
}

function ConflictList({
  selected,
  conflictHref,
  large,
}: {
  selected: number;
  conflictHref: (id: number) => string;
  large?: boolean;
}) {
  return (
    <ul className={cn("space-y-1 p-2", large && "p-3")}>
      {CONFLICTS.map((c) => {
        const active = c.id === selected;
        return (
          <li key={c.id}>
            <Link
              href={conflictHref(c.id)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2.5 py-3",
                active ? "bg-accent-soft" : "hover:bg-sunken",
              )}
            >
              <ConflictMarker
                id={c.id}
                status={c.status}
                selected={active}
                size={large ? "lg" : "md"}
              />
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block truncate font-medium",
                    large ? "text-base" : "text-[13px]",
                    active && "text-accent-fg",
                  )}
                >
                  {c.type}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-x-3 text-xs">
                  {c.systems.map((s) => (
                    <SystemTag key={s.label ?? s.system} system={s.system} label={s.label} />
                  ))}
                  {large && <span className="text-fg-muted">・{c.space}</span>}
                </span>
              </span>
              <span className="flex flex-col items-end gap-1">
                <StatusText status={c.status} />
                {!large && <span className="text-xs text-fg-muted">{c.space}</span>}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Filters() {
  return (
    <div className="grid grid-cols-3 gap-2 border-b border-border p-3">
      <SelectBox value="系統" label="系統篩選" />
      <SelectBox value="類型" label="類型篩選" />
      <SelectBox value="狀態" label="狀態篩選" />
    </div>
  );
}

function EmptyList() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center">
      <CircleCheck className="size-8 text-success" aria-hidden />
      <p className="text-sm font-semibold">沒有找到衝突</p>
      <p className="text-xs leading-relaxed text-fg-muted">
        目前的檢查設定下，管線之間、管線與柱、RC 牆都沒有碰撞。
      </p>
    </div>
  );
}

function Center({ selection }: { selection: ConflictSelection }) {
  const empty = selection === "empty";
  const plan = empty ? "/mock/plan-mep.png" : `/mock/plan-mep-${selection}.png`;
  const model = empty ? "/mock/model-3d-faded.png" : `/mock/model-3d-conflicts-${selection}.png`;
  const conflict = empty ? undefined : CONFLICTS.find((c) => c.id === selection);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {empty && (
        <p className="hidden h-12 shrink-0 items-center gap-2 border-b border-success/20 bg-success-soft px-4 text-[13px] text-success-fg lg:flex">
          <CircleCheck className="size-4" aria-hidden />
          <span className="font-semibold">沒有找到衝突</span>
          <span>・容許誤差 0.05 m・最後檢查 14:40</span>
        </p>
      )}
      <div className="flex min-h-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col lg:border-r lg:border-border">
          <div className="hidden lg:block">
            <PaneHeader
              title="平面套疊"
              meta="建築＋給排水＋電力弱電"
              aside={
                conflict && (
                  <span className="inline-flex items-center gap-1.5 text-accent-fg">
                    <ChipSwatch />
                    <span className="font-mono">#{conflict.id}</span> {conflict.space}
                  </span>
                )
              }
            />
          </div>
          <div className="relative min-h-0 flex-1 grid-paper">
            <MockImage
              src={plan}
              alt="建築圖與水電圖套疊，標示衝突位置"
              kind="plan"
              preload
              className="absolute inset-3 lg:inset-6"
            />
          </div>
          <div className="hidden h-12 shrink-0 items-center border-t border-border bg-surface px-4 lg:flex">
            <MepLegend />
          </div>
        </section>
        <section className="hidden min-w-0 flex-1 flex-col lg:flex">
          <PaneHeader
            title="3D"
            meta="東南等角・剖切 115 cm"
            aside={
              <span className="inline-flex items-center gap-1.5 text-fg-muted">
                <ArrowLeftRight className="size-3.5" aria-hidden />
                同步選取
              </span>
            }
          />
          <div className="relative min-h-0 flex-1 grid-paper">
            <MockImage
              src={model}
              alt="3D 模型套疊管線，標示衝突位置"
              className="absolute inset-6"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function CheckSettings() {
  return (
    <section className="rounded-lg border border-border">
      <div className="flex h-11 items-center justify-between border-b border-border px-3">
        <span className="flex items-center gap-1.5 text-[13px] font-semibold">
          <ChevronDown className="size-3.5" aria-hidden />
          檢查設定
        </span>
        <span className="font-mono text-[11px] text-fg-muted">誤差 0.05 m・3 項</span>
      </div>
      <div className="space-y-4 p-3">
        <div className="flex items-center justify-between gap-3 text-[13px]">
          <span className="text-fg-muted">容許誤差</span>
          <NumberField value="0.05" unit="m" label="容許誤差" className="w-28" />
        </div>
        <div className="flex items-start justify-between gap-3 text-[13px]">
          <span>
            <span className="block text-fg-muted">確認門檻</span>
            <span className="block text-xs text-fg-muted">預設高程且淨距小於此值 → 需確認</span>
          </span>
          <NumberField value="0.15" unit="m" label="確認門檻" className="w-28 shrink-0" />
        </div>
        <div className="space-y-2.5">
          <SectionLabel>檢查項目</SectionLabel>
          <Checkbox label="管線交錯" defaultChecked />
          <Checkbox label="穿柱" defaultChecked />
          <Checkbox label="穿 RC 牆" defaultChecked />
          <Checkbox label="同系統內交錯" />
        </div>
      </div>
    </section>
  );
}

function DetailRows({ c }: { c: Conflict }) {
  const rows: [string, ReactNode][] = [
    ["類型", c.type],
    [
      "系統",
      <span key="s" className="flex flex-wrap gap-x-3">
        {c.systems.map((s) => (
          <SystemTag
            key={s.label ?? s.system}
            system={s.system}
            label={s.label}
            className="text-fg"
          />
        ))}
      </span>,
    ],
    [
      "管徑",
      <span key="p" className="font-mono">
        {c.spec}
      </span>,
    ],
    ["碰撞對象", c.target],
    [
      "座標",
      <span key="xy" className="font-mono">
        X {c.x} Y {c.y}
      </span>,
    ],
    [
      "高程",
      <span key="z" className="font-mono">
        {c.elevation}
      </span>,
    ],
    ["所在空間", c.space],
  ];
  return (
    <dl className="space-y-3 text-[13px]">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-2">
          <dt className="text-fg-muted">{k}</dt>
          <dd className="leading-relaxed">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function StatusSegment({ status }: { status: Conflict["status"] }) {
  return (
    <Segmented
      stretch
      items={(["open", "resolved", "ignored"] as const).map((s) => ({
        key: s,
        active: s === status,
        label: (
          <>
            <StatusDot status={s} />
            {s === "open" ? "未處理" : s === "resolved" ? "已處理" : "忽略"}
          </>
        ),
      }))}
    />
  );
}

function ConflictDetail({ c }: { c: Conflict }) {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-3">
        <ConflictMarker id={c.id} status={c.status} selected size="lg" />
        <div>
          <h3 className="text-base font-semibold">{c.type}</h3>
          <p className="text-xs text-fg-muted">{c.space}・自動偵測・今天 14:40</p>
        </div>
      </div>

      {c.status === "review" && (
        <div className="rounded-lg border border-warning bg-warning-soft p-3">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-warning-fg">
            <TriangleAlert className="size-4" aria-hidden />
            系統無法確定是否相撞
          </p>
          <p className="mt-1 text-xs leading-relaxed text-warning-fg">
            電力高程為預設值、淨距 0.07 m（確認門檻 0.15 m）
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button>確認是衝突</Button>
            <Button>不是衝突</Button>
          </div>
        </div>
      )}

      <DetailRows c={c} />

      {c.status !== "review" && (
        <section className="space-y-2">
          <SectionLabel>狀態</SectionLabel>
          <StatusSegment status={c.status} />
        </section>
      )}

      <section className="space-y-2">
        <SectionLabel>備註</SectionLabel>
        <textarea
          aria-label="備註"
          defaultValue={c.note}
          rows={3}
          className="w-full resize-none rounded-md border border-border-strong bg-surface p-3 text-[13px] leading-relaxed outline-none focus:border-accent"
        />
      </section>

      <CheckSettings />
    </div>
  );
}

export function mepView({ selection, conflictHref, exportHref }: MepViewOptions): ViewParts {
  const empty = selection === "empty";
  const conflict = empty ? undefined : CONFLICTS.find((c) => c.id === selection);
  const selectedId = conflict?.id ?? 0;

  return {
    left: (
      <>
        <PanelHeader title="衝突清單" count={empty ? 0 : 5} aside="點選以定位" />
        <Filters />
        {empty ? (
          <EmptyList />
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ConflictList selected={selectedId} conflictHref={conflictHref} />
          </div>
        )}
      </>
    ),
    center: <Center selection={selection} />,
    right: conflict ? (
      <>
        <PanelHeader title={`衝突 #${conflict.id}`} />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ConflictDetail c={conflict} />
        </div>
      </>
    ) : (
      <>
        <PanelHeader title="檢查結果" />
        <div className="p-4">
          <CheckSettings />
        </div>
      </>
    ),
    statusBar: (
      <>
        <StatusGroup>
          {empty ? (
            <span className="font-semibold text-fg">0 個衝突</span>
          ) : (
            <>
              <span className="font-semibold text-fg">5 個衝突</span>
              <ConflictSummary />
            </>
          )}
          <span>容許誤差 0.05 m・最後檢查 14:40</span>
        </StatusGroup>
        <StatusGroup className="ml-auto">
          <Button>
            <RotateCw className="size-3.5" aria-hidden />
            重新檢查
          </Button>
          {empty ? (
            <Button variant="primary" disabled>
              <Download className="size-3.5" aria-hidden />
              匯出 Excel
            </Button>
          ) : (
            <ButtonLink href={exportHref} variant="primary">
              <Download className="size-3.5" aria-hidden />
              匯出 Excel
            </ButtonLink>
          )}
        </StatusGroup>
      </>
    ),
    mobile: {
      tabs: ["衝突", "詳情"],
      canvasTop: (
        <div className="flex items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2">
          <Segmented
            size="md"
            items={[
              { key: "plan", label: "平面", active: true },
              { key: "3d", label: "3D" },
            ]}
          />
          {conflict && (
            <span className="inline-flex min-w-0 items-center gap-1.5 text-[13px] font-semibold">
              <ChipSwatch />
              <span className="truncate text-accent-fg">
                #{conflict.id} {conflict.type}
              </span>
              <span className="shrink-0">{conflict.space}</span>
            </span>
          )}
        </div>
      ),
      content: empty ? (
        <EmptyList />
      ) : (
        <>
          <div className="flex items-center justify-between px-5 pt-4 text-[13px]">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">5 個衝突</span>
              <ConflictSummary />
            </span>
            <span className="text-xs text-fg-muted">點選看詳情</span>
          </div>
          <ConflictList selected={selectedId} conflictHref={conflictHref} large />
        </>
      ),
      footer: (
        <>
          <span className="text-[13px]">{empty ? "0 個衝突" : "5 個衝突・未處理 3"}</span>
          {empty ? (
            <Button variant="primary" size="lg" disabled>
              匯出 Excel
            </Button>
          ) : (
            <ButtonLink href={exportHref} variant="primary" size="lg">
              匯出 Excel
            </ButtonLink>
          )}
        </>
      ),
    },
  };
}
