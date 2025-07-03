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
import { Instagram, Leaf } from "lucide-react"; // Leaf icon for pure veg

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
                placeholder="Aveer Arcade, Nehru Nagar East,  Bhilai, Chhattisgarh,  490020"
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
          <FormLabel>Opening Hours (optional)</FormLabel>
          <FormControl>
            <Input
              placeholder="e.g. 9 AM - 11 PM"
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
              placeholder="e.g. foodgasam@gmail.com"
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 md:col-span-2">
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
                  placeholder="e.g. 81098 00010"
                  className={cn("rounded-l-none", inputFocusRing)}
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              📞 Let customers reach you directly by phone.
            </FormDescription>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="instaID"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Insta ID (optional)</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center px-3 h-9 rounded-l-md border border-r-0 bg-secondary text-sm">
                  <Instagram className="w-4 h-4" />
                </div>
                <Input
                  type="text"
                  placeholder="e.g. eksaathindia"
                  className={cn("rounded-l-none", inputFocusRing)}
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              📸 Share your Instagram handle for more visibility.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Pure Veg Field */}
      <div className="flex flex-col items-start gap-1">
        <FormField
          name="isPureVeg"
          control={control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="accent-green-500 w-4 h-4"
                />
                <FormLabel className="flex items-center gap-1 text-green-500 font-semibold text-sm m-0">
                  <Leaf className="w-4 h-4 text-green-600" />
                  Pure Veg Cafe (optional)
                </FormLabel>
              </div>

              <FormDescription className="text-xs text-muted-foreground mt-1 pl-6">
                🥗 Let customers know you serve only vegetarian food.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  </div>
);
