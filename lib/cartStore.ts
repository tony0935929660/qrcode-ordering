import { create } from "zustand";

type CartItem = {
  menu_item_id: number;
  name: string;
  price: number;
  quantity: number;
  note?: string;
};

type AddCartItemInput = {
  menu_item_id: number;
  name: string;
  price: number;
};

type CartState = {
  items: CartItem[];
  orderNote: string;
  addItem: (input: AddCartItemInput) => void;
  increaseQty: (menuItemId: number) => void;
  decreaseQty: (menuItemId: number) => void;
  removeItem: (menuItemId: number) => void;
  setItemNote: (menuItemId: number, note: string) => void;
  setOrderNote: (note: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  orderNote: "",
  addItem: (input) =>
    set((state) => {
      const existing = state.items.find((item) => item.menu_item_id === input.menu_item_id);

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.menu_item_id === input.menu_item_id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      return {
        items: [...state.items, { ...input, quantity: 1 }],
      };
    }),
  increaseQty: (menuItemId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.menu_item_id === menuItemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    })),
  decreaseQty: (menuItemId) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.menu_item_id === menuItemId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    })),
  removeItem: (menuItemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.menu_item_id !== menuItemId),
    })),
  setItemNote: (menuItemId, note) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.menu_item_id === menuItemId ? { ...item, note: note.trim() || undefined } : item,
      ),
    })),
  setOrderNote: (note) => set({ orderNote: note }),
  clear: () => set({ items: [], orderNote: "" }),
}));

export const getCartTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);
