import { ArrowLeftRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, MockImage, SectionLabel } from "@/components/ui/misc";
import { cn } from "@/lib/utils";
import { ChipSwatch, Meter, PaneHeader } from "@/features/editor/components/canvas-parts";
import { PanelHeader, StatusGroup } from "@/features/editor/components/editor-shell";
import type { ViewParts } from "@/features/editor/types";
import { AREA_BY_KIND, AREA_TOTAL, SPACES } from "@/features/sample/data";

const SELECTED = "閱覽區";

export function SpaceList({ large }: { large?: boolean }) {
  return (
    <ul className={cn("p-2", large && "p-4")}>
      {SPACES.map((s) => {
        const selected = s.name === SELECTED;
        return (
          <li key={s.name}>
            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 text-left",
                large ? "h-14" : "h-14",
                selected ? "bg-accent-soft" : "hover:bg-sunken",
              )}
            >
              <span>
                <span className={cn("block text-[13px] font-medium", selected && "text-accent-fg")}>
                  {s.name}
                </span>
                <span className="block text-xs text-fg-muted">{s.kind}</span>
              </span>
              <span className={cn("font-mono text-sm", selected && "text-accent-fg")}>
                {s.area.toFixed(1)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Center() {
  return (
    <div className="flex min-h-0 flex-1">
      <section className="hidden min-w-0 flex-1 flex-col border-r border-border lg:flex">
        <PaneHeader
          title="平面"
          meta={<span className="font-mono">1:100</span>}
          aside={
            <span className="inline-flex items-center gap-1.5 text-accent-fg">
              <ChipSwatch />
              閱覽區
            </span>
          }
        />
        <div className="relative min-h-0 flex-1 grid-paper">
          <MockImage
            src="/mock/plan-analysis.png"
            alt="平面圖，閱覽區以藍色標示"
            kind="plan"
            className="absolute inset-6"
          />
        </div>
      </section>
      <section className="flex min-w-0 flex-1 flex-col">
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
            src="/mock/model-3d-highlight.png"
            alt="3D 模型，閱覽區以藍色標示"
            preload
            className="absolute inset-6"
          />
        </div>
      </section>
    </div>
  );
}

function RightPanel() {
  return (
    <>
      <PanelHeader title="面積統計" />
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
        <section>
          <SectionLabel>總面積</SectionLabel>
          <p className="mt-1 font-mono text-4xl font-medium tracking-tight">
            {AREA_TOTAL.total}
            <span className="ml-1 font-sans text-sm font-normal text-fg-muted">m²</span>
          </p>
          <p className="mt-1 text-xs text-fg-muted">
            室內 <span className="font-mono">{AREA_TOTAL.indoor}</span>・戶外{" "}
            <span className="font-mono">{AREA_TOTAL.outdoor}</span>
          </p>
        </section>

        <section className="space-y-3">
          <SectionLabel>依空間類型</SectionLabel>
          {AREA_BY_KIND.map((k, i) => (
            <div key={k.kind} className="space-y-1.5">
              <div className={cn("flex justify-between text-[13px]", i === 0 && "text-accent-fg")}>
                <span>
                  {k.kind}・{k.rooms} 間
                </span>
                <span className="font-mono">{k.area}</span>
              </div>
              <Meter value={k.ratio} tone={i === 0 ? "accent" : "muted"} />
            </div>
          ))}
        </section>

        <section className="rounded-lg border border-border bg-subtle p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">閱覽區</h3>
            <Badge tone="accent">閱覽</Badge>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-y-4 text-xs text-fg-muted">
            {[
              ["面積", "118.6 m²"],
              ["周長", "46.0 m"],
              ["佔總面積", "35.0%"],
              ["淨高", "3.20 m"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd className="mt-1 font-mono text-base text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
      <div className="space-y-2 border-t border-border p-4">
        <Button variant="primary" size="lg" className="w-full">
          <Download className="size-4" aria-hidden />
          匯出 CSV
        </Button>
        <p className="text-center text-xs text-fg-muted">8 個空間・UTF-8・單位 m²</p>
      </div>
    </>
  );
}

export function analysisView(): ViewParts {
  return {
    left: (
      <>
        <PanelHeader title="空間" count={8} aside="面積 m²" />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SpaceList />
        </div>
        <dl className="space-y-1.5 border-t border-border p-4 text-[13px]">
          <div className="flex justify-between text-fg-muted">
            <dt>室內</dt>
            <dd className="font-mono">{AREA_TOTAL.indoor}</dd>
          </div>
          <div className="flex justify-between text-fg-muted">
            <dt>戶外</dt>
            <dd className="font-mono">{AREA_TOTAL.outdoor}</dd>
          </div>
          <div className="flex justify-between font-semibold">
            <dt>合計</dt>
            <dd className="font-mono">{AREA_TOTAL.total}</dd>
          </div>
        </dl>
      </>
    ),
    center: <Center />,
    right: <RightPanel />,
    statusBar: (
      <>
        <StatusGroup>
          <span>
            8 個空間・總面積 <span className="font-mono">339.3 m²</span>
          </span>
          <span>以牆內緣計算的室內淨面積</span>
        </StatusGroup>
        <StatusGroup className="ml-auto">更新於 14:32</StatusGroup>
      </>
    ),
    mobile: {
      tabs: ["空間", "面積統計"],
      content: <SpaceList large />,
      footer: (
        <>
          <span className="text-[13px]">
            總面積 <span className="font-mono text-fg">339.3 m²</span>
          </span>
          <Button variant="primary" size="lg">
            匯出 CSV
          </Button>
        </>
      ),
    },
  };
}
