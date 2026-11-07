import { CircleCheck, Ellipsis, Link2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Toast } from "@/components/ui/empty-state";
import { MockImage } from "@/components/ui/misc";
import type { ProjectSummary } from "@/features/sample/data";

export function ProjectCard({
  project,
  menuOpen,
}: {
  project: ProjectSummary;
  menuOpen?: boolean;
}) {
  return (
    <article className="relative rounded-xl border border-border bg-surface shadow-xs">
      <Link href={`/projects/${project.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl border-b border-border grid-paper">
          <MockImage
            src={project.thumb}
            alt={`${project.name} 縮圖`}
            sizes="(min-width: 1024px) 25vw, 100vw"
            className="absolute inset-3"
          />
        </div>
        <div className="px-4 py-3 pr-14">
          <h2 className="truncate text-[15px] font-semibold">{project.name}</h2>
          <p className="mt-0.5 text-[13px] text-fg-muted">
            {project.floors} 層・{project.drawings} 張圖面・{project.updated}
          </p>
        </div>
      </Link>
      <button
        type="button"
        aria-label="更多動作"
        aria-expanded={menuOpen ?? false}
        className={
          menuOpen
            ? "absolute right-3 bottom-4 inline-flex size-8 items-center justify-center rounded-md bg-sunken text-fg"
            : "absolute right-3 bottom-4 inline-flex size-8 items-center justify-center rounded-md text-fg-muted hover:bg-sunken"
        }
      >
        <Ellipsis className="size-4" aria-hidden />
      </button>
      {menuOpen && (
        <div
          role="menu"
          className="absolute top-full right-3 z-20 mt-1 w-56 rounded-lg border border-border bg-surface p-1 text-sm shadow-lg"
        >
          <button
            role="menuitem"
            type="button"
            className="flex w-full items-center gap-2.5 rounded-md bg-sunken px-3 py-2 text-left"
          >
            <Pencil className="size-4 text-fg-muted" aria-hidden />
            重新命名
          </button>
          <button
            role="menuitem"
            type="button"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left hover:bg-sunken"
          >
            <Link2 className="size-4 text-fg-muted" aria-hidden />
            複製分享連結
          </button>
          <div className="my-1 h-px bg-border" />
          <button
            role="menuitem"
            type="button"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-danger-fg hover:bg-danger-soft"
          >
            <Trash2 className="size-4" aria-hidden />
            刪除專案
          </button>
        </div>
      )}
    </article>
  );
}

export function DeletedToast() {
  return (
    <Toast
      icon={<CircleCheck className="size-4 text-success" aria-hidden />}
      action={
        <button type="button" className="ml-4 font-medium text-accent">
          復原
        </button>
      }
    >
      已刪除「舊版草圖 v2」
    </Toast>
  );
}
