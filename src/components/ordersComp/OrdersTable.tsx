import React from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Printer,
  CheckCircle2,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Order, PageInfo, OrderStatus } from "./types";

// Helpers
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

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> =
  {
    pending: {
      label: "Pending",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-300 border-amber-200 dark:border-amber-700/80",
    },
    accepted: {
      label: "Accepted",
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300 border-blue-200 dark:border-blue-700/80",
    },
    preparing: {
      label: "Preparing",
      className:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-300 border-purple-200 dark:border-purple-700/80",
    },
    ready: {
      label: "Ready",
      className:
        "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700/80",
    },
    completed: {
      label: "Completed",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300 border-green-200 dark:border-green-700/80",
    },
  };

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "completed",
];

const TableRowSkeleton: React.FC = () => (
  <TableRow>
    <TableCell className="pl-6">
      <Skeleton className="h-5 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-5 w-32" />
    </TableCell>
    <TableCell className="text-center">
      <Skeleton className="h-6 w-20 mx-auto" />
    </TableCell>
    <TableCell className="text-right">
      <Skeleton className="h-5 w-16 ml-auto" />
    </TableCell>
    <TableCell className="text-right pr-6">
      <Skeleton className="h-8 w-8 ml-auto" />
    </TableCell>
  </TableRow>
);

interface OrderTableProps {
  orders: Order[];
  pageInfo: PageInfo | null;
  isLoading: boolean;
  activeTab: string;
  searchQuery: string;
  onTabChange: (tab: string) => void;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onViewDetails: (orderId: number) => void;
  onStatusUpdate: (orderId: number, status: OrderStatus) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  pageInfo,
  isLoading,
  activeTab,
  searchQuery,
  onTabChange,
  onSearchChange,
  onPageChange,
  onViewDetails,
  onStatusUpdate,
}) => {
  return (
    <Card>
      {/* Header with Tabs & Search */}
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b px-6 py-4">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="w-full sm:w-auto">
            {["all", "pending", "preparing", "completed"].map((status) => (
              <TabsTrigger key={status} value={status} className="capitalize">
                {status}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-md border bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </CardHeader>

      {/* Table */}
      <CardContent className="p-0 overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="sticky top-0 z-10 bg-background border-b">
            <TableRow>
              <TableHead className="pl-6">Order Info</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  {/* Order Info */}
                  <TableCell className="pl-6 py-2.5">
                    <div className="text-xs font-mono text-foreground font-medium">
                      #{order.publicId}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(order.created_at)},{" "}
                      {formatTime(order.created_at)}
                    </div>
                  </TableCell>

                  {/* Customer Info */}
                  <TableCell className="py-2.5">
                    <div className="font-medium">
                      {order.customerName || "Dine-in"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.tableNo ? `Table #${order.tableNo}` : "Takeaway"}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center py-2.5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "border font-medium text-xs px-2 py-0.5",
                        STATUS_CONFIG[order.status].className
                      )}
                    >
                      {STATUS_CONFIG[order.status].label}
                    </Badge>
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="text-right py-2.5 font-semibold">
                    {formatCurrency(parseFloat(order.total_price))}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right pr-6 py-2.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 shadow-md"
                      >
                        <DropdownMenuItem
                          onClick={() => onViewDetails(order.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Edit className="mr-2 h-4 w-4" /> Update Status
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuLabel>
                                Set status to
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {ALL_STATUSES.map((status) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() =>
                                    onStatusUpdate(order.id, status)
                                  }
                                  disabled={order.status === status}
                                >
                                  <span className="capitalize">{status}</span>
                                  {order.status === status && (
                                    <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
                                  )}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => alert("Printing...")}>
                          <Printer className="mr-2 h-4 w-4" /> Print Receipt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <Package className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-4 font-medium">No orders found</p>
                  <p className="text-sm text-muted-foreground">
                    Try different filters or a new date range.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Pagination Footer */}
      {pageInfo && pageInfo.totalOrders > 0 && (
        <CardFooter className="flex items-center justify-between py-4 px-6 border-t bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <strong>
              {Math.min(
                (pageInfo.currentPage - 1) * pageInfo.limit + 1,
                pageInfo.totalOrders
              )}
              –
              {Math.min(
                pageInfo.currentPage * pageInfo.limit,
                pageInfo.totalOrders
              )}
            </strong>{" "}
            of <strong>{pageInfo.totalOrders}</strong>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageInfo.currentPage - 1)}
              disabled={pageInfo.currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageInfo.currentPage + 1)}
              disabled={pageInfo.currentPage === pageInfo.totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
