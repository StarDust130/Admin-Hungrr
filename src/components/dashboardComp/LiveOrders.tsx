import React, { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, CheckCircle } from "lucide-react";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order, OrderStatus } from "./types";
import { api } from "@/lib/axios";
import { formatCurrency, ORDER_STATUS_CONFIG } from "@/lib/helper";



export const LiveOrders: FC<{
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  cafeId: string | null;
}> = ({ orders, setOrders }) => {
  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await api.patch(`/order/${orderId}/status`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handlePaidToggle = async (order: Order) => {
    console.log("Toggling paid status for", order.id);
    setOrders(
      orders.map((o) => (o.id === order.id ? { ...o, paid: !o.paid } : o))
    );
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl h-[calc(100vh-10rem)] flex flex-col">
      <h3 className="p-5 border-b border-gray-200 dark:border-neutral-800 font-semibold text-xl tracking-tight text-gray-800 dark:text-white">
        🍽️ Live Kitchen Orders
      </h3>
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        <AnimatePresence>
          {orders.length > 0 ? (
            orders.map((order) => {
              const statusInfo = ORDER_STATUS_CONFIG[order.status];
              const itemsSummary =
                order.order_items
                  ?.map((oi) => `${oi.quantity}x ${oi.item.name}`)
                  .join(", ") || "";

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                  className={`rounded-xl border-l-4 p-4 transition-shadow hover:shadow-md bg-white dark:bg-neutral-800/50`}
                  style={{ borderColor: statusInfo.hex }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-800 dark:text-white">
                        Table <span className="text-lg">{order.tableNo}</span>
                      </p>
                      <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                        #{order.publicId}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1 italic pt-1">
                        {itemsSummary}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-800 dark:text-white">
                        {formatCurrency(order.total_price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <Select
                      onValueChange={(value: OrderStatus) =>
                        handleStatusChange(order.id, value)
                      }
                      defaultValue={order.status}
                    >
                      <SelectTrigger
                        className={`h-9 text-sm w-full sm:w-[160px] rounded-md border-gray-300 dark:border-neutral-700 focus:ring-2`}
                        style={{
                          color: statusInfo.hex,
                          borderColor: statusInfo.hex,
                        }}
                      >
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ORDER_STATUS_CONFIG).map(
                          ([status, { label, hex }]) => (
                            <SelectItem
                              key={status}
                              value={status}
                              style={{ color: hex }}
                            >
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <button
                      onClick={() => handlePaidToggle(order)}
                      className={`h-9 text-sm w-full sm:w-auto flex-grow rounded-md border flex items-center justify-center gap-2 transition font-semibold ${
                        order.paid
                          ? "border-emerald-500 text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20"
                          : "border-gray-300 dark:border-neutral-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {order.paid ? "Paid" : "Mark as Paid"}
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400"
            >
              <ShoppingCart size={48} className="mb-4" />
              <h4 className="font-semibold text-lg">No Live Orders</h4>
              <p className="text-sm">
                New orders will appear here automatically.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

