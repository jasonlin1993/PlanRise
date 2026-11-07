import { Ellipsis, Upload } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge, MockImage } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

interface DrawingCardProps {
  href: string;
  badge: string;
  file: string;
  meta: ReactNode;
  image: string;
  kind: "model" | "plan";
}

export function DrawingCard({ href, badge, file, meta, image, kind }: DrawingCardProps) {
  return (
    <article className="relative rounded-xl border border-border bg-surface shadow-xs">
      <Link href={href} className="block">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl border-b border-border grid-paper">
          <MockImage
            src={image}
            alt={`${file} 縮圖`}
            kind={kind}
            sizes="(min-width: 1024px) 25vw, 100vw"
            className="absolute inset-3"
          />
          <Badge tone="accent" className="absolute top-3 left-3 bg-surface">
            {badge}
          </Badge>
        </div>
        <div className="px-4 py-3 pr-14">
          <h3 className="truncate font-mono text-sm">{file}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[13px] text-fg-muted">
            {meta}
          </p>
        </div>
      </Link>
      <button
        type="button"
        aria-label="更多動作"
        className="absolute right-3 bottom-4 inline-flex size-8 items-center justify-center rounded-md text-fg-muted hover:bg-sunken"
      >
        <Ellipsis className="size-4" aria-hidden />
      </button>
    </article>
  );
}

export function UploadTile({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong text-center hover:border-accent hover:bg-accent-soft/40",
        className,
      )}
    >
      <Upload className="size-5 text-fg-muted" aria-hidden />
      <span className="text-[15px] font-medium">{label}</span>
      <span className="text-[13px] text-fg-muted">.dxf・.json</span>
    </Link>
  );
}
