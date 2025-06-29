import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, List } from "lucide-react";
import { Category, ViewMode } from "./menu-types";

type MenuControlsProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  categories: Category[];
  activeCategoryId: number | null;
  onCategoryChange: (id: number | null) => void;
};

export function MenuControls({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewChange,
  categories,
  activeCategoryId,
  onCategoryChange,
}: MenuControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* 🔍 Search and View Toggle */}
      <div className="flex flex-col md:flex-row items-center gap-2">
        <div className="relative w-full ">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name..."
            className="pl-8 h-9 text-sm"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center space-x-1 border rounded-md p-0.5 bg-muted ml-auto">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewChange("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 🏷️ Category Filter */}
      <div className="flex items-center gap-1.5 flex-wrap text-sm">
        <Button
          size="sm"
          variant={activeCategoryId === null ? "default" : "outline"}
          className="px-3 py-1 rounded-md"
          onClick={() => onCategoryChange(null)}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            size="sm"
            variant={activeCategoryId === cat.id ? "default" : "outline"}
            className="px-3 py-1 rounded-md"
            onClick={() => onCategoryChange(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
