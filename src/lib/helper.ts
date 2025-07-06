import { OrderStatusConfig } from "@/components/dashboardComp/types";

// --- HELPERS ---
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);




  export const ORDER_STATUS_CONFIG: OrderStatusConfig = {
    pending: { label: "Pending", color: "amber", hex: "#f59e0b" },
    accepted: { label: "Accepted", color: "blue", hex: "#3b82f6" },
    preparing: { label: "Preparing", color: "purple", hex: "#8b5cf6" },
    ready: { label: "Ready", color: "emerald", hex: "#10b981" },
    completed: { label: "Completed", color: "gray", hex: "#6b7280" },
  };

  // --- Helper Functions ---
export const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
export const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });