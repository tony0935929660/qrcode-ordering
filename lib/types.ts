export type Table = { id: number; name: string; qr_token: string };

export type MenuItem = {
  id: number;
  category_id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  is_available: boolean;
  sort_order: number;
};

export type MenuCategory = {
  id: number;
  name: string;
  sort_order: number;
  items: MenuItem[];
};

export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "SERVED"
  | "DONE"
  | "CANCELLED";

export type OrderItemInput = {
  menu_item_id: number;
  quantity: number;
  note?: string;
};

export type OrderInput = {
  table_id: number;
  note?: string;
  items: OrderItemInput[];
};

export type OrderItem = {
  id: number;
  menu_item_id: number;
  name: string;
  price: number;
  quantity: number;
  note?: string;
};

export type Order = {
  id: string;
  table_id: number;
  table_name: string;
  status: OrderStatus;
  total: number;
  note?: string;
  items: OrderItem[];
  created_at: string;
};
