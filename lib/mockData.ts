import { MenuCategory, Table } from "@/lib/types";

export const mockTables: Table[] = Array.from({ length: 10 }, (_, index) => {
  const number = index + 1;
  return {
    id: number,
    name: `A${number}`,
    qr_token: `tbl_a${number}`,
  };
});

export const mockMenu: MenuCategory[] = [
  {
    id: 1,
    name: "主餐",
    sort_order: 1,
    items: [
      {
        id: 101,
        category_id: 1,
        name: "招牌牛肉飯",
        price: 180,
        description: "慢燉牛肉搭配時蔬與白飯",
        image_url: "https://placehold.co/640x360?text=Beef+Rice",
        is_available: true,
        sort_order: 1,
      },
      {
        id: 102,
        category_id: 1,
        name: "香煎雞腿排",
        price: 165,
        description: "外酥內嫩雞腿排，附季節配菜",
        image_url: "https://placehold.co/640x360?text=Chicken",
        is_available: true,
        sort_order: 2,
      },
      {
        id: 103,
        category_id: 1,
        name: "蔬食咖哩",
        price: 150,
        description: "溫和香料咖哩，含時蔬與豆腐",
        image_url: "https://placehold.co/640x360?text=Veg+Curry",
        is_available: true,
        sort_order: 3,
      },
    ],
  },
  {
    id: 2,
    name: "飲料",
    sort_order: 2,
    items: [
      {
        id: 201,
        category_id: 2,
        name: "蜜香紅茶",
        price: 45,
        description: "微糖去冰，茶香回甘",
        image_url: "https://placehold.co/640x360?text=Black+Tea",
        is_available: true,
        sort_order: 1,
      },
      {
        id: 202,
        category_id: 2,
        name: "檸檬氣泡飲",
        price: 60,
        description: "現榨檸檬搭配氣泡水",
        image_url: "https://placehold.co/640x360?text=Lemon+Soda",
        is_available: false,
        sort_order: 2,
      },
      {
        id: 203,
        category_id: 2,
        name: "拿鐵咖啡",
        price: 75,
        description: "濃縮咖啡與鮮奶",
        image_url: "https://placehold.co/640x360?text=Latte",
        is_available: true,
        sort_order: 3,
      },
    ],
  },
  {
    id: 3,
    name: "小點",
    sort_order: 3,
    items: [
      {
        id: 301,
        category_id: 3,
        name: "酥炸薯條",
        price: 70,
        description: "金黃酥脆，附番茄醬",
        image_url: "https://placehold.co/640x360?text=Fries",
        is_available: true,
        sort_order: 1,
      },
      {
        id: 302,
        category_id: 3,
        name: "雞塊拼盤",
        price: 95,
        description: "六塊雞塊搭配蜂蜜芥末",
        image_url: "https://placehold.co/640x360?text=Nuggets",
        is_available: true,
        sort_order: 2,
      },
      {
        id: 303,
        category_id: 3,
        name: "季節沙拉",
        price: 85,
        description: "綜合生菜與和風醬",
        image_url: "https://placehold.co/640x360?text=Salad",
        is_available: true,
        sort_order: 3,
      },
    ],
  },
].sort((a, b) => a.sort_order - b.sort_order);
