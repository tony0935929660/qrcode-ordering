import { mockMenu, mockTables } from "@/lib/mockData";
import { MenuCategory, MenuItem, Order, OrderInput, Table } from "@/lib/types";

const ORDER_STORAGE_KEY = "qrcode_ordering_orders_v1";

const wait = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

function getStorageOrders(): Order[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

function setStorageOrders(orders: Order[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function findMenuItem(menuItemId: number): MenuItem | undefined {
  return mockMenu.flatMap((category) => category.items).find((item) => item.id === menuItemId);
}

export const api = {
  getMenu: async (): Promise<MenuCategory[]> => {
    await wait();
    return mockMenu.map((category) => ({
      ...category,
      items: [...category.items].sort((a, b) => a.sort_order - b.sort_order),
    }));
  },

  getTableByToken: async (token: string): Promise<Table | null> => {
    await wait();
    return mockTables.find((table) => table.qr_token === token) ?? null;
  },

  createOrder: async (input: OrderInput): Promise<Order> => {
    await wait();

    const table = mockTables.find((entry) => entry.id === input.table_id);
    if (!table) {
      throw new Error("找不到桌號，請重新掃描 QR Code。");
    }

    if (input.items.length === 0) {
      throw new Error("購物車是空的，請先加入餐點。");
    }

    const items = input.items.map((itemInput, index) => {
      const menuItem = findMenuItem(itemInput.menu_item_id);

      if (!menuItem || !menuItem.is_available) {
        throw new Error("購物車中有已下架品項，請重新確認後送單。");
      }

      return {
        id: index + 1,
        menu_item_id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: itemInput.quantity,
        note: itemInput.note?.trim() || undefined,
      };
    });

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order: Order = {
      id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      table_id: table.id,
      table_name: table.name,
      status: "PENDING",
      total,
      note: input.note?.trim() || undefined,
      items,
      created_at: new Date().toISOString(),
    };

    const orders = getStorageOrders();
    orders.unshift(order);
    setStorageOrders(orders);

    return order;
  },

  getOrder: async (id: string): Promise<Order | null> => {
    await wait();
    const orders = getStorageOrders();
    return orders.find((order) => order.id === id) ?? null;
  },
};
