// src/lib/types.ts

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed";
export type TimeRange = "today" | "week" | "month";

export interface OrderItem {
  quantity: number;
  item: {
    name: string;
    price: string;
  };
}

export interface Order {
  id: number;
  publicId: string;
  customerName: string;
  tableNo: number | null;
  total_price: string;
  created_at: string;
  status: OrderStatus;
  order_items?: OrderItem[];
}

export interface PageInfo {
  currentPage: number;
  limit: number;
  totalOrders: number;
  totalPages: number;
}

export interface Stats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  pending: number;
}
