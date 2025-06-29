// app/(dashboard)/menu/components/MenuCard.tsx
"use client";

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
import { MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import { MenuItem } from "./menu-types";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper for colorful tags can be in a separate utils file or here if only used here
const tagColorClasses = [
  "border-transparent bg-sky-100 text-sky-800 dark:bg-sky-600/80 dark:text-white hover:bg-sky-200/80",
  "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-600/80 dark:text-white hover:bg-amber-200/80",
  "border-transparent bg-violet-100 text-violet-800 dark:bg-violet-600/80 dark:text-white hover:bg-violet-200/80",
  "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-600/80 dark:text-white hover:bg-emerald-200/80",
  "border-transparent bg-rose-100 text-rose-800 dark:bg-rose-600/80 dark:text-white hover:bg-rose-200/80",
  "border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-600/80 dark:text-white hover:bg-indigo-200/80",
];


const getTagColor = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColorClasses[Math.abs(hash % tagColorClasses.length)];
};

type MenuCardContentProps = {
  item: MenuItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

// Client component wrapper that handles client-side interactions
export function MenuCard({ item }: { item: MenuItem }) {
  const handleToggle = () => {
    // Client-side implementation
    console.log("Toggle item:", item.id);
  };

  const handleEdit = () => {
    // Client-side implementation
    console.log("Edit item:", item.id);
  };

  const handleDelete = () => {
    // Client-side implementation
    console.log("Delete item:", item.id);
  };

  return (
    <MenuCardContent
      item={item}
      onToggle={handleToggle}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

// The actual component implementation without "use client" directive
function MenuCardContent({ item, onToggle, onEdit, onDelete }: MenuCardContentProps) {
    console.log("Image URL:", item);
    
  return (
    <div className="rounded-[10px] overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="relative aspect-[4/3] bg-muted rounded-t-lg overflow-hidden">
        <div className="relative w-full h-[180px]">
          <Image
            width={400}
            height={300}
            src={item.food_image_url ?? "/food_img_placeholder.png"}
            alt={item.name}
            className="w-full h-full object-cover"
          />

          {/* 📸 No Image Placeholder */}
          {!item.food_image_url && (
            <div className="absolute bottom-4 left-14 px-2 py-0.5 bg-neutral-800/70 text-white text-[10px] rounded-sm shadow backdrop-blur-sm">
              📸 No image added
            </div>
          )}

          {/* 🏷️ Tags */}
          {item.tags?.length > 0 && (
            <div className="absolute top-2 right-2 flex gap-1 flex-wrap">
              {item.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  className={`text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm ${getTagColor(
                    tag
                  )}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* ⭐ Special Badge */}
        {item.isSpecial && (
          <Badge
            className="absolute bottom-2 left-2 !bg-amber-400 text-amber-900 shadow text-[10px] px-2 py-0.5"
            variant="default"
          >
            <Star className="h-3 w-3 mr-1" /> Special
          </Badge>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold leading-tight line-clamp-2 text-sm">
              {item.name}
            </h3>
            <span className="font-bold text-primary whitespace-nowrap text-sm">
              ₹{parseFloat(item.price).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 border-t bg-muted/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            id={`toggle-card-${item.id}`}
            checked={item.is_available}
            onCheckedChange={onToggle}
          />
          <label
            htmlFor={`toggle-card-${item.id}`}
            className="text-[11px] text-muted-foreground"
          >
            <Tooltip>
              <TooltipTrigger>
                {item.is_available
                  ? "Visible to customers"
                  : "Hidden from customers"}
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {item.is_available
                    ? "This item is shown in the menu."
                    : "This item is hidden from customers."}
                </p>
              </TooltipContent>
            </Tooltip>
          </label>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Deactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
