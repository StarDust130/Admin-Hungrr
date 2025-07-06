import { FC } from "react";
import { UtensilsCrossed } from "lucide-react";

export const MostSoldItems: FC<{
  items: { name: string; count: number }[];
}> = ({ items }) => (
  <div className="bg-card border rounded-xl p-5 h-full">
    {/* Title */}
    <div className="mb-4">
      <h3 className="text-base font-semibold text-foreground mb-1">
        🍽️ Top-Selling Dishes Today
      </h3>
      <p className="text-xs text-muted-foreground">
        An overview of your most popular dishes.
      </p>
    </div>

    {/* Content */}
    {items.length === 0 ? (
      <div className="flex-grow flex items-center justify-center text-sm text-muted-foreground h-24">
        No food sold yet.
      </div>
    ) : (
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-rose-100 dark:bg-rose-500/10">
                <UtensilsCrossed className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-sm font-medium text-foreground truncate">
                {item.name}
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {item.count}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                sold
              </span>
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);
