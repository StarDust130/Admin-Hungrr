import React from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { FileUploadField } from "./FileUploadField";
import { OnboardingData } from "./types";

interface StepBrandingProps {
  control: Control<OnboardingData>;
  setValue: UseFormSetValue<OnboardingData>;
  setIsFileUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StepBranding: React.FC<StepBrandingProps> = ({
  control,
  setValue,
  setIsFileUploading,
}) => {
  return (
    <div className="space-y-8">
      <FileUploadField
        control={control}
        setValue={setValue}
        setIsFileUploading={setIsFileUploading}
        name="bannerUrl"
        label="Cafe Banner"
        description="Upload a wide (16:9) image – ideal for headers. Max 5MB (.png, .jpg)."
        previewStyle="wide"
      />
      <FileUploadField
        control={control}
        setValue={setValue}
        setIsFileUploading={setIsFileUploading}
        name="logoUrl"
        label="Cafe Logo"
        description="Upload a square (1:1) logo. Max 2MB (.png, .jpg)."
        previewStyle="square"
      />
    </div>
  );
};
