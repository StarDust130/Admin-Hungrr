import { FC } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export const OrderStatusPieChart: FC<{
  data: { name: string; value: number; color: string }[];
}> = ({ data }) => (
  <div className="bg-card border rounded-xl p-5 flex flex-col h-full">
    {/* Header */}
    <div className="mb-4">
      <h3 className="text-base font-semibold text-foreground mb-1">
        📦 Live Order Breakdown
      </h3>
      <p className="text-xs text-muted-foreground">
        Real-time overview of current order statuses.
      </p>
    </div>

    {/* No Data */}
    {data.length === 0 ? (
      <div className="flex-grow flex items-center justify-center text-sm text-muted-foreground">
        No orders placed yet today.
      </div>
    ) : (
      <div className="flex-grow flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-6">
        {/* Pie Chart */}
        <ResponsiveContainer width={150} height={150}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              paddingAngle={4}
              cornerRadius={4}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-col justify-center space-y-3">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center text-sm">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium text-foreground mr-2">
                {entry.name}
              </span>
              <span className="ml-auto font-semibold text-muted-foreground">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
