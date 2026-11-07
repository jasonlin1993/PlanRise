import { cn } from "@/lib/utils";
import { STATUS_LABEL, SYSTEMS, type ConflictStatus, type SystemKey } from "@/features/sample/data";

const SYS_BG: Record<SystemKey, string> = {
  water: "bg-sys-water",
  drain: "bg-sys-drain",
  power: "bg-sys-power",
  lowv: "bg-sys-lowv",
};

const SYS_BORDER: Record<SystemKey, string> = {
  water: "border-sys-water",
  drain: "border-sys-drain",
  power: "border-sys-power",
  lowv: "border-sys-lowv",
};

/** 系統色短線；弱電以虛線區分 */
export function SystemLine({ system, className }: { system: SystemKey; className?: string }) {
  if (SYSTEMS[system].dashed) {
    return (
      <span
        aria-hidden
        className={cn("inline-block w-3.5 border-t-2 border-dashed", SYS_BORDER[system], className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn("inline-block h-0.5 w-3.5 rounded-full", SYS_BG[system], className)}
    />
  );
}

export function SystemTag({
  system,
  label,
  className,
}: {
  system: SystemKey;
  label?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-fg-muted", className)}>
      <SystemLine system={system} />
      {label ?? SYSTEMS[system].label}
    </span>
  );
}

const MARKER: Record<ConflictStatus, string> = {
  open: "border-danger bg-danger-soft text-danger-fg",
  review: "border-warning bg-warning-soft text-warning-fg",
  resolved: "border-resolved bg-resolved-soft text-fg-muted",
  ignored: "border-border-strong bg-sunken text-fg-muted",
};

interface ConflictMarkerProps {
  id: number;
  status: ConflictStatus;
  selected?: boolean;
  size?: "sm" | "md" | "lg";
}

/** 衝突編號標記：圓形、狀態色外框與淡色填色；選取時外加一圈強調色 */
export function ConflictMarker({ id, status, selected, size = "md" }: ConflictMarkerProps) {
  return (
    <span
      aria-label={`衝突 ${id}`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border-[1.5px] font-medium",
        size === "sm" && "size-5 text-[11px]",
        size === "md" && "size-7 text-xs",
        size === "lg" && "size-11 text-lg",
        MARKER[status],
        selected && "ring-2 ring-accent ring-offset-2 ring-offset-surface",
      )}
    >
      {id}
    </span>
  );
}

const DOT: Record<ConflictStatus, string> = {
  open: "bg-danger",
  review: "bg-warning",
  resolved: "bg-resolved",
  ignored: "bg-border-strong",
};

export function StatusDot({ status, className }: { status: ConflictStatus; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-1.5 shrink-0 rounded-full", DOT[status], className)}
    />
  );
}

export function StatusText({ status, className }: { status: ConflictStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-fg-muted", className)}>
      <StatusDot status={status} />
      {STATUS_LABEL[status]}
    </span>
  );
}

/** 衝突數量摘要：5 個衝突・未處理 3・需確認 1・已處理 1 */
export function ConflictSummary({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-muted",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <StatusDot status="open" />
        未處理 3
      </span>
      <span aria-hidden>・</span>
      <span className="inline-flex items-center gap-1.5">
        <StatusDot status="review" />
        需確認 1
      </span>
      <span aria-hidden>・</span>
      <span className="inline-flex items-center gap-1.5">
        <StatusDot status="resolved" />
        已處理 1
      </span>
    </span>
  );
}

/** 平面套疊下方的圖例 */
export function MepLegend({
  withStatus = true,
  className,
}: {
  withStatus?: boolean;
  className?: string;
}) {
  const systems: SystemKey[] = ["water", "drain", "power", "lowv"];
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs whitespace-nowrap text-fg-muted",
        className,
      )}
    >
      {systems.map((s) => (
        <SystemTag key={s} system={s} />
      ))}
      {withStatus && (
        <>
          <span aria-hidden className="h-3 w-px bg-border" />
          {(["open", "review", "resolved"] as const).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span aria-hidden className={cn("size-3 rounded-full border-[1.5px]", MARKER[s])} />
              {STATUS_LABEL[s]}
            </span>
          ))}
        </>
      )}
    </div>
  );
}
