import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Layers, UtensilsCrossed } from "lucide-react";
import { StatsCards, MenuStats } from "./StatsCards"; // Import new component and type
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MenuHeaderProps = {
  onAddItem: () => void;
  onManageCategories: () => void;
  isAddDisabled: boolean;
  stats: MenuStats | null; // ✨ Accept stats data
  statsLoading: boolean; // ✨ Accept loading state for stats
};

export function MenuHeader({
  onAddItem,
  onManageCategories,
  isAddDisabled,
  stats,
  statsLoading,
}: MenuHeaderProps) {
  return (
    <TooltipProvider>
      <header className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
              Menu Editor
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your delicious creations and view key stats at a glance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onManageCategories}
                  className="h-9 cursor-pointer"
                >
                  <Layers className="w-4 h-4 mr-1.5" />
                  Categories
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add or edit menu categories</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    size="sm"
                    onClick={onAddItem}
                    disabled={isAddDisabled}
                    className="h-9 pointer-events-auto cursor-pointer" // Ensure div allows tooltip
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Item
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isAddDisabled
                    ? "Please create a category first"
                    : "Create a new menu item"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* ✨ Render the new StatsCards component with data */}
        <StatsCards stats={stats} loading={statsLoading} />
      </header>
    </TooltipProvider>
  );
}
