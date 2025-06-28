// app/(dashboard)/menu/page.tsx
"use client";

import React, { useState, useEffect, FC, FormEvent, useCallback } from "react";
import {
  MoreHorizontal,
  PlusCircle,
  Pencil,
  Trash2,
  Tag as TagIcon,
  Loader2,
  X,
  LayoutGrid,
  List,
  Search,
  AlertTriangle,
  Coffee,
  Star,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
} from "lucide-react";
import { useDebounce } from "use-debounce";

// --- SHADCN/UI COMPONENT IMPORTS ---
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// --- TYPE DEFINITIONS (Matching your Prisma Schema) ---
interface Category {
  id: number;
  name: string;
  cafeId: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  food_image_url: string;
  is_available: boolean;
  isSpecial: boolean;
  tags: string[];
  categoryId: number;
  cafeId: number;
}

type ViewMode = "grid" | "list";

// --- API HELPER ---
const API_BASE_URL = "http://localhost:5000/api/admin";

// --- NEW: HELPER FOR COLORFUL TAGS ---
const tagColorClasses = [
  "border-transparent bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300 hover:bg-sky-200/80",
  "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 hover:bg-amber-200/80",
  "border-transparent bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300 hover:bg-violet-200/80",
  "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 hover:bg-emerald-200/80",
  "border-transparent bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 hover:bg-rose-200/80",
  "border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 hover:bg-indigo-200/80",
];

const getTagColor = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColorClasses[Math.abs(hash % tagColorClasses.length)];
};

// --- CHILD COMPONENTS ---

const MenuCard: FC<{
  item: MenuItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ item, onToggle, onEdit, onDelete }) => (
  <div className="rounded-2xl border bg-background shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full">
    {/* Image */}
    <div className="relative w-full aspect-[4/3] bg-muted">
      <img
        src={
          item.food_image_url ||
          `https://placehold.co/400x300/171717/ffffff?text=${encodeURIComponent(
            item.name
          )}`
        }
        alt={item.name}
        className="h-50 w-full object-cover"
      />
      {item.isSpecial && (
        <Badge className="absolute top-2 left-2 bg-yellow-400 text-yellow-950 text-[10px] px-2 py-0.5 rounded-full shadow">
          <Star className="w-3 h-3 mr-1" /> Special
        </Badge>
      )}
    </div>

    {/* Title + Price + Tags */}
    <div className="p-3 border-t flex-1 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-foreground line-clamp-2">
            {item.name}
          </h3>
          <span className="text-sm font-semibold text-primary whitespace-nowrap">
            ₹{parseFloat(item.price).toFixed(2)}
          </span>
        </div>

        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                className={`text-[10px] px-2 py-0.5 rounded-full ${getTagColor(
                  tag
                )}`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Footer */}
    <div className="p-3 border-t bg-muted/40 flex items-center justify-between">
      <Switch
        id={`toggle-${item.id}`}
        checked={item.is_available}
        onCheckedChange={onToggle}
      />
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



const MenuListItem: FC<{
  item: MenuItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ item, onToggle, onEdit, onDelete }) => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-4">
        <img
          src={item.food_image_url || `https://placehold.co/100x100?text=N/A`}
          alt={item.name}
          className="w-10 h-10 object-cover rounded-md"
        />
        <div className="font-medium">{item.name}</div>
        {item.isSpecial && (
          <Badge variant="outline" className="text-amber-600 border-amber-500">
            <Star className="h-3 w-3 mr-1" /> Special
          </Badge>
        )}
      </div>
    </TableCell>
    <TableCell>${parseFloat(item.price).toFixed(2)}</TableCell>
    <TableCell>
      <div className="flex flex-wrap gap-1">
        {item.tags?.slice(0, 4).map((tag) => (
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
    <TableCell>
      <Switch checked={item.is_available} onCheckedChange={onToggle} />
    </TableCell>
    <TableCell className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Details
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
    </TableCell>
  </TableRow>
);

// --- MAIN PAGE COMPONENT ---
const MenuPage: FC = () => {
  // (State and API logic remains the same as the previous correct version)
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pageInfo, setPageInfo] = useState({ currentPage: 1, totalPages: 1 });
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const cafeId = 1;

  // --- API LOGIC ---
  const fetchMenuItems = useCallback(
    async (
      page = 1,
      categoryId = activeCategoryId,
      search = debouncedSearchQuery
    ) => {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (search) params.append("search", search);
      if (categoryId) params.append("categoryId", String(categoryId));

      try {
        const res = await fetch(
          `${API_BASE_URL}/menu/cafe/${cafeId}?${params.toString()}`
        );
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        const data = await res.json();
        setMenuItems(data.items || []);
        setPageInfo(data.pageInfo || { currentPage: 1, totalPages: 1 });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred while fetching menu items."
        );
      } finally {
        setLoading(false);
      }
    },
    [cafeId, activeCategoryId, debouncedSearchQuery]
  );

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/category/cafe/${cafeId}`);
      if (!res.ok) throw new Error("Could not fetch categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
      setError(
        "Could not load categories. Some features might be unavailable."
      );
    }
  }, [cafeId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    // We create a separate function to avoid dependency array complexities with fetchMenuItems
    const loadData = () => {
      fetchMenuItems(1, activeCategoryId, debouncedSearchQuery);
    };
    loadData();
  }, [activeCategoryId, debouncedSearchQuery, fetchMenuItems]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageInfo.totalPages) {
      fetchMenuItems(newPage);
    }
  };

  const onToggleAvailability = async (itemId: number) => {
    const originalItems = [...menuItems];
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, is_available: !item.is_available }
          : item
      )
    );
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/item/${itemId}/toggle-availability`,
        { method: "PATCH" }
      );
      if (!response.ok) throw new Error("Failed to toggle availability");
    } catch (err) {
      setMenuItems(originalItems); // Revert on error
      alert("Failed to update item availability. Please try again.");
    }
  };

  const handleSaveMenuItem = async (data: Partial<MenuItem>) => {
    const isEditing = !!data.id;
    const url = isEditing
      ? `${API_BASE_URL}/menu/item/${data.id}`
      : `${API_BASE_URL}/menu/item`;
    const method = isEditing ? "PATCH" : "POST";
    const payload = isEditing ? data : { ...data, cafeId };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save menu item");
      }
      setIsMenuModalOpen(false);
      await fetchMenuItems(pageInfo.currentPage);
    } catch (err) {
      alert(
        `Error: ${err instanceof Error ? err.message : "Could not save item."}`
      );
    }
  };

  const handleDeleteMenuItem = async () => {
    if (itemToDelete === null) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/item/${itemToDelete}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to deactivate menu item");
      await fetchMenuItems(pageInfo.currentPage);
    } catch (err) {
      alert("Failed to deactivate item. See console for details.");
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4 sm:p-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menu Editor</h1>
          <p className="text-muted-foreground">
            The central hub for all your culinary creations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            <TagIcon className="mr-2 h-4 w-4" /> Manage Categories
          </Button>
          <Button
            onClick={() => {
              setEditingMenuItem(null);
              setIsMenuModalOpen(true);
            }}
            disabled={categories.length === 0}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center self-end md:self-center space-x-1 border p-1 rounded-md bg-muted">
            <Button
              variant={viewMode === "grid" ? "background" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "background" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant={activeCategoryId === null ? "default" : "outline"}
            onClick={() => setActiveCategoryId(null)}
          >
            All Categories
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              variant={activeCategoryId === cat.id ? "default" : "outline"}
              onClick={() => setActiveCategoryId(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <main className="flex-1">
        {loading ? (
          <div className="flex h-64 justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col justify-center items-center text-destructive">
            <XCircle className="h-12 w-12 mb-4" />
            <p className="font-semibold text-lg">{error}</p>
          </div>
        ) : menuItems.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {menuItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onToggle={() => onToggleAvailability(item.id)}
                  onEdit={() => {
                    setEditingMenuItem(item);
                    setIsMenuModalOpen(true);
                  }}
                  onDelete={() => setItemToDelete(item.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Item</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Live</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <MenuListItem
                      key={item.id}
                      item={item}
                      onToggle={() => onToggleAvailability(item.id)}
                      onEdit={() => {
                        setEditingMenuItem(item);
                        setIsMenuModalOpen(true);
                      }}
                      onDelete={() => setItemToDelete(item.id)}
                    />
                  ))}
                </TableBody>
              </Table>
            </Card>
          )
        ) : (
          <div className="text-center h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
            <PackageOpen className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No Items Found</h3>
            <p>Try adjusting your search or category filters.</p>
          </div>
        )}
      </main>

      {!loading && pageInfo.totalPages > 1 && (
        <footer className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageInfo.currentPage - 1)}
            disabled={pageInfo.currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {pageInfo.currentPage} of {pageInfo.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageInfo.currentPage + 1)}
            disabled={pageInfo.currentPage >= pageInfo.totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </footer>
      )}

      {/* --- DIALOGS & ALERTS --- */}
      {isMenuModalOpen && (
        <MenuItemFormDialog
          isOpen={isMenuModalOpen}
          setIsOpen={setIsMenuModalOpen}
          initialData={editingMenuItem}
          categories={categories}
          onSave={handleSaveMenuItem}
        />
      )}
      {isCategoryModalOpen && (
        <CategoryManagerDialog
          isOpen={isCategoryModalOpen}
          setIsOpen={setIsCategoryModalOpen}
          cafeId={cafeId}
          onUpdate={fetchCategories}
        />
      )}
      <AlertDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will hide this item from your menu. It will not be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMenuItem}
              className="bg-destructive hover:bg-destructive/90"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// --- DIALOG COMPONENTS ---

const MenuItemFormDialog: FC<{
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  initialData: MenuItem | null;
  categories: Category[];
  onSave: (d: Partial<MenuItem>) => Promise<void>;
}> = ({ isOpen, setIsOpen, initialData, categories, onSave }) => {
  const [formData, setFormData] = useState<Partial<MenuItem>>(
    initialData || {}
  );
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(
      initialData || {
        name: "",
        price: "0.00",
        is_available: true,
        isSpecial: false,
        tags: [],
        categoryId: categories[0]?.id,
      }
    );
  }, [initialData, categories, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags?.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), newTag],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) =>
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove),
    }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Menu Item" : "Create New Item"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for your menu item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="price">Price</label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="categoryId">Category</label>
            <Select
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, categoryId: Number(val) }))
              }
              value={String(formData.categoryId)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="(Optional) A brief description of the item."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="food_image_url">Image URL</label>
            <Input
              id="food_image_url"
              name="food_image_url"
              value={formData.food_image_url || ""}
              onChange={handleChange}
              placeholder="(Optional) e.g., https://..."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="tags">Tags</label>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <Badge key={tag} className={getTagColor(tag)}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              id="tags"
              placeholder="Add a tag and press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <label htmlFor="isSpecial">Mark as Special</label>
              <p className="text-xs text-muted-foreground">
                Special items are highlighted in the menu.
              </p>
            </div>
            <Switch
              id="isSpecial"
              checked={formData.isSpecial}
              onCheckedChange={(c) =>
                setFormData((p) => ({ ...p, isSpecial: c }))
              }
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CategoryManagerDialog: FC<{
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  cafeId: number;
  onUpdate: () => void;
}> = ({ isOpen, setIsOpen, cafeId, onUpdate }) => {
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
        const res = await fetch(`${API_BASE_URL}/category/cafe/${cafeId}`);
        const data = await res.json();
        setCategories(data.categories || []);
        setIsLoading(false);
      };
      fetchCats();
    }
  }, [isOpen, cafeId]);

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;
    await fetch(`${API_BASE_URL}/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName, cafeId }),
    });
    setNewCategoryName("");
    onUpdate(); // Refetch categories on the main page
    const res = await fetch(`${API_BASE_URL}/category/cafe/${cafeId}`);
    const data = await res.json();
    setCategories(data.categories || []);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    await fetch(`${API_BASE_URL}/category/${categoryToDelete.id}`, {
      method: "DELETE",
    });
    setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
    setCategoryToDelete(null);
    onUpdate(); // Refetch categories on the main page
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Add or remove your menu categories.
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="space-y-2 py-4 max-h-[300px] overflow-y-auto">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                >
                  <p className="flex-grow">{cat.name}</p>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setCategoryToDelete(cat)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <DialogFooter className="pt-4 border-t">
            <div className="flex w-full gap-2">
              <Input
                placeholder="New category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
              <Button onClick={handleCreate}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              DANGER: Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. Deleting the category{" "}
              <span className="font-bold">"{categoryToDelete?.name}"</span> will
              also{" "}
              <span className="font-bold text-destructive">
                PERMANENTLY DELETE
              </span>{" "}
              all menu items within it.
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
};

export default MenuPage;
