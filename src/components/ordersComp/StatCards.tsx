
import React from "react";
import {
  DollarSign,
  ShoppingCart,
  LineChart,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Stats } from "./types";



const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    value
  );

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
}) => (
  <Card className="h-[110px] overflow-hidden">
    <CardContent className="p-3 flex flex-col justify-center h-full gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-xl font-semibold leading-tight">{value}</p>
        {change && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" /> {change}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);
  
  

const StatCardSkeleton: React.FC = () => (
  <Card>
    <CardContent className="p-4">
      <Skeleton className="h-4 w-2/3 mb-2" />
      <Skeleton className="h-6 w-1/3" />
    </CardContent>
  </Card>
);

interface StatCardsProps {
  stats: Stats | null;
  isLoading: boolean;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
};
