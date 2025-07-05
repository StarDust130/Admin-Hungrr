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

// Configs
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

// Skeleton Component
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

export const OrderTable: React.FC<OrderTableProps> = (props) => {
  const {
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
  } = props;

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b px-6 py-4">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="preparing">Preparing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Customer</TableHead>
              <TableHead>Order ID & Time</TableHead>
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
                <TableRow key={order.id} className="hover:bg-muted/50">
                  <TableCell className="pl-6 py-3">
                    <div className="font-medium">
                      {order.customerName || `Order #${order.publicId}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.tableNo ? `Table #${order.tableNo}` : "Takeaway"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs">{order.publicId}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(order.created_at)},{" "}
                      {formatTime(order.created_at)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "border-2",
                        STATUS_CONFIG[order.status].className
                      )}
                    >
                      {STATUS_CONFIG[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(parseFloat(order.total_price))}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => onViewDetails(order.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Update Status</span>
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
                        <DropdownMenuItem onClick={() => alert(`Printing...`)}>
                          <Printer className="mr-2 h-4 w-4" />
                          <span>Print Receipt</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No orders found
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      {pageInfo && pageInfo.totalOrders > 0 && (
        <CardFooter className="flex items-center justify-between py-3 border-t">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <strong>
              {Math.min(
                (pageInfo.currentPage - 1) * pageInfo.limit + 1,
                pageInfo.totalOrders
              )}
              -
              {Math.min(
                pageInfo.currentPage * pageInfo.limit,
                pageInfo.totalOrders
              )}
            </strong>{" "}
            of <strong>{pageInfo.totalOrders}</strong> orders.
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageInfo.currentPage - 1)}
              disabled={pageInfo.currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
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
