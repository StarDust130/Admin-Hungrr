"use client";

import { LayoutGrid, Layers, Eye,  Tags, BookX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatsCardsProps = {
  totalItems: number;
  totalCategories: number;
  deactivatedItems: number;
  totalTags?: number;
};

export function StatsCards({
  totalItems,
  totalCategories,
  deactivatedItems,
  totalTags = 0,
}: StatsCardsProps) {
  const activeItems = totalItems - deactivatedItems;

  const stats = [
    {
      label: "Menu Items",
      value: totalItems,
      icon: LayoutGrid,
      color: "text-blue-500",
    },
    {
      label: "Available",
      value: activeItems,
      icon: Eye,
      color: "text-green-500",
    },
    {
      label: "Unavailable",
      value: deactivatedItems,
      icon: BookX,
      color: "text-red-500",
    },
    {
      label: "Categories",
      value: totalCategories,
      icon: Layers,
      color: "text-pink-500",
    },
    {
      label: "Tags",
      value: totalTags,
      icon: Tags,
      color: "text-orange-500",
    },
  ];
  
  
  

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <Card
          key={label}
          className="p-3 flex flex-col justify-between rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out"
        >
          <div className="flex items-center justify-between">
            <p className=" text-xs md:text-sm font-medium md:font-bold">
              {label}
            </p>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Icon className={cn("w-5 h-5", color)} />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </Card>
      ))}
    </div>
  );
}
