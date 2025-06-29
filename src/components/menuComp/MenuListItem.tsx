import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import { MenuItem } from "./menu-types";
import Image from "next/image";

// Re-using the same helper function for consistency
const tagColorClasses = [
  "border-transparent bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300",
  // ... same colors as in MenuCard
];
const getTagColor = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++)
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return tagColorClasses[Math.abs(hash % tagColorClasses.length)];
};

type MenuListItemProps = {
  item: MenuItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function MenuListItem({
  item,
  onToggle,
  onEdit,
  onDelete,
}: MenuListItemProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-4">
          <Image
            width={50}
            height={50}
            src={item.food_image_url || `/no_image.png`}
            alt={item.name}
            className="w-10 h-10 object-cover rounded-md hidden sm:block"
          />
          <div className="flex flex-col">
            <span className="font-medium">{item.name}</span>
            {item.isSpecial && (
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-500 w-fit text-xs mt-1"
              >
                <Star className="h-3 w-3 mr-1" /> Special
              </Badge>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        ₹{parseFloat(item.price).toFixed(2)}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
          {item.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} className={getTagColor(tag)}>
              {tag}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={item.is_available ? "default" : "destructive"}>
          {item.is_available ? "Live" : "Hidden"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Switch checked={item.is_available} onCheckedChange={onToggle} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
