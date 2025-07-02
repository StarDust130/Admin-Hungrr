import React, { useState, useEffect, FormEvent, useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UploadCloud } from "lucide-react";
import { Category, MenuItem } from "./menu-types";
import { imagekit, fileToBase64 } from "@/lib/imagekit";

// --- Type Definitions ---
type Dietary = "veg" | "non_veg" | "vegan";
type ItemTag =
  | "Spicy"
  | "Sweet"
  | "Bestseller"
  | "Chefs_Special"
  | "Healthy"
  | "Popular"
  | "New"
  | "Jain_Food"
  | "Signature_Dish";

const PREDEFINED_TAGS: ItemTag[] = [
  "Spicy",
  "Sweet",
  "Bestseller",
  "Chefs_Special",
  "Healthy",
  "Popular",
  "New",
  "Jain_Food",
  "Signature_Dish",
];

type MenuItemFormDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialData: MenuItem | null;
  categories: Category[];
  onSave: (data: Partial<MenuItem>) => Promise<void>;
};

// --- Component ---
export function MenuItemDialog({
  isOpen,
  setIsOpen,
  initialData,
  categories,
  onSave,
}: MenuItemFormDialogProps) {
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cafeId =
    typeof window !== "undefined" ? localStorage.getItem("cafeId") : null;

  useEffect(() => {
    if (isOpen) {
      setFormData(
        initialData || {
          name: "",
          price: "",
          is_available: true,
          isSpecial: false,
          dietary: "veg",
          categoryId: categories[0]?.id,
          cafeId: cafeId ? parseInt(cafeId, 10) : undefined,
        }
      );
      setIsUploading(false);
    }
  }, [isOpen, initialData, categories, cafeId]);

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const auth = await fetch("/api/imagekit-auth").then((res) => res.json());
      const fileAsBase64 = await fileToBase64(file);
      const uploadResult = await imagekit.upload({
        file: fileAsBase64,
        fileName: file.name,
        signature: auth.signature,
        token: auth.token,
        expire: auth.expire,
      });
      setFormData((prev) => ({ ...prev, food_image_url: uploadResult.url }));
    } catch (error) {
      console.error("ImageKit upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.cafeId) {
      alert("Error: Cafe ID is missing. Cannot save.");
      return;
    }
    setIsSaving(true);
    try {
      const finalData = { ...formData, price: formData.price || "0" };
      await onSave(finalData);
    } catch (error) {
      console.error("Save error", error);
    }
    setIsSaving(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Menu Item" : "Create New Item"}
          </DialogTitle>
          <DialogDescription>
            Add details and an image for your menu item.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 max-h-[70vh] overflow-y-auto pr-4"
        >
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label>Food Image</Label>
              <div
                className="relative mt-2 w-full h-48 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-center overflow-hidden bg-secondary cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : formData.food_image_url ? (
                  <Image
                    src={formData.food_image_url}
                    alt={formData.name || "Menu item image"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground">
                    <UploadCloud className="mx-auto h-10 w-10" />
                    <p className="mt-2 text-sm font-medium">
                      Click or drag to upload
                    </p>
                  </div>
                )}
                <Input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    handleFileSelect(e.target.files?.[0] || null)
                  }
                  accept="image/png, image/jpeg, image/webp"
                  disabled={isUploading || isSaving}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Masala Dosa"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="A short, tasty description of the item"
                rows={4}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, price: e.target.value }))
                  }
                  placeholder="150.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  name="categoryId"
                  value={String(formData.categoryId || "")}
                  onValueChange={(value) =>
                    setFormData((p) => ({ ...p, categoryId: Number(value) }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dietary">Dietary Type</Label>
                <Select
                  name="dietary"
                  value={formData.dietary || "none"}
                  onValueChange={(value: Dietary | "none") =>
                    setFormData((p) => ({
                      ...p,
                      dietary: value === "none" ? undefined : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="veg">Veg</SelectItem>
                    <SelectItem value="non_veg">Non-Veg</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tag</Label>
                <Select
                  name="tags"
                  // ✅ FIX: The value is a simple string from the state
                  value={formData.tags || "none"}
                  onValueChange={(value: ItemTag | "none") =>
                    setFormData((p) => ({
                      ...p,
                      // ✅ FIX: Store the tag as a single string, NOT an array
                      tags: value === "none" ? undefined : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {PREDEFINED_TAGS.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Switch
                id="isSpecial"
                checked={formData.isSpecial || false}
                onCheckedChange={(checked) =>
                  setFormData((p) => ({ ...p, isSpecial: checked }))
                }
              />
              <Label htmlFor="isSpecial">Mark as a &quot;Special&quot; 🌟</Label>
            </div>
          </div>

          <DialogFooter className="md:col-span-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSaving || isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || isUploading || !formData.categoryId}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
