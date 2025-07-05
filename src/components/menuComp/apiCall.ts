/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { Category, MenuItem } from "./menu-types";
import { CafeSettingsFormValues } from "../cafeSettings/CafePage";

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

// 🔍 Get all categories for a cafe
export const getCategoriesByCafe = async (cafeId: number): Promise<Category[]> => {
  const res = await api.get(`/category/cafe/${cafeId}`);
  // This now works because the backend sends { categories: [...] }
  return res.data.categories || [];
};

// ➕ Create category
export const createCategory = async (name: string, cafeId: number) => {
  const res = await api.post(`/category`, { name, cafeId });
  return res.data;
};

// ✏️ Update category name
// ✅ FIXED: This now correctly sends an object like { name: "New Name" }
export const updateCategory = async (categoryId: number, data: { name: string }) => {
  const res = await api.patch(`/category/${categoryId}`, data);
  return res.data;
};

// ❌ Delete category
export const deleteCategory = async (categoryId: number) => {
  const res = await api.delete(`/category/${categoryId}`);
  return res.data;
};

// ✨ NEW: Update category order
export const updateCategoryOrder = async (orderedCategories: { id: number; order: number }[]) => {
  const res = await api.put("/categories/order", { orderedCategories });
  return res.data;
};


//! -───────────── AI MENU ──────────────

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



export const getCafeByOwner = async (ownerId: string): Promise<Cafe> => {
  try {
    // CORRECTED URL: The path here is now relative to the baseURL in `api.ts`.
    // This will result in a call to: http://localhost:5000/api/cafe/owner/:ownerId
    const response = await api.get(`/cafe/owner/${ownerId}`);
    return response.data.cafe;
  } catch (error) {
    console.error("Failed to fetch cafe data:", error);
    throw new Error("Could not retrieve cafe details. Please check if the server is running and the owner ID is correct.");
  }
};

/**
 * Updates an existing cafe's details.
 */
export const updateCafeDetails = async (
  ownerId: string,
  data: Partial<CafeSettingsFormValues>
): Promise<{ cafe: Cafe }> => { // Expect the updated cafe object back
  try {
    // CORRECTED URL: This will call http://localhost:5000/api/cafe/:ownerId
    const response = await api.patch(`/cafe/${ownerId}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update cafe:", error);
    throw new Error("The cafe settings could not be saved.");
  }
};
export interface Cafe {
  id: number;
  owner_id: string;
  name: string;
  slug: string;
  tagline: string | null;
  openingTime: string | null;
  logoUrl: string;
  bannerUrl: string;
  payment_url: string;
  isPureVeg: boolean;
  address: string;
  gstNo: string | null;
  gstPercentage: number | null;
  phone: string;
  email: string;
  instaID: string | null;
  is_active: boolean;
  rating: string; // Prisma Decimal becomes a string in JSON
  reviews: number;
  created_at: string; // Prisma DateTime becomes a string in JSON
  updated_at: string;
}