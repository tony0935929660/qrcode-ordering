"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { Order, OrderStatus } from "@/lib/types";

const statusLabel: Record<OrderStatus, string> = {
  PENDING: "待處理",
  PREPARING: "製作中",
  SERVED: "已送餐",
  DONE: "已完成",
  CANCELLED: "已取消",
};

export default function OrderStatusPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }
      const orderData = await api.getOrder(id);

      if (!cancelled) {
        setOrder(orderData);
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <main className="p-6 text-center text-gray-600">載入訂單中...</main>;
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          找不到訂單（{id}），可能已過期或尚未建立。
        </div>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          回首頁
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <header className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">訂單編號</p>
        <h1 className="mt-1 break-all text-xl font-semibold text-gray-900">{order.id}</h1>
        <p className="mt-2 text-sm text-gray-600">桌號 {order.table_name}</p>
        <p className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          狀態：{statusLabel[order.status]}
        </p>
      </header>

      <section className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">訂單內容</h2>
        <ul className="mt-3 space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="rounded-lg border border-gray-100 p-3">
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    NT$ {item.price} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">NT$ {item.price * item.quantity}</p>
              </div>
              {item.note ? <p className="mt-2 text-sm text-gray-600">備註：{item.note}</p> : null}
            </li>
          ))}
        </ul>

        {order.note ? <p className="mt-4 text-sm text-gray-700">整單備註：{order.note}</p> : null}

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="font-medium text-gray-800">總金額</span>
          <span className="text-xl font-bold text-gray-900">NT$ {order.total}</span>
        </div>
      </section>

      <div className="mt-4 flex gap-3">
        <Link
          href="/"
          className="inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          回首頁
        </Link>
      </div>
    </main>
  );
}
