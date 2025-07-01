import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  Sparkles,
  XCircle,
  Layers3,
  Tags,
  LayoutGrid,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export type MenuStats = {
  totalItems: number;
  availableItems: number;
  specialItems: number;
  unavailableItems: number;
  totalCategories: number;
  totalTags: number;
};

type StatsCardsProps = {
  stats: MenuStats | null;
  loading: boolean;
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;
  loading: boolean;
}) => (
  <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-1">
      <CardTitle className="text-base font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className={`h-6 w-6 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-1/2" />
      ) : (
        <div className="text-3xl font-semibold text-foreground">{value}</div>
      )}
    </CardContent>
  </Card>
);

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const cardData = [
    {
      title: "Menu Items",
      value: stats?.totalItems,
      icon: LayoutGrid,
      iconColor: "text-emerald-500",
    },
    {
      title: "Available",
      value: stats?.availableItems,
      icon: CheckCircle2,
      iconColor: "text-green-500",
    },
    {
      title: "Special Items",
      value: stats?.specialItems,
      icon: Sparkles,
      iconColor: "text-yellow-500",
    },
    {
      title: "Unavailable",
      value: stats?.unavailableItems,
      icon: XCircle,
      iconColor: "text-rose-500",
    },
    {
      title: "Categories",
      value: stats?.totalCategories,
      icon: Layers3,
      iconColor: "text-sky-500",
    },
    {
      title: "Tags",
      value: stats?.totalTags,
      icon: Tags,
      iconColor: "text-violet-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {cardData.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value ?? 0}
          icon={card.icon}
          iconColor={card.iconColor}
          loading={loading}
        />
      ))}
    </div>
  );
}
