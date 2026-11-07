import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, Logo } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  active?: "projects" | "presets";
  /** 有麵包屑時不顯示主導覽（例如上傳頁） */
  breadcrumb?: readonly { label: string; href?: string; strong?: boolean }[];
}

export function AppHeader({ active, breadcrumb }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-4 border-b border-border bg-surface px-4">
      <Logo href="/projects" />
      {breadcrumb ? (
        <>
          <span aria-hidden className="h-5 w-px bg-border" />
          <nav
            aria-label="位置"
            className="flex min-w-0 items-center gap-1.5 truncate text-[13px] text-fg-muted"
          >
            {breadcrumb.map((b, i) => (
              <Crumb key={b.label} item={b} last={i === breadcrumb.length - 1} />
            ))}
          </nav>
        </>
      ) : (
        <nav aria-label="主要" className="flex items-center gap-1 text-[13px]">
          <NavLink href="/projects" active={active === "projects"}>
            專案
          </NavLink>
          <NavLink href="/presets" active={active === "presets"}>
            Preset
          </NavLink>
        </nav>
      )}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle className="size-8" />
        <Avatar />
      </div>
    </header>
  );
}

function Crumb({
  item,
  last,
}: {
  item: { label: string; href?: string; strong?: boolean };
  last: boolean;
}) {
  const label = <span className={cn(item.strong && "font-medium text-fg")}>{item.label}</span>;
  return (
    <>
      {item.href ? (
        <Link href={item.href} className="hover:text-fg">
          {label}
        </Link>
      ) : (
        label
      )}
      {!last && <span aria-hidden>/</span>}
    </>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-1.5 font-medium",
        active ? "bg-accent-soft text-accent-fg" : "text-fg-muted hover:bg-sunken hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}
