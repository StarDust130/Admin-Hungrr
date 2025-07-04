"use client";

import React from "react";
import Image from "next/image";
import {
  Building2,
  Phone,
  Mail,
  Clock,
  Instagram,
  CreditCard,
  BadgePercent,
  ReceiptText,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Cafe } from "./CafePage";

export const CafeInfoDisplay: React.FC<{ cafe: Cafe }> = ({ cafe }) => (
  <div className="space-y-6 max-w-4xl mx-auto px-4">
    {/* Banner with Logo & Header Overlay */}
    <Card className="relative overflow-hidden p-0 shadow-md">
      {cafe.bannerUrl && (
        <div className="relative h-[200px] w-full">
          <Image
            src={cafe.bannerUrl}
            alt="Cafe Banner"
            fill
            className="object-cover w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-4 p-4 -mt-12 md:-mt-8">
        <Image
          src={cafe.logoUrl || "/placeholder.svg"}
          alt="Logo"
          width={80}
          height={80}
          className="rounded-full border-4 border-background shadow-md bg-background"
        />
        <div className="text-center md:text-left md:ml-4 mt-2 md:mt-0">
          <h2 className="text-xl font-semibold">{cafe.name}</h2>
          <p className="text-muted-foreground text-sm">
            {cafe.tagline || "No tagline set"}
          </p>
          <div className="mt-2 flex gap-2 flex-wrap justify-center md:justify-start text-xs font-medium">
            <StatusBadge label="Active" active={cafe.is_active} emoji="🟢" />
            <StatusBadge label="Pure Veg" active={cafe.isPureVeg} emoji="🌱" />
          </div>
        </div>
      </div>
    </Card>

    {/* Details */}
    <Card className="p-5 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Info icon={<Building2 className="w-4 h-4" />} label="Address">
          {cafe.address}
        </Info>
        <Info icon={<Clock className="w-4 h-4" />} label="Opening Time">
          {cafe.openingTime}
        </Info>
        <Info icon={<Phone className="w-4 h-4" />} label="Phone">
          {cafe.phone}
        </Info>
        <Info icon={<Mail className="w-4 h-4" />} label="Email">
          {cafe.email}
        </Info>
        <Info icon={<Instagram className="w-4 h-4" />} label="Instagram">
          @{cafe.instaID || "N/A"}
        </Info>
        <Info icon={<CreditCard className="w-4 h-4" />} label="Payment URL">
          {cafe.payment_url}
        </Info>
        <Info icon={<ReceiptText className="w-4 h-4" />} label="GST Number">
          {cafe.gstNo}
        </Info>
        <Info icon={<BadgePercent className="w-4 h-4" />} label="GST Rate">
          {cafe.gstPercentage !== null ? `${cafe.gstPercentage}%` : "Not set"}
        </Info>
      </div>
    </Card>
  </div>
);

// Info block
const Info: React.FC<{
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}> = ({ icon, label, children }) => (
  <div className="flex items-start gap-3">
    <div className="text-muted-foreground mt-0.5">{icon}</div>
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">{children || "Not set"}</p>
    </div>
  </div>
);

// Status pill
const StatusBadge: React.FC<{
  label: string;
  active: boolean;
  emoji: string;
}> = ({ label, active, emoji }) => (
  <span
    className={`px-2 py-0.5 rounded-full border text-xs ${
      active
        ? "bg-green-100 text-green-700 border-green-300"
        : "bg-muted text-muted-foreground"
    }`}
  >
    {emoji} {label}
  </span>
);
