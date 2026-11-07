import { Download, Move, RotateCw, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/form";
import { Badge, MockImage, SectionLabel, ViewCube } from "@/components/ui/misc";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import { CanvasChip, ChipSwatch } from "@/features/editor/components/canvas-parts";
import {
  FloatingBar,
  PanelHeader,
  StatusGroup,
  ToolButton,
} from "@/features/editor/components/editor-shell";
import type { ViewParts } from "@/features/editor/types";
import { SystemLine } from "@/features/mep/components/primitives";
import { SYSTEMS, SYSTEM_ORDER, VISIBILITY_LAYERS } from "@/features/sample/data";

const VIEWS = [
  "東南等角",
  "西南等角",
  "東北等角",
  "西北等角",
  "上方",
  "前方",
  "右側",
  "後方",
] as const;

function VisibilityList({ large }: { large?: boolean }) {
  return (
    <ul className={cn("px-4", large && "px-5")}>
      {VISIBILITY_LAYERS.map((l) => (
        <li
          key={l.layer}
          className={cn("grid grid-cols-[1fr_3rem_3rem] items-center", large ? "h-16" : "h-14")}
        >
          <span>
            <span className={cn("block font-medium", large ? "text-base" : "text-[13px]")}>
              {l.role}
            </span>
            <span className="block font-mono text-[11px] text-fg-muted">{l.layer}</span>
          </span>
          <span className="flex justify-center">
            <Switch checked label={`顯示${l.role}`} />
          </span>
          <span className="flex justify-center">
            {l.translucent ? (
              <Switch label={`${l.role}半透明`} />
            ) : (
              <span aria-label="不適用" className="text-fg-muted">
                —
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function MepOverlayCard({ on, toggleHref }: { on: boolean; toggleHref: string }) {
  return (
    <div className="border-t border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[13px] font-semibold">
            疊加機電 <Badge tone="accent">加值</Badge>
          </p>
          <p className="mt-1 text-xs text-fg-muted">
            {on ? "顯示管線；衝突標記在機電模式" : "1F 有 2 張水電圖・預設關閉"}
          </p>
        </div>
        <Switch checked={on} href={toggleHref} label="疊加機電" />
      </div>
      {on && (
        <ul className="mt-3 space-y-1">
          {SYSTEM_ORDER.map((key) => {
            const s = SYSTEMS[key];
            return (
              <li key={key} className="grid grid-cols-[1.5rem_1fr_auto] items-center py-1.5">
                <SystemLine system={key} className="w-4" />
                <span>
                  <span className="block text-[13px]">{s.label}</span>
                  <span className="block font-mono text-[11px] text-fg-muted">
                    {s.spec}・{s.elevation}
                  </span>
                </span>
                <Switch checked label={`顯示${s.label}`} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Center({ mepOn }: { mepOn: boolean }) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden grid-paper">
      <FloatingBar className="top-3 left-3 hidden lg:flex">
        <ToolButton label="旋轉" active>
          <RotateCw className="size-4" aria-hidden />
        </ToolButton>
        <ToolButton label="平移">
          <Move className="size-4" aria-hidden />
        </ToolButton>
        <ToolButton label="縮放">
          <ZoomIn className="size-4" aria-hidden />
        </ToolButton>
        <span aria-hidden className="mx-1 h-5 w-px bg-border" />
        <button
          type="button"
          className="h-8 rounded-md px-2 text-fg-muted hover:bg-sunken hover:text-fg"
        >
          重設視角
        </button>
      </FloatingBar>

      <div className="absolute top-3 right-4 z-10 lg:top-4 lg:right-6">
        <ViewCube caption="東南等角" />
      </div>

      <MockImage
        src={mepOn ? "/mock/model-3d-mep.png" : "/mock/model-3d.png"}
        alt={
          mepOn
            ? "社區圖書館 1F 3D 模型，疊加給排水與電力管線"
            : "社區圖書館 1F 3D 模型，剖切高度 115 cm"
        }
        preload
        className="absolute inset-x-2 top-16 bottom-6 lg:inset-x-[8%] lg:top-[18%] lg:bottom-[16%]"
      />

      <CanvasChip className="top-3 left-3 lg:top-auto lg:bottom-4 lg:left-4">
        <ChipSwatch />
        剖切 <span className="font-mono text-fg">115 cm</span>
        <span aria-hidden className="hidden h-4 w-px bg-border lg:block" />
        <span className="hidden lg:inline">平行投影</span>
      </CanvasChip>
    </div>
  );
}

function RightPanel() {
  return (
    <>
      <PanelHeader title="檢視設定" />
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
        <section className="space-y-2">
          <SectionLabel>投影</SectionLabel>
          <Segmented
            stretch
            size="lg"
            items={[
              { key: "ortho", label: "平行", active: true },
              { key: "persp", label: "透視" },
            ]}
          />
        </section>

        <section className="space-y-2">
          <SectionLabel>預設視角</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {VIEWS.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={v === "東南等角"}
                className={cn(
                  "h-9 rounded-md border text-[13px] font-medium",
                  v === "東南等角"
                    ? "border-accent bg-accent-soft text-accent-fg"
                    : "border-border bg-surface text-fg hover:bg-sunken",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <SectionLabel>剖切高度</SectionLabel>
            <Switch checked label="剖切高度" />
          </div>
          <p className="font-mono text-2xl font-medium">
            115 <span className="font-sans text-xs font-normal text-fg-muted">cm</span>
          </p>
          <div
            className="relative py-2"
            aria-label="剖切高度 115 cm"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={320}
            aria-valuenow={115}
          >
            <div className="h-1 rounded-full bg-sunken">
              <div className="h-full w-[36%] rounded-full bg-accent" />
            </div>
            <span className="absolute top-1/2 left-[36%] size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-surface" />
          </div>
          <div className="relative h-4 font-mono text-[11px] text-fg-muted">
            <span className="absolute left-0">0</span>
            <span className="absolute left-[28%] -translate-x-1/2">90 窗台</span>
            <span className="absolute left-[66%] -translate-x-1/2">210 門</span>
            <span className="absolute right-0">320</span>
          </div>
        </section>

        <section className="space-y-3">
          <SectionLabel>顯示</SectionLabel>
          <div className="flex items-center justify-between text-[13px]">
            物件邊線
            <Switch checked label="物件邊線" />
          </div>
        </section>
      </div>
      <div className="space-y-2 border-t border-border p-4">
        <Button size="lg" className="w-full">
          <Download className="size-4" aria-hidden />
          匯出 PNG
        </Button>
        <Button size="lg" className="w-full" disabled>
          匯出 GLB
          <Badge>即將推出</Badge>
        </Button>
      </div>
    </>
  );
}

export function viewerView({
  mepAvailable,
  mepOn,
  toggleMepHref,
}: {
  mepAvailable: boolean;
  mepOn: boolean;
  toggleMepHref: string;
}): ViewParts {
  return {
    left: (
      <>
        <PanelHeader
          title="圖層顯示"
          aside={
            <span className="grid grid-cols-[3rem_3rem] text-center">
              <span>顯示</span>
              <span>半透明</span>
            </span>
          }
        />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <VisibilityList />
        </div>
        {mepAvailable && <MepOverlayCard on={mepOn} toggleHref={toggleMepHref} />}
      </>
    ),
    center: <Center mepOn={mepAvailable && mepOn} />,
    right: <RightPanel />,
    statusBar: (
      <>
        <StatusGroup>
          <span className="inline-flex items-center gap-1.5 text-fg">
            <span aria-hidden className="size-1.5 rounded-full bg-success" />
            模型已更新
          </span>
          <span>
            視角 <span className="text-fg">東南等角</span>
          </span>
          <span className="font-mono">游標 X 12.40 Y 6.85 m</span>
        </StatusGroup>
        <StatusGroup className="ml-auto">左鍵旋轉・右鍵平移・滾輪縮放</StatusGroup>
      </>
    ),
    mobile: {
      tabs: ["圖層顯示", "檢視設定"],
      content: (
        <>
          <div className="grid grid-cols-[1fr_3rem_3rem] px-5 pt-3 text-xs text-fg-muted">
            <span>圖層</span>
            <span className="text-center">顯示</span>
            <span className="text-center">半透明</span>
          </div>
          <VisibilityList large />
        </>
      ),
      footer: (
        <>
          <span className="text-[13px]">單指旋轉・雙指縮放平移</span>
          <Button size="lg">匯出 PNG</Button>
        </>
      ),
    },
  };
}
