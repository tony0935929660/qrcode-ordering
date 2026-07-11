"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CartPanel } from "@/components/CartPanel";
import { MenuItemCard } from "@/components/MenuItemCard";
import { api } from "@/lib/api";
import { useCartStore } from "@/lib/cartStore";
import { MenuCategory, Table } from "@/lib/types";

type OrderClientProps = {
  tableToken: string | null;
};

export function OrderClient({ tableToken }: OrderClientProps) {
  const router = useRouter();

  const [table, setTable] = useState<Table | null>(null);
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    items,
    orderNote,
    addItem,
    increaseQty,
    decreaseQty,
    removeItem,
    setItemNote,
    setOrderNote,
    clear,
  } = useCartStore();

  useEffect(() => {
    clear();
  }, [clear, tableToken]);

  useEffect(() => {
    let cancelled = false;

    async function fetchPageData() {
      if (!tableToken) {
        setError("缺少桌號資訊，請重新掃描 QR Code。");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [tableData, menuData] = await Promise.all([
          api.getTableByToken(tableToken),
          api.getMenu(),
        ]);

        if (cancelled) {
          return;
        }

        if (!tableData) {
          setError("找不到對應桌號，請確認 QR Code 是否正確。");
          setLoading(false);
          return;
        }

        setTable(tableData);
        setMenu(menuData);
      } catch {
        if (!cancelled) {
          setError("載入資料失敗，請稍後再試。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPageData();

    return () => {
      cancelled = true;
    };
  }, [tableToken]);

  const groupedMenu = useMemo(
    () => menu.map((category) => ({ ...category, items: [...category.items] })),
    [menu],
  );

  async function handleSubmit() {
    if (!table) {
      return;
    }

    setSubmitError("");
    setSubmitting(true);

    try {
      const order = await api.createOrder({
        table_id: table.id,
        note: orderNote,
        items: items.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          note: item.note,
        })),
      });

      clear();
      router.push(`/order/status/${order.id}`);
    } catch (submit) {
      const message = submit instanceof Error ? submit.message : "送單失敗，請稍後再試";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main className="p-6 text-center text-gray-600">載入中...</main>;
  }

  if (error) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
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
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">桌號</p>
          <h1 className="text-2xl font-bold text-gray-900">{table?.name}</h1>
        </div>
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-700">
          回首頁
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <section className="space-y-6">
          {groupedMenu.map((category) => (
            <div key={category.id} className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {category.items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAdd={(selectedItem) =>
                      addItem({
                        menu_item_id: selectedItem.id,
                        name: selectedItem.name,
                        price: selectedItem.price,
                      })
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        <div className="lg:sticky lg:top-4 lg:self-start">
          <CartPanel
            items={items}
            orderNote={orderNote}
            submitting={submitting}
            submitError={submitError}
            onIncrease={increaseQty}
            onDecrease={decreaseQty}
            onRemove={removeItem}
            onItemNoteChange={setItemNote}
            onOrderNoteChange={setOrderNote}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </main>
  );
}
