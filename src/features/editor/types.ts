import type { ReactNode } from "react";

/** 每個編輯器模式提供的畫面區塊，由 EditorShell 組合 */
export interface ViewParts {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  statusBar: ReactNode;
  mobile: {
    tabs: readonly string[];
    activeTab?: number;
    content: ReactNode;
    footer: ReactNode;
    canvasTop?: ReactNode;
  };
}

export const EDITOR_TABS = ["2d", "3d", "analysis", "mep"] as const;

export type EditorTab = (typeof EDITOR_TABS)[number];

export function parseEditorTab(
  value: string | string[] | undefined,
  fallback: EditorTab = "2d",
): EditorTab {
  return EDITOR_TABS.find((t) => t === value) ?? fallback;
}

/** 讀取單一 query 參數（陣列取第一個） */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
