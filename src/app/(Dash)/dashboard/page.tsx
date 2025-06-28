"use client";
import React, { useState, useEffect, FC } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  PieChart as PieChartIcon,
  ArrowUp,
  ArrowDown,
  BrainCircuit,
  CheckCircle,
  Flame,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { motion, AnimatePresence } from "framer-motion";

// --- TYPE DEFINITIONS ---
type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "completed";

interface Order {
  id: string;
  table: string;
  amount: string;
  status: OrderStatus;
  paid: boolean;
  items: string;
}

interface Stat {
  value: number;
  change: number;
}

interface MockStats {
  revenue: Stat;
  orders: Stat;
  avgOrderValue: Stat;
  newCustomers: Stat;
}

interface OrderStatusConfig {
  [key: string]: { label: string; color: string };
}

// --- MOCK DATA & CONFIG ---
const MOCK_STATS: MockStats = {
  revenue: { value: 4500.5, change: 12.5 },
  orders: { value: 120, change: 8.2 },
  avgOrderValue: { value: 37.5, change: -2.1 },
  newCustomers: { value: 15, change: 30 },
};

const INITIAL_LIVE_ORDERS: Order[] = [
  {
    id: "ORD-001",
    table: "T-01",
    amount: "15.50",
    status: "pending",
    paid: false,
    items: "2x Latte, 1x Croissant",
  },
  {
    id: "ORD-002",
    table: "T-03",
    amount: "4.00",
    status: "accepted",
    paid: false,
    items: "1x Americano",
  },
  {
    id: "ORD-003",
    table: "T-05",
    amount: "9.00",
    status: "preparing",
    paid: true,
    items: "3x Espresso",
  },
  {
    id: "ORD-004",
    table: "T-08",
    amount: "5.50",
    status: "ready",
    paid: true,
    items: "1x Matcha Latte",
  },
];

const ORDER_STATUS_CONFIG: OrderStatusConfig = {
  pending: { label: "Pending", color: "#f59e0b" },
  accepted: { label: "Accepted", color: "#3b82f6" },
  preparing: { label: "Preparing", color: "#8b5cf6" },
  ready: { label: "Ready", color: "#10b981" },
  completed: { label: "Completed", color: "#6b7280" },
};

const ORDER_STATUS_DATA = [
  { name: "Pending", value: 30, color: ORDER_STATUS_CONFIG.pending.color },
  { name: "Accepted", value: 20, color: ORDER_STATUS_CONFIG.accepted.color },
  { name: "Preparing", value: 50, color: ORDER_STATUS_CONFIG.preparing.color },
  { name: "Ready", value: 25, color: ORDER_STATUS_CONFIG.ready.color },
];

const HOURLY_REVENUE_DATA = [
  { hour: "9am", revenue: 200 },
  { hour: "10am", revenue: 450 },
  { hour: "11am", revenue: 800 },
  { hour: "12pm", revenue: 700 },
  { hour: "1pm", revenue: 950 },
  { hour: "2pm", revenue: 600 },
  { hour: "3pm", revenue: 1100 },
  { hour: "4pm", revenue: 1300 },
  { hour: "5pm", revenue: 1000 },
];

const MOST_SOLD_ITEMS = [
  { name: "Espresso", count: 125, icon: Flame },
  { name: "Croissant", count: 95, icon: Flame },
  { name: "Latte", count: 80, icon: Flame },
];

// --- HELPER FUNCTIONS ---
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value
  );

// --- UI COMPONENTS ---

const Header: FC<{ isOpen: boolean; setIsOpen: (isOpen: boolean) => void }> = ({
  isOpen,
  setIsOpen,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-mono font-semibold text-lg">
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {time.toLocaleDateString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                isOpen
                  ? "border-green-500/50 text-green-500 bg-green-500/10"
                  : "border-red-500/50 text-red-500 bg-red-500/10"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full animate-pulse ${
                  isOpen ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span>{isOpen ? "Cafe Open" : "Cafe Closed"}</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Are you sure you want to {isOpen ? "CLOSE" : "OPEN"} the cafe?
              This will affect live orders.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => setIsOpen(!isOpen)}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

const StatCard: FC<{
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  change: number;
}> = ({ title, value, icon: Icon, color, change }) => (
  <div className="border dark:border-neutral-800 rounded-xl p-5 transition-all duration-300 hover:shadow-xl dark:hover:shadow-neutral-800/50">
    <div className="flex justify-between items-center mb-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <Icon className="h-6 w-6" style={{ color }} />
    </div>
    <p className="text-3xl font-bold mb-1">{value}</p>
    <div className="flex items-center text-xs">
      <span
        className={`flex items-center font-semibold ${
          change >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {change >= 0 ? (
          <ArrowUp size={12} className="mr-1" />
        ) : (
          <ArrowDown size={12} className="mr-1" />
        )}
        {Math.abs(change)}%
      </span>
    </div>
  </div>
);

const OrderStatusPieChart: FC<{
  data: { name: string; value: number; color: string }[];
}> = ({ data }) => (
  <div className="border dark:border-neutral-800 rounded-xl p-5 flex flex-col">
    <div className="flex items-center mb-4">
      <PieChartIcon className="h-6 w-6 text-muted-foreground mr-3" />
      <h3 className="font-semibold text-lg">Live Order Status</h3>
    </div>
    <div className="flex-grow flex items-center">
      <ResponsiveContainer width="45%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            paddingAngle={5}
            cornerRadius={5}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="w-55% flex flex-col justify-center space-y-3 pl-4">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center text-sm">
            <span
              className="w-3  h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium mr-2">{entry.name}</span>
            <span className="ml-auto font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AiSuggestions: FC = () => (
  <div className="border dark:border-neutral-800 rounded-xl p-6 bg-neutral-900 overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.1)_0%,_transparent_50%)] animate-pulse"></div>
    <div className="relative z-10">
      <div className="flex items-center mb-4">
        <BrainCircuit className="h-6 w-6 text-purple-400 mr-3" />
        <h3 className="font-semibold text-lg text-purple-300">
          Sentient AI - v2.5 Insights
        </h3>
      </div>
      <div className="font-mono text-sm text-neutral-400 space-y-2">
        <p>
          <span className="text-green-400">&gt; Observation:</span> Peak revenue
          between 3-4 PM.
        </p>
        <p>
          <span className="text-yellow-400">&gt; Recommendation:</span>{" "}
          Introduce 'Happy Hour' discount from 5-6 PM to boost late sales.
        </p>
      </div>
    </div>
  </div>
);

const LiveOrders: FC<{
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}> = ({ orders, setOrders }) => {
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };
  const handlePaidToggle = (orderId: string) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, paid: !o.paid } : o))
    );
  };

  return (
    <div className="border dark:border-neutral-800 rounded-xl h-full flex flex-col xl:col-span-1">
      <h3 className="p-5 border-b dark:border-neutral-800 font-semibold text-xl tracking-tight">
        Live Kitchen Orders
      </h3>
      <div className="flex-grow p-3 space-y-3 overflow-y-auto">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="border dark:border-neutral-800/50 rounded-lg p-4 transition-shadow hover:shadow-md relative overflow-hidden"
            >
              <div
                className="absolute left-0 top-0 h-full w-1"
                style={{
                  backgroundColor: ORDER_STATUS_CONFIG[order.status]?.color,
                }}
              ></div>
              <div className="flex justify-between items-start mb-3 pl-2">
                <div>
                  <p className="font-bold">{order.id}</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Table: {order.table}
                  </p>
                </div>
                <p className="font-bold text-lg">
                  {formatCurrency(parseFloat(order.amount))}
                </p>
              </div>
              <div className="pl-2 space-y-3">
                <Select
                  onValueChange={(value: OrderStatus) =>
                    handleStatusChange(order.id, value)
                  }
                  defaultValue={order.status}
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                    <div className="flex items-center">
                      <span
                        className="w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            ORDER_STATUS_CONFIG[order.status]?.color,
                        }}
                      />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ORDER_STATUS_CONFIG).map(
                      ([status, { label, color }]) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center">
                            <span
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: color }}
                            />
                            {label}
                          </div>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className={`w-full flex items-center justify-center space-x-2 h-9 px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                        order.paid
                          ? "border-green-500/50 text-green-500 bg-green-500/10"
                          : "border-neutral-600"
                      }`}
                    >
                      <CheckCircle size={12} />
                      <span>{order.paid ? "Paid" : "Mark As Paid"}</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Confirm Payment Status
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      Are you sure you want to mark this order as{" "}
                      {order.paid ? "UNPAID" : "PAID"}?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handlePaidToggle(order.id)}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MostSoldItems: FC<{
  items: { name: string; count: number; icon: React.ElementType }[];
}> = ({ items }) => (
  <div className="border dark:border-neutral-800 rounded-xl p-5">
    <div className="flex items-center mb-4">
      <Flame className="h-6 w-6 text-muted-foreground mr-3" />
      <h3 className="font-semibold text-lg">Hot Items Today</h3>
    </div>
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.name} className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg">
            <item.icon className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex-grow">
            <p className="font-semibold text-sm">{item.name}</p>
          </div>
          <p className="font-bold text-sm">
            {item.count}{" "}
            <span className="text-xs text-muted-foreground">sold</span>
          </p>
        </div>
      ))}
    </div>
  </div>
);

const HourlyRevenueChart: FC<{ data: { hour: string; revenue: number }[] }> = ({
  data,
}) => (
  <div className="border dark:border-neutral-800 rounded-xl p-5 xl:col-span-3">
    <h3 className="font-semibold text-lg mb-4">Hourly Revenue</h3>
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border))"
        />
        <XAxis dataKey="hour" axisLine={false} tickLine={false} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// --- MAIN APP COMPONENT ---
const DashboardPage: FC = () => {
  const [stats, setStats] = useState<MockStats>(MOCK_STATS);
  const [liveOrders, setLiveOrders] = useState<Order[]>(INITIAL_LIVE_ORDERS);
  const [isCafeOpen, setIsCafeOpen] = useState<boolean>(true);

  return (
    <div className="mx-auto w-full">
      <Header isOpen={isCafeOpen} setIsOpen={setIsCafeOpen} />
      <main className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.revenue.value)}
              icon={DollarSign}
              color="#3b82f6"
              change={stats.revenue.change}
            />
            <StatCard
              title="Total Orders"
              value={String(stats.orders.value)}
              icon={ShoppingCart}
              color="#10b981"
              change={stats.orders.change}
            />
            <StatCard
              title="Avg. Order Value"
              value={formatCurrency(stats.avgOrderValue.value)}
              icon={TrendingUp}
              color="#f59e0b"
              change={stats.avgOrderValue.change}
            />
            <StatCard
              title="New Customers"
              value={String(stats.newCustomers.value)}
              icon={Users}
              color="#8b5cf6"
              change={stats.newCustomers.change}
            />
          </div>
          <AiSuggestions />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderStatusPieChart data={ORDER_STATUS_DATA} />
            <MostSoldItems items={MOST_SOLD_ITEMS} />
          </div>

          <div className="grid grid-cols-1">
            <HourlyRevenueChart data={HOURLY_REVENUE_DATA} />
          </div>
        </div>
        <LiveOrders orders={liveOrders} setOrders={setLiveOrders} />
      </main>
    </div>
  );
};

export default DashboardPage;
