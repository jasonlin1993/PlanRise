import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "quiet";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary: "border border-border-strong bg-surface text-fg hover:bg-sunken",
  ghost: "text-accent-fg hover:bg-accent-soft",
  danger: "border border-border bg-surface text-danger-fg hover:bg-danger-soft",
  quiet: "text-fg-muted hover:bg-sunken hover:text-fg",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-7 gap-1.5 px-2.5 text-xs",
  md: "h-8 gap-1.5 px-3 text-[13px]",
  lg: "h-11 gap-2 px-5 text-sm",
};

const DISABLED =
  "disabled:pointer-events-none disabled:border-border disabled:bg-sunken disabled:text-fg-subtle";

export function buttonClass(
  variant: ButtonVariant = "secondary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-md font-medium whitespace-nowrap transition-colors",
    VARIANT[variant],
    SIZE[size],
    DISABLED,
    className,
  );
}

interface ButtonProps extends Omit<ComponentProps<"button">, "type"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant, size, className, ...rest }: ButtonProps) {
  return <button type="button" className={buttonClass(variant, size, className)} {...rest} />;
}

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ href, variant, size, className, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}
