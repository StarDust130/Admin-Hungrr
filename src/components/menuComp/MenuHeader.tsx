"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Tags, ChefHat, Layers, UtensilsCrossed } from "lucide-react";
import { StatsCards } from "./StatsCards";

type MenuHeaderProps = {
  onAddItem: () => void;
  onManageCategories: () => void;
  isAddDisabled: boolean;
};

export function MenuHeader({
  onAddItem,
  onManageCategories,
  isAddDisabled,
}: MenuHeaderProps) {
  return (
    <header className="space-y-4 sm:space-y-2">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
            Menu Editor
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your delicious creations.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 ">
          <Button
            variant="outline"
            size="sm"
            onClick={onManageCategories}
            className="h-8 text-xs cursor-pointer"
          >
            <Layers className="w-4 h-4 mr-1" />
            Categories
          </Button>
          <Button
            variant="outline"
            size="sm"
            // onClick={}
            className="h-8 text-xs cursor-pointer"
          >
            <Tags className="w-4 h-4 mr-1" />
            Tags
          </Button>
          <Button
            size="sm"
            onClick={onAddItem}
            disabled={isAddDisabled}
            className="h-8 text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats below on mobile, inline on desktop */}
      <StatsCards totalItems={120} totalCategories={10} deactivatedItems={5} totalTags={4} />
    </header>
  );
}
