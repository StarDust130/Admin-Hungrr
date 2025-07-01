import React, { useState, useRef } from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingData } from "./types";
import ImageKit from "imagekit-javascript";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
  authenticationEndpoint: "", // not needed, we call API manually
});

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleImageUpload = async (file: File): Promise<string | null> => {
  if (!file) return null;

  try {
    const auth = await fetch("/api/imagekit-auth").then((res) => res.json());
    const base64 = await fileToBase64(file);

    const result = await imagekit.upload({
      file: base64,
      fileName: file.name,
      signature: auth.signature,
      token: auth.token,
      expire: auth.expire,
    });

    return result.url;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};


interface FileUploadFieldProps {
  control: Control<OnboardingData>;
  setValue: UseFormSetValue<OnboardingData>;
  name: "logoUrl" | "bannerUrl";
  label: string;
  description: string;
  setIsFileUploading: React.Dispatch<React.SetStateAction<boolean>>;
  previewStyle?: "square" | "wide";
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  control,
  setValue,
  name,
  label,
  description,
  setIsFileUploading,
  previewStyle = "square",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isWide = previewStyle === "wide";

  const previewContainerClasses = isWide
    ? "w-full h-40 rounded-lg"
    : "w-30 h-30 rounded-lg";

  const handleFileSelect = async (file: File | null) => {
    if (file) {
      setIsUploading(true);
      setIsFileUploading(true);
      const url = await handleImageUpload(file);
      setValue(name, url || "", { shouldValidate: true });
      setIsUploading(false);
      setIsFileUploading(false);
    }
  };

  const handleDragEvent = (
    e: React.DragEvent<HTMLDivElement>,
    dragging: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvent(e, false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file || null);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div
            onDragEnter={(e) => handleDragEvent(e, true)}
            onDragLeave={(e) => handleDragEvent(e, false)}
            onDragOver={(e) => handleDragEvent(e, true)}
            onDrop={handleDrop}
            className={cn(
              "relative flex items-center justify-center overflow-hidden border-2 border-dashed bg-secondary transition-all rounded-lg",
              previewContainerClasses,
              isDragging && "border-primary ring-2 ring-primary/50"
            )}
          >
            {isUploading ? (
              <Loader2 className="animate-spin text-muted-foreground" />
            ) : field.value ? (
              <img
                src={field.value as string}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <ImageIcon className="mx-auto w-10 h-10 text-muted-foreground" />
                <p className={`mt-2  font-medium ${isWide ? "text-sm" : "text-[10px]"}`}>
                  Click or drag image to upload
                </p>
              </div>
            )}
          </div>

          <div className="mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "📁 Pick an image"}
            </Button>

            <input
              ref={inputRef}
              id={name}
              type="file"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              accept="image/png, image/jpeg, image/webp"
              disabled={isUploading}
            />

            <FormDescription className="mt-2 text-xs">
              📸 {description}
            </FormDescription>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
