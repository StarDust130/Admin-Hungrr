"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle } from "lucide-react";
import { processMenuWithAI, bulkSaveAIMenu } from "./apiCall";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Type Definitions ---
interface MenuItem {
  name: string;
  price: number;
  description: string | null;
  dietary: "veg" | "non_veg";
}
interface Category {
  name: string;
  items: MenuItem[];
}
interface AIMenuResponse {
  categories: Category[];
}
type DialogStatus = "idle" | "processing" | "preview" | "saving" | "error";

export function AIMenuUploadDialog({
  isOpen,
  setIsOpen,
  cafeId,
  onSuccess,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  cafeId: number;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState<DialogStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [menuData, setMenuData] = useState<AIMenuResponse | null>(null);
  const [menuText, setMenuText] = useState<string>("");

  const resetState = () => {
    setStatus("idle");
    setError(null);
    setMenuData(null);
    setMenuText("");
  };

  const handleSubmit = async () => {
    if (!menuText.trim()) {
      setError("Please paste menu text before processing.");
      setStatus("error");
      return;
    }
    setStatus("processing");
    setError(null);
    try {
      const data = await processMenuWithAI({ menuText });
      if (!data || !Array.isArray(data.categories)) {
        throw new Error(
          "AI returned an invalid data structure. Please check the format of your pasted text and try again."
        );
      }
      setMenuData(data);
      setStatus("preview");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unknown error occurred."
      );
      setStatus("error");
    }
  };

  const handleSave = async () => {
    if (!menuData) return;
    setStatus("saving");
    try {
      await bulkSaveAIMenu(menuData, cafeId);
      onSuccess();
      setIsOpen(false);
      setTimeout(resetState, 300);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save the menu.");
      setStatus("error");
    }
  };

  const renderInitialView = () => (
    <div className="grid w-full gap-2">
      <Label htmlFor="menu-text">Paste your full menu text below</Label>
      <Textarea
        id="menu-text"
        placeholder={`Provide clear categories and items. For example:

Starters
Paneer Tikka - 250
Chicken Lollipop - 300

Main Course
Butter Chicken - 450
Shahi Paneer - 400`}
        className="h-48 text-sm font-mono"
        value={menuText}
        onChange={(e) => setMenuText(e.target.value)}
      />
      <p className="text-xs text-muted-foreground">
        The AI will create items, categories, and descriptions for you.
      </p>
    </div>
  );

  const renderLoadingView = (text: string) => (
    <div className="flex flex-col items-center justify-center h-48 gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="font-semibold text-lg">{text}</p>
    </div>
  );

  const renderErrorView = () => (
    <div className="flex flex-col items-center justify-center h-48 gap-4 text-destructive">
      <AlertTriangle className="h-12 w-12" />
      <p className="font-semibold text-lg">An Error Occurred</p>
      <p className="text-sm text-center max-w-sm">{error}</p>
    </div>
  );

  const renderPreviewView = () => (
    <div className="space-y-4 max-h-[60vh] w-full overflow-y-auto pr-2">
      <h3 className="font-semibold text-center text-lg">
        ✨ AI Generated Menu Preview ✨
      </h3>
      {menuData?.categories.map((cat, index) => (
        <div key={index} className="space-y-2 rounded-lg border p-4 shadow-sm">
          <h4 className="font-bold text-primary text-md">
            Category: {cat.name}
          </h4>
          {Array.isArray(cat.items) && cat.items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Details</TableHead>
                  <TableHead className="w-[100px]">Price</TableHead>
                  <TableHead className="w-[100px]">Dietary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cat.items.map((item, itemIndex) => (
                  <TableRow key={itemIndex}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </div>
                    </TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell className="capitalize">{item.dietary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground px-2 py-4">
              No items were found for this category.
            </p>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) resetState();
        setIsOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>AI-Powered Menu Creation</DialogTitle>
          <DialogDescription>
            Paste your menu as text, and the AI will build it for you.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 min-h-[250px] flex items-center justify-center">
          {status === "idle" && renderInitialView()}
          {status === "processing" &&
            renderLoadingView("AI is reading your menu...")}
          {status === "saving" && renderLoadingView("Saving your menu...")}
          {status === "error" && renderErrorView()}
          {status === "preview" && renderPreviewView()}
        </div>

        <DialogFooter>
          {status === "error" ? (
            <Button variant="outline" onClick={resetState}>
              Start Over
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={status === "processing" || status === "saving"}
            >
              Cancel
            </Button>
          )}

          {status === "idle" && (
            <Button onClick={handleSubmit} disabled={!menuText.trim()}>
              Process with AI
            </Button>
          )}
          {status === "preview" && (
            <Button onClick={handleSave}>Looks Good, Save Menu</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
