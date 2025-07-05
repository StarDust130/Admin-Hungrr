/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, FC, useCallback, useMemo } from "react";
import {
  DollarSign,
  ShoppingCart,
  Clock,
  MoreHorizontal,
  Search,
  Calendar as CalendarIcon,
  LineChart,
  Eye,
  Edit,
  Printer,
  CheckCircle2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Make sure you have this component from shadcn
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// --- TYPE DEFINITIONS ---
type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "completed";
type TimeRange = "today" | "week" | "month";

interface OrderItem {
  quantity: number;
  item: {
    name: string;
    price: string;
  };
}

interface Order {
  id: number;
  publicId: string;
  customerName: string;
  tableNo: number | null;
  total_price: string;
  created_at: string;
  status: OrderStatus;
  order_items?: OrderItem[]; // Now includes full item details
}
interface PageInfo {
  currentPage: number;
  limit: number;
  totalOrders: number;
  totalPages: number;
}
interface Stats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  pending: number;
}

// --- HELPER FUNCTIONS & CONFIG ---
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

// --- API & State ---
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || "/api";
const CAFE_ID = "1";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- UI COMPONENTS ---

// ✨ Smaller, cooler Stat Card
const StatCard: FC<{
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
}> = ({ title, value, icon: Icon, change }) => (
  <Card>
    <CardContent className="p-4 flex flex-col">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-xs font-medium text-muted-foreground">{title}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3 text-green-500" /> {change}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);

// ✨ Skeleton loader for the stat cards
const StatCardSkeleton: FC = () => (
  <Card>
    <CardContent className="p-4">
      <Skeleton className="h-4 w-2/3 mb-2" />
      <Skeleton className="h-6 w-1/3" />
    </CardContent>
  </Card>
);

// ✨ Skeleton loader for the table rows
const TableRowSkeleton: FC = () => (
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

// ✨ Enhanced Order Details Modal with full info
const OrderDetailsModal: FC<{
  orderId: number | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}> = ({ orderId, isOpen, onOpenChange }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      setIsLoading(true);
      setOrder(null); // Clear previous order data
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
            {formatDate(order?.created_at || new Date().toISOString())},{" "}
            {formatTime(order?.created_at || new Date().toISOString())},{" "}
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
            <div className="text-sm">
              <strong>Customer:</strong> {order.customerName}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items?.map((orderItem, index) => (
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

// --- MAIN PAGE COMPONENT ---
const OrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<TimeRange | undefined>("today");
  const [date, setDate] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  // Memoize API parameters to prevent unnecessary refetching
  const apiParams = useMemo(() => {
    const params = new URLSearchParams();
    if (timeRange) params.set("range", timeRange);
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    return params;
  }, [timeRange, date]);

  // --- DATA FETCHING ---
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams(apiParams);
    params.set("page", currentPage.toString());
    params.set("limit", "10");
    params.set("status", activeTab);
    if (debouncedSearch) params.set("search", debouncedSearch);

    try {
      const res = await fetch(
        `${API_BASE}/orders/cafe/${CAFE_ID}?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders);
      setPageInfo(data.pageInfo);
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, activeTab, debouncedSearch, apiParams]);

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/stats/cafe/${CAFE_ID}?${apiParams.toString()}`
      );
      if (!res.ok) throw new Error(`Failed to fetch stats`);
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setIsStatsLoading(false);
    }
  }, [apiParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // --- EVENT HANDLERS ---
  const handleStatusUpdate = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      await fetch(`${API_BASE}/order/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchStats();
    } catch (error: any) {
      console.error("Failed to update status, rolling back UI.");
      fetchOrders(); // Refetch to get the correct state
    }
  };

  // ✅ FIXED CALENDAR/BUTTON LOGIC
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    setDate(undefined); // Clear date when button is clicked
    setCurrentPage(1);
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setTimeRange(undefined); // Clear time range when date is picked
      setCurrentPage(1);
    }
  };

  return (
    <>
      <OrderDetailsModal
        orderId={selectedOrderId}
        isOpen={isDetailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">
              Manage and review all your cafe&apos;s orders.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              {(["today", "week", "month"] as TimeRange[]).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTimeRangeChange(range)}
                >
                  <span className="capitalize">{range}</span>
                </Button>
              ))}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isStatsLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats?.totalRevenue || 0)}
                icon={DollarSign}
                change="+20.1%"
              />
              <StatCard
                title="Total Orders"
                value={stats?.totalOrders?.toString() || "0"}
                icon={ShoppingCart}
                change="+18.2%"
              />
              <StatCard
                title="Avg. Order Value"
                value={formatCurrency(stats?.averageOrderValue || 0)}
                icon={LineChart}
                change="+2.5%"
              />
              <StatCard
                title="Pending Orders"
                value={stats?.pending?.toString() || "0"}
                icon={Clock}
              />
            </>
          )}
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b px-6 py-4">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                setCurrentPage(1);
              }}
            >
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all" className="flex-1 sm:flex-initial">
                  All
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1 sm:flex-initial">
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="preparing"
                  className="flex-1 sm:flex-initial"
                >
                  Preparing
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="flex-1 sm:flex-initial"
                >
                  Completed
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search by Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                          {order.tableNo
                            ? `Table #${order.tableNo}`
                            : "Takeaway"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-xs">
                          {order.publicId}
                        </div>
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
                              onClick={() => {
                                setSelectedOrderId(order.id);
                                setDetailsModalOpen(true);
                              }}
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
                                        handleStatusUpdate(order.id, status)
                                      }
                                      disabled={order.status === status}
                                    >
                                      <span className="capitalize">
                                        {status}
                                      </span>
                                      {order.status === status && (
                                        <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
                                      )}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => alert(`Printing...`)}
                            >
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
                        Try adjusting your date and status filters.
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
                  onClick={() => setCurrentPage((c) => c - 1)}
                  disabled={pageInfo.currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((c) => c + 1)}
                  disabled={pageInfo.currentPage === pageInfo.totalPages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </main>
    </>
  );
};

export default OrdersPage;
