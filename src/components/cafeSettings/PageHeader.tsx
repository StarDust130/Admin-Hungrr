import React, { useState } from "react";
import { Loader2, Pencil, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

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
}) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">☕ Cafe Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isEditMode
            ? "Editing in progress... Save once you're happy 😄"
            : "Your cafe profile overview. Ready to tweak something?"}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {isEditMode ? (
          <>
            <Button
              variant="outline"
              className=" px-5 py-2 text-base"
              onClick={onCancel}
              disabled={isSubmitting || isFileUploading}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  className=" px-5 py-2 text-base"
                  disabled={!isDirty || isSubmitting || isFileUploading}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-5 w-5" />
                  )}
                  Save Changes
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-sm ">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg">
                    ✨ Want to save your updates?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-muted-foreground">
                    These changes will update your cafe profile right away.
                    Ready to roll? 🚀
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-md">
                    Not Yet
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setOpen(false);
                      onSave();
                    }}
                    className="rounded-md"
                  >
                    Yes, Save It! 🎉
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <Button onClick={onEdit} className=" px-5 py-2 text-base">
            <Pencil className="mr-2 h-5 w-5" />
            Edit Profile
          </Button>
        )}
      </div>
    </header>
  );
};
