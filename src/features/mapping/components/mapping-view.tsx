import {
  Box,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Lock,
  MousePointer2,
  Move,
  PencilRuler,
  Ruler,
  Search,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink, Button } from "@/components/ui/button";
import { NumberField, SelectBox } from "@/components/ui/form";
import { Badge, MockImage, SectionLabel } from "@/components/ui/misc";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import {
  CanvasChip,
  ChipSwatch,
  Meter,
  ScaleBar,
  ZoomControls,
} from "@/features/editor/components/canvas-parts";
import {
  FloatingBar,
  PanelHeader,
  StatusGroup,
  ToolButton,
} from "@/features/editor/components/editor-shell";
import type { ViewParts } from "@/features/editor/types";
import { ARCH_LAYER_GROUPS, BLOCKS } from "@/features/sample/data";

const SELECTED_LAYER = "A-WD";

function SearchField({ placeholder, kbd }: { placeholder: string; kbd?: string }) {
  return (
    <label className="flex h-9 items-center gap-2 rounded-md border border-border-strong bg-surface px-2.5 focus-within:border-accent">
      <Search className="size-4 text-fg-muted" aria-hidden />
      <input
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-fg-subtle"
      />
      {kbd && (
        <kbd className="rounded border border-border px-1.5 font-mono text-[11px] text-fg-muted">
          {kbd}
        </kbd>
      )}
    </label>
  );
}

function LayerGroups() {
  return (
    <ul className="space-y-1 px-2 pb-2">
      {ARCH_LAYER_GROUPS.map((group) => (
        <li key={group.role}>
          <div className="flex items-center justify-between px-2 pt-2 pb-1 text-[13px]">
            <span className="flex items-center gap-1.5 font-medium">
              <ChevronDown className="size-3.5 text-fg-muted" aria-hidden />
              {group.role}
              <span className="font-normal text-fg-muted">{group.layers.length}</span>
            </span>
            <span className="text-xs text-fg-muted">{group.action}</span>
          </div>
          {group.layers.map((layer) => {
            const selected = layer.name === SELECTED_LAYER;
            return (
              <button
                key={layer.name}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between rounded-md py-2 pr-2 pl-6 text-left",
                  selected ? "bg-accent-soft" : "hover:bg-sunken",
                )}
              >
                <span>
                  <span
                    className={cn(
                      "block font-mono text-[13px] font-medium",
                      selected ? "text-accent-fg" : "text-fg",
                    )}
                  >
                    {layer.name}
                  </span>
                  <span className="block text-xs text-fg-muted">{layer.detail}</span>
                </span>
                <span className="text-xs text-fg-muted">自動</span>
              </button>
            );
          })}
        </li>
      ))}
    </ul>
  );
}

function BlockList() {
  return (
    <ul className="px-4">
      {BLOCKS.map((b) => (
        <li key={b.name} className="flex h-9 items-center justify-between text-[13px]">
          <span>
            {b.name} <span className="ml-1 text-xs text-fg-muted">×{b.count}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
            <span aria-hidden className="size-1.5 rounded-full bg-success" />
            {b.template}
          </span>
        </li>
      ))}
    </ul>
  );
}

function LeftPanel() {
  return (
    <>
      <PanelHeader
        title="圖層"
        count={6}
        aside={
          <>
            分組
            <Segmented
              size="sm"
              items={[
                { key: "role", label: "角色", active: true },
                { key: "name", label: "名稱" },
              ]}
            />
          </>
        }
      />
      <div className="flex min-h-0 flex-3 flex-col">
        <div className="p-3">
          <SearchField placeholder="搜尋圖層名稱或角色" kbd="/" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <LayerGroups />
        </div>
      </div>
      <div className="flex min-h-0 flex-2 flex-col border-t border-border">
        <PanelHeader title="圖塊" count={9} aside="依名稱自動配對" className="border-b-0" />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <BlockList />
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-border px-4 py-2.5 text-[11px] text-fg-muted">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-1.5 rounded-full bg-success" />
            已配對樣板
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-1.5 rounded-full bg-warning" />
            以方塊代替（依外框尺寸）
          </span>
        </div>
      </div>
    </>
  );
}

function Center({ demo }: { demo: boolean }) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden grid-paper">
      <FloatingBar className="top-3 left-3 hidden lg:flex">
        <ToolButton label="選取" active>
          <MousePointer2 className="size-4" aria-hidden />
        </ToolButton>
        <ToolButton label="平移">
          <Move className="size-4" aria-hidden />
        </ToolButton>
        <ToolButton label="量測">
          <Ruler className="size-4" aria-hidden />
        </ToolButton>
        <span aria-hidden className="mx-1 h-5 w-px bg-border" />
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-fg-muted hover:bg-sunken hover:text-fg"
        >
          <PencilRuler className="size-4" aria-hidden />
          校正
        </button>
      </FloatingBar>

      <CanvasChip className="top-3 left-3 lg:right-3 lg:left-auto">
        <ChipSwatch />
        <span className="font-mono font-medium text-fg">A-WD</span>
        32 線段・16 圖塊<span className="hidden lg:inline">・已選取</span>
      </CanvasChip>
      <CanvasChip className="top-3 right-3 font-mono lg:hidden">41%・1:243</CanvasChip>

      <MockImage
        src="/mock/plan-2d.png"
        alt="社區圖書館 1F 平面圖，門窗圖層已選取"
        kind="plan"
        preload
        className={cn(
          "absolute inset-x-4 top-14 bottom-4 lg:inset-x-[8%] lg:top-[12%] lg:bottom-[14%]",
          demo && "lg:top-[14%]",
        )}
      />

      <div className="absolute right-3 bottom-16 z-10 hidden w-64 overflow-hidden rounded-lg border border-border bg-surface shadow-sm lg:block">
        <div className="flex h-9 items-center justify-between px-3 text-xs">
          <span className="inline-flex items-center gap-1 font-medium">
            <ChevronDown className="size-3.5 text-fg-muted" aria-hidden />
            小地圖
          </span>
          <span className="text-fg-muted">
            可見 <span className="font-mono">100%</span>
          </span>
        </div>
        <MockImage
          src="/mock/plan-2d.png"
          alt=""
          kind="plan"
          sizes="256px"
          className="mx-0.5 mb-0.5 h-36 rounded-md border-2 border-accent bg-accent-soft"
        />
      </div>

      <ScaleBar className="bottom-4 left-4 hidden lg:block" />
      <ZoomControls zoom="56%" scale="1:177" className="right-3 bottom-3 hidden lg:flex" />
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs text-fg-muted">{label}</span>
      {children}
    </div>
  );
}

function RightPanel({ demo }: { demo: boolean }) {
  return (
    <>
      <PanelHeader
        title="圖層設定"
        aside={
          <Badge tone="accent" className="font-mono">
            A-WD
          </Badge>
        }
      />
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-5">
          <div>
            <p className="text-[13px] font-medium">層高</p>
            <p className="text-xs text-fg-muted">牆、柱預設等於層高</p>
          </div>
          <NumberField value="320" unit="cm" label="層高" className="w-28" />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionLabel>物件統計</SectionLabel>
            <span className="text-xs text-fg-muted">
              共 <span className="font-mono">48</span> 個
            </span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border">
            {[
              { label: "線段", value: "32", dot: "bg-fg-muted" },
              { label: "圖塊", value: "16", dot: "bg-accent" },
              { label: "其他", value: "0", dot: "bg-border-strong", disabled: true },
            ].map((s) => (
              <div key={s.label} className="p-3">
                <p
                  className={cn(
                    "flex items-center gap-1.5 text-xs",
                    s.disabled ? "text-fg-subtle" : "text-fg-muted",
                  )}
                >
                  <span aria-hidden className={cn("size-1.5 rounded-full", s.dot)} />
                  {s.label}
                </p>
                <p
                  className={cn(
                    "mt-1 font-mono text-xl font-medium",
                    s.disabled && "text-fg-subtle",
                  )}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>
          <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
            <span className="w-2/3 bg-fg-muted" />
            <span className="w-1/3 bg-accent" />
          </div>
          <p className="font-mono text-[11px] text-fg-muted">LINE 24・LWPOLYLINE 8・INSERT 16</p>
          <ul className="space-y-2 text-[13px]">
            {[
              { name: "門", n: 7, v: 100 },
              { name: "窗", n: 7, v: 100 },
              { name: "門-廁所", n: 2, v: 28 },
            ].map((r) => (
              <li key={r.name} className="grid grid-cols-[4.5rem_1fr_1.5rem] items-center gap-3">
                <span>{r.name}</span>
                <Meter value={r.v} />
                <span className="text-right font-mono text-xs text-fg-muted">{r.n}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <SectionLabel>角色</SectionLabel>
          <SelectBox value="門窗" size="lg" className="w-full" label="角色" />
          <p className="flex items-center gap-1.5 text-xs text-fg-muted">
            <span aria-hidden className="size-1.5 rounded-full bg-success" />
            自動辨識・名稱含「WD」，含門窗圖塊
          </p>
        </section>

        <section className="space-y-2">
          <SectionLabel>高度</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            <SettingRow label="門高">
              <NumberField value="210" unit="cm" label="門高" />
            </SettingRow>
            <SettingRow label="窗台高">
              <NumberField value="90" unit="cm" label="窗台高" />
            </SettingRow>
            <SettingRow label="窗高">
              <NumberField value="130" unit="cm" label="窗高" />
            </SettingRow>
          </div>
        </section>

        <section className="space-y-2">
          <SectionLabel>材質</SectionLabel>
          {[
            { label: "門", value: "淺橡木", swatch: "bg-mat-oak" },
            { label: "窗", value: "鋁框・透明玻璃", swatch: "bg-mat-glass" },
          ].map((m) => (
            <div
              key={m.label}
              className="grid grid-cols-[2.5rem_1fr] items-center gap-2 text-[13px]"
            >
              <span className="text-fg-muted">{m.label}</span>
              <SelectBox
                size="lg"
                label={`${m.label}材質`}
                className="w-full"
                value={
                  <>
                    <span
                      aria-hidden
                      className={cn("size-4 rounded border border-border", m.swatch)}
                    />
                    {m.value}
                  </>
                }
              />
            </div>
          ))}
        </section>

        <div className="flex items-center justify-between text-[13px]">
          <SectionLabel>圖塊對應</SectionLabel>
          <span className="text-xs text-success-fg">依名稱自動配對</span>
        </div>
      </div>
      <div className="flex h-14 shrink-0 items-center justify-between border-t border-border px-4 text-[13px]">
        {demo ? (
          <button
            type="button"
            disabled
            title="登入後可使用"
            className="inline-flex items-center gap-1.5 text-fg-subtle"
          >
            <Lock className="size-3.5" aria-hidden />
            另存為 preset…
          </button>
        ) : (
          <button type="button" className="font-medium text-accent-fg hover:underline">
            另存為 preset…
          </button>
        )}
        <button type="button" className="text-fg-muted hover:text-fg">
          還原自動辨識
        </button>
      </div>
    </>
  );
}

function MobileLayerList() {
  return (
    <div className="space-y-3 p-4">
      <SearchField placeholder="搜尋圖層名稱或角色" />
      <ul>
        {ARCH_LAYER_GROUPS.slice(0, 5).map((group) => (
          <li key={group.role}>
            <div className="flex items-center justify-between pt-3 pb-1 text-sm font-medium">
              {group.role}
              <span className="text-xs font-normal text-fg-muted">{group.action}</span>
            </div>
            {group.layers.map((layer) => {
              const selected = layer.name === SELECTED_LAYER;
              return (
                <button
                  key={layer.name}
                  type="button"
                  className={cn(
                    "-mx-2 flex w-[calc(100%+1rem)] items-center justify-between rounded-lg px-2 py-2.5 text-left",
                    selected && "bg-accent-soft",
                  )}
                >
                  <span>
                    <span
                      className={cn(
                        "block font-mono text-base font-medium",
                        selected && "text-accent-fg",
                      )}
                    >
                      {layer.name}
                    </span>
                    <span className="block text-[13px] text-fg-muted">{layer.detail}・自動</span>
                  </span>
                  <ChevronRight className="size-4 text-fg-muted" aria-hidden />
                </button>
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function mappingView({
  demo,
  generateHref,
}: {
  demo: boolean;
  generateHref: string;
}): ViewParts {
  return {
    left: <LeftPanel />,
    center: <Center demo={demo} />,
    right: <RightPanel demo={demo} />,
    statusBar: (
      <>
        <StatusGroup>
          <span className="inline-flex items-center gap-1.5 font-medium text-fg">
            <CircleCheck className="size-4 text-success" aria-hidden />
            比例尺已校正
          </span>
          <span className="font-mono">門寬 90 cm = 900 單位・1 單位 = 1 mm</span>
          <Button variant="ghost" size="sm">
            重新校正
          </Button>
          <span aria-hidden className="h-5 w-px bg-border" />
          <span>套用 preset</span>
          <SelectBox value="事務所標準（AIA）" className="w-60" label="套用 preset" />
        </StatusGroup>
        <StatusGroup className="ml-auto">
          <span>6 個圖層已確認・9 種圖塊已自動配對</span>
          <ButtonLink href={generateHref} variant="primary">
            <Box className="size-4" aria-hidden />
            生成 3D
            <kbd className="rounded bg-white/20 px-1 font-mono text-[10px]">⌘↵</kbd>
          </ButtonLink>
        </StatusGroup>
      </>
    ),
    mobile: {
      tabs: ["圖層", "圖塊", "圖層設定"],
      content: <MobileLayerList />,
      footer: (
        <>
          <span className="inline-flex items-center gap-1.5 text-[13px]">
            <span aria-hidden className="size-1.5 rounded-full bg-success" />
            比例尺已校正・1 單位 = 1 mm
          </span>
          <Link
            href={generateHref}
            className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-medium text-white"
          >
            生成 3D
          </Link>
        </>
      ),
    },
  };
}
