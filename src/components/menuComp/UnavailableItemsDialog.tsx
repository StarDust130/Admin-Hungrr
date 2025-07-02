import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, PackageX } from "lucide-react";
import { MenuItem } from "./menu-types";
import { UnavailableCard } from "./UnavailableCard";

type UnavailableItemsDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  items: MenuItem[];
  isLoading: boolean;
  onReactivate: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export function UnavailableItemsDialog({
  isOpen,
  setIsOpen,
  items,
  isLoading,
  onReactivate,
  onDelete,
}: UnavailableItemsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Unavailable Menu Items</DialogTitle>
          <DialogDescription>
            Reactivate items to make them available on the menu again or
            permanently delete them.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <UnavailableCard
                  key={item.id}
                  item={item}
                  onReactivate={() => onReactivate(item.id)}
                  onDelete={() => onDelete(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center h-48 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
              <PackageX className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold">No Unavailable Items</h3>
              <p>All your menu items are active.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
