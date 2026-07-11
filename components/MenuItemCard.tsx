import Image from "next/image";

import { MenuItem } from "@/lib/types";

type MenuItemCardProps = {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
};

export function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="relative h-40 w-full bg-gray-100">
        {item.image_url ? (
          <Image src={item.image_url} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">無圖片</div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
          <span className="shrink-0 text-sm font-semibold text-gray-700">NT$ {item.price}</span>
        </div>

        {item.description ? <p className="text-sm text-gray-600">{item.description}</p> : null}

        <button
          type="button"
          disabled={!item.is_available}
          onClick={() => onAdd(item)}
          className="w-full rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:bg-gray-300 bg-blue-600 hover:bg-blue-700"
        >
          {item.is_available ? "加入購物車" : "售完 / 下架"}
        </button>
      </div>
    </article>
  );
}
