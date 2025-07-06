import React, { useState, useEffect } from "react";
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
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, orderId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Order #{order?.publicId}</DialogTitle>
          <DialogDescription>
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
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-5 w-1/2 ml-auto" />
          </div>
        ) : order ? (
          <div className="flex flex-col gap-4">
            {order.customerName && (
              <div className="text-sm">
                <strong>Customer:</strong> {order.customerName}
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(order.order_items ?? []).map((orderItem, index) => (
                  <TableRow key={index}>
                    <TableCell>{orderItem.item.name}</TableCell>
                    <TableCell className="text-center">
                      {orderItem.quantity}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(
                        parseFloat(orderItem.item.price) * orderItem.quantity
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-lg font-bold text-right mt-2">
              Total: {formatCurrency(parseFloat(order.total_price))}
            </div>
          </div>
        ) : (
          <p>Could not load order details.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
