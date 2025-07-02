import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
};

export function UnavailableCard({
  item,
  onReactivate,
  onDelete,
}: UnavailableCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-md">
      <CardHeader className="p-0">
        <Image
          width={300}
          height={200}
          src={item.food_image_url ?? "/no_food_placeholder.jpg"}
          alt={item.name}
          className="w-full h-32 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <CardTitle className="text-base font-semibold line-clamp-2">
          {item.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          ₹{parseFloat(item.price as any).toFixed(2)}
        </p>
        {item.category?.name && (
          <Badge variant="outline" className="mt-2">
            {item.category.name}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-2 border-t grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={onReactivate}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reactivate
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
