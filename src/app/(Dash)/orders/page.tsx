"use client";
import React, { useState, useEffect, FC } from "react";
import {
  DollarSign,
  ShoppingCart,
  Clock,
  MoreHorizontal,
  Search,
  Utensils,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar as CalendarIcon,
  Inbox,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";

// --- TYPE DEFINITIONS ---
type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";
type PaymentMethod = "online" | "cash";
type OrderType = "dinein" | "takeaway" | "delivery";
type TimeRange = "today" | "week" | "month";

interface Order {
  id: number;
  publicId: string;
  tableNo: number | null;
  payment_method: PaymentMethod;
  orderType: OrderType;
  total_price: string;
  paid: boolean;
  created_at: string;
  status: OrderStatus;
}

interface PageInfo {
  currentPage: number;
  limit: number;
  totalOrders: number;
  totalPages: number;
}

interface ApiResponse {
  message: string;
  filter: string;
  pageInfo: PageInfo;
  orders: Order[];
}

// --- MOCK API RESPONSE (for fallback) ---
const MOCK_API_RESPONSE: ApiResponse = {
  message: "✅ Mock orders fetched successfully!",
  filter: "all",
  pageInfo: { currentPage: 1, limit: 10, totalOrders: 4, totalPages: 1 },
  orders: [
    {
      id: 19,
      publicId: "cmcdatjof000do6poimda5f2j",
      tableNo: 12,
      payment_method: "online",
      orderType: "dinein",
      total_price: "1598.00",
      paid: true,
      created_at: "2025-06-26T11:27:13.115Z",
      status: "completed",
    },
    {
      id: 20,
      publicId: "cmcdbujof000eo6poimda5f2k",
      tableNo: 5,
      payment_method: "cash",
      orderType: "dinein",
      total_price: "850.50",
      paid: false,
      created_at: "2025-06-26T12:05:22.115Z",
      status: "pending",
    },
    {
      id: 21,
      publicId: "cmcdcajof000fo6poimda5f2l",
      tableNo: null,
      payment_method: "online",
      orderType: "takeaway",
      total_price: "475.00",
      paid: true,
      created_at: "2025-06-26T12:15:45.115Z",
      status: "preparing",
    },
    {
      id: 22,
      publicId: "cmcdeajof000go6poimda5f2m",
      tableNo: 2,
      payment_method: "cash",
      orderType: "dinein",
      total_price: "1250.00",
      paid: false,
      created_at: "2025-06-26T12:30:00.115Z",
      status: "accepted",
    },
  ],
};

// --- HELPER FUNCTIONS & CONFIG ---
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value
  );
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; dotColor: string }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-500",
    dotColor: "bg-yellow-500",
  },
  accepted: {
    label: "Accepted",
    color: "text-blue-500",
    dotColor: "bg-blue-500",
  },
  preparing: {
    label: "Preparing",
    color: "text-purple-500",
    dotColor: "bg-purple-500",
  },
  ready: { label: "Ready", color: "text-cyan-500", dotColor: "bg-cyan-500" },
  completed: {
    label: "Completed",
    color: "text-green-500",
    dotColor: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-500",
    dotColor: "bg-red-500",
  },
};

// --- UI COMPONENTS ---

const StatCard: FC<{
  title: string;
  value: string;
  icon: React.ElementType;
}> = ({ title, value, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="border dark:border-neutral-800 rounded-xl p-5 bg-background"
  >
    <div className="flex items-center text-muted-foreground space-x-3">
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{title}</span>
    </div>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </motion.div>
);

const OrdersTable: FC<{ orders: Order[] }> = ({ orders }) => (
  <div className="border dark:border-neutral-800 rounded-xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 dark:bg-muted/20">
          <tr>
            <th className="p-4 text-left font-semibold">Order ID</th>
            <th className="p-4 text-left font-semibold">Date</th>
            <th className="p-4 text-left font-semibold">Details</th>
            <th className="p-4 text-right font-semibold">Amount</th>
            <th className="p-4 text-center font-semibold">Status</th>
            <th className="p-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b dark:border-neutral-800 last:border-none hover:bg-muted/50 dark:hover:bg-muted/20"
              >
                <td className="p-4 font-mono text-xs font-medium">
                  {order.publicId}
                </td>
                <td className="p-4 text-muted-foreground">
                  {formatDate(order.created_at)}
                </td>
                <td>
                  <div className="flex items-center space-x-2">
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {order.tableNo ? `Table ${order.tableNo}` : "Takeaway"}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right font-semibold">
                  {formatCurrency(parseFloat(order.total_price))}
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        STATUS_CONFIG[order.status]?.dotColor
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        STATUS_CONFIG[order.status]?.color
                      }`}
                    >
                      {STATUS_CONFIG[order.status]?.label}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-md hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  </div>
);

const Pagination: FC<{
  pageInfo: PageInfo;
  setPage: (page: number) => void;
}> = ({ pageInfo, setPage }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
    <p className="text-sm text-muted-foreground">
      Showing{" "}
      <strong>
        {pageInfo.totalOrders > 0
          ? pageInfo.limit * (pageInfo.currentPage - 1) + 1
          : 0}
        -{" "}
        {Math.min(pageInfo.limit * pageInfo.currentPage, pageInfo.totalOrders)}
      </strong>{" "}
      of <strong>{pageInfo.totalOrders}</strong> orders
    </p>
    <div className="flex items-center space-x-1">
      <button
        onClick={() => setPage(1)}
        disabled={pageInfo.currentPage === 1}
        className="p-2 rounded-md border dark:border-neutral-800 disabled:opacity-50"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => setPage(pageInfo.currentPage - 1)}
        disabled={pageInfo.currentPage === 1}
        className="p-2 rounded-md border dark:border-neutral-800 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => setPage(pageInfo.currentPage + 1)}
        disabled={pageInfo.currentPage === pageInfo.totalPages}
        className="p-2 rounded-md border dark:border-neutral-800 disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <button
        onClick={() => setPage(pageInfo.totalPages)}
        disabled={pageInfo.currentPage === pageInfo.totalPages}
        className="p-2 rounded-md border dark:border-neutral-800 disabled:opacity-50"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  </div>
);

const EmptyState: FC<{ message: string; description: string }> = ({
  message,
  description,
}) => (
  <div className="text-center py-16 border-2 border-dashed dark:border-neutral-800 rounded-xl flex flex-col items-center">
    <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
    <p className="font-semibold text-lg">{message}</p>
    <p className="text-muted-foreground text-sm mt-1">{description}</p>
  </div>
);

// --- MAIN PAGE COMPONENT ---
const OrdersPage: FC = () => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<TimeRange | undefined>("today");
  const [date, setDate] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real app, the cafe ID should be dynamic
        const cafeId = 1;
        const params = new URLSearchParams({
          filter: activeFilter,
          page: currentPage.toString(),
        });
        if (timeRange) params.append("range", timeRange);
        if (date) params.append("date", date.toISOString().split("T")[0]);
        if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);

        const response = await fetch(
          `http://localhost:5000/api/admin/orders/cafe/${cafeId}?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        setApiData(data);
      } catch (err) {
        console.error("API fetch failed. Using mock data as a fallback.", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );

        // --- FIXED: Fallback logic with filtering on mock data ---
        let filteredOrders = MOCK_API_RESPONSE.orders;

        // Apply status filter first
        if (activeFilter !== "all") {
          filteredOrders = filteredOrders.filter(
            (o) => o.status === activeFilter
          );
        }

        // Then apply search filter on the result
        if (debouncedSearchQuery) {
          filteredOrders = filteredOrders.filter((o) =>
            o.publicId
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase())
          );
        }

        const totalOrders = filteredOrders.length;
        const limit = 10;
        const totalPages = Math.ceil(totalOrders / limit);
        const paginatedOrders = filteredOrders.slice(
          (currentPage - 1) * limit,
          currentPage * limit
        );

        setApiData({
          ...MOCK_API_RESPONSE,
          orders: paginatedOrders,
          pageInfo: {
            currentPage,
            limit,
            totalOrders,
            totalPages,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeFilter, timeRange, date, currentPage, debouncedSearchQuery]);

  const totalRevenue = apiData?.pageInfo.totalOrders // Should be calculated on all filtered data, not just the current page
    ? MOCK_API_RESPONSE.orders
        .filter((o) => activeFilter === "all" || o.status === activeFilter)
        .reduce((sum, order) => sum + parseFloat(order.total_price), 0)
    : 0;

  const pendingOrders = apiData?.pageInfo.totalOrders
    ? MOCK_API_RESPONSE.orders.filter((o) => o.status === "pending").length
    : 0;

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-10">Loading orders...</div>;
    }
    if (apiData && apiData.orders.length > 0) {
      return (
        <>
          <OrdersTable orders={apiData.orders} />
          <Pagination pageInfo={apiData.pageInfo} setPage={setCurrentPage} />
        </>
      );
    }
    if (apiData && apiData.orders.length === 0) {
      const message = debouncedSearchQuery
        ? `No results for "${debouncedSearchQuery}"`
        : `No ${activeFilter} orders found`;
      const description = debouncedSearchQuery
        ? "Try a different search term or adjust your filters."
        : "There are no orders matching the current filter criteria.";

      return <EmptyState message={message} description={description} />;
    }
    // This handles the initial error state before mock data is loaded
    if (error) {
      return (
        <EmptyState
          message="Failed to load orders"
          description="There was an issue connecting to the server. Please try again later."
        />
      );
    }
    return null;
  };

  return (
    <div className="mx-auto w-full p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        {/* FIXED: Responsive header layout */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Orders Management
            </h1>
            <p className="text-muted-foreground">
              View and manage all customer orders.
            </p>
          </div>
          {/* FIXED: Responsive date filter controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex space-x-1 bg-muted dark:bg-muted/30 p-1 rounded-lg">
              {(["today", "week", "month"] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setTimeRange(range);
                    setDate(undefined);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors w-full sm:w-auto ${
                    timeRange === range
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="capitalize">{range}</span>
                </button>
              ))}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={`flex items-center justify-center space-x-2 px-3 py-1.5 text-sm font-semibold border dark:border-neutral-700 rounded-lg hover:bg-muted ${
                    date ? "bg-muted" : ""
                  }`}
                >
                  <CalendarIcon size={16} />
                  <span>{date ? format(date, "PPP") : "Pick a date"}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    setTimeRange(undefined);
                    setCurrentPage(1);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <main className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
          />
          <StatCard
            title="Total Orders"
            value={apiData?.pageInfo.totalOrders.toString() || "0"}
            icon={ShoppingCart}
          />
          <StatCard
            title="Pending Orders"
            value={pendingOrders.toString()}
            icon={Clock}
          />
        </div>

        {/* FIXED: Responsive filter and search bar section */}
        <div className="border dark:border-neutral-800 rounded-xl p-4 bg-background">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto p-1 rounded-lg overflow-x-auto">
              <div className="flex space-x-1 bg-muted dark:bg-muted/30 p-1 rounded-lg">
                {["all", "pending", "preparing", "completed"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                      activeFilter === filter
                        ? "bg-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="capitalize">{filter}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border dark:border-neutral-800 rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
          </div>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default OrdersPage;
