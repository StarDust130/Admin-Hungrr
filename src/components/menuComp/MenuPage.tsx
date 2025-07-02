"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { Separator } from "@/components/ui/separator";
import { Loader2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
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

// Component Imports
import { Category, MenuItem, PageInfo, ViewMode } from "./menu-types";
import { MenuHeader } from "./MenuHeader";
import { MenuControls } from "./MenuControls";
import { MenuGrid } from "./MenuGrid";
import { MenuTable } from "./MenuTable";
import { MenuItemDialog } from "./MenuItemDialog";
import { CategoryManagerDialog } from "./CategoryDialog";
import { UnavailableItemsDialog } from "./UnavailableItemsDialog";
import { MenuStats } from "./StatsCards";

// API Call Imports
import {
  deleteMenuItem, // This is the soft delete
  getMenuStats,
  saveMenuItem,
  toggleMenuItemAvailability,
  getUnavailableMenuItems,
  reactivateMenuItem,
  hardDeleteMenuItem,
  getCategoriesByCafe,
} from "./apiCall";
import { AIMenuUploadDialog } from "./AIMenuUploadDialog";

// Main Component
export default function MenuPage() {
  // Core State
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [unavailableItems, setUnavailableItems] = useState<MenuItem[]>([]);
  const [stats, setStats] = useState<MenuStats | null>(null);

  // Loading & Error State
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isUnavailableLoading, setIsUnavailableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI & Filter State
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 1,
    totalPages: 1,
  });
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Dialog & Modal State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null); // For soft delete
  const [itemToHardDelete, setItemToHardDelete] = useState<number | null>(null); // For permanent delete
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isUnavailableModalOpen, setIsUnavailableModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const cafeId =
    typeof window !== "undefined" ? localStorage.getItem("cafeId") : null;

  // --- DATA FETCHING ---
  const fetchAllStats = useCallback(async () => {
    if (!cafeId) return;
    setStatsLoading(true);
    try {
      const statsData = await getMenuStats(Number(cafeId));
      setStats(statsData);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setStatsLoading(false);
    }
  }, [cafeId]);

  const fetchAllCategories = useCallback(async () => {
    if (!cafeId) return;
    try {
      const fetchedCategories = await getCategoriesByCafe(Number(cafeId));
      setCategories(fetchedCategories || []);
    } catch (err) {
      console.error(err);
      setError("Could not load categories.");
    }
  }, [cafeId]);

  const fetchActiveMenuItems = useCallback(
    async (page = 1) => {
      if (!cafeId) {
        setError("Cafe ID is not available.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

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

  const fetchUnavailableItems = useCallback(async () => {
    if (!cafeId) return;
    setIsUnavailableLoading(true);
    try {
      const items = await getUnavailableMenuItems(Number(cafeId));
      setUnavailableItems(items);
    } catch (err) {
      console.error("Failed to fetch unavailable items", err);
    } finally {
      setIsUnavailableLoading(false);
    }
  }, [cafeId]);

  // --- EFFECTS ---
  useEffect(() => {
    if (cafeId) {
      fetchAllCategories();
      fetchAllStats();
    }
  }, [cafeId, fetchAllCategories, fetchAllStats]);

  useEffect(() => {
    if (cafeId) {
      fetchActiveMenuItems(1); // Reset to page 1 on filter change
    }
  }, [debouncedSearchQuery, activeCategoryId, cafeId, fetchActiveMenuItems]);

  // --- HANDLERS ---
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageInfo.totalPages) {
      setPageInfo((prev) => ({ ...prev, currentPage: newPage }));
      fetchActiveMenuItems(newPage);
    }
  };

  const refreshAllData = async () => {
    await fetchActiveMenuItems(pageInfo.currentPage);
    await fetchAllStats();
  };

  const handleToggleAvailability = async (id: number) => {
    const originalItems = [...menuItems];
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, is_available: !item.is_available } : item
      )
    );
    try {
      await toggleMenuItemAvailability(id);
      await fetchAllStats();
    } catch (err) {
      console.error("Toggle error", err);
      setMenuItems(originalItems); // Revert on error
    }
  };

  const handleSaveItem = async (menuData: Partial<MenuItem>) => {
    try {
      await saveMenuItem(menuData);
      setIsMenuModalOpen(false);
      await refreshAllData();
    } catch (err) {
      console.error("Save error", err);
      // Optionally show an error toast to the user
    }
  };

  const handleDeactivateConfirm = async () => {
    if (itemToDelete === null) return;
    try {
      await deleteMenuItem(itemToDelete); // Soft delete
      await refreshAllData();
    } catch (err) {
      console.error("Deactivate error", err);
    } finally {
      setItemToDelete(null);
    }
  };

  const handleReactivateItem = async (itemId: number) => {
    try {
      await reactivateMenuItem(itemId);
      await fetchUnavailableItems(); // Refresh unavailable list
      await refreshAllData(); // Refresh main list and stats
    } catch (err) {
      console.error("Failed to reactivate item", err);
    }
  };

  const handleHardDeleteConfirm = async () => {
    if (itemToHardDelete === null) return;
    try {
      await hardDeleteMenuItem(itemToHardDelete);
      await fetchUnavailableItems(); // Refresh list in the dialog
      await fetchAllStats();
    } catch (err) {
      console.error("Failed to permanently delete item", err);
    } finally {
      setItemToHardDelete(null);
    }
  };

  // --- RENDER ---
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
    <div className="flex flex-col h-screen gap-4 p-4 sm:p-6">
      <MenuHeader
        onAddItem={() => {
          setEditingMenuItem(null);
          setIsMenuModalOpen(true);
        }}
        onManageCategories={() => setIsCategoryModalOpen(true)}
        onShowUnavailable={() => {
          fetchUnavailableItems();
          setIsUnavailableModalOpen(true);
        }}
        isAddDisabled={categories.length === 0}
        stats={stats}
        statsLoading={statsLoading}
        onAiUpload={() => setIsAiModalOpen(true)}
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
            onToggle={handleToggleAvailability}
            onEdit={(item) => {
              setEditingMenuItem(item);
              setIsMenuModalOpen(true);
            }}
            onDelete={setItemToDelete}
          />
        ) : (
          <MenuTable
            items={menuItems}
            onToggle={handleToggleAvailability}
            onEdit={(item) => {
              setEditingMenuItem(item);
              setIsMenuModalOpen(true);
            }}
            onDelete={setItemToDelete}
          />
        )}
      </main>

      {!loading && pageInfo.totalPages > 1 && (
        <footer className="flex items-center justify-center gap-4 pt-5 pb-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageInfo.currentPage - 1)}
            disabled={pageInfo.currentPage <= 1}
            className="cursor-pointer"
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
            className="cursor-pointer"
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
          onSave={handleSaveItem}
        />
      )}

      {isAiModalOpen && cafeId && (
        <AIMenuUploadDialog
          isOpen={isAiModalOpen}
          setIsOpen={setIsAiModalOpen}
          cafeId={parseInt(cafeId, 10)}
          onSuccess={refreshAllData} // Refresh all data on success
        />
      )}

      {isCategoryModalOpen && cafeId && (
        <CategoryManagerDialog
          isOpen={isCategoryModalOpen}
          setIsOpen={setIsCategoryModalOpen}
          cafeId={parseInt(cafeId, 10)}
          onUpdate={async () => {
            const updatedCategories = await getCategoriesByCafe(Number(cafeId));
            setCategories(updatedCategories || []);
            fetchAllStats();
          }}
        />
      )}
      {isUnavailableModalOpen && (
        <UnavailableItemsDialog
          isOpen={isUnavailableModalOpen}
          setIsOpen={setIsUnavailableModalOpen}
          items={unavailableItems}
          isLoading={isUnavailableLoading}
          onReactivate={handleReactivateItem}
          onDelete={async (id: number) => setItemToHardDelete(id)}
        />
      )}
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
              it. You can reactivate it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivateConfirm}>
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={itemToHardDelete !== null}
        onOpenChange={() => setItemToHardDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Permanently Delete Item?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All data for this item will be
              removed forever.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleHardDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
