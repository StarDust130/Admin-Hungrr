import { z } from "zod";
import React from "react";

export const FormSchema = z.object({
  name: z.string().min(2, "📝 Give your cafe a cool name!"),
  slug: z
    .string()
    .min(3, "🔗 Slug must be 3+ characters.")
    .regex(
      /^[a-z0-9-]+$/,
      "❌ Only use lowercase letters, numbers, and hyphens."
    ),
  tagline: z.string().optional(),
  email: z.string().email("📧 That doesn't look like a valid email."),
  phone: z
    .string()
    .min(10, "📱 Phone number must be 10 digits.")
    .max(10, "📱 Phone number must be exactly 10 digits."),
  logoUrl: z.string().url("🎨 Upload a logo to represent your cafe."),
  bannerUrl: z.string().url("🖼️ Banners welcome your guests — don’t skip it!"),
  address: z.string().min(10, "📍 Where is your cafe? Enter a proper address."),
  openingTime: z.string().optional(),
  gstNo: z.string().optional(),
  gstPercentage: z.coerce.number().optional(),
  payment_url: z
    .string()
    .min(3, "💸 How will customers pay you? Add UPI or link."),
  ipAddress: z.string().optional(),
  instaID: z.string().optional(),
  isPureVeg: z.boolean().optional(),
});

export type OnboardingData = z.infer<typeof FormSchema>;

export interface Step {
  id: number;
  name: string;
  title: string;
  description: string;
  icon: React.ReactElement<{ size?: number }>;
  fields?: (keyof OnboardingData)[];
}
