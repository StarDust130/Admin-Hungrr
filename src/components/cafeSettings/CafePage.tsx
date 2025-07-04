"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "sonner";
import { api } from "@/lib/axios";

// Import the new components
import { PageHeader } from "./PageHeader";
import { CafeInfoDisplay } from "./CafeInfoDisplay";
import { CafeEditForm } from "./CafeEditForm";

// Shadcn UI Imports
import { Skeleton } from "@/components/ui/skeleton";

// --- TYPE DEFINITION (kept here as it's central to this page) ---
export interface Cafe {
  id: number;
  owner_id: string;
  name: string;
  tagline: string | null;
  openingTime: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  payment_url: string | null;
  isPureVeg: boolean;
  address: string;
  gstNo: string | null;
  gstPercentage: number | null;
  phone: string;
  email: string;
  instaID: string | null;
  is_active: boolean;
}

// --- FORM SCHEMA ---
const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  tagline: z.string().max(100).optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  address: z.string().min(10, "Address is required"),
  phone: z.string().length(10, "Must be a 10-digit phone number"),
  email: z.string().email(),
  openingTime: z.string().max(50).optional().nullable(),
  instaID: z.string().max(30).optional().nullable(),
  gstNo: z.string().length(15).optional().or(z.literal("")).nullable(),
  gstPercentage: z.coerce.number().min(0).max(100).optional().nullable(),
  isPureVeg: z.boolean().default(false),
  is_active: z.boolean().default(true),
  payment_url: z.string().url().optional().or(z.literal("")).nullable(),
});
type CafeSettingsFormValues = z.infer<typeof formSchema>;

// --- API FUNCTIONS ---
const getCafeByOwner = async (ownerId: string): Promise<Cafe> => {
  const response = await api.get(`/cafe/owner/${ownerId}`);
  if (response.data?.cafe) return response.data.cafe;
  throw new Error("Cafe data not found.");
};
const updateCafeDetails = async (
  ownerId: string,
  data: Partial<CafeSettingsFormValues>
): Promise<{ cafe: Cafe }> => {
  const response = await api.patch(`/cafe/${ownerId}`, data);
  return response.data;
};

// --- MAIN PAGE ---
export default function CafePage() {
  const [cafeData, setCafeData] = useState<Cafe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const { user, isLoaded } = useUser();

  const formMethods = useForm<CafeSettingsFormValues>({
    resolver: zodResolver(formSchema),
  });
  const {
    formState: { isDirty, isSubmitting },
    reset,
    handleSubmit,
  } = formMethods;

  useEffect(() => {
    if (isLoaded && user) {
      getCafeByOwner(user.id)
        .then((data) => {
          setCafeData(data);
          reset(data);
        })
        .catch((err) => setError(err.message));
    }
  }, [isLoaded, user, reset]);

  const onSubmit = async (values: CafeSettingsFormValues) => {
    if (!user) return toast.error("Authentication error.");
    const changedData = Object.fromEntries(
      Object.entries(values).filter(
        ([key]) =>
          formMethods.getFieldState(key as keyof CafeSettingsFormValues).isDirty
      )
    );
    if (Object.keys(changedData).length === 0) {
      toast.info("No changes were made.");
      return setIsEditMode(false);
    }
    await toast.promise(updateCafeDetails(user.id, changedData), {
      loading: "Saving changes...",
      success: (data) => {
        setCafeData(data.cafe);
        reset(data.cafe);
        setIsEditMode(false);
        return "Cafe updated successfully!";
      },
      error: (err: any) =>
        err.response?.data?.message || "Could not save settings.",
    });
  };

  if (!isLoaded || (!cafeData && !error)) {
    return <Skeleton className="h-[600px] w-full rounded-lg" />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="font-semibold text-destructive">Failed to Load Data</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <FormProvider {...formMethods}>
      <Toaster richColors position="bottom-right" />
      <PageHeader
        isEditMode={isEditMode}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        isFileUploading={isFileUploading}
        onEdit={() => setIsEditMode(true)}
        onSave={handleSubmit(onSubmit)}
        onCancel={() => {
          reset(cafeData || {});
          setIsEditMode(false);
        }}
      />
      <form>
        {isEditMode ? (
          <CafeEditForm setIsFileUploading={setIsFileUploading} />
        ) : (
          <CafeInfoDisplay cafe={cafeData!} />
        )}
      </form>
    </FormProvider>
  );
}
