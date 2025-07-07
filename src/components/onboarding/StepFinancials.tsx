import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OnboardingData } from "./types";

const inputFocusRing =
  "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none";

interface StepFinancialsProps {
  control: Control<OnboardingData>;
}

export const StepFinancials: React.FC<StepFinancialsProps> = ({ control }) => (
  <div className="flex w-full flex-col items-start gap-4">
    <FormField
      name="payment_url"
      control={control}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>UPI ID</FormLabel>
          <FormControl>
            <Input
              placeholder="e.g. 9687456813@ybl"
              className={inputFocusRing}
              {...field}
            />
          </FormControl>
          <FormDescription>
            💸 Add your UPI ID — customers will use this to pay you. ✅
            Double-check it!
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      name="gstNo"
      control={control}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>GST Number (Optional)</FormLabel>
          <FormControl>
            <Input
              placeholder="e.g. 22ABCDE1234F1Z5"
              className={inputFocusRing}
              {...field}
            />
          </FormControl>
          <FormDescription>
            🧾 Add only if you have a GSTIN for billing.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);
