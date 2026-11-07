import { Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-fg text-canvas",
        className,
      )}
    >
      <Layers className="size-4" aria-hidden />
    </span>
  );
}

export function Logo({ href = "/", showText = true }: { href?: string; showText?: boolean }) {
  return (
    <Link href={href} className="flex shrink-0 items-center gap-2 font-semibold text-fg">
      <LogoMark />
      {showText && <span className="text-[15px] tracking-tight">PlanRise</span>}
    </Link>
  );
}

export function Avatar({ name = "林" }: { name?: string }) {
  return (
    <span
      aria-label="帳號"
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-sunken text-xs font-medium text-fg-muted"
    >
      {name}
    </span>
  );
}

type BadgeTone = "accent" | "neutral" | "success" | "warning" | "danger";

const BADGE_TONE: Record<BadgeTone, string> = {
  accent: "border-accent/60 text-accent-fg bg-accent-soft/40",
  neutral: "border-border bg-sunken text-fg-muted",
  success: "border-success/40 bg-success-soft text-success-fg",
  warning: "border-warning/40 bg-warning-soft text-warning-fg",
  danger: "border-danger/40 bg-danger-soft text-danger-fg",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded border px-1.5 text-[11px] leading-none font-medium",
        BADGE_TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** 等寬數字與圖層名稱 */
export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-mono", className)}>{children}</span>;
}

type MockImageKind = "model" | "plan";

interface MockImageProps {
  src: string;
  alt: string;
  kind?: MockImageKind;
  className?: string;
  sizes?: string;
  preload?: boolean;
}

/**
 * 切版階段的模型／圖面截圖（透明背景）。
 * 平面圖在深色主題反相，線條才看得見；3D 模型維持原色，只換背景。
 */
export function MockImage({
  src,
  alt,
  kind = "model",
  className,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  preload,
}: MockImageProps) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={cn("object-contain", kind === "plan" && "dark:hue-rotate-180 dark:invert")}
      />
    </div>
  );
}

/** 3D 檢視右上角的方位方塊 */
export function ViewCube({ caption }: { caption?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div aria-hidden className="relative size-16">
        <svg viewBox="0 0 64 64" className="size-16">
          <polygon points="32,4 58,17 32,30 6,17" className="fill-surface stroke-border-strong" />
          <polygon points="6,17 32,30 32,60 6,47" className="fill-subtle stroke-border-strong" />
          <polygon points="32,30 58,17 58,47 32,60" className="fill-sunken stroke-border-strong" />
          <text x="32" y="20" textAnchor="middle" className="fill-fg-muted text-[9px]">
            上
          </text>
          <text x="19" y="44" textAnchor="middle" className="fill-fg-muted text-[9px]">
            前
          </text>
          <text x="45" y="44" textAnchor="middle" className="fill-fg-muted text-[9px]">
            右
          </text>
        </svg>
      </div>
      {caption && <span className="text-[11px] text-fg-muted">{caption}</span>}
    </div>
  );
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("text-xs font-medium text-fg-muted", className)}>{children}</h3>;
}
