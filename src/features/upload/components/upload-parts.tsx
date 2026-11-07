import { ArrowRight, Check, CircleAlert, CircleCheck, LoaderCircle, Upload } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { SelectBox } from "@/components/ui/form";
import { MockImage } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

export type DrawingType = "arch" | "mep";

export function UploadOptions({
  type,
  hrefFor,
}: {
  type: DrawingType;
  hrefFor: Record<DrawingType, string>;
}) {
  const options = [
    { key: "arch" as const, title: "建築圖", desc: "牆・柱・門窗・家具" },
    { key: "mep" as const, title: "水電圖", desc: "加值功能・需先有同樓層建築圖" },
  ];
  return (
    <section className="grid gap-4 rounded-xl border border-border bg-surface p-5 md:grid-cols-[13rem_1fr]">
      <div className="space-y-2">
        <p className="text-[13px] text-fg-muted">樓層</p>
        <SelectBox value="1F" size="lg" className="w-full" label="樓層" />
      </div>
      <div className="space-y-2">
        <p className="text-[13px] text-fg-muted">圖面類型</p>
        <div
          role="radiogroup"
          aria-label="圖面類型"
          className="grid gap-1 rounded-lg bg-sunken p-1 sm:grid-cols-2"
        >
          {options.map((o) => (
            <Link
              key={o.key}
              href={hrefFor[o.key]}
              role="radio"
              aria-checked={type === o.key}
              className={cn(
                "flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm",
                type === o.key ? "bg-surface shadow-sm" : "hover:bg-surface/60",
              )}
            >
              <span
                className={cn("font-semibold", type === o.key ? "text-accent-fg" : "text-fg-muted")}
              >
                {o.title}
              </span>
              <span className="truncate text-xs text-fg-muted">{o.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Dropzone({ retry }: { retry?: boolean }) {
  return (
    <section className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-lg bg-sunken text-fg-muted">
        <Upload className="size-5" aria-hidden />
      </span>
      <p className="mt-2 text-base font-semibold">拖曳檔案到這裡</p>
      <p className="text-sm text-fg-muted">或從電腦選擇檔案</p>
      <p className="flex gap-2 font-mono text-xs text-fg-muted">
        <span className="rounded border border-border px-2 py-1">.dxf</span>
        <span className="rounded border border-border px-2 py-1">.json</span>
      </p>
      <Button variant="primary" size="lg" className="mt-2">
        {retry ? "重新上傳" : "選擇檔案"}
      </Button>
    </section>
  );
}

type StepState = "done" | "running" | "pending";

function Step({
  state,
  title,
  detail,
  time,
}: {
  state: StepState;
  title: string;
  detail?: string;
  time?: string;
}) {
  return (
    <li className="flex items-center gap-3 py-2 text-sm">
      {state === "done" && <CircleCheck className="size-5 text-success" aria-label="完成" />}
      {state === "running" && (
        <LoaderCircle className="size-5 animate-spin text-accent" aria-label="進行中" />
      )}
      {state === "pending" && (
        <span
          aria-label="等待中"
          className="size-5 rounded-full border-2 border-dashed border-border-strong"
        />
      )}
      <span
        className={cn(
          state === "running" && "font-semibold",
          state === "pending" && "text-fg-muted",
        )}
      >
        {title}
      </span>
      {detail && <span className="text-fg-muted">{detail}</span>}
      {time && <span className="ml-auto font-mono text-fg-muted">{time}</span>}
    </li>
  );
}

export function ParsingCard() {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-start gap-4 border-b border-border p-5">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-sunken font-mono text-xs text-fg-muted">
          DXF
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex justify-between font-mono text-sm">
            <span className="truncate font-medium">library-1F.dxf</span>
            <span>62%</span>
          </div>
          <div className="h-1.5 rounded-full bg-sunken">
            <div className="h-full w-[62%] rounded-full bg-accent" />
          </div>
          <div className="flex justify-between text-[13px] text-fg-muted">
            <span>正在建立圖塊索引…</span>
            <span className="font-mono">4.2 MB</span>
          </div>
        </div>
      </div>
      <ol className="border-b border-border px-5 py-3">
        <Step state="done" title="讀取檔案" time="0.4 s" />
        <Step state="done" title="解析圖層" detail="找到 6 個圖層" time="1.1 s" />
        <Step state="running" title="建立圖塊索引" detail="31 / 52" />
        <Step state="pending" title="偵測單位與比例尺" />
      </ol>
      <div className="flex justify-end px-5 py-3">
        <Button variant="quiet">取消上傳</Button>
      </div>
    </section>
  );
}

export function ParseError() {
  return (
    <section role="alert" className="rounded-xl border border-danger bg-danger-soft p-5">
      <p className="flex items-center gap-2 font-semibold text-danger-fg">
        <CircleAlert className="size-5 shrink-0" aria-hidden />
        無法解析檔案：找不到圖面內容，檔案可能已損毀
      </p>
      <div className="mt-2 space-y-2 pl-7 text-sm">
        <p className="font-mono text-fg-muted">library-1F.dxf・4.2 MB</p>
        <p className="font-medium">建議：</p>
        <ul className="list-disc space-y-1 pl-5 text-fg-muted">
          <li>從 AutoCAD 重新匯出 DXF（建議選 AutoCAD 2013 DXF 格式）</li>
          <li>或使用 PlanRise AutoCAD 插件直接匯出 JSON</li>
        </ul>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  unit,
  detail,
}: {
  label: string;
  value: string;
  unit?: string;
  detail: ReactNode;
}) {
  return (
    <div className="p-5">
      <p className="text-[13px] text-fg-muted">{label}</p>
      <p className="mt-2 font-mono text-2xl font-medium">
        {value}
        {unit && <span className="ml-1 font-sans text-sm font-normal">{unit}</span>}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{detail}</p>
    </div>
  );
}

export function ParseResult({ type, changeHref }: { type: DrawingType; changeHref: string }) {
  const mep = type === "mep";
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <CircleCheck className="size-5 text-success" aria-hidden />
        <div className="min-w-0">
          <p className="font-semibold">解析完成</p>
          <p className="truncate font-mono text-[13px] text-fg-muted">
            {mep ? "library-1F-plumbing.dxf・1.8 MB・1.6 s" : "library-1F.dxf・4.2 MB・2.3 s"}
          </p>
        </div>
        <Link href={changeHref} className="ml-auto shrink-0 text-sm text-fg-muted hover:text-fg">
          換一個檔案
        </Link>
      </div>
      <div className="grid divide-border sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
        {mep ? (
          <>
            <Stat label="圖層" value="7" detail="給水、排水、立管 2、設備，另含底圖 2" />
            <Stat label="圖塊" value="2" unit="種" detail="落水頭、洗手台" />
            <Stat label="圖面範圍" value="27.0×17.0" detail="公尺" />
            <Stat
              label="偵測到的單位"
              value="mm"
              detail={<span className="font-mono">INSUNITS = 4</span>}
            />
          </>
        ) : (
          <>
            <Stat label="圖層" value="6" detail="牆、柱、門窗、家具、文字，另含標註 1" />
            <Stat label="圖塊" value="9" unit="種" detail="門、窗、椅子、櫃子等 52 個" />
            <Stat label="圖面範圍" value="24.0×17.0" detail="公尺" />
            <Stat
              label="偵測到的單位"
              value="mm"
              detail={<span className="font-mono">INSUNITS = 4</span>}
            />
          </>
        )}
      </div>
      {!mep && (
        <div className="flex justify-end border-t border-border px-5 py-4">
          <ButtonLink href="/projects/library/drawings/library-1f" variant="primary" size="lg">
            進入編輯器
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      )}
    </section>
  );
}

export function AlignmentCard({ offset, editorHref }: { offset: boolean; editorHref: string }) {
  return (
    <section
      className={cn(
        "grid overflow-hidden rounded-xl border bg-surface md:grid-cols-[2fr_3fr]",
        offset ? "border-warning" : "border-border",
      )}
    >
      <div className="relative min-h-56 border-b border-border grid-paper md:border-r md:border-b-0">
        <MockImage
          src={offset ? "/mock/plan-offset.png" : "/mock/plan-aligned.png"}
          alt={offset ? "水電圖與建築圖偏移的套疊預覽" : "水電圖與建築圖已對齊的套疊預覽"}
          kind="plan"
          sizes="320px"
          className="absolute inset-3"
        />
      </div>
      <div className="space-y-4 p-6">
        <p className="text-[13px] text-fg-muted">對齊檢查・與 1F 建築圖 library-1F.dxf</p>
        {offset ? (
          <p className="flex items-center gap-3 text-xl font-semibold text-warning-fg">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-warning-soft text-sm">
              !
            </span>
            偏移，需要兩點校正
          </p>
        ) : (
          <p className="flex items-center gap-3 text-xl font-semibold text-success-fg">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-success-soft">
              <Check className="size-4" aria-hidden />
            </span>
            座標已對齊
          </p>
        )}
        <p className="text-sm leading-relaxed text-fg-muted">
          {offset
            ? "以底圖 A-COL 的 11 根柱比對，柱位與建築圖對不上，可能是圖面原點或比例不同。請在兩張圖上各點選兩根相同的柱，系統會算出位移、縮放與旋轉。"
            : "水電圖與建築圖使用相同原點與單位，以底圖 A-COL 的 11 根柱比對，位置全部吻合，可以直接套疊。"}
        </p>
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
          {(offset
            ? [
                ["平均偏差", "1.38 m", "text-warning-fg"],
                ["推估旋轉", "約 2.4°", ""],
                ["吻合柱位", "0 / 11", ""],
              ]
            : [
                ["最大偏差", "0.004 m", "text-success-fg"],
                ["旋轉", "0.00°", ""],
                ["吻合柱位", "11 / 11", ""],
              ]
          ).map(([k, v, tone]) => (
            <div key={k}>
              <dt className="text-fg-muted">{k}</dt>
              <dd className={cn("mt-1 font-mono text-base", tone)}>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          {offset ? (
            <>
              <ButtonLink href={editorHref} size="lg">
                稍後再校正
              </ButtonLink>
              <ButtonLink href={`${editorHref}?calibrate=1`} variant="primary" size="lg">
                開始兩點校正
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </>
          ) : (
            <ButtonLink href={editorHref} variant="primary" size="lg">
              進入編輯器
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
