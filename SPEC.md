# QRcode 內用點餐系統 Spec（Spec-Driven）

## 1) 專案概述

- 目標：提供可部署到 Vercel 的前端 Demo，展示顧客掃碼點餐完整流程。
- MVP 範圍：單店、10 桌、僅內用。
- 排除項目：線上付款、發票、會員、外帶/外送、多分店。
- 本次 PR 完成：**前端 F0 + F1**。

## 2) 技術棧

### 目前前端 Demo
- Next.js（App Router）+ TypeScript
- Tailwind CSS
- Zustand（購物車）
- `lib/api.ts` 抽象層
- `lib/mockData.ts` 假資料
- localStorage（訂單暫存）
- Vercel 部署

### 未來整體規劃
- 後端：FastAPI（Python）
- 資料庫：PostgreSQL
- 即時：WebSocket（推播新訂單/狀態變更）

## 3) 系統角色

- 顧客：掃碼點餐、查詢訂單狀態。
- 店家：接單、改狀態、管理菜單與桌號（後續階段）。

## 4) 完整資料模型（TypeScript）

```ts
type Table = { id: number; name: string; qr_token: string };
type MenuItem = {
  id: number;
  category_id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  is_available: boolean;
  sort_order: number;
};
type MenuCategory = { id: number; name: string; sort_order: number; items: MenuItem[] };
type OrderStatus = 'PENDING' | 'PREPARING' | 'SERVED' | 'DONE' | 'CANCELLED';
type OrderItemInput = { menu_item_id: number; quantity: number; note?: string };
type OrderInput = { table_id: number; note?: string; items: OrderItemInput[] };
type OrderItem = { id: number; menu_item_id: number; name: string; price: number; quantity: number; note?: string };
type Order = {
  id: string;
  table_id: number;
  table_name: string;
  status: OrderStatus;
  total: number;
  note?: string;
  items: OrderItem[];
  created_at: string;
};
```

## 5) 完整後端 API 規格（未來 FastAPI）

Base URL: `/api`

### 顧客端 REST

#### `GET /api/tables/by-token/{qr_token}`
- 說明：依 QR token 取得桌號。
- Response 200
```json
{ "id": 5, "name": "A5", "qr_token": "tbl_a5" }
```
- Response 404
```json
{ "detail": "Table not found" }
```

#### `GET /api/menu`
- 說明：取得分類化菜單。
- Response 200
```json
[
  {
    "id": 1,
    "name": "主餐",
    "sort_order": 1,
    "items": [
      {
        "id": 101,
        "category_id": 1,
        "name": "招牌牛肉飯",
        "price": 180,
        "description": "慢燉牛肉搭配時蔬與白飯",
        "image_url": "https://placehold.co/640x360?text=Beef+Rice",
        "is_available": true,
        "sort_order": 1
      }
    ]
  }
]
```

#### `POST /api/orders`
- 說明：建立訂單。
- Request
```json
{
  "table_id": 5,
  "note": "請先上飲料",
  "items": [
    { "menu_item_id": 101, "quantity": 2, "note": "不要香菜" }
  ]
}
```
- Response 201
```json
{
  "id": "ord_abc123",
  "table_id": 5,
  "table_name": "A5",
  "status": "PENDING",
  "total": 360,
  "note": "請先上飲料",
  "items": [
    {
      "id": 1,
      "menu_item_id": 101,
      "name": "招牌牛肉飯",
      "price": 180,
      "quantity": 2,
      "note": "不要香菜"
    }
  ],
  "created_at": "2026-07-11T11:00:00.000Z"
}
```

#### `GET /api/orders/{id}`
- 說明：查詢單筆訂單。
- Response 200：同 `Order` 型別。
- Response 404
```json
{ "detail": "Order not found" }
```

### 店家端 REST（後續）

#### `POST /api/staff/auth/login`
- Request
```json
{ "username": "staff", "password": "******" }
```
- Response 200
```json
{ "access_token": "jwt-token", "token_type": "bearer" }
```

#### `GET /api/staff/orders`
- Query: `status`（可選）
- Response 200
```json
[{ "id": "ord_abc123", "status": "PENDING", "table_name": "A5", "total": 360 }]
```

#### `PATCH /api/staff/orders/{id}/status`
- Request
```json
{ "status": "PREPARING" }
```
- Response 200
```json
{ "id": "ord_abc123", "status": "PREPARING" }
```

#### 菜單管理
- `POST /api/staff/menu/categories`
- `PATCH /api/staff/menu/categories/{id}`
- `DELETE /api/staff/menu/categories/{id}`
- `POST /api/staff/menu/items`
- `PATCH /api/staff/menu/items/{id}`
- `DELETE /api/staff/menu/items/{id}`

#### 桌號管理
- `GET /api/staff/tables`
- `POST /api/staff/tables`
- `PATCH /api/staff/tables/{id}`
- `GET /api/staff/tables/{id}/qrcode`

### WebSocket 事件（後續）

- Channel: `/ws/staff`
- `order:new`
```json
{ "event": "order:new", "data": { "id": "ord_abc123", "table_name": "A5", "status": "PENDING" } }
```
- `order:statusChanged`
```json
{ "event": "order:statusChanged", "data": { "id": "ord_abc123", "status": "SERVED" } }
```

## 6) 前端頁面清單

| 路由 | 說明 | 狀態 |
|---|---|---|
| `/` | 首頁與 demo 入口 | ✅ 已完成 |
| `/order?table={qr_token}` | 顧客點餐頁（分類菜單、購物車、送單） | ✅ 已完成 |
| `/order/status/[id]` | 顧客訂單狀態頁 | ✅ 已完成 |
| `/staff/login` | 店家登入 | ⏳ 未實作 |
| `/staff/orders` | 店家訂單看板 | ⏳ 未實作 |
| `/staff/menu` | 菜單管理 | ⏳ 未實作 |
| `/staff/tables` | 桌號與 QR 管理 | ⏳ 未實作 |

## 7) 分階段開發與驗收清單

### 前端階段
- [x] F0：初始化（Next.js + TypeScript + Tailwind + Vercel 可部署）
- [x] F1：顧客流程（掃碼桌號 → 菜單 → 購物車 → 送單 → 訂單狀態）
- [ ] F2：店家看板（登入、接單、改狀態）
- [ ] F3：菜單管理與 QRcode 管理
- [ ] F4：整體 UX 打磨、E2E Demo 完整驗收

### 後端階段
- [ ] B0：FastAPI 專案初始化、資料庫連線、Migration
- [ ] B1：資料模型與種子資料（10 桌、菜單）
- [ ] B2：顧客端 REST API
- [ ] B3：店家端 REST API + 驗證
- [ ] B4：WebSocket 推播（`order:new` / `order:statusChanged`）
- [ ] B5：部署與整合測試

## 8) 日後接後端的路徑

1. 保持頁面層與元件層不變。
2. 只改 `lib/api.ts` 內部實作：
   - `getMenu` / `getTableByToken` / `createOrder` / `getOrder`
   - 從 mock/localStorage 改為 `fetch('/api/...')`。
3. 即時機制由本地暫存/輪詢替換為 WebSocket 訂閱。
4. Zustand 購物車與路由流程維持不動。

---

本文件為後續 F2~F4 與後端階段開發基準。
