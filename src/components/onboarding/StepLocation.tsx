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
import { cn } from "@/lib/utils";
import { OnboardingData } from "./types";


const inputFocusRing =
  "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none";

interface StepLocationProps {
  control: Control<OnboardingData>;
}

export const StepLocation: React.FC<StepLocationProps> = ({ control }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
    <div className="md:col-span-2">
      <FormField
        name="address"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Address</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. 25 MG Road, Bhilai Chhattisgarh 490006"
                className={inputFocusRing}
                {...field}
              />
            </FormControl>
            <FormDescription>
              📍 Mention your exact cafe location.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    <FormField
      name="openingTime"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Opening Hours</FormLabel>
          <FormControl>
            <Input
              placeholder="e.g., 9 AM - 11 PM"
              className={inputFocusRing}
              {...field}
            />
          </FormControl>
          <FormDescription>⏰ When your cafe opens and closes.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      name="email"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Contact Email</FormLabel>
          <FormControl>
            <Input
              placeholder="e.g., foodgasam@gmail.com"
              type="email"
              className={inputFocusRing}
              {...field}
            />
          </FormControl>
          <FormDescription>
            📧 Customers may reach out to this email.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      name="phone"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Contact Phone</FormLabel>
          <FormControl>
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center px-3 h-9 rounded-l-md border border-r-0 bg-secondary text-sm">
                +91
              </div>
              <Input
                type="tel"
                placeholder="e.g., 98765 43210"
                className={cn("rounded-l-none", inputFocusRing)}
                {...field}
              />
            </div>
          </FormControl>
          <FormDescription>
            📞 Customers may call you here for orders or queries.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);
