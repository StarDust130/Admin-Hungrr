"use client";

import React from "react";
import Image from "next/image";
import {
  Building,
  Phone,
  Mail,
  Clock,
  Globe,
  Wallet,
  BadgePercent,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cafe } from "./page"; // Import the type from the main page

export const CafeInfoDisplay: React.FC<{ cafe: Cafe }> = ({ cafe }) => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
    <div className="xl:col-span-1 space-y-6">
      <Card className="text-center">
        <CardContent className="p-6">
          <Image
            src={cafe.logoUrl || "/placeholder.svg"}
            alt="Logo"
            width={108}
            height={108}
            className="bg-background rounded-full border-4 border-card mx-auto shadow-lg"
          />
          <h2 className="text-2xl font-bold mt-4">{cafe.name}</h2>
          <p className="text-muted-foreground min-h-[20px]">{cafe.tagline}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Status & Settings</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-3">
            <p className="font-medium">Cafe Active</p>
            {cafe.is_active ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div className="flex items-center justify-between py-3">
            <p className="font-medium">Pure Veg</p>
            {cafe.isPureVeg ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    <div className="xl:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle>Cafe Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cafe.bannerUrl && (
            <Image
              src={cafe.bannerUrl}
              alt="Banner"
              width={1600}
              height={600}
              className="rounded-xl aspect-video object-cover border"
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 pt-4">
            <InfoField icon={<Building />} label="Address">
              {cafe.address}
            </InfoField>
            <InfoField icon={<Clock />} label="Opening Hours">
              {cafe.openingTime}
            </InfoField>
            <InfoField icon={<Phone />} label="Phone">
              {cafe.phone}
            </InfoField>
            <InfoField icon={<Mail />} label="Email">
              {cafe.email}
            </InfoField>
            <InfoField icon={<Globe />} label="Instagram">
              @{cafe.instaID || "N/A"}
            </InfoField>
            <InfoField icon={<Wallet />} label="Payment URL">
              {cafe.payment_url}
            </InfoField>
            <InfoField icon={<p className="font-bold">G</p>} label="GST Number">
              {cafe.gstNo}
            </InfoField>
            <InfoField icon={<BadgePercent />} label="GST Rate">
              {cafe.gstPercentage !== null
                ? `${cafe.gstPercentage}%`
                : "Not set"}
            </InfoField>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const InfoField: React.FC<{
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}> = ({ icon, label, children }) => (
  <div className="flex gap-4">
    <div className="text-muted-foreground flex-shrink-0 mt-1">{icon}</div>
    <div className="space-y-1">
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{children || "Not set"}</p>
    </div>
  </div>
);
