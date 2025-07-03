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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { OnboardingData } from "./types";

const inputFocusRing =
  "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none";

interface StepFinancialsProps {
  control: Control<OnboardingData>;
}

export const StepFinancials: React.FC<StepFinancialsProps> = ({ control }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
    <div className="md:col-span-2">
      <FormField
        name="payment_url"
        control={control}
        render={({ field }) => (
          <FormItem>
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
    </div>

    <FormField
      name="gstNo"
      control={control}
      render={({ field }) => (
        <FormItem>
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

    <FormField
      name="gstPercentage"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>GST Rate</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(parseInt(value))}
            defaultValue={String(field.value)}
          >
            <FormControl>
              <SelectTrigger className={inputFocusRing}>
                <SelectValue placeholder="Select GST %" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="5">5% (Most cafes)</SelectItem>
              <SelectItem value="12">12%</SelectItem>
              <SelectItem value="18">18%</SelectItem>
              <SelectItem value="28">28%</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            📊 Default GST applied to your menu items.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);
