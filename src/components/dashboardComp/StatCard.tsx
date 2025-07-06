import React, { FC, ElementType } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ElementType;
  color: string;
  change: number;
}

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
}) => (
  <div className="bg-card border shadow-sm  rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-[1px] dark:hover:shadow-neutral-800/50">
    <div className="flex justify-between items-center mb-2">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <Icon className="h-6 w-6" style={{ color }} />
    </div>
    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
      {value}
    </p>
    <div className="flex items-center text-xs">
      <span
        className={`flex items-center font-semibold ${
          change >= 0 ? "text-emerald-500" : "text-red-500"
        }`}
      >
        {change >= 0 ? (
          <ArrowUp size={14} className="mr-1" />
        ) : (
          <ArrowDown size={14} className="mr-1" />
        )}
        {Math.abs(change)}% vs yesterday
      </span>
    </div>
  </div>
);
