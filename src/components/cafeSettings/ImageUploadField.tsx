"use client";

import React, { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { imagekit, fileToBase64 } from "@/lib/imagekit";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const handleImageUpload = async (file: File) => {
  try {
    const auth = await fetch("/api/imagekit-auth").then((res) => res.json());
    const base64 = await fileToBase64(file);
    const result = await imagekit.upload({
      file: base64,
      fileName: file.name,
      ...auth,
    });
    return result.url;
  } catch (error) {
    toast.error("Image upload failed.");
    return null;
  }
};

interface ImageUploadFieldProps {
  name: "logoUrl" | "bannerUrl";
  label: string;
  description: string;
  setIsFileUploading: (isUploading: boolean) => void;
  isWide?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  name,
  label,
  description,
  setIsFileUploading,
  isWide,
}) => {
  const { control, setValue } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileSelect = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    setIsFileUploading(true);
    toast.info(`Uploading ${label.toLowerCase()}...`);
    const url = await handleImageUpload(file);
    if (url) {
      setValue(name, url, { shouldValidate: true, shouldDirty: true });
      toast.success(`${label} uploaded!`);
    }
    setIsUploading(false);
    setIsFileUploading(false);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "relative flex-shrink-0 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50",
                isWide ? "w-48 h-24" : "w-24 h-24"
              )}
            >
              {isUploading ? (
                <Loader2 className="animate-spin text-muted-foreground" />
              ) : field.value ? (
                <Image
                  src={field.value}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Change Image"}
              </Button>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
                accept="image/*"
                disabled={isUploading}
              />
              <FormDescription className="mt-2 text-xs">
                {description}
              </FormDescription>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
