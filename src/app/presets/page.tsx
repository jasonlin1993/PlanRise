import { ArrowRight, Ellipsis, Pencil, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import { DrawingDots } from "@/features/editor/components/editor-header";
import { AppHeader } from "@/features/projects/components/app-header";
import { MEP_PRESET_DEFAULTS, MEP_PRESET_RULES, PRESETS } from "@/features/sample/data";

export const metadata: Metadata = {
  title: "Preset | PlanRise",
};

const SELECTED = 1;
const RENAMING = 2;

function KindTag({ kind }: { kind: "arch" | "mep" }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-sunken px-2 py-1 text-xs font-medium">
      <DrawingDots kind={kind === "arch" ? "arch" : "overlay"} />
      {kind === "arch" ? "建築" : "機電"}
    </span>
  );
}

function RuleRow({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border border-border px-3 py-2">
      <span className="font-mono text-[13px]">{left}</span>
      <ArrowRight className="size-3.5 text-fg-muted" aria-hidden />
      <span className="rounded-md bg-sunken px-2 py-1 text-center text-[13px]">{right}</span>
    </li>
  );
}

export default function PresetsPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <AppHeader active="presets" />
      <div className="flex flex-1 flex-col lg:flex-row">
        <main className="min-w-0 flex-1 px-4 py-8 lg:px-12">
          <h1 className="text-3xl font-bold">圖層對應 Preset</h1>
          <p className="mt-2 text-sm text-fg-muted">
            在編輯器中把圖層對應另存為 preset，下次上傳相同命名習慣的圖面時一鍵套用。
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Segmented
              size="lg"
              items={[
                { key: "all", label: "全部", active: true },
                { key: "arch", label: "建築" },
                { key: "mep", label: "機電" },
              ]}
            />
            <p className="text-[13px] text-fg-muted">
              規則支援萬用字元 *，由上而下比對，先符合者優先
            </p>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-subtle text-left text-[13px] text-fg-muted">
                <tr>
                  <th className="h-12 px-6 font-normal">名稱</th>
                  <th className="w-32 font-normal">類型</th>
                  <th className="w-28 text-right font-normal">對應規則</th>
                  <th className="w-36 pr-4 text-right font-normal">最後使用</th>
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody>
                {PRESETS.map((p, i) => (
                  <tr
                    key={p.name}
                    className={cn("border-t border-border", i === SELECTED && "bg-accent-soft")}
                  >
                    <td className="px-6 py-3">
                      {i === RENAMING ? (
                        <span className="flex items-center gap-3">
                          <input
                            aria-label="Preset 名稱"
                            defaultValue={p.name}
                            className="h-9 w-72 rounded-md border-2 border-accent bg-surface px-3 text-sm outline-none"
                          />
                          <span className="text-xs whitespace-nowrap text-fg-muted">
                            Enter 儲存・Esc 取消
                          </span>
                        </span>
                      ) : (
                        <>
                          <span
                            className={cn(
                              "block font-semibold",
                              i === SELECTED && "text-accent-fg",
                            )}
                          >
                            {p.name}
                          </span>
                          <span className="block text-[13px] text-fg-muted">{p.desc}</span>
                        </>
                      )}
                    </td>
                    <td>
                      <KindTag kind={p.kind} />
                    </td>
                    <td className="text-right font-mono">
                      {p.rules} <span className="font-sans">條</span>
                    </td>
                    <td className="pr-4 text-right text-fg-muted">{p.used}</td>
                    <td>
                      <button
                        type="button"
                        aria-label="更多動作"
                        className="inline-flex size-8 items-center justify-center rounded-md text-fg-muted hover:bg-sunken"
                      >
                        <Ellipsis className="size-4" aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-border px-6 py-4 text-[13px] text-fg-muted">
              6 個 preset・在編輯器底部「套用 preset」選單中使用
            </p>
          </div>
        </main>

        <aside className="w-full shrink-0 border-t border-border bg-surface lg:w-[420px] lg:border-t-0 lg:border-l">
          <div className="border-b border-border p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">機電標準（P-／E-）</h2>
              <span className="text-[13px] text-fg-muted">9 條規則</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="lg">
                <Pencil className="size-4" aria-hidden />
                重新命名
              </Button>
              <Button variant="danger" size="lg">
                <Trash2 className="size-4" aria-hidden />
                刪除
              </Button>
            </div>
          </div>
          <div className="space-y-6 p-6">
            <section>
              <h3 className="text-[13px] text-fg-muted">圖層規則 → 系統・元素類型（9 條）</h3>
              <ul className="mt-3 space-y-2">
                {MEP_PRESET_RULES.map((r) => (
                  <RuleRow key={r.pattern} left={r.pattern} right={r.target} />
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-[13px] text-fg-muted">系統預設（不計入規則）</h3>
              <ul className="mt-3 space-y-2">
                {MEP_PRESET_DEFAULTS.map((d) => (
                  <RuleRow
                    key={d.system}
                    left={<span className="font-sans">{d.system}</span>}
                    right={
                      <span className="block text-left">
                        {d.value}
                        <span className="block font-mono text-xs text-fg-muted">{d.spec}</span>
                      </span>
                    }
                  />
                ))}
              </ul>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
