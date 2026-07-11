# QRcode 內用點餐系統（前端 Demo）

此專案為 **Next.js + TypeScript + Tailwind CSS** 的前端 Demo 版，使用 `lib/api.ts` 抽象層搭配 mock 假資料，展示顧客掃碼點餐流程（F0 + F1）。

目前為「**前端 Demo（mock 資料）**」階段，尚未接入真實後端。

## Demo 流程

1. 首頁進入 `/order?table=tbl_a5`
2. 依分類瀏覽菜單
3. 加入購物車、調整數量與備註
4. 送出訂單
5. 跳轉至 `/order/status/[id]` 查看訂單內容與狀態

## 本地啟動

```bash
npm install
npm run dev
```

開啟 `http://localhost:3000`。

## 建置

```bash
npm run build
```

## Vercel 部署

1. 將 repo 匯入 Vercel
2. Framework Preset 選擇 Next.js（預設即可）
3. Build Command: `npm run build`（預設）
4. Output 設定使用 Next.js 預設
5. Deploy

## 專案重點

- `lib/types.ts`：資料模型型別
- `lib/mockData.ts`：桌號與菜單假資料
- `lib/api.ts`：資料抽象層（目前 mock + localStorage）
- `lib/cartStore.ts`：Zustand 購物車狀態
- `app/order/page.tsx`：顧客點餐頁
- `app/order/status/[id]/page.tsx`：訂單狀態頁

## 後續接 FastAPI 路徑

維持頁面不動，只需替換 `lib/api.ts` 內部實作（由 mock/localStorage 改為 fetch FastAPI）。
