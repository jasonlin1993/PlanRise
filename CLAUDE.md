# PlanRise

@AGENTS.md

建築平面圖轉互動 3D 的網頁工具。核心：建築圖 → 圖層對應 → 3D 與面積表。加值：機電套疊（只在樓層有水電圖時出現）。

## 開發階段

1 核心轉換（解析、2D、圖層對應）→ 2 3D 與分析（Demo 上線）→ 3 機電套疊（加值）→ 4 產品化（Supabase、登入、分享）→ 5 擴充（DWG 轉檔、glTF）

## 規範

- TypeScript strict，不使用 any；外部資料一律先用 Zod 驗證。
- 功能放在 src/features/<模組>，頁面只負責組合。
- 解析與衝突檢查等重運算放在 Web Worker。
- react-three-fiber 每幀變動的狀態放在 ref 並於 useFrame 更新，不放 React state。
- 顏色、間距一律用 globals.css 的 token（例如 bg-surface、text-fg-muted），不要寫死色碼；fg-subtle 只用於停用狀態與 placeholder。
- 介面文字使用繁體中文。
- 機電系統色不使用紅與橘黃，紅與橘黃保留給衝突狀態。
- dxf-parser 只能透過 src/features/cad/parse-dxf.ts 使用。

## 安全

- 新增套件前先詢問，說明理由；安裝後執行 npm audit。
- 不 commit 金鑰；.env.local 不進 git。
- GitHub Actions 釘選完整 commit SHA。

## 指令

npm run dev / lint / typecheck / test / test:run / test:e2e / format / build
