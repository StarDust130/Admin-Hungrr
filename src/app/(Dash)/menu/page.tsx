"use client";
import React, { useState, useEffect, FC, FormEvent, useCallback } from "react";
import {
  Utensils,
  PlusCircle,
  MoreVertical,
  Edit,
  Trash2,
  Tag,
  Loader2,
  XCircle,
  LayoutGrid,
  Save,
  List,
  Search,
  Image as ImageIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- TYPE DEFINITIONS (Matching Backend Schema) ---
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
  food_image_url: string; // Matches backend
  is_available: boolean; // Matches backend
  categoryId: number;
  cafeId: number;
}

type MenuFormData = Omit<MenuItem, "id" | "cafeId" | "is_active">;
type CategoryFormData = Omit<Category, "id" | "cafeId">;
type ViewMode = "grid" | "list";

// --- API HELPER ---
const API_BASE_URL = "http://localhost:5000/api/admin";

// --- UI COMPONENTS ---

const MenuCard: FC<{
  item: MenuItem;
  onToggleAvailability: (id: number, currentStatus: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ item, onToggleAvailability, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
    className="border dark:border-neutral-800 rounded-xl overflow-hidden group flex flex-col"
  >
    <div className="relative">
      <img
        src={
          item.food_image_url ||
          "https://placehold.co/600x400/27272a/a1a1aa?text=No+Image"
        }
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div
        className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${
          item.is_available
            ? "bg-green-500/20 text-green-300 border-green-500/30"
            : "bg-red-500/20 text-red-300 border-red-500/30"
        }`}
      >
        {item.is_available ? "Available" : "Unavailable"}
      </div>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">{item.name}</h3>
        <p className="font-semibold text-lg">
          ${parseFloat(item.price).toFixed(2)}
        </p>
      </div>
      <p className="text-sm text-muted-foreground mt-1 flex-grow">
        {item.description}
      </p>
      <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-neutral-800">
        <div className="flex items-center space-x-2">
          <Switch
            checked={item.is_available}
            onCheckedChange={() =>
              onToggleAvailability(item.id, item.is_available)
            }
            aria-label="Toggle Availability"
          />
          <label className="text-xs text-muted-foreground">Live</label>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </motion.div>
);

const MenuListItem: FC<{
  item: MenuItem;
  onToggleAvailability: (id: number, currentStatus: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ item, onToggleAvailability, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="flex items-center p-2 border-b dark:border-neutral-800 hover:bg-muted/50"
  >
    <img
      src={
        item.food_image_url ||
        "https://placehold.co/100x100/27272a/a1a1aa?text=N/A"
      }
      alt={item.name}
      className="w-12 h-12 object-cover rounded-md mr-4"
    />
    <div className="flex-grow">
      <p className="font-semibold">{item.name}</p>
      <p className="text-sm text-muted-foreground">
        ${parseFloat(item.price).toFixed(2)}
      </p>
    </div>
    <div className="hidden md:flex w-32 text-center items-center justify-center">
      <div className="flex items-center space-x-2">
        <Switch
          checked={item.is_available}
          onCheckedChange={() =>
            onToggleAvailability(item.id, item.is_available)
          }
        />
        <span
          className={`text-xs font-semibold ${
            item.is_available ? "text-green-500" : "text-red-500"
          }`}
        >
          {item.is_available ? "Live" : "Hidden"}
        </span>
      </div>
    </div>
    <div className="w-16 text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-red-500">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </motion.div>
);

const CategorySidebar: FC<{
  categories: Category[];
  activeCategory: number | null;
  setActiveCategory: (id: number | null) => void;
  onAddCategory: () => void;
  onEditCategory: (cat: Category) => void;
  onDeleteCategory: (id: number) => void;
  menuItems: MenuItem[];
}> = ({
  categories,
  activeCategory,
  setActiveCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  menuItems,
}) => (
  <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
    <div className="sticky top-20 space-y-4">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-xl font-bold">Categories</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onAddCategory}
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      <div className="space-y-1 pr-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`w-full flex items-center justify-between space-x-3 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeCategory === null
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          <div className="flex items-center space-x-3">
            <LayoutGrid className="h-5 w-5" />
            <span>All Items</span>
          </div>
          <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-muted-foreground/20">
            {menuItems.length}
          </span>
        </button>
        {categories.map((cat) => (
          <div key={cat.id} className="group flex items-center">
            <button
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center justify-between space-x-3 pl-4 pr-2 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5" />
                <span>{cat.name}</span>
              </div>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-muted-foreground/20">
                {menuItems.filter((i) => i.categoryId === cat.id).length}
              </span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditCategory(cat)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteCategory(cat.id)}
                  className="text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  </aside>
);

const FormDialog: FC<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  description: string;
  initialData: any;
  onSave: (data: any) => void;
  children: (
    formData: any,
    setFormData: (data: any) => void
  ) => React.ReactNode;
}> = ({
  isOpen,
  setIsOpen,
  title,
  description,
  initialData,
  onSave,
  children,
}) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {children(formData, setFormData)}
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// --- MAIN PAGE COMPONENT ---
const MenuPage: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState({ categories: true, menu: true });
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const cafeId = 1; // This should be dynamic in a real app

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchCategories = useCallback(async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/category/cafe/${cafeId}`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  }, [cafeId]);

  const fetchMenuItems = useCallback(async () => {
    setLoading((prev) => ({ ...prev, menu: true }));
    try {
      const params = new URLSearchParams();
      if (activeCategory) {
        params.append("categoryId", String(activeCategory));
      }
      if (debouncedSearchQuery) {
        params.append("search", debouncedSearchQuery);
      }

      const response = await fetch(
        `${API_BASE_URL}/menu/cafe/${cafeId}?${params.toString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch menu items");
      const data = await response.json();
      setMenuItems(data.items || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, menu: false }));
    }
  }, [cafeId, activeCategory, debouncedSearchQuery]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const onToggleAvailability = async (
    itemId: number,
    currentStatus: boolean
  ) => {
    const originalItems = [...menuItems];
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, is_available: !currentStatus } : item
      )
    );
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/${itemId}/toggle-availability`,
        { method: "PATCH" }
      );
      if (!response.ok) throw new Error("Failed to toggle availability");
    } catch (err) {
      setMenuItems(originalItems);
      console.error(err);
    }
  };

  const handleOpenMenuModal = (item: MenuItem | null = null) => {
    setEditingMenuItem(item);
    setIsMenuModalOpen(true);
  };

  const handleSaveMenuItem = async (data: any, id?: number) => {
    const method = id ? "PATCH" : "POST";
    const url = id ? `${API_BASE_URL}/menu/${id}` : `${API_BASE_URL}/menu`;

    const payload = {
      name: data.name,
      description: data.description,
      price: String(data.price),
      food_image_url: data.food_image_url,
      categoryId: data.categoryId,
      cafeId,
    };

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
      await fetchMenuItems();
      setIsMenuModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(
        `Failed to save menu item: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const handleDeleteMenuItem = async () => {
    if (itemToDelete === null) return;
    const originalItems = [...menuItems];
    setMenuItems((prev) => prev.filter((item) => item.id !== itemToDelete));
    try {
      const response = await fetch(`${API_BASE_URL}/menu/${itemToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete menu item");
    } catch (err) {
      setMenuItems(originalItems);
      console.error(err);
      alert("Failed to delete menu item. See console for details.");
    } finally {
      setItemToDelete(null);
    }
  };

  const handleOpenCategoryModal = (cat: Category | null = null) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (data: CategoryFormData) => {
    const id = editingCategory?.id;
    const method = id ? "PATCH" : "POST";
    const url = id
      ? `${API_BASE_URL}/category/${id}`
      : `${API_BASE_URL}/category`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, cafeId }),
      });
      if (!response.ok) throw new Error("Failed to save category");
      await fetchCategories();
      setIsCategoryModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save category. See console for details.");
    }
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete === null) return;
    const originalCategories = [...categories];
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete));
    try {
      const response = await fetch(
        `${API_BASE_URL}/category/${categoryToDelete}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete category");
      await fetchMenuItems();
    } catch (err) {
      setCategories(originalCategories);
      console.error(err);
      alert("Failed to delete category. See console for details.");
    } finally {
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="mx-auto w-full">
      <FormDialog
        isOpen={isMenuModalOpen}
        setIsOpen={setIsMenuModalOpen}
        title={editingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
        description="Fill in the details for your menu item."
        initialData={
          editingMenuItem
            ? {
                name: editingMenuItem.name,
                description: editingMenuItem.description,
                price: editingMenuItem.price,
                food_image_url: editingMenuItem.food_image_url,
                is_available: editingMenuItem.is_available,
                categoryId: editingMenuItem.categoryId,
              }
            : {
                name: "",
                description: "",
                price: "",
                food_image_url: "",
                is_available: true,
                categoryId: categories[0]?.id || 0,
              }
        }
        onSave={(data) => handleSaveMenuItem(data, editingMenuItem?.id)}
      >
        {(formData, setFormData) => (
          <>
            <Input
              placeholder="Item Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
              step="0.01"
            />
            <Input
              placeholder="Image URL"
              value={formData.food_image_url}
              onChange={(e) =>
                setFormData({ ...formData, food_image_url: e.target.value })
              }
            />
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: Number(value) })
              }
              value={String(formData.categoryId)}
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
            <div className="flex items-center space-x-2">
              <Switch
                id="availability"
                checked={formData.is_available}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_available: checked })
                }
              />
              <label htmlFor="availability">Available for purchase</label>
            </div>
          </>
        )}
      </FormDialog>

      <FormDialog
        isOpen={isCategoryModalOpen}
        setIsOpen={setIsCategoryModalOpen}
        title={editingCategory ? "Edit Category" : "Add New Category"}
        description="Enter the name for the category."
        initialData={editingCategory || { name: "" }}
        onSave={handleSaveCategory}
      >
        {(formData, setFormData) => (
          <Input
            placeholder="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        )}
      </FormDialog>

      <AlertDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This action will mark the item as inactive but it will remain in
            your records.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMenuItem}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={categoryToDelete !== null}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This will permanently delete the category and all its menu items.
            This action cannot be undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Menu Management
            </h1>
            <p className="text-muted-foreground">
              Organize categories and manage your delicious offerings.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => handleOpenMenuModal()}
            disabled={categories.length === 0}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Menu Item
          </Button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <CategorySidebar
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onAddCategory={() => handleOpenCategoryModal()}
          onEditCategory={handleOpenCategoryModal}
          onDeleteCategory={setCategoryToDelete}
          menuItems={menuItems}
        />

        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {loading.menu || loading.categories ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-16 border-2 border-dashed dark:border-neutral-800 rounded-xl flex flex-col items-center">
              <XCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="font-semibold text-lg">Failed to load menu</p>
              <p className="text-muted-foreground text-sm mt-1">{error}</p>
            </div>
          ) : (
            <AnimatePresence>
              {viewMode === "grid" ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {menuItems.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      onToggleAvailability={onToggleAvailability}
                      onEdit={() => handleOpenMenuModal(item)}
                      onDelete={() => setItemToDelete(item.id)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="border dark:border-neutral-800 rounded-xl"
                >
                  <div className="hidden md:flex items-center p-2 border-b dark:border-neutral-800 bg-muted/50 font-semibold text-sm text-muted-foreground">
                    <div className="w-12 mr-4"></div> {/* Image placeholder */}
                    <div className="flex-grow">Item</div>
                    <div className="w-24 text-center">Toggle</div>
                    <div className="w-24 text-center">Status</div>
                    <div className="w-16 text-right pr-2">Actions</div>
                  </div>
                  {menuItems.map((item) => (
                    <MenuListItem
                      key={item.id}
                      item={item}
                      onToggleAvailability={onToggleAvailability}
                      onEdit={() => handleOpenMenuModal(item)}
                      onDelete={() => setItemToDelete(item.id)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
          {!loading.menu && menuItems.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed dark:border-neutral-800 rounded-xl flex flex-col items-center">
              <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-semibold text-lg">No items found</p>
              <p className="text-muted-foreground text-sm mt-1">
                Try adjusting your search or category filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MenuPage;
