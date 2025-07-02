import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Layers, UtensilsCrossed, Archive, Wand2 } from "lucide-react"; // Import Archive icon
import { StatsCards, MenuStats } from "./StatsCards";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MenuHeaderProps = {
  onAddItem: () => void;
  onManageCategories: () => void;
  onShowUnavailable: () => void; // New prop to handle showing the dialog
  onAiUpload: () => void; // Add new prop
  isAddDisabled: boolean;
  stats: MenuStats | null;
  statsLoading: boolean;
};

export function MenuHeader({
  onAddItem,
  onManageCategories,
  onShowUnavailable, // Destructure new prop
  isAddDisabled,
  onAiUpload, // Add new prop
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
            {/* New Unavailable Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAiUpload}
                  className="h-9 cursor-pointer"
                >
                  <Wand2 className="w-4 h-4 mr-1.5 text-purple-500" />
                  AI Menu Upload
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quickly generate your menu with AI assistance</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShowUnavailable}
                  className="h-9 cursor-pointer"
                >
                  <Archive className="w-4 h-4 mr-1.5" />
                  Unavailable
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View and manage deactivated items</p>
              </TooltipContent>
            </Tooltip>

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
                    className="h-9 pointer-events-auto cursor-pointer"
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

        <StatsCards stats={stats} loading={statsLoading} />
      </header>
    </TooltipProvider>
  );
}
