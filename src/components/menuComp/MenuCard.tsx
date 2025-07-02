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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const tagColorClasses = [
  "border-transparent bg-sky-100 text-sky-800 dark:bg-sky-600/80 dark:text-white hover:bg-sky-200/80",
  "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-600/80 dark:text-white hover:bg-amber-200/80",
  "border-transparent bg-violet-100 text-violet-800 dark:bg-violet-600/80 dark:text-white hover:bg-violet-200/80",
];

// Simple hash function to pick a color
const getTagColor = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColorClasses[Math.abs(hash % tagColorClasses.length)];
};

type MenuCardProps = {
  item: MenuItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function MenuCard({ item, onToggle, onEdit, onDelete }: MenuCardProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="rounded-[10px] overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
        <div className="relative">
          <Image
            width={400}
            height={300}
            src={item.food_image_url ?? "/no_food_placeholder.jpg"}
            alt={item.name}
            className="w-full h-40 object-cover"
          />
          {/* ✨ FIX: Handle a single tag string instead of an array */}
          {item.tags && (
            <div className="absolute top-2 right-2">
              <Badge className={`text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm ${getTagColor(item.tags)}`}>
                {item.tags.replace(/_/g, " ")}
              </Badge>
            </div>
          )}
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
                ₹{parseFloat(item.price as any).toFixed(2)}
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
             <Tooltip>
                <TooltipTrigger asChild>
                   <label htmlFor={`toggle-card-${item.id}`} className="text-xs text-muted-foreground cursor-pointer">
                      {item.is_available ? "Live" : "Hidden"}
                   </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {item.is_available
                      ? "This item is visible to customers."
                      : "This item is hidden from customers."}
                  </p>
                </TooltipContent>
              </Tooltip>
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
    </TooltipProvider>
  );
}
