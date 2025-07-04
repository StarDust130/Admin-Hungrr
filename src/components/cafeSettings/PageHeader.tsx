"use client";

import React from "react";
import { Loader2, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  isEditMode: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  isFileUploading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  isEditMode,
  isDirty,
  isSubmitting,
  isFileUploading,
  onEdit,
  onSave,
  onCancel,
}) => (
  <header className="flex items-center justify-between mb-8">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Cafe Settings</h1>
      <p className="text-muted-foreground">
        {isEditMode
          ? "Make changes to your cafe profile below."
          : "View your current cafe profile."}
      </p>
    </div>
    <div className="flex items-center gap-3">
      {isEditMode ? (
        <>
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting || isFileUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={!isDirty || isSubmitting || isFileUploading}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </>
      ) : (
        <Button onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      )}
    </div>
  </header>
);
