import { Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 畫布上的資訊小卡（例如「A-WD 32 線段・已選取」） */
export function CanvasChip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "absolute z-10 inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-[13px] whitespace-nowrap text-fg-muted shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ChipSwatch({ className }: { className?: string }) {
  return <span aria-hidden className={cn("size-2.5 shrink-0 rounded-xs bg-accent", className)} />;
}

export function ZoomControls({
  zoom,
  scale,
  className,
}: {
  zoom: string;
  scale: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute z-10 flex h-10 items-center gap-1 rounded-lg border border-border bg-surface p-1 font-mono text-[13px] shadow-sm",
        className,
      )}
    >
      <button
        type="button"
        aria-label="縮小"
        className="inline-flex size-8 items-center justify-center rounded-md text-fg-muted hover:bg-sunken"
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <span className="rounded-md bg-sunken px-3 py-1.5 text-fg">{zoom}</span>
      <button
        type="button"
        aria-label="放大"
        className="inline-flex size-8 items-center justify-center rounded-md text-fg-muted hover:bg-sunken"
      >
        <Plus className="size-4" aria-hidden />
      </button>
      <span aria-hidden className="mx-1 h-5 w-px bg-border" />
      <span className="px-1 text-fg-muted">{scale}</span>
      <button
        type="button"
        className="rounded-md bg-accent-soft px-2.5 py-1.5 font-sans font-medium text-accent-fg"
      >
        符合畫面
      </button>
    </div>
  );
}

export function ScaleBar({ className }: { className?: string }) {
  return (
    <div className={cn("absolute z-10 font-mono text-[11px] text-fg-muted", className)}>
      <div className="h-1.5 w-28 border-x border-b border-fg-muted" />
      <div className="mt-1 flex w-28 justify-between">
        <span>0</span>
        <span>5 m</span>
      </div>
    </div>
  );
}

/** 分割畫布（平面＋3D）上方的標題列 */
export function PaneHeader({
  title,
  meta,
  aside,
}: {
  title: string;
  meta: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4 text-[13px]">
      <span className="font-semibold">{title}</span>
      <span className="min-w-0 truncate text-fg-muted">{meta}</span>
      {aside && <span className="ml-auto flex shrink-0 items-center gap-1.5">{aside}</span>}
    </div>
  );
}

/** 灰階統計長條 */
export function Meter({
  value,
  className,
  tone = "accent",
}: {
  value: number;
  className?: string;
  tone?: "accent" | "muted";
}) {
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-sunken", className)}>
      <div
        className={cn("h-full rounded-full", tone === "accent" ? "bg-accent" : "bg-border-strong")}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
