import { ArrowLeft, Box, Cable, ChartColumn, LayoutPanelLeft, Link2, Lock } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import { SelectBox } from "@/components/ui/form";
import { Avatar, Logo, LogoMark } from "@/components/ui/misc";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import type { EditorTab } from "../types";

export type DrawingKind = "arch" | "plumbing" | "overlay";

const DRAWING_LABEL: Record<DrawingKind, string> = {
  arch: "建築圖",
  plumbing: "給排水",
  overlay: "套疊：全部圖面",
};

const DRAWING_DOTS: Record<DrawingKind, [string, string]> = {
  arch: ["bg-fg-muted", "bg-border-strong"],
  plumbing: ["bg-sys-water", "bg-sys-drain"],
  overlay: ["bg-sys-water", "bg-sys-power"],
};

export function DrawingDots({ kind }: { kind: DrawingKind }) {
  const [a, b] = DRAWING_DOTS[kind];
  return (
    <span aria-hidden className="flex gap-0.5">
      <span className={cn("size-2 rounded-xs", a)} />
      <span className={cn("size-2 rounded-xs", b)} />
    </span>
  );
}

interface EditorHeaderProps {
  mode: "project" | "demo";
  tab: EditorTab;
  tabHref: Record<EditorTab, string>;
  showMepTab: boolean;
  mepCount: number;
  drawing: DrawingKind;
  file: string;
}

const TAB_META: Record<EditorTab, { label: string; short: string; Icon: typeof Box }> = {
  "2d": { label: "2D 對應", short: "2D", Icon: LayoutPanelLeft },
  "3d": { label: "3D 檢視", short: "3D", Icon: Box },
  analysis: { label: "分析", short: "分析", Icon: ChartColumn },
  mep: { label: "機電", short: "機電", Icon: Cable },
};

export function EditorHeader({
  mode,
  tab,
  tabHref,
  showMepTab,
  mepCount,
  drawing,
  file,
}: EditorHeaderProps) {
  const tabs: EditorTab[] = showMepTab ? ["2d", "3d", "analysis", "mep"] : ["2d", "3d", "analysis"];
  const demo = mode === "demo";

  return (
    <header className="shrink-0 border-b border-border bg-surface">
      {/* 桌機 */}
      <div className="hidden h-12 grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 lg:grid">
        <div className="flex min-w-0 items-center gap-3 text-[13px]">
          <Logo href={demo ? "/" : "/projects"} />
          <span aria-hidden className="h-5 w-px bg-border" />
          <nav
            aria-label="位置"
            className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-fg-muted"
          >
            <Link href={demo ? "/demo" : "/projects"} className="hover:text-fg">
              {demo ? "範例" : "專案"}
            </Link>
            <span aria-hidden>/</span>
            <Link
              href={demo ? "/demo" : "/projects/library"}
              className="font-medium text-fg hover:underline"
            >
              社區圖書館
            </Link>
            <span aria-hidden>/</span>
            <SelectBox value="1F" size="sm" label="樓層" className="border-transparent bg-sunken" />
            <span aria-hidden>/</span>
            <SelectBox
              size="sm"
              label="圖面"
              className="max-w-64 min-w-0"
              value={
                <>
                  <DrawingDots kind={drawing} />
                  <span className="font-medium">{DRAWING_LABEL[drawing]}</span>
                  {drawing !== "overlay" && (
                    <span className="truncate font-mono text-fg-muted">{file}</span>
                  )}
                </>
              }
            />
          </nav>
        </div>

        <Segmented
          label="編輯器模式"
          items={tabs.map((t) => {
            const { label, Icon } = TAB_META[t];
            return {
              key: t,
              href: tabHref[t],
              active: t === tab,
              label: (
                <>
                  <Icon className="size-3.5" aria-hidden />
                  {label}
                  {t === "mep" && (
                    <span
                      className={cn(
                        "rounded px-1 font-mono text-[11px]",
                        mepCount > 0 ? "text-danger-fg" : "text-fg-muted",
                      )}
                    >
                      {mepCount}
                    </span>
                  )}
                </>
              ),
            };
          })}
        />

        <div className="flex items-center justify-end gap-2">
          {!demo && (
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs text-fg-muted">
              <span aria-hidden className="size-1.5 rounded-full bg-success" />
              已儲存
            </span>
          )}
          <ThemeToggle className="size-8" />
          {demo ? (
            <>
              <Button size="md" disabled title="登入後可使用">
                <Lock className="size-3.5" aria-hidden />
                分享
              </Button>
              <ButtonLink href="/login" size="md">
                登入
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href="/s/library-1f" size="md">
                <Link2 className="size-3.5" aria-hidden />
                分享
              </ButtonLink>
              <Avatar />
            </>
          )}
        </div>
      </div>

      {/* 手機 */}
      <div className="flex h-14 items-center gap-2 px-3 lg:hidden">
        {demo ? (
          <LogoMark className="size-8" />
        ) : (
          <Link
            href="/projects/library"
            aria-label="返回專案"
            className="inline-flex size-8 items-center justify-center text-fg-muted"
          >
            <ArrowLeft className="size-5" aria-hidden />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">社區圖書館 1F</p>
          <p className="truncate font-mono text-[11px] text-fg-muted">{file}</p>
        </div>
        <Segmented
          size="sm"
          label="編輯器模式"
          items={tabs.map((t) => ({
            key: t,
            href: tabHref[t],
            active: t === tab,
            label: TAB_META[t].short,
          }))}
        />
        {demo ? (
          <Link href="/login" className="px-1 text-sm font-medium text-fg">
            登入
          </Link>
        ) : (
          <Link
            href="/s/library-1f"
            aria-label="分享"
            className="inline-flex size-8 items-center justify-center text-fg-muted"
          >
            <Link2 className="size-4" aria-hidden />
          </Link>
        )}
      </div>
    </header>
  );
}
