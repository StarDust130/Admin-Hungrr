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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { OnboardingData } from "./types";

const inputFocusRing =
  "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none";

interface StepWelcomeProps {
  control: Control<OnboardingData>;
  onSlugGenerate: (name: string) => void;
}

export const StepWelcome: React.FC<StepWelcomeProps> = ({
  control,
  onSlugGenerate,
}) => (
  <>
    <FormField
      name="name"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cafe Name</FormLabel>
          <FormControl>
            <Input
              placeholder="e.g. Ek Saath"
              {...field}
              className={inputFocusRing}
              onChange={(e) => {
                field.onChange(e);
                onSlugGenerate(e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      name="slug"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>URL Slug</FormLabel>
          <FormControl>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-secondary text-sm text-muted-foreground h-9">
                hungrr.in/menu/
              </span>
              <Input
                placeholder="ek-saath"
                className={cn("rounded-l-none", inputFocusRing)}
                {...field}
              />
            </div>
          </FormControl>
          <FormDescription>
            🔗 This becomes part of your public menu link — like your online
            address.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      name="tagline"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tagline (Optional)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="e.g. Ek Saath Specialty Coffee & Pizzeria"
              className={inputFocusRing}
              {...field}
            />
          </FormControl>
          <FormDescription>
            ✨ A short, catchy line to describe your vibe.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);
