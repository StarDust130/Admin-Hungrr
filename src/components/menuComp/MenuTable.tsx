import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PackageOpen } from "lucide-react";
import { MenuItem } from "./menu-types";
import { MenuListItem } from "./MenuListItem";

type MenuTableProps = {
  items: MenuItem[];
  onToggle: (id: number) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
};

export function MenuTable({
  items,
  onToggle,
  onEdit,
  onDelete,
}: MenuTableProps) {
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
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Item</TableHead>
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead className="hidden lg:table-cell">Tags</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <MenuListItem
              key={item.id}
              item={item}
              onToggle={() => onToggle(item.id)}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
