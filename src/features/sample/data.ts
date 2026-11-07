// 畫面切版用的假資料（社區圖書館範例）。之後接上解析結果與 Supabase 時替換。

export type SystemKey = "water" | "drain" | "power" | "lowv";

export interface SystemInfo {
  label: string;
  layer: string;
  spec: string;
  elevation: string;
  dashed: boolean;
}

export const SYSTEMS: Record<SystemKey, SystemInfo> = {
  water: { label: "給水", layer: "P-WATER", spec: "Ø25", elevation: "+2.90 m", dashed: false },
  drain: { label: "排水", layer: "P-DRAIN", spec: "Ø100", elevation: "-0.45 m", dashed: false },
  power: { label: "電力", layer: "E-POWER", spec: "EMT Ø28", elevation: "+2.80 m", dashed: false },
  lowv: { label: "弱電", layer: "E-LOWV", spec: "EMT Ø22", elevation: "+2.75 m", dashed: true },
};

export const SYSTEM_ORDER: readonly SystemKey[] = ["water", "drain", "power", "lowv"];

export type ConflictStatus = "open" | "review" | "resolved" | "ignored";

export const STATUS_LABEL: Record<ConflictStatus, string> = {
  open: "未處理",
  review: "需確認",
  resolved: "已處理",
  ignored: "忽略",
};

export interface ConflictSystem {
  system: SystemKey;
  label?: string;
}

export interface Conflict {
  id: number;
  type: string;
  systems: readonly ConflictSystem[];
  space: string;
  status: ConflictStatus;
  spec: string;
  target: string;
  x: string;
  y: string;
  z: string;
  elevation: string;
  elevationShort: string;
  note: string;
  exportNote: string;
}

export const CONFLICTS: readonly Conflict[] = [
  {
    id: 1,
    type: "管線穿柱",
    systems: [{ system: "drain" }],
    space: "閱覽區",
    status: "open",
    spec: "排水 Ø100",
    target: "柱 C-07（50×50）",
    x: "8.000",
    y: "4.500",
    z: "-0.49",
    elevation: "樓版下 0.49 m（依圖上標註 FL-0.53、FL-0.40 內插）",
    elevationShort: "樓版下 0.49 m",
    note: "排水管改由柱側繞行，或請結構確認是否可預留套管。",
    exportNote: "排水管改由柱側繞行，或請結構確認是否可預留套管。",
  },
  {
    id: 2,
    type: "管線交錯",
    systems: [{ system: "water" }, { system: "drain", label: "排水立管" }],
    space: "閱覽區",
    status: "open",
    spec: "給水 Ø25 × 排水立管 Ø100",
    target: "排水立管 P-RISER-D-01",
    x: "12.600",
    y: "4.500",
    z: "2.90",
    elevation: "樓版上 2.90 m",
    elevationShort: "樓版上 2.90 m",
    note: "給水管於立管前降至 2.70 m 繞過。",
    exportNote: "給水管於立管前降至 2.70 m 繞過。",
  },
  {
    id: 3,
    type: "平面交錯，需確認",
    systems: [{ system: "water" }, { system: "power" }],
    space: "檢索區",
    status: "review",
    spec: "給水 Ø25 × 電力 EMT Ø28",
    target: "電力管線",
    x: "3.200",
    y: "11.600",
    z: "2.90",
    elevation: "樓版上 2.90 m・電力為預設 2.80 m",
    elevationShort: "樓版上 2.90 m",
    note: "電力管線沒有高程標註，請向機電確認實際高度。",
    exportNote: "電力高程為預設值、淨距 0.07 m，需人工確認。",
  },
  {
    id: 4,
    type: "管線穿 RC 牆",
    systems: [{ system: "water" }],
    space: "影印室",
    status: "open",
    spec: "給水 Ø25",
    target: "RC 牆 W-12",
    x: "10.000",
    y: "10.400",
    z: "2.90",
    elevation: "樓版上 2.90 m",
    elevationShort: "樓版上 2.90 m",
    note: "於 RC 牆預埋 Ø50 套管，需在施工圖標示。",
    exportNote: "於 RC 牆預埋 Ø50 套管，需在施工圖標示。",
  },
  {
    id: 5,
    type: "管線交錯",
    systems: [{ system: "lowv" }, { system: "power" }],
    space: "準備室",
    status: "resolved",
    spec: "弱電 EMT Ø22 × 電力 EMT Ø28",
    target: "電力管線",
    x: "12.800",
    y: "12.600",
    z: "2.78",
    elevation: "樓版上 2.78 m",
    elevationShort: "樓版上 2.78 m",
    note: "弱電改走電力下方 0.15 m，10/20 現場確認。",
    exportNote: "弱電改走電力下方 0.15 m，10/20 現場確認。",
  },
];

export interface Space {
  name: string;
  kind: string;
  area: number;
}

export const SPACES: readonly Space[] = [
  { name: "閱覽區", kind: "閱覽", area: 118.6 },
  { name: "期刊區", kind: "閱覽", area: 46.2 },
  { name: "閱報區", kind: "閱覽", area: 36.8 },
  { name: "檢索區", kind: "服務", area: 27.4 },
  { name: "影印室", kind: "服務", area: 17.6 },
  { name: "準備室", kind: "後勤", area: 22.9 },
  { name: "廁所・服務核心", kind: "後勤", area: 41.3 },
  { name: "景觀陽台", kind: "戶外", area: 28.5 },
];

export const AREA_TOTAL = { total: "339.3", indoor: "310.8", outdoor: "28.5" };

export const AREA_BY_KIND = [
  { kind: "閱覽", rooms: 3, area: "201.6", ratio: 59 },
  { kind: "後勤", rooms: 2, area: "64.2", ratio: 32 },
  { kind: "服務", rooms: 2, area: "45.0", ratio: 22 },
  { kind: "戶外", rooms: 1, area: "28.5", ratio: 14 },
] as const;

export interface ArchLayerGroup {
  role: string;
  action: string;
  layers: readonly { name: string; detail: string }[];
}

export const ARCH_LAYER_GROUPS: readonly ArchLayerGroup[] = [
  { role: "牆", action: "3D 擠出", layers: [{ name: "A-WALL", detail: "248 線段" }] },
  { role: "柱", action: "3D 擠出", layers: [{ name: "A-COL", detail: "44 線段" }] },
  { role: "門窗", action: "套用樣板", layers: [{ name: "A-WD", detail: "32 線段・16 圖塊" }] },
  { role: "家具", action: "套用樣板", layers: [{ name: "A-FUR", detail: "25 線段・36 圖塊" }] },
  { role: "空間名稱", action: "面積表", layers: [{ name: "A-TEXT", detail: "8 文字" }] },
  { role: "忽略", action: "不轉 3D", layers: [{ name: "A-DIM", detail: "64 線段" }] },
];

export const BLOCKS = [
  { name: "門", count: 7, template: "門扇樣板" },
  { name: "門-廁所", count: 2, template: "門扇樣板" },
  { name: "窗", count: 7, template: "窗樣板" },
  { name: "雙人沙發", count: 2, template: "沙發樣板" },
  { name: "椅子", count: 21, template: "椅子樣板" },
  { name: "茶几", count: 1, template: "桌子樣板" },
  { name: "櫃子x6", count: 5, template: "櫃子樣板" },
  { name: "櫃子x8", count: 2, template: "櫃子樣板" },
  { name: "植栽A", count: 5, template: "植栽樣板" },
] as const;

export const VISIBILITY_LAYERS = [
  { role: "牆", layer: "A-WALL", translucent: true },
  { role: "柱", layer: "A-COL", translucent: true },
  { role: "門窗", layer: "A-WD", translucent: true },
  { role: "家具", layer: "A-FUR", translucent: true },
  { role: "空間名稱", layer: "A-TEXT", translucent: false },
  { role: "地板", layer: "系統", translucent: false },
] as const;

export interface ProjectSummary {
  id: string;
  name: string;
  floors: number;
  drawings: number;
  updated: string;
  thumb: string;
}

export const PROJECTS: readonly ProjectSummary[] = [
  {
    id: "library",
    name: "社區圖書館",
    floors: 2,
    drawings: 4,
    updated: "3 小時前",
    thumb: "/mock/thumb-library.png",
  },
  {
    id: "activity-center",
    name: "社區活動中心",
    floors: 3,
    drawings: 3,
    updated: "昨天",
    thumb: "/mock/thumb-activity.png",
  },
  {
    id: "housing-a",
    name: "住宅 A 棟 標準層",
    floors: 1,
    drawings: 3,
    updated: "10 月 14 日",
    thumb: "/mock/thumb-housing.png",
  },
  {
    id: "corner-cafe",
    name: "設計課期末・轉角咖啡廳",
    floors: 1,
    drawings: 1,
    updated: "10 月 9 日",
    thumb: "/mock/thumb-cafe.png",
  },
  {
    id: "school-extension",
    name: "小學增建案",
    floors: 2,
    drawings: 2,
    updated: "9 月 30 日",
    thumb: "/mock/card-2f-arch.png",
  },
  {
    id: "office-renovation",
    name: "事務所辦公室改裝",
    floors: 1,
    drawings: 1,
    updated: "9 月 22 日",
    thumb: "/mock/thumb-office.png",
  },
];

export const PRESETS = [
  {
    name: "事務所標準（AIA）",
    desc: "A- 前綴的 AIA 圖層命名",
    kind: "arch",
    rules: 14,
    used: "今天 14:20",
  },
  {
    name: "機電標準（P-／E-）",
    desc: "給排水 P-、電力弱電 E- 前綴",
    kind: "mep",
    rules: 9,
    used: "今天 14:38",
  },
  {
    name: "學校課程範本",
    desc: "課堂作業常用的簡化圖層",
    kind: "arch",
    rules: 8,
    used: "10 月 2 日",
  },
  {
    name: "中文圖層（牆／柱／門窗）",
    desc: "常見於國內事務所的中文圖層",
    kind: "arch",
    rules: 11,
    used: "10 月 16 日",
  },
  {
    name: "水電包商 B 公司",
    desc: "中文系統名稱（給水、排水、強電）",
    kind: "mep",
    rules: 7,
    used: "9 月 28 日",
  },
  {
    name: "Revit 匯出圖層",
    desc: "Revit 預設圖層對照（A-WALL、S-COLS…）",
    kind: "arch",
    rules: 12,
    used: "9 月 18 日",
  },
] as const;

export const MEP_PRESET_RULES = [
  { pattern: "P-WATER*", target: "給水・管線" },
  { pattern: "P-DRAIN*・P-SAN*", target: "排水・管線" },
  { pattern: "P-RISER-W*", target: "給水立管" },
  { pattern: "P-RISER-D*", target: "排水立管" },
  { pattern: "E-POWER*・E-LIGHT*", target: "電力・管線" },
  { pattern: "E-LOWV*・E-DATA*", target: "弱電・管線" },
  { pattern: "E-SYMB*・P-SYMB*", target: "設備" },
  { pattern: "A-WALL*・A-COL*", target: "底圖（對齊用）" },
  { pattern: "*-TEXT・*-DIM*", target: "忽略" },
] as const;

export const MEP_PRESET_DEFAULTS = [
  { system: "給水", value: "樓版上 2.90 m", spec: "Ø25" },
  { system: "排水", value: "樓版下 0.45 m", spec: "Ø100・坡度 1/100" },
  { system: "電力", value: "樓版上 2.80 m", spec: "EMT Ø28" },
  { system: "弱電", value: "樓版上 2.75 m", spec: "EMT Ø22" },
] as const;

export const PIPE_LENGTHS = [
  { system: "給水", spec: "Ø25", length: "32.80", segments: 5, source: "library-1F-plumbing.dxf" },
  {
    system: "給水立管",
    spec: "Ø50",
    length: "3.80",
    segments: 1,
    source: "library-1F-plumbing.dxf",
  },
  { system: "排水", spec: "Ø100", length: "32.70", segments: 3, source: "library-1F-plumbing.dxf" },
  {
    system: "排水立管",
    spec: "Ø100",
    length: "3.65",
    segments: 1,
    source: "library-1F-plumbing.dxf",
  },
  {
    system: "電力",
    spec: "EMT Ø28",
    length: "16.80",
    segments: 4,
    source: "library-1F-electrical.dxf",
  },
  {
    system: "弱電",
    spec: "EMT Ø22",
    length: "13.00",
    segments: 3,
    source: "library-1F-electrical.dxf",
  },
] as const;

export const CHECK_SETTINGS_ROWS = [
  ["專案", "社區圖書館"],
  ["樓層", "1F"],
  ["建築圖", "library-1F.dxf"],
  ["水電圖", "library-1F-plumbing.dxf、library-1F-electrical.dxf"],
  ["對齊方式", "座標已對齊（以 A-COL 11 根柱比對，平均偏差 0.004 m）"],
  ["容許誤差", "0.05 m"],
  ["確認門檻", "0.15 m（高程為預設值且淨距小於此值時標為需確認）"],
  ["檢查項目", "管線交錯、穿柱、穿 RC 牆"],
  ["未檢查", "同系統內交錯"],
  ["系統預設高程", "給水 +2.90 m・排水 -0.45 m（坡度 1/100）・電力 +2.80 m・弱電 +2.75 m"],
  ["匯出時間", "2026-10-22 14:42"],
  ["匯出者", "林小築"],
] as const;
