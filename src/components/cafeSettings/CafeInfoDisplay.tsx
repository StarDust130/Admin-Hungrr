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
  <div className="space-y-6 max-w-5xl mx-auto">
    {/* Top: Logo and Name */}
    <Card className="flex flex-col md:flex-row items-center p-6 gap-6 shadow-lg">
      <Image
        src={cafe.logoUrl || "/placeholder.svg"}
        alt="Logo"
        width={96}
        height={96}
        className="rounded-full border-4 border-muted shadow-md"
      />
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold">{cafe.name}</h2>
        <p className="text-muted-foreground">
          {cafe.tagline || "No tagline set"}
        </p>
        <div className="mt-3 flex gap-4 justify-center md:justify-start text-sm font-medium">
          <StatusBadge label="Active" active={cafe.is_active} emoji="🟢" />
          <StatusBadge label="Pure Veg" active={cafe.isPureVeg} emoji="🌱" />
        </div>
      </div>
    </Card>

    {/* Banner */}
    {cafe.bannerUrl && (
      <Image
        src={cafe.bannerUrl}
        alt="Cafe Banner"
        width={1200}
        height={400}
        className="rounded-xl object-cover w-full aspect-[3/1] border shadow-sm"
      />
    )}

    {/* Info Section */}
    <Card className="p-6 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Info icon={<Building2 />} label="Address">
          {cafe.address}
        </Info>
        <Info icon={<Clock />} label="Opening Time">
          {cafe.openingTime}
        </Info>
        <Info icon={<Phone />} label="Phone">
          {cafe.phone}
        </Info>
        <Info icon={<Mail />} label="Email">
          {cafe.email}
        </Info>
        <Info icon={<Instagram />} label="Instagram">
          @{cafe.instaID || "N/A"}
        </Info>
        <Info icon={<CreditCard />} label="Payment URL">
          {cafe.payment_url}
        </Info>
        <Info icon={<ReceiptText />} label="GST Number">
          {cafe.gstNo}
        </Info>
        <Info icon={<BadgePercent />} label="GST Rate">
          {cafe.gstPercentage !== null ? `${cafe.gstPercentage}%` : "Not set"}
        </Info>
      </div>
    </Card>
  </div>
);

// ⬇️ Single Info Block with Icon
const Info: React.FC<{
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}> = ({ icon, label, children }) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-muted rounded-md text-muted-foreground">{icon}</div>
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-muted-foreground text-sm">{children || "Not set"}</p>
    </div>
  </div>
);

// ✅ Badge for Status
const StatusBadge: React.FC<{
  label: string;
  active: boolean;
  emoji: string;
}> = ({ label, active, emoji }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs ${
      active
        ? "bg-green-100 text-green-700 border border-green-300"
        : "bg-muted text-muted-foreground"
    }`}
  >
    {emoji} {label}
  </span>
);
