/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import {
  Loader2,
  Trash2,
  Pencil,
  Check,
  X,
  GripVertical,
  Info,
  PackageOpen,
} from "lucide-react";
import { Category } from "./menu-types";
import {
  createCategory,
  deleteCategory,
  getCategoriesByCafe,
  updateCategory,
  updateCategoryOrder,
} from "./apiCall";

// ✨ UI/UX REFINED: A dedicated component for the sortable category item
type SortableCategoryItemProps = {
  id: number | string;
  category: Category;
  isEditing: boolean;
  onStartEdit: (category: Category) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (category: Category) => void;
  editingName: string;
  setEditingName: (name: string) => void;
};

function SortableCategoryItem({
  id,
  category,
  isEditing,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  editingName,
  setEditingName,
}: SortableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Style for the item, including smooth transitions and a fade-out effect for the placeholder
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transition-all duration-300 ease-in-out",
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  // Classes for the card, with enhanced hover and dragging states
  const cardClasses = `
    flex items-center justify-between p-3 rounded-xl border bg-card
    transition-all duration-200 ease-in-out
    hover:shadow-lg hover:border-primary/50
    ${
      isDragging
        ? "shadow-xl ring-2 ring-primary ring-offset-background ring-offset-2"
        : "shadow-sm"
    }
  `;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="transform-gpu"
      {...attributes}
    >
      <div className={cardClasses}>
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="h-9"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && onSaveEdit()}
            />
            <Button variant="ghost" size="icon" onClick={onSaveEdit}>
              <Check className="h-5 w-5 text-green-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCancelEdit}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 overflow-hidden">
              <div
                {...listeners}
                className="cursor-grab p-2 rounded-lg text-muted-foreground/60 hover:bg-muted hover:text-muted-foreground transition-colors"
              >
                <GripVertical className="h-5 w-5" />
              </div>
              <span
                className="font-medium text-sm truncate"
                title={category.name}
              >
                {category.name}
              </span>
            </div>
            <div className="flex items-center flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onStartEdit(category)}
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(category)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type CategoryManagerDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  cafeId: number;
  onUpdate: () => void;
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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingName, setEditingName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Prevent drag from starting on button clicks
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = async (event : any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.id === active.id);
      const newIndex = categories.findIndex((cat) => cat.id === over.id);

      const newOrder = arrayMove(categories, oldIndex, newIndex);
      setCategories(newOrder); // Optimistic update

      const orderedCategoriesForApi = newOrder.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      try {
        await updateCategoryOrder(orderedCategoriesForApi);
        onUpdate();
      } catch (error) {
        console.error("Failed to reorder categories", error);
        fetchCats(); // Revert on failure
      }
    }
  };

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
      await updateCategory(editingCategory.id, { name: editingName });
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
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Manage Categories
            </DialogTitle>
            <DialogDescription>
              Add, edit, or remove categories. Drag and drop to change the
              display order on your menu.
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4 space-y-2">
            <Label htmlFor="new-category" className="font-semibold">
              Add New Category
            </Label>
            <div className="flex gap-2">
              <Input
                id="new-category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Breads, Curries, Drinks..."
                disabled={isCreating}
                className="h-10"
              />
              <Button
                onClick={handleCreate}
                disabled={isCreating || !newCategoryName}
                className="h-10 px-6"
              >
                {isCreating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h4 className="text-lg font-semibold">Existing Categories</h4>
            {isLoading ? (
              <div className="flex justify-center items-center h-48 bg-muted/50 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : categories.length > 0 ? (
              <>
                {/* ✨ UI IMPROVEMENT: Enhanced instructional banner */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                  <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold">Pro Tip</h5>
                    <p className="text-xs">
                      Click and hold the grip icon{" "}
                      <GripVertical className="inline-block h-4 w-4 mx-1" /> to
                      drag and reorder categories. The order you set here will
                      be the order customers see on your menu.
                    </p>
                  </div>
                </div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={categories}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-1">
                      {categories.map((cat) => (
                        <SortableCategoryItem
                          key={cat.id}
                          id={cat.id}
                          category={cat}
                          isEditing={editingCategory?.id === cat.id}
                          editingName={editingName}
                          setEditingName={setEditingName}
                          onStartEdit={handleStartEdit}
                          onSaveEdit={handleSaveEdit}
                          onCancelEdit={handleCancelEdit}
                          onDelete={startDelete}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </>
            ) : (
              // ✨ UI IMPROVEMENT: Enhanced empty state
              <div className="text-center py-12 px-4 border-2 border-dashed rounded-xl">
                <div className="mx-auto bg-muted h-16 w-16 rounded-full flex items-center justify-center">
                  <PackageOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-muted-foreground mt-4">
                  No Categories Yet
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your first category using the input above to get started.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
