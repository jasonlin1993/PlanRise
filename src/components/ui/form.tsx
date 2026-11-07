import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  label: string;
  size?: "sm" | "md";
  /** 切版階段用連結切換畫面狀態 */
  href?: string;
}

/** 開關（切版用，僅呈現狀態） */
export function Switch({ checked = false, disabled, label, size = "md", href }: SwitchProps) {
  const sm = size === "sm";
  const cls = cn(
    "relative inline-flex shrink-0 items-center rounded-full transition-colors disabled:opacity-50",
    sm ? "h-4 w-7" : "h-5 w-9",
    checked ? "bg-accent" : "bg-border-strong",
  );
  const knob = (
    <span
      className={cn(
        "absolute rounded-full bg-white shadow-sm transition-transform",
        sm ? "left-0.5 size-3" : "left-0.5 size-4",
        checked && (sm ? "translate-x-3" : "translate-x-4"),
      )}
    />
  );
  if (href) {
    return (
      <Link href={href} role="switch" aria-checked={checked} aria-label={label} className={cls}>
        {knob}
      </Link>
    );
  }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={cls}
    >
      {knob}
    </button>
  );
}

interface SelectBoxProps {
  value: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

/** 下拉選單外觀（切版用） */
export function SelectBox({ value, className, size = "md", label }: SelectBoxProps) {
  return (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-between gap-2 rounded-md border border-border-strong bg-surface text-left text-fg hover:border-fg-muted",
        size === "sm" && "h-7 px-2 text-xs",
        size === "md" && "h-8 px-2.5 text-[13px]",
        size === "lg" && "h-10 px-3 text-sm",
        className,
      )}
    >
      <span className="flex min-w-0 items-center gap-2 truncate">{value}</span>
      <ChevronDown className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
    </button>
  );
}

interface NumberFieldProps {
  value: string;
  unit?: string;
  label: string;
  className?: string;
  invalid?: boolean;
}

/** 帶單位的數值輸入框 */
export function NumberField({ value, unit, label, className, invalid }: NumberFieldProps) {
  return (
    <span
      className={cn(
        "flex h-9 items-center gap-1 rounded-md border bg-surface px-2.5 focus-within:border-accent",
        invalid ? "border-danger" : "border-border-strong",
        className,
      )}
    >
      <input
        aria-label={label}
        defaultValue={value}
        inputMode="decimal"
        className="w-full min-w-0 bg-transparent font-mono text-[13px] text-fg outline-none"
      />
      {unit && <span className="font-mono text-[11px] text-fg-muted">{unit}</span>}
    </span>
  );
}

interface CheckboxProps {
  label: ReactNode;
  defaultChecked?: boolean;
}

export function Checkbox({ label, defaultChecked }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2.5 text-[13px] text-fg">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="size-4 rounded accent-accent"
      />
      {label}
    </label>
  );
}
