import Link from "next/link";

import { mockTables } from "@/lib/mockData";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">QRcode 內用點餐系統 Demo</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
          目前版本為前端 Demo（mock 資料）。可直接掃碼（帶桌號 token）進入點餐流程：菜單 → 購物車 → 送單 → 訂單狀態追蹤。
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/order?table=tbl_a5"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            立即體驗（A5）
          </Link>
          <Link
            href="/order?table=tbl_a1"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            另一桌示範（A1）
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900">測試桌號 token</h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700 sm:grid-cols-3">
          {mockTables.map((table) => (
            <li key={table.id} className="rounded border border-gray-200 p-2">
              {table.name}: <code>{table.qr_token}</code>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
