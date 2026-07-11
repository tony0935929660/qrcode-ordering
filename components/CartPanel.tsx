import { getCartTotal } from "@/lib/cartStore";

type CartItem = {
  menu_item_id: number;
  name: string;
  price: number;
  quantity: number;
  note?: string;
};

type CartPanelProps = {
  items: CartItem[];
  orderNote: string;
  submitting: boolean;
  submitError: string;
  onIncrease: (menuItemId: number) => void;
  onDecrease: (menuItemId: number) => void;
  onRemove: (menuItemId: number) => void;
  onItemNoteChange: (menuItemId: number, note: string) => void;
  onOrderNoteChange: (note: string) => void;
  onSubmit: () => void;
};

export function CartPanel({
  items,
  orderNote,
  submitting,
  submitError,
  onIncrease,
  onDecrease,
  onRemove,
  onItemNoteChange,
  onOrderNoteChange,
  onSubmit,
}: CartPanelProps) {
  const total = getCartTotal(items);

  return (
    <aside className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">購物車</h2>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">目前尚未加入餐點。</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.menu_item_id} className="rounded-lg border border-gray-100 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    NT$ {item.price} × {item.quantity}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item.menu_item_id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  移除
                </button>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDecrease(item.menu_item_id)}
                  className="h-8 w-8 rounded border border-gray-300 text-gray-700"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onIncrease(item.menu_item_id)}
                  className="h-8 w-8 rounded border border-gray-300 text-gray-700"
                >
                  +
                </button>
              </div>

              <label className="mt-2 block text-xs text-gray-600">
                品項備註
                <input
                  value={item.note ?? ""}
                  onChange={(event) => onItemNoteChange(item.menu_item_id, event.target.value)}
                  placeholder="例如：少冰、不要香菜"
                  className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                />
              </label>
            </li>
          ))}
        </ul>
      )}

      <label className="block text-sm text-gray-700">
        整單備註
        <textarea
          value={orderNote}
          onChange={(event) => onOrderNoteChange(event.target.value)}
          rows={3}
          placeholder="例如：餐點一起上、兒童餐具"
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

      {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="font-medium text-gray-800">總金額</span>
        <span className="text-lg font-bold text-gray-900">NT$ {total}</span>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={items.length === 0 || submitting}
        className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {submitting ? "送單中..." : "送出訂單"}
      </button>
    </aside>
  );
}
