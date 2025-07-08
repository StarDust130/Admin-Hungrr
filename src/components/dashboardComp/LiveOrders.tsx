"use client";
import React, { useState, FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

import {
  ShoppingCart,
  Clock,
  Info,
  BadgeCheck,
  Loader2,
  Utensils, // For Dine-in
  CreditCard, // For Online
  ReceiptText,
  Wallet, // For Cash
  ShoppingBag, // For Takeaway
} from "lucide-react";

import { LiveOrdersProps, Order, OrderStatus } from "./types";
import { formatCurrency, ORDER_STATUS_CONFIG } from "@/lib/helper";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";

// UI Component Imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { OrderDetailsModal } from "../ordersComp/OrderDetailsModal";

export const LiveOrders: FC<LiveOrdersProps> = ({ orders }) => {
  const [submittingOrderId, setSubmittingOrderId] = useState<string | null>(
    null
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("LiveOrders component rendered with orders:", orders);
  

  // This component now relies on a parent to update its state via WebSocket.
  // The API calls here just trigger the backend event.
  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await api.patch(`/order/${orderId}/status`, { status: newStatus });
      // The parent component's WebSocket listener will handle the state update
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handlePaidToggle = async (orderToUpdate: Order) => {
    if (orderToUpdate.paid || submittingOrderId) return;
    setSubmittingOrderId(orderToUpdate.id);
    try {
      await api.patch(`/order/${orderToUpdate.id}/mark-paid`);
      // The parent component's WebSocket listener will update the state,
      // providing the "source of truth" update.
    } catch (error) {
      console.error("Failed to mark order as paid:", error);
    } finally {
      setSubmittingOrderId(null);
    }
  };

  const openDetailsModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <TooltipProvider>
      <Card className="flex flex-col h-[130vh] w-full rounded-2xl bg-background border border-border shadow-sm">
        {/* Card Header */}
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <ReceiptText className="w-5 h-5 text-primary" />
              <span>Live Orders</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            New customer orders will appear here in real-time.
          </p>
          <div className="mt-4 border-b border-border" />
        </div>

        {/* Orders List */}
        <div className="overflow-y-auto px-3 space-y-4 flex-1 min-h-0">
          <AnimatePresence>
            {orders.length > 0 ? (
              orders.map((order) => {
                const statusInfo =
                  ORDER_STATUS_CONFIG[order.status] ||
                  ORDER_STATUS_CONFIG.pending;
                const isSubmitting = submittingOrderId === order.id;

                // --- FIX: Conditional Icons ---
                const OrderTypeIcon =
                  order.orderType === "takeaway" ? ShoppingBag : Utensils;
                const PaymentMethodIcon =
                  order.payment_method === "cash" ? Wallet : CreditCard;

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  >
                    <div className="rounded-lg border border-border shadow-sm hover:shadow-md transition p-3">
                      {/* Order Header */}
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
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: statusInfo.hex,
                              color: statusInfo.hex,
                            }}
                          >
                            {statusInfo.label}
                          </Badge>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => openDetailsModal(order)}
                              >
                                <Info className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Order Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Order Info Icons */}
                      <div className="flex flex-wrap justify-between items-center text-xs text-muted-foreground border-t pt-2 mt-2 gap-2">
                        <div className="flex items-center gap-1 capitalize">
                          {/* -- Corrected Icon -- */}
                          <OrderTypeIcon className="w-3 h-3" />
                          <span>{order.orderType}</span>
                        </div>
                        <div className="flex items-center gap-1 capitalize">
                          {/* -- Corrected Icon -- */}
                          <PaymentMethodIcon className="w-3 h-3" />
                          <span>{order.payment_method}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatDistanceToNow(new Date(order.created_at), {
                              addSuffix: true,
                            }).replace("about ", "")}
                          </span>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(order.total_price)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleStatusChange(order.id, value as OrderStatus)
                            }
                            disabled={order.status === "completed"}
                          >
                            <SelectTrigger className="h-8 w-[100px] rounded-md bg-muted border border-border px-2 text-[11px] font-medium">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(ORDER_STATUS_CONFIG).map(
                                ([status, { label, hex }]) => (
                                  <SelectItem
                                    key={status}
                                    value={status}
                                    className="text-xs"
                                    style={{ color: hex }}
                                  >
                                    {label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>

                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger
                                  asChild
                                  disabled={order.paid || isSubmitting}
                                >
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className={cn(
                                      "h-8 w-8 p-0 rounded-full border transition-all",
                                      order.paid
                                        ? "bg-emerald-100 text-emerald-600 border-emerald-400 dark:bg-emerald-900/30 cursor-not-allowed"
                                        : "hover:bg-muted text-muted-foreground border-border"
                                    )}
                                    aria-label="Mark order as paid"
                                  >
                                    {isSubmitting ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <BadgeCheck className="h-4 w-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>
                                  {order.paid
                                    ? "💸 Payment received"
                                    : "Mark this order as paid"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  💰 Confirm Payment Received?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will mark the order as{" "}
                                  <strong>paid</strong> and change its status to{" "}
                                  <strong>accepted</strong>. This action cannot
                                  be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  ❌ Not Yet
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handlePaidToggle(order)}
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    "👍"
                                  )}
                                  {isSubmitting
                                    ? "Confirming..."
                                    : "Yes, Paid!"}
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
              <div className="text-center text-muted-foreground py-10 text-sm flex flex-col items-center justify-center">
                <ShoppingCart
                  className="mx-auto mb-2"
                  size={28}
                  strokeWidth={1.5}
                />
                <p className="font-semibold">No live orders yet</p>
                <p className="text-xs">New orders will show up here.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </Card>
      <OrderDetailsModal
        orderId={
          selectedOrder?.id && orders.some((o) => o.id === selectedOrder.id)
            ? selectedOrder.id
            : ""
        }
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </TooltipProvider>
  );
};
