import { PieChartIcon } from "lucide-react";
import { FC } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export const OrderStatusPieChart: FC<{
  data: { name: string; value: number; color: string }[];
}> = ({ data }) => (
  <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col h-full">
    <div className="flex items-center mb-4">
      <PieChartIcon className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3" />
      <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
        Live Order Status
      </h3>
    </div>
    {data.length === 0 ? (
      <div className="flex-grow flex items-center justify-center text-gray-500 dark:text-gray-400">
        No orders today.
      </div>
    ) : (
      <div className="flex-grow flex items-center justify-center sm:justify-start">
        <ResponsiveContainer width="50%" height={150}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              paddingAngle={5}
              cornerRadius={5}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="w-50% flex flex-col justify-center space-y-3 pl-4">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center text-sm">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium text-gray-600 dark:text-gray-300 mr-2">
                {entry.name}
              </span>
              <span className="ml-auto font-bold text-gray-800 dark:text-white">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);