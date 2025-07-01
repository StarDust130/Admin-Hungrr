import React from "react";
import {
  Mail,
  Phone,
  Home,
  Clock,
  Link as LinkIcon,
  ScanLine,
  Percent,
  Landmark,
} from "lucide-react";
import { OnboardingData } from "./types"; // Assuming types are in a shared file

// --- PROPS DEFINITION ---
interface ReviewStepProps {
  getValues: () => OnboardingData;
}

// --- SUB-COMPONENT for displaying each piece of information ---
const InfoItem = ({
  icon,
  label,
  value,
}: {
  // This more specific type fixes the TypeScript error with React.cloneElement
  icon: React.ReactElement<{ size?: number; className?: string }>;
  label: string;
  value?: string | number;
}) =>
  value ? (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2 mt-1 font-medium text-sm">
        {React.cloneElement(icon, {
          size: 16,
          className: "text-muted-foreground",
        })}
        <span>{value}</span>
      </div>
    </div>
  ) : null;

// --- MAIN REVIEW STEP COMPONENT ---
export const ReviewStep: React.FC<ReviewStepProps> = ({ getValues }) => {
  const data = getValues();

  return (
    <div className="border rounded-xl overflow-hidden bg-card transition-all">
      {/* Banner Section */}
      <div className="h-32 bg-secondary overflow-hidden flex items-center justify-center">
        {data.bannerUrl ? (
          <img
            src={data.bannerUrl}
            alt="Cafe Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-sm text-muted-foreground">No banner uploaded</p>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4 -mt-16">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-card bg-secondary shrink-0 flex items-center justify-center">
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt="Cafe Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center p-1">
                No logo
              </p>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{data.name || "Cafe Name"}</h3>
            <p className="text-sm text-muted-foreground">
              {data.tagline || "Your cafe's tagline"}
            </p>
          </div>
        </div>

        {/* Details Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <InfoItem
            icon={<LinkIcon />}
            label="URL Slug"
            value={data.slug ? `your.app/${data.slug}` : "Not set"}
          />
          <InfoItem icon={<Home />} label="Address" value={data.address} />
          <InfoItem icon={<Mail />} label="Email" value={data.email} />
          <InfoItem
            icon={<Phone />}
            label="Phone"
            value={data.phone ? `+91 ${data.phone}` : ""}
          />
          <InfoItem icon={<Clock />} label="Hours" value={data.openingTime} />
          <InfoItem
            icon={<ScanLine />}
            label="Payment UPI"
            value={data.payment_url}
          />
          <InfoItem
            icon={<Landmark />}
            label="GST Number"
            value={data.gstNo || "Not Provided"}
          />
          <InfoItem
            icon={<Percent />}
            label="GST Rate"
            value={data.gstPercentage ? `${data.gstPercentage}%` : "Not Set"}
          />
        </div>
      </div>
    </div>
  );
};
