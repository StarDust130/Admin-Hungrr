import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { Separator } from "@/components/ui/separator";
import { Loader2, XCircle } from "lucide-react";

import {
    Category,
    MenuItem,
    PageInfo,
    ViewMode,
} from "./menu-types";
import { MenuHeader } from "./MenuHeader";
import { MenuControls } from "./MenuControls";
import { MenuGrid } from "./MenuGrid";
import { MenuTable } from "./MenuTable";
import { MenuItemDialog } from "./MenuItemDialog";
import { CategoryManagerDialog } from "./CategoryDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/admin";

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 1,
    totalPages: 1,
  });
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
    async (page = 1) => {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);
      if (activeCategoryId)
        params.append("categoryId", String(activeCategoryId));

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
          err instanceof Error ? err.message : "Failed to fetch menu items."
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
      setError("Could not load categories.");
    }
  }, [cafeId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchMenuItems(1);
  }, [debouncedSearchQuery, activeCategoryId, fetchMenuItems]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageInfo.totalPages) {
      setPageInfo((prev) => ({ ...prev, currentPage: newPage }));
      fetchMenuItems(newPage);
    }
  };

  const onToggleAvailability = async (itemId: number) => {
    /* ... API Call ... */
  };
  const handleSaveMenuItem = async (data: Partial<MenuItem>) => {
    /* ... API Call ... */
  };
  const handleDeleteMenuItem = async () => {
    /* ... API Call ... */
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4 sm:p-6">
      <MenuHeader
        onAddItem={() => {
          setEditingMenuItem(null);
          setIsMenuModalOpen(true);
        }}
        onManageCategories={() => setIsCategoryModalOpen(true)}
        isAddDisabled={categories.length === 0}
      />

      <MenuControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewChange={setViewMode}
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategoryId}
      />

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
        ) : viewMode === "grid" ? (
          <MenuGrid
            items={menuItems}
            onToggle={onToggleAvailability}
            onEdit={(item) => {
              setEditingMenuItem(item);
              setIsMenuModalOpen(true);
            }}
            onDelete={setItemToDelete}
          />
        ) : (
          <MenuTable
            items={menuItems}
            onToggle={onToggleAvailability}
            onEdit={(item) => {
              setEditingMenuItem(item);
              setIsMenuModalOpen(true);
            }}
            onDelete={setItemToDelete}
          />
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
        <MenuItemDialog
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
        onOpenChange={() => setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will hide the item from your menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMenuItem}>
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
