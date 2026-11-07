import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  CHECK_SETTINGS_ROWS,
  CONFLICTS,
  PIPE_LENGTHS,
  STATUS_LABEL,
  SYSTEMS,
  type ConflictStatus,
} from "@/features/sample/data";

export const SHEETS = [
  {
    key: "conflicts",
    label: "衝突清單",
    rows: 5,
    note: "表頭已凍結・每欄可篩選・狀態：未處理／需確認／已處理／忽略",
  },
  {
    key: "lengths",
    label: "管線長度",
    rows: 7,
    note: "長度依 2D 線段加立管高度計算，不含彎頭與接頭",
  },
  {
    key: "settings",
    label: "檢查設定",
    rows: 12,
    note: "用於追溯：同一組設定可在 PlanRise 重新檢查",
  },
] as const;

export type SheetKey = (typeof SHEETS)[number]["key"];

interface Column {
  title: string;
  align?: "right";
  mono?: boolean;
  filter?: boolean;
  width: string;
}

const STATUS_TONE: Record<ConflictStatus, string> = {
  open: "text-danger-fg",
  review: "text-warning-fg",
  resolved: "text-fg-muted",
  ignored: "text-fg-muted",
};

function sheetData(sheet: SheetKey): {
  columns: Column[];
  rows: ReactNode[][];
  formula: string;
  totalRow?: boolean;
} {
  if (sheet === "lengths") {
    return {
      formula: "給水",
      totalRow: true,
      columns: [
        { title: "系統", filter: true, width: "w-48" },
        { title: "管徑", filter: true, width: "w-40" },
        { title: "總長度 m", align: "right", mono: true, width: "w-48" },
        { title: "線段數", align: "right", mono: true, width: "w-40" },
        { title: "來源圖面", mono: true, filter: true, width: "" },
      ],
      rows: [
        ...PIPE_LENGTHS.map((r) => [r.system, r.spec, r.length, String(r.segments), r.source]),
        ["合計", "", "102.75", "17", ""],
      ],
    };
  }
  if (sheet === "settings") {
    return {
      formula: "專案",
      columns: [
        { title: "項目", width: "w-60" },
        { title: "值", mono: true, width: "" },
      ],
      rows: CHECK_SETTINGS_ROWS.map(([k, v]) => [k, v]),
    };
  }
  return {
    formula: "1",
    columns: [
      { title: "編號", align: "right", filter: true, width: "w-16" },
      { title: "類型", filter: true, width: "w-40" },
      { title: "系統", filter: true, width: "w-32" },
      { title: "碰撞對象", filter: true, width: "w-48" },
      { title: "X (m)", align: "right", mono: true, filter: true, width: "w-24" },
      { title: "Y (m)", align: "right", mono: true, filter: true, width: "w-24" },
      { title: "高程 (m)", align: "right", mono: true, filter: true, width: "w-24" },
      { title: "所在空間", filter: true, width: "w-28" },
      { title: "狀態", filter: true, width: "w-24" },
      { title: "備註", filter: true, width: "" },
    ],
    rows: CONFLICTS.map((c) => [
      String(c.id),
      c.type,
      c.systems.map((s) => s.label ?? SYSTEMS[s.system].label).join(" × "),
      c.target.replace("（50×50）", ""),
      c.x,
      c.y,
      c.z,
      c.space,
      <span key="s" className={STATUS_TONE[c.status]}>
        {STATUS_LABEL[c.status]}
      </span>,
      c.exportNote,
    ]),
  };
}

const LETTERS = "ABCDEFGHIJ";

export function SheetPreview({
  sheet,
  hrefFor,
}: {
  sheet: SheetKey;
  hrefFor: (key: SheetKey) => string;
}) {
  const { columns, rows, formula, totalRow } = sheetData(sheet);
  const meta = SHEETS.find((s) => s.key === sheet) ?? SHEETS[0];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex h-12 shrink-0 items-center border-b border-border font-mono text-[13px]">
        <span className="w-24 border-r border-border px-4 text-fg-muted">A2</span>
        <span className="px-4 font-sans text-fg-muted italic">fx</span>
        <span className="font-sans">{formula}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[1280px] border-collapse text-[13px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-sunken font-mono text-[11px] text-fg-muted">
              <th className="w-12 border-r border-b border-border font-normal" />
              {columns.map((c, i) => (
                <th
                  key={c.title}
                  className={cn("h-7 border-r border-b border-border font-normal", c.width)}
                >
                  {LETTERS[i]}
                </th>
              ))}
            </tr>
            <tr className="bg-subtle">
              <th className="border-r border-b-2 border-border font-mono text-[11px] font-normal text-fg-muted">
                1
              </th>
              {columns.map((c) => (
                <th
                  key={c.title}
                  className="h-12 border-r border-b-2 border-border px-3 text-left font-semibold"
                >
                  <span className="flex items-center justify-between gap-2">
                    {c.title}
                    {c.filter && (
                      <span
                        aria-hidden
                        className="inline-flex size-5 items-center justify-center rounded-xs border border-border-strong bg-surface"
                      >
                        <ChevronDown className="size-3 text-fg-muted" />
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => {
              const isTotal = totalRow && r === rows.length - 1;
              return (
                <tr key={r} className={cn(isTotal && "bg-subtle font-medium")}>
                  <td className="h-12 border-r border-b border-border bg-sunken text-center font-mono text-[11px] text-fg-muted">
                    {r + 2}
                  </td>
                  {row.map((cell, c) => {
                    const col = columns[c];
                    return (
                      <td
                        key={c}
                        className={cn(
                          "border-r border-b border-border px-3 whitespace-nowrap",
                          col?.align === "right" && "text-right",
                          col?.mono && "font-mono",
                          r === 0 && c === 0 && "outline-2 -outline-offset-2 outline-accent",
                          sheet === "settings" && c === 0 && "text-fg-muted",
                        )}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex shrink-0 items-center border-t border-border bg-subtle">
        <nav aria-label="工作表" className="flex">
          {SHEETS.map((s) => (
            <Link
              key={s.key}
              href={hrefFor(s.key)}
              aria-current={s.key === sheet ? "page" : undefined}
              className={cn(
                "flex h-12 items-center gap-2 border-r border-border px-5 text-sm",
                s.key === sheet
                  ? "border-t-2 border-t-accent bg-surface font-semibold"
                  : "text-fg-muted hover:bg-sunken",
              )}
            >
              {s.label}
              <span className="font-mono text-xs font-normal text-fg-muted">{s.rows} 列</span>
            </Link>
          ))}
        </nav>
        <p className="ml-auto hidden px-5 text-xs text-fg-muted lg:block">{meta.note}</p>
      </div>
    </div>
  );
}
