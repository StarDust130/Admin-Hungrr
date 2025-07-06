import { FC, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/helper";
import { Card } from "../ui/card";

export const HourlyRevenueChart: FC<{
  data: { hour: string; revenue: number }[];
}> = ({ data }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDark(isDark);
    };

    checkDarkMode();

    // Optional: Watch for changes to classList (if using a toggle)
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const axisTickStyle = {
    fill: isDark ? "#ffffff" : "#000000",
    fontSize: 12,
  };

  return (
    <Card className="rounded-xl p-5 xl:col-span-3">
      <div className="mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          📊 Hourly Revenue
        </h3>
        <p className="text-sm text-muted-foreground">
          See how much money you made each hour of the day.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--border))"
          />
          <XAxis
            dataKey="hour"
            axisLine={false}
            tickLine={false}
            tick={axisTickStyle}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={axisTickStyle}
            tickFormatter={(value) => `₹${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
            formatter={(value: number) => [formatCurrency(value), "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
