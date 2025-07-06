import { Flame } from "lucide-react";
import { FC } from "react";

export const MostSoldItems: FC<{
  items: { name: string; count: number }[];
}> = ({ items }) => (
  <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-5 h-full">
    <div className="flex items-center mb-4">
      <Flame className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3" />
      <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
        Hot Items Today
      </h3>
    </div>
    {items.length === 0 ? (
      <div className="flex-grow flex items-center justify-center text-gray-500 dark:text-gray-400">
        No items sold yet.
      </div>
    ) : (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.name} className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg">
              <Flame className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                {item.name}
              </p>
            </div>
            <p className="font-bold text-sm text-gray-800 dark:text-white">
              {item.count}{" "}
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                sold
              </span>
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);
