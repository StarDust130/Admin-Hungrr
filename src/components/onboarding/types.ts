import { z } from "zod";
import React from "react";

// The main validation schema for your form data
export const FormSchema = z.object({
  name: z.string().min(2, "Every great cafe needs a name!"),
  slug: z
    .string()
    .min(3, "A slug should be at least 3 characters.")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and hyphens are allowed."
    ),
  tagline: z.string().optional(),
  email: z.string().email("Oops! That email doesn't look right."),
  phone: z
    .string()
    .min(10, "Please enter a valid 10-digit phone number.")
    .max(10, "Phone number must be exactly 10 digits."),
  logoUrl: z.string().url("Your logo is your signature. Please upload one."),
  bannerUrl: z
    .string()
    .url("A banner welcomes your customers. Please upload one."),
  address: z.string().min(10, "Where can people find your amazing coffee?"),
  openingTime: z.string().optional(),
  gstNo: z.string().optional(),
  gstPercentage: z.coerce.number().optional(),
  payment_url: z
    .string()
    .min(3, "How will you get paid? Enter a UPI ID or payment link."),
  ipAddress: z.string().optional(),
});

// The inferred type from the schema
export type OnboardingData = z.infer<typeof FormSchema>;

// The interface for defining each step in the onboarding process
export interface Step {
  id: number;
  name: string;
  title: string;
  description: string;
  // This more specific type for `icon` fixes the TypeScript error
  icon: React.ReactElement<{ size?: number }>;
  fields?: (keyof OnboardingData)[];
}
