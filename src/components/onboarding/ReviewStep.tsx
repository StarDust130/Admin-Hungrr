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
  Instagram,
} from "lucide-react";
import { OnboardingData } from "./types"; // Assuming types are in a shared file
import Image from "next/image";

// --- PROPS DEFINITION ---
interface ReviewStepProps {
  getValues: () => OnboardingData;
  agreedToTerms: boolean;
  setAgreedToTerms: (checked: boolean) => void;
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
export const ReviewStep: React.FC<ReviewStepProps> = ({ getValues ,agreedToTerms ,setAgreedToTerms }) => {
  const data = getValues();

  return (
    <div className="border rounded-xl overflow-hidden bg-card transition-all">
      {/* Banner Section */}
      <div className="h-32 bg-secondary overflow-hidden flex items-center justify-center">
        {data.bannerUrl ? (
          <Image
            src={data.bannerUrl}
            alt="Cafe Banner"
            className="w-full h-full object-cover"
            width={800}
            height={128}
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
              <Image
                src={data.logoUrl}
                alt="Cafe Logo"
                className="w-full h-full object-cover"
                width={100}
                height={100}
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
    value={data.slug ? `hungrr.in/menu/${data.slug}` : "Not set"}
  />
  <InfoItem icon={<Home />} label="Address" value={data.address} />
  <InfoItem icon={<Mail />} label="Email" value={data.email} />
  <InfoItem
    icon={<Phone />}
    label="Phone"
    value={data.phone ? `+91 ${data.phone}` : ""}
  />
  <InfoItem
    icon={<Instagram />}
    label="Instagram"
    value={data.instaID ? `@${data.instaID}` : "Not Linked"}
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


      <div className="mt-8 px-4 py-3 rounded-lg border bg-muted/50 space-x-2 flex items-start">
        <input
          type="checkbox"
          id="terms"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-1 accent-primary border-muted-foreground"
        />
        <label
          htmlFor="terms"
          className="text-sm text-muted-foreground leading-relaxed"
        >
          I agree to the{" "}
          <a
            href="/terms-of-service"
            className="underline hover:text-foreground transition"
            target="_blank"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy-policy"
            className="underline hover:text-foreground transition"
            target="_blank"
          >
            Privacy Policy
          </a>
          .
        </label>
      </div>
    </div>
  );
};
