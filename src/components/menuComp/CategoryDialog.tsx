import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { Category } from "./menu-types";
import { createCategory, deleteCategory, getCategoriesByCafe } from "./apiCall";

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
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      const fetchCats = async () => {
        setIsLoading(true);
        try {
          const fetched = await getCategoriesByCafe(cafeId);
          setCategories(fetched || []);
        } catch (error) {
          console.error("Failed to fetch categories", error);
          setCategories([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCats();
    }
  }, [isOpen, cafeId]);

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;
    setIsCreating(true);
    try {
      await createCategory(newCategoryName, cafeId);
      setNewCategoryName("");
      onUpdate(); // Update categories on the main page
      // Refetch categories for this dialog
      const fetched = await getCategoriesByCafe(cafeId);
      setCategories(fetched || []);
    } catch (error) {
      console.error("Failed to create category", error);
      // Optional: show an error toast
    } finally {
      setIsCreating(false);
    }
  };

  const startDelete = (category: Category) => {
    setCategoryToDelete(category);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      onUpdate(); // Update categories on the main page
    } catch (error) {
      console.error("Failed to delete category", error);
    } finally {
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Add new categories or remove existing ones.
            </DialogDescription>
          </DialogHeader>

          {/* Create New Category Form */}
          <div className="pt-4 space-y-2">
            <Label htmlFor="new-category">Add New Category</Label>
            <div className="flex gap-2">
              <Input
                id="new-category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Breads"
                disabled={isCreating}
              />
              <Button
                onClick={handleCreate}
                disabled={isCreating || !newCategoryName}
              >
                {isCreating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add
              </Button>
            </div>
          </div>

          {/* Existing Categories List */}
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Existing Categories</h4>
            {isLoading ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : categories.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                  >
                    <span className="text-sm font-medium">{cat.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startDelete(cat)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No categories found.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={() => setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Deleting the category{" "}
              <span className="font-bold">
                &quot;{categoryToDelete?.name}&quot;
              </span>{" "}
              will also{" "}
              <span className="font-bold text-destructive">
                permanently delete
              </span>{" "}
              all of its associated menu items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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
