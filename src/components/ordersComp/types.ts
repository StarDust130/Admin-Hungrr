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
  created_at: string;
  total_price: string;
  customerName?: string;
  order_items: {
    quantity: number;
    item: {
      name: string;
      price: string;
    };
    variant?: {
      name: string;
      price: string;
    };
  }[];
  status: OrderStatus;
  payment_method: PaymentMethod;
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


export enum PaymentMethod {
  cash,
  online,
}

