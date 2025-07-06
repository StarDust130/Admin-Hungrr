import React, { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart,
  CheckCircle,
  Clock,
  Info,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Recommended for consistency
import { Order, OrderStatus } from "./types";
import { api } from "@/lib/axios";
import { formatCurrency, ORDER_STATUS_CONFIG } from "@/lib/helper";
import { formatDistanceToNow } from "date-fns"; // For human-readable time
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const LiveOrders: FC<{
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  cafeId: string | null; // cafeId is unused in this component but kept for props consistency
}> = ({ orders, setOrders }) => {
  // --- LOGIC (UNCHANGED) ---
  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      // Note: This optimistic UI update is now handled by the real-time subscription
      // in the parent component. This API call informs the backend.
      await api.patch(`/order/${orderId}/status`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update order status:", error);
      // Optionally, revert the UI change on failure
    }
  };

  const handlePaidToggle = async (order: Order) => {
    // Note: This is an optimistic update. The change is reflected instantly in the UI.
    // You might want to add a backend call here as well.
    setOrders(
      orders.map((o) => (o.id === order.id ? { ...o, paid: !o.paid } : o))
    );
  };


  // --- RENDER (UI UPDATED) ---
  return (
    <Card className="flex flex-col h-[130vh] w-full rounded-2xl bg-background border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-3 border-b">
        <div className="flex items-center text-center justify-center w-full  gap-2">
          <span className="text-xl">🍽️</span>
          <h3 className="text-xl  font-semibold text-foreground">
            Live Orders
          </h3>
        </div>
      </div>

      {/* Scrollable Order List */}
      <div className="overflow-y-auto px-4   space-y-4 flex-1 min-h-0">
        <AnimatePresence>
          {orders.length > 0 ? (
            orders.map((order) => {
              const statusInfo = ORDER_STATUS_CONFIG[order.status];
              const itemsSummary = order.order_items
                ?.map((oi) => `${oi.quantity}x ${oi.item.name}`)
                .join(", ");

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className=" rounded-lg border border-border shadow-sm hover:shadow-md transition p-3">
                    {/* Top */}
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Table #{order.tableNo}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">
                          #{order.publicId}
                        </p>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <span
                          className="text-[10px] font-medium mr-2 px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${statusInfo.hex}1A`,
                            color: statusInfo.hex,
                          }}
                        >
                          {statusInfo.label}
                        </span>

                        <Tooltip>
                          <TooltipTrigger>
                            <Info className=" w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Order Info in Deatail</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    {/* Items */}
                    {itemsSummary && (
                      <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                        {itemsSummary}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex justify-between text-[10px] text-muted-foreground border-t pt-2 mt-2">
                      <div className="flex items-center gap-1 capitalize">
                        🍽️ <span>{order.orderType}</span>
                      </div>
                      <div className="flex items-center gap-1 capitalize">
                        💳 <span>{order.payment_method}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(order.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(order.total_price)}
                      </p>

                      <div className="flex gap-1 items-center">
                        <Select
                          onValueChange={(value) =>
                            handleStatusChange(order.id, value as OrderStatus)
                          }
                          defaultValue={order.status}
                        >
                          <SelectTrigger className="h-7 text-[10px] w-[88px] rounded bg-muted border border-border">
                            <SelectValue placeholder="Update" />
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

                        {/* Confirm paid */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className={`h-7 w-7 p-0 rounded-full border ${
                                order.paid
                                  ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-600"
                                  : "hover:bg-muted dark:hover:bg-neutral-700"
                              }`}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Mark as Paid?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure the customer has paid?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handlePaidToggle(order)}
                              >
                                Confirm Paid
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-10 text-sm">
              <ShoppingCart
                className="mx-auto mb-2"
                size={28}
                strokeWidth={1.5}
              />
              <p>No live orders</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
