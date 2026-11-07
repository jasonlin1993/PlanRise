import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, actions, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 text-center", className)}>
      <span className="inline-flex size-16 items-center justify-center rounded-xl border border-border bg-surface text-fg-muted shadow-sm">
        {icon}
      </span>
      <h2 className="mt-2 text-lg font-semibold">{title}</h2>
      <p className="max-w-lg text-sm leading-relaxed text-fg-muted">{description}</p>
      {actions && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">{actions}</div>
      )}
    </div>
  );
}

/** 深色底的提示（淺色主題）／淺色底（深色主題） */
export function Toast({
  icon,
  children,
  action,
}: {
  icon: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      role="status"
      className="fixed bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-lg bg-toast px-5 py-3 text-sm whitespace-nowrap text-toast-fg shadow-lg"
    >
      {icon}
      <span>{children}</span>
      {action}
    </div>
  );
}
