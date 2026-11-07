import { X } from "lucide-react";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { MockImage, SectionLabel } from "@/components/ui/misc";

function Pane({
  label,
  kind,
  file,
  src,
  alt,
}: {
  label: string;
  kind: string;
  file: string;
  src: string;
  alt: string;
}) {
  return (
    <section className="flex min-w-0 flex-1 flex-col border-border lg:border-r">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4 text-[13px]">
        <span className="font-semibold">
          {label}・{kind}
        </span>
        <span className="truncate font-mono text-fg-muted">{file}</span>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-success-fg">
          <span aria-hidden className="size-1.5 rounded-full bg-success" />
          已選 2 / 2
        </span>
      </div>
      <div className="relative min-h-56 flex-1 grid-paper">
        <MockImage src={src} alt={alt} kind="plan" className="absolute inset-4" />
      </div>
    </section>
  );
}

/** 兩點校正：在兩張圖上各點選同一組參考柱，算出位移、縮放與旋轉 */
export function CalibrationDialog({ closeHref }: { closeHref: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fg/40 p-4 lg:p-10">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="calibration-title"
        className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 id="calibration-title" className="text-base font-semibold">
              兩點校正
            </h2>
            <p className="mt-0.5 text-[13px] text-fg-muted">
              在兩張圖上依序點選同一組參考點，建議選距離較遠的兩根柱。
            </p>
          </div>
          <Link
            href={closeHref}
            aria-label="關閉"
            className="inline-flex size-8 items-center justify-center rounded-md text-fg-muted hover:bg-sunken"
          >
            <X className="size-5" aria-hidden />
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          <Pane
            label="A"
            kind="建築圖"
            file="library-1F.dxf"
            src="/mock/calib-a.png"
            alt="建築圖，已選取柱 C-01 與 C-08"
          />
          <Pane
            label="B"
            kind="給排水"
            file="library-1F-plumbing.dxf"
            src="/mock/calib-b.png"
            alt="給排水圖，已選取對應的兩根柱"
          />

          <aside className="w-full shrink-0 space-y-5 overflow-y-auto p-5 lg:w-96">
            <section className="space-y-2">
              <SectionLabel>參考點</SectionLabel>
              <table className="w-full font-mono text-[13px]">
                <thead className="font-sans text-xs text-fg-muted">
                  <tr>
                    <th className="w-6" />
                    <th className="py-1 text-left font-normal">A 建築圖</th>
                    <th className="py-1 text-left font-normal">B 給排水</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1", "C-01 (0, 0)", "(-1.23, 0.75)"],
                    ["2", "C-08 (24, 14)", "(21.47, 15.31)"],
                  ].map(([n, a, b]) => (
                    <tr key={n}>
                      <td className="py-1.5 text-accent-fg">{n}</td>
                      <td className="py-1.5">{a}</td>
                      <td className="py-1.5">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="space-y-2">
              <SectionLabel>計算結果</SectionLabel>
              <dl className="space-y-2.5 rounded-lg border border-border p-4 text-[13px]">
                {[
                  ["位移 ΔX", "+1.225 m"],
                  ["位移 ΔY", "-0.746 m"],
                  ["縮放", "× 1.037"],
                  ["旋轉", "-2.35°"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt className="text-fg-muted">{k}</dt>
                    <dd className="font-mono">{v}</dd>
                  </div>
                ))}
                <p className="border-t border-border pt-2.5 text-xs text-fg-muted">
                  以其他 9 根柱驗證：平均偏差{" "}
                  <span className="font-mono text-success-fg">0.006 m</span>
                </p>
              </dl>
            </section>

            <section className="space-y-2">
              <SectionLabel>預覽套疊</SectionLabel>
              <div className="relative h-40 rounded-lg border border-border grid-paper">
                <MockImage
                  src="/mock/plan-mep.png"
                  alt="校正後的套疊預覽"
                  kind="plan"
                  sizes="384px"
                  className="absolute inset-3"
                />
              </div>
            </section>
          </aside>
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-5 py-3 text-[13px] lg:flex-row lg:items-center">
          <p className="text-fg-muted">點位可拖曳微調・套用後會重新計算衝突</p>
          <div className="flex items-center gap-2 lg:ml-auto">
            <Button variant="ghost">重新選點</Button>
            <ButtonLink href={closeHref}>取消</ButtonLink>
            <ButtonLink href={closeHref} variant="primary">
              套用
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
