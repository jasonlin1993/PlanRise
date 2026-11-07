import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";

interface EditorShellProps {
  header: ReactNode;
  banner?: ReactNode;
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  statusBar: ReactNode;
  mobile: MobileSheetProps;
  leftClassName?: string;
}

/**
 * 編輯器版面：桌機三欄（左面板／畫布／右面板）＋底部狀態列；
 * 手機為上方畫布＋下方面板（bottom sheet）。
 */
export function EditorShell({
  header,
  banner,
  left,
  center,
  right,
  statusBar,
  mobile,
  leftClassName,
}: EditorShellProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas text-fg">
      {header}
      {banner}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside
          className={cn(
            "hidden w-[272px] shrink-0 flex-col overflow-hidden border-r border-border bg-surface lg:flex",
            leftClassName,
          )}
        >
          {left}
        </aside>
        <main className="relative flex h-[46dvh] min-w-0 shrink-0 flex-col lg:h-auto lg:flex-1 lg:shrink">
          {mobile.canvasTop && <div className="lg:hidden">{mobile.canvasTop}</div>}
          {center}
        </main>
        <aside className="hidden w-[304px] shrink-0 flex-col overflow-hidden border-l border-border bg-surface lg:flex">
          {right}
        </aside>
        <MobileSheet {...mobile} />
      </div>
      <footer className="hidden h-11 shrink-0 items-center gap-4 border-t border-border bg-surface px-4 text-xs lg:flex">
        {statusBar}
      </footer>
    </div>
  );
}

interface MobileSheetProps {
  tabs: readonly string[];
  activeTab?: number;
  content: ReactNode;
  footer: ReactNode;
  canvasTop?: ReactNode;
}

function MobileSheet({ tabs, activeTab = 0, content, footer }: MobileSheetProps) {
  return (
    <section
      aria-label="面板"
      className="-mt-4 flex min-h-0 flex-1 flex-col rounded-t-2xl border-t border-border bg-surface shadow-[0_-4px_16px_rgb(0_0_0/0.04)] lg:hidden"
    >
      <div aria-hidden className="mx-auto mt-2 h-1 w-10 rounded-full bg-border-strong" />
      <div className="flex items-center gap-2 border-b border-border px-3 py-3">
        <Segmented
          stretch
          size="lg"
          items={tabs.map((t, i) => ({ key: t, label: t, active: i === activeTab }))}
        />
        <button
          type="button"
          aria-label="收合面板"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-fg-muted"
        >
          <ChevronDown className="size-4" aria-hidden />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{content}</div>
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-t border-border px-4 text-xs text-fg-muted">
        {footer}
      </div>
    </section>
  );
}

export function PanelHeader({
  title,
  count,
  aside,
  className,
}: {
  title: ReactNode;
  count?: number;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border px-4",
        className,
      )}
    >
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        {title}
        {count !== undefined && (
          <span className="rounded bg-sunken px-1.5 font-mono text-[11px] font-normal text-fg-muted">
            {count}
          </span>
        )}
      </h2>
      {aside && <div className="flex items-center gap-2 text-xs text-fg-muted">{aside}</div>}
    </div>
  );
}

/** 畫布上方的浮動工具列容器 */
export function FloatingBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "absolute z-10 flex items-center gap-1 rounded-lg border border-border bg-surface p-1 text-[13px] shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ToolButton({
  label,
  active,
  children,
}: {
  label: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md transition-colors",
        active ? "bg-accent-soft text-accent-fg" : "text-fg-muted hover:bg-sunken hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

export function StatusGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3 text-fg-muted", className)}>{children}</div>
  );
}
