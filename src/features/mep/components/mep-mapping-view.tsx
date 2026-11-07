import { ChevronDown, CircleCheck, MousePointer2, Move, Ruler, Search, Spline } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { NumberField, SelectBox, Switch } from "@/components/ui/form";
import { Badge, MockImage, SectionLabel } from "@/components/ui/misc";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import { CanvasChip, ZoomControls } from "@/features/editor/components/canvas-parts";
import {
  FloatingBar,
  PanelHeader,
  StatusGroup,
  ToolButton,
} from "@/features/editor/components/editor-shell";
import type { ViewParts } from "@/features/editor/types";
import type { SystemKey } from "@/features/sample/data";
import { SystemLine } from "./primitives";

type LayerIcon =
  | { kind: "line"; system: SystemKey }
  | { kind: "riser"; system: SystemKey }
  | { kind: "box"; muted?: boolean };

interface MepLayerGroup {
  title: string;
  aside: string;
  layers: { name: string; detail: string; tag: string; icon: LayerIcon }[];
}

const GROUPS: readonly MepLayerGroup[] = [
  {
    title: "給水",
    aside: "+2.90 m",
    layers: [
      { name: "P-WATER", detail: "5 線段", tag: "管線", icon: { kind: "line", system: "water" } },
    ],
  },
  {
    title: "排水",
    aside: "-0.45 m",
    layers: [
      { name: "P-DRAIN", detail: "3 線段", tag: "管線", icon: { kind: "line", system: "drain" } },
    ],
  },
  {
    title: "立管",
    aside: "至 2F",
    layers: [
      {
        name: "P-RISER-W",
        detail: "1 立管・給水",
        tag: "立管",
        icon: { kind: "riser", system: "water" },
      },
      {
        name: "P-RISER-D",
        detail: "1 立管・排水",
        tag: "立管",
        icon: { kind: "riser", system: "drain" },
      },
    ],
  },
  {
    title: "設備",
    aside: "",
    layers: [
      { name: "P-SYMB", detail: "2 設備（落水頭、洗手台）", tag: "設備", icon: { kind: "box" } },
    ],
  },
  {
    title: "底圖",
    aside: "用於對齊，不轉 3D",
    layers: [
      {
        name: "A-WALL",
        detail: "248 線段・不轉 3D",
        tag: "底圖",
        icon: { kind: "box", muted: true },
      },
      { name: "A-COL", detail: "11 柱・對齊用", tag: "底圖", icon: { kind: "box", muted: true } },
    ],
  },
];

const RISER_BORDER: Record<SystemKey, string> = {
  water: "border-sys-water",
  drain: "border-sys-drain",
  power: "border-sys-power",
  lowv: "border-sys-lowv",
};

function Icon({ icon }: { icon: LayerIcon }) {
  if (icon.kind === "line") return <SystemLine system={icon.system} className="w-4" />;
  if (icon.kind === "riser")
    return (
      <span
        aria-hidden
        className={cn("size-3.5 rounded-full border-2", RISER_BORDER[icon.system])}
      />
    );
  return (
    <span
      aria-hidden
      className={cn(
        "size-3.5 rounded-xs border-2",
        icon.muted ? "border-border-strong" : "border-fg-muted",
      )}
    />
  );
}

function LayerGroups() {
  return (
    <ul className="px-2 pb-2">
      {GROUPS.map((g) => (
        <li key={g.title}>
          <div className="flex items-center justify-between px-2 pt-3 pb-1 text-[13px]">
            <span className="flex items-center gap-1.5 font-medium">
              <ChevronDown className="size-3.5 text-fg-muted" aria-hidden />
              {g.title}
              <span className="font-normal text-fg-muted">{g.layers.length}</span>
            </span>
            <span className="font-mono text-xs text-fg-muted">{g.aside}</span>
          </div>
          {g.layers.map((l) => {
            const selected = l.name === "P-DRAIN";
            const muted = l.icon.kind === "box" && l.icon.muted;
            return (
              <button
                key={l.name}
                type="button"
                className={cn(
                  "grid w-full grid-cols-[1.5rem_1fr_auto] items-center gap-2 rounded-md px-2 py-2 text-left",
                  selected ? "bg-accent-soft" : "hover:bg-sunken",
                )}
              >
                <Icon icon={l.icon} />
                <span>
                  <span
                    className={cn(
                      "block font-mono text-[13px] font-medium",
                      selected && "text-accent-fg",
                      muted && "text-fg-muted",
                    )}
                  >
                    {l.name}
                  </span>
                  <span className="block text-xs text-fg-muted">{l.detail}</span>
                </span>
                <span className="rounded border border-border bg-sunken px-2 py-1 text-xs">
                  {l.tag}
                </span>
              </button>
            );
          })}
        </li>
      ))}
    </ul>
  );
}

function LeftPanel() {
  return (
    <>
      <PanelHeader title="圖層" count={6} aside="依系統分組" />
      <div className="p-3">
        <label className="flex h-9 items-center gap-2 rounded-md border border-border-strong bg-surface px-2.5">
          <Search className="size-4 text-fg-muted" aria-hidden />
          <input
            placeholder="搜尋圖層或系統"
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-fg-subtle"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <LayerGroups />
      </div>
      <div className="space-y-3 border-t border-border p-4 text-[13px]">
        <div className="flex items-center justify-between">
          <span className="font-medium">建築底圖</span>
          <Switch checked label="建築底圖" />
        </div>
        <div className="flex items-center justify-between text-fg-muted">
          <span className="inline-flex items-center gap-2 font-mono text-fg">
            <span aria-hidden className="size-3 rounded-xs bg-border-strong" />
            library-1F.dxf
          </span>
          淡灰顯示
        </div>
        <div className="flex items-center justify-between text-fg-muted">
          顯示其他水電圖（淡色）
          <Switch label="顯示其他水電圖" />
        </div>
      </div>
    </>
  );
}

function Center({ calibrateHref }: { calibrateHref: string }) {
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
        <Link
          href={calibrateHref}
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-fg-muted hover:bg-sunken hover:text-fg"
        >
          <Spline className="size-4" aria-hidden />
          兩點校正
        </Link>
      </FloatingBar>

      <CanvasChip className="top-3 left-3 lg:right-3 lg:left-auto">
        <SystemLine system="drain" className="w-4" />
        <span className="font-mono font-medium text-fg">P-DRAIN</span>3 線段・已選取
      </CanvasChip>

      <MockImage
        src="/mock/plan-plumbing.png"
        alt="給排水圖套疊在淡灰的建築底圖上，排水管已選取"
        kind="plan"
        preload
        className="absolute inset-x-3 top-14 bottom-3 lg:inset-x-[2%] lg:top-[10%] lg:bottom-[12%]"
      />

      <div className="absolute bottom-3 left-3 z-10 hidden h-10 items-center gap-4 rounded-lg border border-border bg-surface px-4 text-xs text-fg-muted shadow-sm lg:flex">
        <span>圖例</span>
        <span className="inline-flex items-center gap-1.5">
          <SystemLine system="water" />
          給水
        </span>
        <span className="inline-flex items-center gap-1.5">
          <SystemLine system="drain" />
          排水
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-full border-2 border-fg-muted" />
          立管
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-xs border-2 border-fg-muted" />
          設備
        </span>
        <span aria-hidden className="h-5 w-px bg-border" />
        <span className="font-mono">
          <span className="block h-1.5 w-28 border-x border-b border-fg-muted" />5 m
        </span>
      </div>
      <ZoomControls zoom="58%" scale="1:172" className="right-3 bottom-3 hidden lg:flex" />
    </div>
  );
}

function RightPanel() {
  return (
    <>
      <PanelHeader
        title="系統設定"
        aside={
          <Badge tone="accent" className="font-mono">
            P-DRAIN
          </Badge>
        }
      />
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
        <section className="space-y-2">
          <SectionLabel>物件統計</SectionLabel>
          <div className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border">
            {[
              ["線段", "3"],
              ["高程標註", "2"],
              ["總長 m", "32.7"],
            ].map(([k, v]) => (
              <div key={k} className="p-3">
                <p className="text-xs text-fg-muted">{k}</p>
                <p className="mt-1 font-mono text-xl font-medium">{v}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <SectionLabel>系統</SectionLabel>
          <SelectBox
            size="lg"
            className="w-full"
            label="系統"
            value={
              <>
                <SystemLine system="drain" className="w-4" />
                排水
              </>
            }
          />
          <p className="flex items-center gap-1.5 text-xs text-fg-muted">
            <span aria-hidden className="size-1.5 rounded-full bg-success" />
            自動辨識・名稱含「DRAIN」
          </p>
        </section>

        <section className="space-y-2">
          <SectionLabel>元素類型</SectionLabel>
          <Segmented
            stretch
            items={[
              { key: "pipe", label: "管線", active: true },
              { key: "riser", label: "立管" },
              { key: "equip", label: "設備" },
              { key: "ignore", label: "忽略" },
            ]}
          />
        </section>

        <section className="space-y-2">
          <SectionLabel>預設高程</SectionLabel>
          <div className="flex gap-2">
            <Segmented
              className="flex-1"
              stretch
              items={[
                { key: "above", label: "樓版上" },
                { key: "below", label: "樓版下", active: true },
              ]}
            />
            <NumberField value="0.45" unit="m" label="預設高程" className="w-28" />
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <section className="space-y-2">
            <SectionLabel>管徑</SectionLabel>
            <SelectBox
              value={<span className="font-mono">Ø100 mm</span>}
              size="lg"
              className="w-full"
              label="管徑"
            />
          </section>
          <section className="space-y-2">
            <SectionLabel>排水坡度</SectionLabel>
            <NumberField value="1/100" label="排水坡度" className="h-10" />
          </section>
        </div>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <SectionLabel>圖上讀到的高程標註</SectionLabel>
            <span className="text-xs text-fg-muted">2 處</span>
          </div>
          <div className="divide-y divide-border rounded-lg border border-border font-mono text-[13px]">
            {[
              ["FL-0.40", "(16.80, 4.50)"],
              ["FL-0.53", "(3.80, 4.50)"],
            ].map(([a, b]) => (
              <div key={a} className="flex justify-between px-3 py-2.5">
                <span>{a}</span>
                <span className="text-xs text-fg-muted">{b}</span>
              </div>
            ))}
            <p className="bg-subtle px-3 py-2.5 font-sans text-xs leading-relaxed text-fg-muted">
              圖上的高程標註優先於預設高程；其餘線段用預設值或內插。
            </p>
          </div>
        </section>
      </div>
      <div className="flex h-14 shrink-0 items-center justify-between border-t border-border px-4 text-[13px]">
        <button type="button" className="font-medium text-accent-fg hover:underline">
          另存為 preset…
        </button>
        <button type="button" className="text-fg-muted hover:text-fg">
          還原自動辨識
        </button>
      </div>
    </>
  );
}

export function mepMappingView({
  calibrateHref,
  checkHref,
}: {
  calibrateHref: string;
  checkHref: string;
}): ViewParts {
  return {
    left: <LeftPanel />,
    center: <Center calibrateHref={calibrateHref} />,
    right: <RightPanel />,
    statusBar: (
      <>
        <StatusGroup>
          <span className="inline-flex items-center gap-1.5 font-medium text-fg">
            <CircleCheck className="size-4 text-success" aria-hidden />
            對齊：已對齊
          </span>
          <span>
            以 A-COL 11 根柱比對・平均偏差 <span className="font-mono">0.004 m</span>
          </span>
          <ButtonLink href={calibrateHref} variant="ghost" size="sm">
            重新校正
          </ButtonLink>
          <span aria-hidden className="h-5 w-px bg-border" />
          <span>套用 preset</span>
          <SelectBox value="機電標準（P-／E-）" className="w-60" label="套用 preset" />
        </StatusGroup>
        <StatusGroup className="ml-auto">
          <span>7 個圖層・給水、排水已設定高程</span>
          <ButtonLink href={checkHref} variant="primary">
            <Search className="size-4" aria-hidden />
            檢查衝突
          </ButtonLink>
        </StatusGroup>
      </>
    ),
    mobile: {
      tabs: ["圖層", "系統設定"],
      content: <LayerGroups />,
      footer: (
        <>
          <span className="inline-flex items-center gap-1.5 text-[13px]">
            <span aria-hidden className="size-1.5 rounded-full bg-success" />
            已對齊・平均偏差 0.004 m
          </span>
          <ButtonLink href={checkHref} variant="primary" size="lg">
            檢查衝突
          </ButtonLink>
        </>
      ),
    },
  };
}
