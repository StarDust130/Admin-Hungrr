import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || "/api";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    value
  );

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

interface OrderDetailsModalProps {
  orderId: number | null | string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  orderId,
  isOpen,
  onOpenChange,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      setIsLoading(true);
      setOrder(null);
      fetch(`${API_BASE}/order/${orderId}/details`)
        .then((res) => res.json())
        .then((data) => setOrder(data.order))
        .catch((error) => console.error("Error fetching order details:", error))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, orderId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl border border-border  shadow-lg  p-6">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-foreground">
            Order #{order?.publicId || "Loading..."}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {order ? (
              `${formatDate(order.created_at)}, ${formatTime(order.created_at)}`
            ) : (
              <Skeleton className="h-4 w-32" />
            )}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex flex-col gap-4 py-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-5 w-1/2 ml-auto" />
          </div>
        ) : order ? (
          <div className="flex flex-col gap-4">
            {order.customerName && (
              <div className="text-sm font-medium text-foreground">
                <strong>Customer:</strong> {order.customerName}
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50 hover:bg-transparent">
                  <TableHead className="text-foreground font-semibold">
                    Item
                  </TableHead>
                  <TableHead className="text-foreground font-semibold text-center">
                    Qty
                  </TableHead>
                  <TableHead className="text-foreground font-semibold text-right">
                    Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(order.order_items ?? []).map((orderItem, index) => {
                  const itemName = orderItem.variant
                    ? `${orderItem.item.name} (${orderItem.variant.name})`
                    : orderItem.item.name;
                  const itemPrice = orderItem.variant
                    ? Number(orderItem.variant.price)
                    : Number(orderItem.item.price);

                  return (
                    <TableRow
                      key={index}
                      className="border-b border-border/20 hover:bg-muted/20"
                    >
                      <TableCell className="text-foreground">
                        {itemName}
                      </TableCell>
                      <TableCell className="text-center text-foreground">
                        {orderItem.quantity}
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        {formatCurrency(itemPrice * orderItem.quantity)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="text-lg font-bold text-right text-primary mt-4">
              Total: {formatCurrency(Number(order.total_price))}
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Could not load order details.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
