import React from "react";
import { PackageOpen } from "lucide-react";
import { MenuItem } from "./menu-types";
import { MenuCard } from "./MenuCard";

type MenuGridProps = {
  items: MenuItem[];
  onToggle: (id: number) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
};

export function MenuGrid({ items, onToggle, onEdit, onDelete }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
        <PackageOpen className="h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">No Items Found</h3>
        <p>Try adjusting your search or category filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          onToggle={() => onToggle(item.id)}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
        />
      ))}
    </div>
  );
}
