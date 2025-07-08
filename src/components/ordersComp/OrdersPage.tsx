/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { Order, PageInfo, Stats, TimeRange, OrderStatus } from "./types";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { FilterControls } from "./FilterControls";
import { StatCards } from "./StatCards";
import { OrderTable } from "./OrdersTable";


// --- API & State ---
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || "/api";
const CAFE_ID = "1"; // Replace with dynamic ID if needed

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const OrdersPage = () => {
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

  const apiParams = useMemo(() => {
    const params = new URLSearchParams();
    if (timeRange) params.set("range", timeRange);
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    return params;
  }, [timeRange, date]);

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
      console.error("Failed to update status, rolling back UI.", error);
      fetchOrders();
    }
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    setDate(undefined);
    setCurrentPage(1);
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setTimeRange(undefined);
    }
    setCurrentPage(1);
  };

  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setDetailsModalOpen(true);
  };

  return (
    <>
      <OrderDetailsModal
        orderId={selectedOrderId}
        isOpen={isDetailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8">
        <FilterControls
          timeRange={timeRange}
          date={date}
          onTimeRangeChange={handleTimeRangeChange}
          onDateChange={handleDateChange}
        />
        <StatCards stats={stats} isLoading={isStatsLoading} />
        <OrderTable
          orders={orders}
          pageInfo={pageInfo}
          isLoading={isLoading}
          activeTab={activeTab}
          searchQuery={searchQuery}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentPage(1);
          }}
          onSearchChange={setSearchQuery}
          onPageChange={setCurrentPage}
          onViewDetails={handleViewDetails}
          onStatusUpdate={handleStatusUpdate}
        />
      </main>
    </>
  );
};

export default OrdersPage;
