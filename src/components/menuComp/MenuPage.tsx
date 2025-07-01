"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { Separator } from "@/components/ui/separator";
import { Loader2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

import { Category, MenuItem, PageInfo, ViewMode } from "./menu-types";
import { MenuHeader } from "./MenuHeader";
import { MenuControls } from "./MenuControls";
import { MenuGrid } from "./MenuGrid";
import { MenuTable } from "./MenuTable";
import { MenuItemDialog } from "./MenuItemDialog";
import { CategoryManagerDialog } from "./CategoryDialog";
import { MenuStats } from "./StatsCards"; // ✨ Import stats type
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

// ✨ Import the new stats fetcher
import {
  deleteMenuItem,
  getMenuStats,
  saveMenuItem,
  toggleMenuItemAvailability,
} from "./apiCall";

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✨ New state for stats
  const [stats, setStats] = useState<MenuStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

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

  const cafeId =
    typeof window !== "undefined" ? localStorage.getItem("cafeId") : null;

  // ✨ Callback to fetch stats
  const fetchStats = useCallback(async () => {
    if (!cafeId) return;
    setStatsLoading(true);
    try {
      const statsData = await getMenuStats(Number(cafeId));
      setStats(statsData);
    } catch (err) {
      console.error("Failed to fetch stats", err);
      // Don't set a page-level error for stats, just log it
    } finally {
      setStatsLoading(false);
    }
  }, [cafeId]);

  const fetchMenuItems = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      if (!cafeId) {
        setError("Cafe ID is not available.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);
      if (activeCategoryId)
        params.append("categoryId", String(activeCategoryId));

      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_API_URL
          }/menu/cafe/${cafeId}?${params.toString()}`
        );
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        const data = await res.json();
        setMenuItems(data.items || []);
        setPageInfo(data.pageInfo || { currentPage: 1, totalPages: 1 });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch menu items."
        );
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    },
    [cafeId, activeCategoryId, debouncedSearchQuery]
  );

  const fetchCategories = useCallback(async () => {
    if (!cafeId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category/cafe/${cafeId}`
      );
      if (!res.ok) throw new Error("Could not fetch categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
      setError("Could not load categories.");
    }
  }, [cafeId]);

  // ✨ Combined initial fetch
  useEffect(() => {
    if (cafeId) {
      fetchCategories();
      fetchStats();
    }
  }, [cafeId, fetchCategories, fetchStats]);

  useEffect(() => {
    if (cafeId) {
      fetchMenuItems(1);
    }
  }, [debouncedSearchQuery, activeCategoryId, fetchMenuItems, cafeId]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageInfo.totalPages) {
      setPageInfo((prev) => ({ ...prev, currentPage: newPage }));
      fetchMenuItems(newPage);
    }
  };

  const handleToggle = async (id: number) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, is_available: !item.is_available } : item
      )
    );
    try {
      await toggleMenuItemAvailability(id);
      fetchStats(); // Refresh stats after toggle
    } catch (err) {
      console.error("Toggle error", err);
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, is_available: !item.is_available } : item
        )
      );
    }
  };

  const handleSave = async (menuData: Partial<MenuItem>) => {
    try {
      await saveMenuItem(menuData);
      setIsMenuModalOpen(false);
      await fetchMenuItems(pageInfo.currentPage);
      fetchStats(); // Refresh stats after save
    } catch (err) {
      console.error("Save error", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete === null) return;
    try {
      await deleteMenuItem(itemToDelete);
      setItemToDelete(null);
      await fetchMenuItems(pageInfo.currentPage);
      fetchStats(); // Refresh stats after delete
    } catch (err) {
      console.error("Delete error", err);
      setItemToDelete(null);
    }
  };

  const handleManageCategoriesClick = () => {
    if (!cafeId) {
      alert("Cannot manage categories: Cafe ID not found in local storage.");
      return;
    }
    setIsCategoryModalOpen(true);
  };

  if (!cafeId) {
    return (
      <div className="flex h-full flex-col justify-center items-center text-destructive">
        <XCircle className="h-12 w-12 mb-4" />
        <p className="font-semibold text-lg">Cafe ID not found.</p>
        <p className="text-sm text-muted-foreground">
          Please ensure you are logged in and have selected a cafe.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4 p-4 sm:p-6">
      <MenuHeader
        onAddItem={() => {
          setEditingMenuItem(null);
          setIsMenuModalOpen(true);
        }}
        onManageCategories={handleManageCategoriesClick}
        isAddDisabled={categories.length === 0}
        stats={stats}
        statsLoading={statsLoading}
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
            onToggle={handleToggle}
            onEdit={(item) => {
              setEditingMenuItem(item);
              setIsMenuModalOpen(true);
            }}
            onDelete={setItemToDelete}
          />
        ) : (
          <MenuTable
            items={menuItems}
            onToggle={handleToggle}
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
          onSave={handleSave}
        />
      )}

      {isCategoryModalOpen && cafeId && (
        <CategoryManagerDialog
          isOpen={isCategoryModalOpen}
          setIsOpen={setIsCategoryModalOpen}
          cafeId={parseInt(cafeId, 10)}
          onUpdate={() => {
            fetchCategories();
            fetchStats(); // Refresh stats when categories change
          }}
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
              This will hide the item from your menu but not permanently delete
              it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
