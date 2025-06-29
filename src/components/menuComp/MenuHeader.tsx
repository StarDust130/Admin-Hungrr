// app/(dashboard)/menu/components/MenuHeader.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Tag as TagIcon } from "lucide-react";

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
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Menu Editor</h1>
        <p className="text-muted-foreground">
          The central hub for all your culinary creations.
        </p>
      </div>
      <div className="flex gap-2 self-start sm:self-center">
        <Button variant="outline" onClick={onManageCategories}>
          <TagIcon className="mr-2 h-4 w-4" /> Manage Categories
        </Button>
        <Button onClick={onAddItem} disabled={isAddDisabled}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>
    </header>
  );
}
