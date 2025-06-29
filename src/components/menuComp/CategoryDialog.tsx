import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Category } from "./menu-types";
import { Dialog } from "../ui/dialog";



type CategoryManagerDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  cafeId: number;
  onUpdate: () => void; // Callback to refetch categories on the main page
};

export function CategoryManagerDialog({
  isOpen,
  setIsOpen,
  cafeId,
  onUpdate,
}: CategoryManagerDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      const fetchCats = async () => {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category/cafe/${cafeId}`
        );
        const data = await res.json();
        setCategories(data.categories || []);
        setIsLoading(false);
      };
      fetchCats();
    }
  }, [isOpen, cafeId]);

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName, cafeId }),
    });
    setNewCategoryName("");
    onUpdate();
    // Refetch list inside dialog
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category/cafe/${cafeId}`
    );
    const data = await res.json();
    setCategories(data.categories || []);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category/${categoryToDelete.id}`,
      {
        method: "DELETE",
      }
    );
    setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
    setCategoryToDelete(null);
    onUpdate();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Dialog Content */}
      </Dialog>
      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={() => setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              DANGER: Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. Deleting the category{" "}
              <span className="font-bold">
                &quot;{categoryToDelete?.name}&quot;
              </span>{" "}
              will also{" "}
              <span className="font-bold text-destructive">
                PERMANENTLY DELETE
              </span>{" "}
              all its menu items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
