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
import { Badge } from "@/components/ui/badge";
import { Loader2, X, UploadCloud } from "lucide-react";
import { Category, MenuItem } from "./menu-types";
import { imagekit, fileToBase64 } from "@/lib/imagekit";

type Dietary = "veg" | "non_veg" | "vegan";

type MenuItemFormDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialData: MenuItem | null;
  categories: Category[];
  onSave: (data: Partial<MenuItem>) => Promise<void>;
};

export function MenuItemDialog({
  isOpen,
  setIsOpen,
  initialData,
  categories,
  onSave,
}: MenuItemFormDialogProps) {
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
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
          tags: [],
          dietary: "veg",
          categoryId: categories[0]?.id,
          cafeId: cafeId ? parseInt(cafeId, 10) : undefined,
        }
      );
      setImageFile(null);
      setIsUploading(false);
    }
  }, [isOpen, initialData, categories, cafeId]);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setImageFile(file);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !formData.tags?.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), newTag],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const finalData = { ...formData };

    if (imageFile) {
      setIsUploading(true);
      try {
        const auth = await fetch("/api/imagekit-auth").then((res) =>
          res.json()
        );
        const fileAsBase64 = await fileToBase64(imageFile);
        const uploadResult = await imagekit.upload({
          file: fileAsBase64,
          fileName: imageFile.name,
          signature: auth.signature,
          token: auth.token,
          expire: auth.expire,
        });
        finalData.food_image_url = uploadResult.url;
      } catch (error) {
        console.error("ImageKit upload failed:", error);
        alert("Image upload failed. Please try again.");
        setIsSaving(false);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    await onSave(finalData);
    setIsSaving(false);
    setIsOpen(false);
  };

  const imagePreviewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : formData.food_image_url;

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
          {/* --- Left Column: Image & Core Details --- */}
          <div className="space-y-4">
            <div>
              <Label>Food Image</Label>
              {/* ✨ FIX: Changed `aspect-video` to a fixed height `h-48` for consistency */}
              <div
                className="relative mt-2 w-full h-48 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-center overflow-hidden bg-secondary cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : imagePreviewUrl ? (
                  <Image
                    src={imagePreviewUrl}
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

          {/* --- Right Column: Pricing, Category, Tags --- */}
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
              <Label htmlFor="tags">
                General Tags (e.g. spicy, bestseller)
              </Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Type and press Enter"
              />
              <div className="flex flex-wrap gap-1 min-h-[24px] mt-2">
                {formData.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      type="button"
                      className="ml-1"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
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
              <Label htmlFor="isSpecial">
                Mark as a &quot;Special&quot; item 🌟
              </Label>
            </div>
          </div>

          {/* Footer spans both columns */}
          <DialogFooter className="md:col-span-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !formData.categoryId}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
