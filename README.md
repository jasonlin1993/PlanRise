# PlanRise

上傳建築平面圖（DXF 或 AutoCAD 插件匯出的 JSON），確認圖層對應後，自動生成可互動的 3D 模型與面積表。

## 技術棧

- Next.js（App Router）+ TypeScript
- Tailwind CSS v4
- Zustand、Zod、dxf-parser
- react-three-fiber（第 2 階段）
- Supabase（第 4 階段）
- 測試：Vitest、Testing Library、Playwright
- 部署：Vercel

## 開發

```bash
npm install
npm run dev        # http://localhost:3000
npm run test:run   # 單元測試
```

其他指令：`npm run lint`、`npm run typecheck`、`npm run test:e2e`、`npm run format`、`npm run build`。

## 開發階段

1. 核心轉換：解析、2D 檢視、圖層對應
2. 3D 與分析：Demo 上線
3. 機電套疊（加值功能）
4. 產品化：Supabase、登入、分享
5. 擴充：DWG 轉檔、glTF
