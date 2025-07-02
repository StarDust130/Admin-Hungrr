import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "./menu-types";
import Image from "next/image";
import { RotateCcw, Trash2 } from "lucide-react";

type UnavailableCardProps = {
  item: MenuItem;
  onReactivate: () => void;
  onDelete: () => void;
  category?: { name: string };
};

export function UnavailableCard({
  item,
  onReactivate,
  onDelete,
  category,
}: UnavailableCardProps) {
  const price = Number(item.price);

  return (
    <Card className="flex flex-col h-full border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Smaller Image */}
      <div className="w-full h-28 relative">
        <Image
          src={item.food_image_url || "/no_food_placeholder.jpg"}
          alt={item.name || "Food item"}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <CardContent className="p-3 pb-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold line-clamp-2">
            {item.name}
          </CardTitle>

          <p className="text-xs text-muted-foreground">
            ₹{!isNaN(price) ? price.toFixed(2) : "0.00"}
          </p>
          {typeof category?.name === "string" && (
            <Badge variant="outline" className="text-[10px] mt-1">
              {category.name}
            </Badge>
          )}
       
        </div>
      </CardContent>

      {/* Footer Buttons */}
      <CardFooter className="p-2 pt-1 border-t flex justify-center gap-2">
        <Button
          onClick={onReactivate}
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reactivate
        </Button>

        <Button
          onClick={onDelete}
          variant="destructive"
          size="sm"
          className="h-7 px-2 text-xs"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
