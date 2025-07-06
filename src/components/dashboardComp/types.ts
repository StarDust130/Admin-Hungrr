// --- TYPE DEFINITIONS ---
export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed";

export interface Order {
  id: string;
  publicId: string;
  tableNo: number;
  total_price: number;
  status: OrderStatus;
  paid: boolean;
  order_items: { item: { name: string }; quantity: number }[];
  created_at: string;
  orderType: string;
  payment_method: string;
  
}

export interface Stat {
  value: number;
  change: number;
}

export interface DashboardStats {
  revenue: Stat;
  orders: Stat;
  avgOrderValue: Stat;
  newCustomers: Stat;
}

export interface OrderStatusConfig {
  [key: string]: { label: string; color: string; hex: string };
}
