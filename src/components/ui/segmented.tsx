import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SegmentedItem {
  key: string;
  label: ReactNode;
  href?: string;
  active?: boolean;
}

interface SegmentedProps {
  items: readonly SegmentedItem[];
  size?: "sm" | "md" | "lg";
  className?: string;
  /** 撐滿寬度，每個選項等寬 */
  stretch?: boolean;
  label?: string;
}

const SIZE = {
  sm: "h-7 px-2.5 text-xs",
  md: "h-8 px-3 text-[13px]",
  lg: "h-10 px-4 text-sm",
} as const;

/** 分段切換。切版階段用連結切換畫面狀態，沒有 client 狀態。 */
export function Segmented({ items, size = "md", className, stretch, label }: SegmentedProps) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg bg-sunken p-0.5",
        stretch && "flex w-full",
        className,
      )}
    >
      {items.map((item) => {
        const cls = cn(
          "inline-flex items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap transition-colors",
          SIZE[size],
          stretch && "flex-1",
          item.active ? "bg-surface text-accent-fg shadow-sm" : "text-fg-muted hover:text-fg",
        );
        return item.href ? (
          <Link
            key={item.key}
            href={item.href}
            role="tab"
            aria-selected={item.active ?? false}
            className={cls}
          >
            {item.label}
          </Link>
        ) : (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={item.active ?? false}
            className={cls}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
