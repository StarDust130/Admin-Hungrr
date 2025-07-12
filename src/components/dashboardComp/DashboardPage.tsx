/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, FC, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import * as Tone from "tone";
import { Toaster, toast } from "sonner";

// Local Imports
import { Order, DashboardStats } from "./types";
import { Header } from "./Header";
import { StatCard } from "./StatCard";
import { LiveOrders } from "./LiveOrders";
import { formatCurrency, ORDER_STATUS_CONFIG } from "@/lib/helper";
import { DashboardLoadingSkeleton } from "./DashboardLoadingSkeleton";
import { ErrorDisplay } from "./ErrorDisplay";
import { AiSuggestions } from "./AiSuggestions";
import { OrderStatusPieChart } from "./OrderStatusPieChart";
import { MostSoldItems } from "./MostSoldItems";
import { HourlyRevenueChart } from "./HourlyRevenueChart";

// --- Configuration ---
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL;



const DashboardPage: FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [hourlyRevenueData, setHourlyRevenueData] = useState<any[]>([]);
  const [mostSoldItems, setMostSoldItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCafeOpen, setIsCafeOpen] = useState<boolean>(true);
  const playerRef = useRef<Tone.Player | null>(null);

  const cafeId = localStorage.getItem("cafeId") ?? "";

  const fetchAllData = useCallback(async () => {
    try {
      const [dashboardRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/${cafeId}/today`),
        fetch(
          `${API_BASE_URL}/orders/cafe/${cafeId}??range=today&limit=10&status=all&live=true`
        ),
      ]);

      if (!dashboardRes.ok || !ordersRes.ok) {
        throw new Error(
          "Failed to fetch dashboard data. Please try again later."
        );
      }

      const dashboardData = await dashboardRes.json();
      const ordersData = await ordersRes.json();

      setStats(dashboardData.stats);
      setOrderStatusData(
        dashboardData.orderStatusData.map((d: any) => ({
          ...d,
          color: ORDER_STATUS_CONFIG[d.name.toLowerCase()]?.hex || "#ccc",
        }))
      );
      setHourlyRevenueData(dashboardData.hourlyRevenueData);
      setMostSoldItems(dashboardData.mostSoldItems);
      setLiveOrders(ordersData.orders);
    } catch (err: any) {
      console.error("Error during data fetch:", err.message);
      setError(err.message);
    }
  }, [cafeId]);

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      setError(null);
      await fetchAllData();
      setIsLoading(false);
    };
    initialFetch();
  }, [fetchAllData]);

  useEffect(() => {
    if (isLoading || !cafeId) return;

    if (!playerRef.current) {
      playerRef.current = new Tone.Player({
      url: "/soft.mp3",
      autostart: false,
      loop: false,
      volume: -10,
      }).toDestination();
      playerRef.current
      .load("/soft.mp3")
      .catch((err) => console.error("Failed to load sound:", err));
    }
    const player = playerRef.current;

    const socket: Socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Dashboard Socket connected:", socket.id);
      socket.emit("join_cafe_room", cafeId);
    });

    socket.on("new_order", async (newOrder: Order) => {
      console.log("Dashboard: New order received");
      if (Tone.context.state !== "running") await Tone.start();
      player.start();
      // Only add to live list, don't refetch stats yet.
      setLiveOrders((prev) =>
        [newOrder, ...prev].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    });

    socket.on("order_updated", (updatedOrder: Order) => {
      console.log("Dashboard: Order update received");
      // Only refetch all data if the order is accepted or paid, as this affects stats.
      if (updatedOrder.status === "accepted" || updatedOrder.paid) {
        fetchAllData();
      } else {
        // Otherwise, just update the live orders list.
        setLiveOrders((prev) =>
          prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        );
      }
    });

    socket.on("order_cancelled", () => {
      console.log("Dashboard: Order cancellation received");
      toast.info("An order was canceled by the user.");
      // Refetch all data to update stats and remove the order from the live list.
      fetchAllData();
    });

    socket.on("disconnect", () => console.log("Dashboard Socket disconnected"));
    socket.on("connect_error", (err) =>
      console.error("Socket connection error:", err.message)
    );

    return () => {
      socket.disconnect();
    };
  }, [cafeId, fetchAllData, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <DashboardLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <ErrorDisplay message={error}  />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Toaster richColors position="top-center" />
      <div className="mx-auto max-w-screen-2xl">
        <Header isOpen={isCafeOpen} setIsOpen={setIsCafeOpen} cafeId={cafeId} />
        <main className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-100px)] mb-20">
          <div className="xl:col-span-2 space-y-6 h-full overflow-y-auto">
            {stats && (
              <>
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
                <AiSuggestions cafeId={cafeId} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <OrderStatusPieChart data={orderStatusData} />
                  <MostSoldItems items={mostSoldItems} />
                </div>
                <HourlyRevenueChart data={hourlyRevenueData} />
              </>
            )}
          </div>
          <div className="h-full flex flex-col mb-20">
            <LiveOrders orders={liveOrders} cafeId={cafeId} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;


