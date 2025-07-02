// AIMenuUploadDialog.tsx (replace the whole file)
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
import { Textarea } from "@/components/ui/textarea"; // Changed from Input
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle } from "lucide-react";
import { processMenuTextWithAI, bulkSaveAIMenu } from "./apiCall"; // Updated import
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AIMenuUploadDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  cafeId: number;
  onSuccess: () => void;
};

export function AIMenuUploadDialog({
  isOpen,
  setIsOpen,
  cafeId,
  onSuccess,
}: AIMenuUploadDialogProps) {
  const [status, setStatus] = useState<
    "idle" | "processing" | "preview" | "saving" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [menuData, setMenuData] = useState<any>(null);
  const [menuText, setMenuText] = useState<string>(""); // State for the text area

  const resetState = () => {
    setStatus("idle");
    setError(null);
    setMenuData(null);
    setMenuText("");
  };

  const handleSubmitText = async () => {
    if (!menuText.trim()) {
      setError("Please paste your menu text before processing.");
      setStatus("error");
      return;
    }

    setStatus("processing");
    setError(null);

    try {
      const data = await processMenuTextWithAI(menuText);
      setMenuData(data);
      setStatus("preview");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to process the menu.");
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
      setTimeout(resetState, 500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save the menu.");
      setStatus("error");
    }
  };

  const renderContent = () => {
    switch (status) {
      case "processing":
        return (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-semibold text-lg">AI is reading your menu...</p>
          </div>
        );
      case "preview":
        return (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <h3 className="font-semibold text-center">
              ✨ AI Generated Menu Preview ✨
            </h3>
            {menuData.categories.map((cat: any, index: number) => (
              <div key={index} className="space-y-2 rounded-lg border p-4">
                <h4 className="font-bold text-primary">{cat.name}</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Dietary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cat.items.map((item: any, itemIndex: number) => (
                      <TableRow key={itemIndex}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>₹{item.price}</TableCell>
                        <TableCell>{item.dietary || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-destructive">
            <AlertTriangle className="h-12 w-12" />
            <p className="font-semibold text-lg">An Error Occurred</p>
            <p className="text-sm text-center">{error}</p>
            <Button variant="outline" onClick={() => setStatus("idle")}>
              Try Again
            </Button>
          </div>
        );
      default: // idle
        return (
          <div className="grid w-full gap-2">
            <Label htmlFor="menu-text">Paste your menu here</Label>
            <Textarea
              id="menu-text"
              placeholder="e.g., Starters&#10;Paneer Tikka - 250&#10;Chicken Lolipop - 300"
              className="h-48"
              value={menuText}
              onChange={(e) => setMenuText(e.target.value)}
            />
            <Button onClick={handleSubmitText} disabled={!menuText.trim()}>
              Process with AI
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) resetState();
        setIsOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI-Powered Menu Creation</DialogTitle>
          <DialogDescription>
            Paste your menu as text, and we'll automatically generate your items
            and categories.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">{renderContent()}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          {status === "preview" && (
            <Button onClick={handleSave} disabled={status === "saving"}>
              {status === "saving" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Looks Good, Save Menu
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
