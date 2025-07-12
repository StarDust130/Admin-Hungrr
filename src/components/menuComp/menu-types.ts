// app/(dashboard)/menu/components/menu-types.ts

export interface Category {
  id: number;
  name: string;
  cafeId: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  food_image_url: string;
  is_available: boolean;
  isSpecial: boolean;
  tags: string;
  categoryId: number;
  cafeId: number;
  dietary: string;
  variants: {
    id: number;
    itemId: number;
    name: string; // e.g. "Half", "Full", "1kg"
    price: string;
  }[];
}

export interface PageInfo {
  currentPage: number;
  totalPages: number;
}

export type ViewMode = "grid" | "list";
