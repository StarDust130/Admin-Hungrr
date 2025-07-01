import React, { useState, useEffect, useCallback } from "react";
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
import { Loader2, Trash2, Pencil, Check, X } from "lucide-react";
import { Category } from "./menu-types";
import {
  createCategory,
  deleteCategory,
  getCategoriesByCafe,
  updateCategory, // Import the update function
} from "./apiCall";

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

  // ✨ State for inline editing
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingName, setEditingName] = useState("");

  const fetchCats = useCallback(async () => {
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
  }, [cafeId]);

  useEffect(() => {
    if (isOpen) {
      fetchCats();
    }
  }, [isOpen, fetchCats]);

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;
    setIsCreating(true);
    try {
      await createCategory(newCategoryName, cafeId);
      setNewCategoryName("");
      onUpdate();
      await fetchCats();
    } catch (error) {
      console.error("Failed to create category", error);
    } finally {
      setIsCreating(false);
    }
  };

  // ✨ Handlers for starting and saving an edit
  const handleStartEdit = (category: Category) => {
    setEditingCategory(category);
    setEditingName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditingName("");
  };

  const handleSaveEdit = async () => {
    if (!editingCategory || !editingName.trim()) return;

    try {
      await updateCategory(editingCategory.id, editingName);
      handleCancelEdit();
      onUpdate();
      await fetchCats();
    } catch (error) {
      console.error("Failed to update category", error);
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
      onUpdate();
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
              Add, edit, or remove your menu categories.
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4 space-y-2">
            <Label htmlFor="new-category">Add New Category</Label>
            <div className="flex gap-2">
              <Input
                id="new-category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Breads, Curries..."
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
                    {editingCategory?.id === cat.id ? (
                      // ✨ Editing View
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-8"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSaveEdit}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      // ✨ Display View
                      <>
                        <span className="text-sm font-medium">{cat.name}</span>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStartEdit(cat)}
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startDelete(cat)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No categories found. Add one to get started.
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
