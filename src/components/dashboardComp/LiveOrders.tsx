import React, { FC, useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Clock, Info, BadgeCheck, Loader2 } from "lucide-react";
import { io, Socket } from "socket.io-client";
import * as Tone from "tone";

// Assuming these are your ShadCN UI component imports
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

// Assuming these are your utility/helper imports
import { Order, OrderStatus } from "./types"; // Your type definitions
import { api } from "@/lib/axios"; // Your configured axios instance
import { formatCurrency, ORDER_STATUS_CONFIG } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// --- Configuration ---
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL

/**
 * Custom Hook: useOrderSocket
 * Manages the WebSocket connection, event handling, and notification sounds.
 */
const useOrderSocket = (
  cafeId: string | null,
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
) => {
  const socketRef = useRef<Socket | null>(null);
  const playerRef = useRef<Tone.Player | null>(null);

  useEffect(() => {
    if (!cafeId) return;

    // Initialize the audio player
    if (!playerRef.current) {
      playerRef.current = new Tone.Player({
        url: "/soft.mp3", // ✅ exact path to your soft.mp3 file
        autostart: false,
        loop: false,
        volume: -15, // soft volume, you can change to -10 or -5
      }).toDestination();

      playerRef.current
        .load()
        .then(() => {
          console.log("✅ soft.mp3 loaded");
        })
        .catch((err) => {
          console.error("❌ Failed to load soft.mp3:", err);
        });
    }

    const player = playerRef.current;

    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(`✅ Socket connected: ${socket.id}`);
      socket.emit("join_cafe_room", cafeId);
    });

    socket.on("disconnect", () => console.log("🔌 Socket disconnected"));

    socket.on("new_order", async (newOrder: Order) => {
      console.log("📦 New order received:", newOrder);

      // Ensure the browser's audio context is started
      if (Tone.context.state !== "running") {
        await Tone.start();
        console.log("🎧 Tone context started");
      }

      // Play the soft sound
      try {
        player.start();
        console.log("🎵 Playing soft.mp3");
      } catch (err) {
        console.error("⚠️ Couldn't play soft.mp3:", err);
      }

      setOrders((prevOrders) => {
        if (prevOrders.some((o) => o.id === newOrder.id)) return prevOrders;
        return [newOrder, ...prevOrders].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    });

    socket.on("order_updated", (updatedOrder: Order) => {
      console.log("🔄 Order updated:", updatedOrder);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
        )
      );
    });

    return () => {
      if (socket) {
        console.log("🧹 Cleaning up socket connection...");
        socket.emit("leave_cafe_room", cafeId);
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [cafeId, setOrders]);
};





export const LiveOrders: FC<{
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  cafeId: string | null;
}> = ({ orders, setOrders, cafeId }) => {
  useOrderSocket(cafeId, setOrders);

  const [submittingOrderId, setSubmittingOrderId] = useState<string | null>(
    null
  );

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
    if (order.paid || submittingOrderId) return;

    setSubmittingOrderId(order.id);
    try {
      await api.patch(`/order/${order.id}/mark-paid`);
    } catch (error) {
      console.error("Failed to mark order as paid:", error);
    } finally {
      setSubmittingOrderId(null);
    }
  };

  return (
    <TooltipProvider>
      <Card className="flex flex-col h-[130vh] w-full rounded-2xl bg-background border border-border shadow-sm">
        <div className="px-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-semibold">
              🧾 <span>Live Orders</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            New customer orders will appear here in real-time.
          </p>
          <div className="mt-3 border-b border-border" />
        </div>

        <div className="overflow-y-auto px-3 space-y-4 flex-1 min-h-0">
          <AnimatePresence>
            {orders.length > 0 ? (
              orders.map((order) => {
                const statusInfo =
                  ORDER_STATUS_CONFIG[order.status] ||
                  ORDER_STATUS_CONFIG.pending;
                const itemsSummary = order.order_items
                  ?.map((oi) => `${oi.quantity}x ${oi.item.name}`)
                  .join(", ");
                const isSubmitting = submittingOrderId === order.id;

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
                              <Info className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Order Info in Detail</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {itemsSummary && (
                        <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                          {itemsSummary}
                        </p>
                      )}

                      <div className="flex justify-between text-xs text-muted-foreground border-t pt-2 mt-2">
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
                            }).replace("about ", "")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(order.total_price)}
                        </p>
                        <div className="flex items-center gap-2">
                          {/* --- UI FIX --- */}
                          {/* Changed `defaultValue` to `value` to make the component controlled */}
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleStatusChange(order.id, value as OrderStatus)
                            }
                            disabled={
                              order.status === "completed" ||
                              order.status === "cancelled"
                            }
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
              <div className="text-center text-muted-foreground py-10 text-sm absolute inset-0 flex flex-col items-center justify-center">
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
    </TooltipProvider>
  );
};
