import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const DEMO_EXAMPLES = [
  { id: "1", label: "範例 1・AIA 命名", short: "範例 1・AIA", hint: "A-WALL" },
  { id: "2", label: "範例 2・中文圖層", short: "範例 2・中文", hint: "牆／柱" },
  { id: "3", label: "範例 3・自訂命名＋水電圖", short: "範例 3・自訂＋水電", hint: "WALL_EXT" },
] as const;

export type DemoExampleId = (typeof DEMO_EXAMPLES)[number]["id"];

export function DemoBanner({
  example,
  hrefFor,
}: {
  example: DemoExampleId;
  hrefFor: Record<DemoExampleId, string>;
}) {
  return (
    <div className="shrink-0 border-b border-warning/30 bg-warning-soft">
      <div className="flex flex-col gap-2 px-4 py-2.5 lg:h-12 lg:flex-row lg:items-center lg:gap-4 lg:py-0">
        <div className="flex items-center gap-4">
          <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-warning-fg">
            <Info className="size-4" aria-hidden />
            示範模式，不會存檔
          </p>
          <Link href="/login" className="text-[13px] text-accent-fg lg:hidden">
            想用自己的圖面？登入後上傳 →
          </Link>
        </div>
        <span aria-hidden className="hidden h-5 w-px bg-warning/30 lg:block" />
        <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <span className="hidden text-[13px] text-fg-muted lg:inline">範例圖</span>
          {DEMO_EXAMPLES.map((ex) => (
            <Link
              key={ex.id}
              href={hrefFor[ex.id]}
              aria-current={ex.id === example ? "true" : undefined}
              className={cn(
                "inline-flex h-8 shrink-0 items-center gap-2 rounded-md border px-3 text-[13px] font-medium",
                ex.id === example
                  ? "border-accent bg-accent-soft text-accent-fg"
                  : "border-border-strong bg-surface text-fg hover:bg-sunken",
              )}
            >
              <span className="hidden lg:inline">{ex.label}</span>
              <span className="lg:hidden">{ex.short}</span>
              <span className="hidden font-mono text-[11px] text-fg-muted lg:inline">
                {ex.hint}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="/login"
          className="ml-auto hidden items-center gap-1 text-[13px] text-fg-muted lg:inline-flex"
        >
          想用自己的圖面？<span className="text-accent-fg">登入後上傳</span>
          <ArrowRight className="size-3.5 text-accent-fg" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
