/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { MenuItem } from "./menu-types";

//! ────────────── MENU ITEM ──────────────

  // 🔄 Toggle availability
  export const toggleMenuItemAvailability = async (itemId: number) => {
    await api.patch(`/menu/${itemId}/toggle-availability`);
  };

  // ➕ Create or ✏️ Update menu item
  export const saveMenuItem = async (data: Partial<MenuItem>) => {
    if (data.id) {
        console.log("menu Data to backend 🫥 :", data);
        
      await api.patch(`/menu/${data.id}`, data);
    } else {
      await api.post(`/menu`, data);
    }
  };

  // ❌ Delete (soft)
  export const deleteMenuItem = async (itemId: number) => {
    await api.delete(`/menu/${itemId}`);
  };

  // ✨ NEW: Fetch Menu Statistics
export const getMenuStats = async (cafeId: number) => {
    const res = await api.get(`/stats/menu/${cafeId}`);
    return res.data.stats;
}

/**
 * Fetches all unavailable (soft-deleted) menu items for a cafe.
 */
export const getUnavailableMenuItems = async (cafeId: number) => {
    const res = await api.get(`/menu/cafe/${cafeId}/unavailable`);
    return res.data.items;
  };
  
  /**
   * Reactivates a soft-deleted menu item.
   */
  export const reactivateMenuItem = async (itemId: number) => {
    await api.patch(`/menu/${itemId}/reactivate`);
  };
  
  /**
   * Permanently deletes a menu item from the database.
   */
  export const hardDeleteMenuItem = async (itemId: number) => {
    await api.delete(`/menu/${itemId}/permanent`);
  };
  

  //! ────────────── CATEGORY ──────────────

  // 🔍 Get all menu items for a cafe
  export const getMenuItemsByCafe = async (cafeId: number) => {
    const res = await api.get(`/menu/cafe/${cafeId}`);
    return res.data.menuItems;
  };

export const getCategoriesByCafe = async (cafeId: number) => {
  const res = await api.get(`/category/cafe/${cafeId}`);
  return res.data.categories;
};

// ➕ Create category
export const createCategory = async (name: string, cafeId: number) => {
  await api.post(`/category`, { name, cafeId });
};

// ✏️ Update category
export const updateCategory = async (categoryId: number, name: string) => {
  await api.patch(`/category/${categoryId}`, { name });
};

// ❌ Delete category
export const deleteCategory = async (categoryId: number) => {
  await api.delete(`/category/${categoryId}`);
};


// apiCall.ts (or your equivalent API utility)

export const processMenuWithAI = async (
  payload: { menuText: string } | { imageBase64: string }
) => {
  // Use the unified endpoint from the backend
  const res = await api.post(`/menu/ai-upload`, payload);
  return res.data;
};

/**
 * Saves the AI-generated menu data to the database in bulk.
 */
export const bulkSaveAIMenu = async (data: any, cafeId: number) => {
  await api.post(`/menu/ai-bulk-save`, { ...data, cafeId });
};