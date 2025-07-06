/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, FC, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

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

const DashboardPage: FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [hourlyRevenueData, setHourlyRevenueData] = useState<any[]>([]);
  const [mostSoldItems, setMostSoldItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCafeOpen, setIsCafeOpen] = useState<boolean>(true);

  const cafeId = "1"; // In a real app, get this from auth context or URL

  const fetchAllData = useCallback(async () => {
    try {
      const [dashboardRes, ordersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dashboard/${cafeId}/today`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/orders/cafe/${cafeId}?range=today&limit=50`),
      ]);

      if (!dashboardRes.ok || !ordersRes.ok) {
        console.error("Failed to refetch data.");
        return;
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
      console.error("Error during data refetch:", err.message);
    }
  }, [cafeId]);

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [dashboardRes, ordersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dashboard/${cafeId}/today`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/orders/cafe/${cafeId}?range=today&limit=50`),
        ]);

        if (!dashboardRes.ok) {
          const err = await dashboardRes.json();
          throw new Error(err.message || "Failed to fetch dashboard data.");
        }
        if (!ordersRes.ok) {
          const err = await ordersRes.json();
          throw new Error(err.message || "Failed to fetch live orders.");
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
        console.log("Live data fetched successfully.", ordersData);
        
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    initialFetch();
  }, [cafeId]);

  useEffect(() => {
    // FIX: Delay socket connection until after the initial data load is complete.
    if (isLoading) return;

    const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_API_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
      // The path option is often not needed if the server is set up with standard defaults.
      // It can sometimes cause connection issues if misconfigured. Removing it simplifies the connection.
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join_cafe_room", `cafe_${cafeId}`);
    });

    socket.on("new_order", (newOrder: Order) => {
      console.log("New order received:", newOrder);
      // Add the new order to the top of the list for immediate visibility.
      setLiveOrders((prev) => [newOrder, ...prev]);
      // Refetch all dashboard stats to keep cards and charts in sync.
      fetchAllData();
    });

    socket.on("order_status_updated", (updatedOrder: Order) => {
      console.log("Order update received:", updatedOrder);
      // Update the specific order in the list.
      setLiveOrders((prev) =>
        prev.map((o) =>
          o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o
        )
      );
      // Refetch all dashboard stats to keep cards and charts in sync.
      fetchAllData();
    });

    socket.on("disconnect", () => console.log("Socket disconnected"));

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // Cleanup function to disconnect the socket when the component unmounts.
    return () => {
      socket.disconnect();
    };
    // FIX: The dependency array is simplified. `fetchAllData` is stable due to useCallback.
  }, [cafeId, fetchAllData, isLoading]);

  if (isLoading) {
    return (
      <div className=" min-h-screen p-4 sm:p-6 lg:p-8">
        <DashboardLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className=" min-h-screen p-4 sm:p-6 lg:p-8">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  return (
    <div className=" p-4 sm:p-6 lg:p-8 ">
      <div className="mx-auto max-w-screen-2xl">
        <Header isOpen={isCafeOpen} setIsOpen={setIsCafeOpen} />
        <main className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-100px)] mb-20">
          <div className="xl:col-span-2 space-y-6 h-full">
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
          <div className="h-full flex flex-col mb-20 ">
            <LiveOrders
              orders={liveOrders}
              setOrders={setLiveOrders}
              cafeId={cafeId}
              fetchAllData={fetchAllData}
            />
          </div>
        </main>
      </div>
    </div>
  );
};


export default DashboardPage;