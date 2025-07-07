"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Wand2,
} from "lucide-react";

import { OnboardingData, FormSchema } from "./types";
import { StepWelcome } from "./StepWelcome";
import { StepBranding } from "./StepBranding";
import { StepLocation } from "./StepLocation";
import { StepFinancials } from "./StepFinancials";
import { ReviewStep } from "./ReviewStep";
import { GuidancePanel } from "./GuidancePanel";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import SuccessDisplay from "./SuccessDisplay";
import { STEPS } from "./onboardingData";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/app/(Auth)/onboarding/_actions";
import axios from "axios";

// Placeholder data for the "Ek Saath" cafe
const ekSaathData: Partial<OnboardingData> = {
  name: "Ek Saath",
  slug: "ek-saath",
  tagline: "Ek Saath Specialty Coffee & Pizzeria",
  phone: "8109800010",
  logoUrl:
    "https://ik.imagekit.io/hungrr/503203063_1127601849178489_1854416631741525799_n_-mFM4vzJB.jpg?updatedAt=1751531493232",
  bannerUrl:
    "https://ik.imagekit.io/hungrr/499275413_677112291948249_6229927055627318723_n__1__7WLmoR4jP_fgnyOBRr1.webp?updatedAt=1751532544721",
  address: "Aveer Arcade, 44A/5  Nehru Nagar West, Bhilai, Chhattisgarh, 490020",
  openingTime: "10:00 AM - 11:00 PM",
  gstNo: "22ABCFB8782FIZ1",
  gstPercentage: 5,
  instaID: "eksaathindia",
  isPureVeg: true, // Ek Saath is a pure veg cafe
};

export default function Onboarding() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showAutoFillButton, setShowAutoFillButton] = useState(false);

  const form = useForm<OnboardingData>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      tagline: "",
      email: "",
      phone: "",
      logoUrl: "",
      bannerUrl: "",
      address: "",
      openingTime: "9:00 AM - 11:00 PM",
      gstNo: "",
      gstPercentage: 5,
      payment_url: "",
      ipAddress: "",
      instaID: "",
      isPureVeg: false, // Default to false
    },
  });

  const watchedName = form.watch("name");

  // Effect to show the auto-fill button when user types "Ek Saath"
  useEffect(() => {
    if (watchedName && watchedName.toLowerCase().startsWith("ek saath")) {
      setShowAutoFillButton(true);
    } else {
      setShowAutoFillButton(false);
    }
  }, [watchedName]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      form.setValue("email", user.primaryEmailAddress.emailAddress);
    }
  }, [user?.primaryEmailAddress?.emailAddress, form]);

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        form.setValue("ipAddress", data.ip);
        console.log("Fetched IP address 😍:", data.ip);
      } catch (error) {
        console.error("Failed to fetch IP address:", error);
      }
    };
    fetchIp();
  }, [form]);

  const handleSlugGeneration = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
    form.setValue("slug", slug, { shouldValidate: true });
  };

  // Handler to auto-fill the form with placeholder data
  const handleAutoFill = () => {
    Object.entries(ekSaathData).forEach(([key, value]) => {
      form.setValue(key as keyof OnboardingData, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    });
    setShowAutoFillButton(false); // Hide button after use
  };

  const handleNextStep = async () => {
    setShowAutoFillButton(false);
    const fields = STEPS[step - 1].fields;
    const isValid = await form.trigger(fields as (keyof OnboardingData)[]);
    if (isValid) setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setStep((prev) => prev - 1);

  //! Submit handler
  const onSubmit = async (data: OnboardingData) => {
    setIsLoading(true);
    setServerError("");

    // Append user_id to the data
    const payload = {
      ...data,
      owner_id: user?.id,
      ipAddress: data.ipAddress,
    };

    let clerkSuccess = false;
    let backendSuccess = false;

    // ✅ Update Clerk metadata
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });
    if (user?.id) formData.append("user_id", user.id);

    const res = await completeOnboarding(formData);
    if (res?.message) {
      clerkSuccess = true;
    }

    // ✅ Send JSON to backend (NOT FormData)
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cafe`,
        payload
      );
      backendSuccess = true;
    } catch (axiosError) {
      console.error("Error sending to backend:", axiosError);
      setServerError("Failed to save data to backend.");
    }

    setIsLoading(false);

    if (clerkSuccess && backendSuccess) {
      await user?.reload();
      setStep((prev) => prev + 1);
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  };

  const isNavDisabled = isLoading || isFileUploading;
  const motionTransition: Transition = { duration: 0.4, ease: "easeInOut" };
  const motionProps = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: motionTransition,
  };

  return (
    <div className="flex items-center justify-center mx-auto my-5 h-screen p-4 bg-background font-sans">
      <div
        className={cn(
          "w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3  rounded-2xl shadow-2xl shadow-primary/5",
          step <= STEPS.length && "min-h-[620px] "
        )}
      >
        <GuidancePanel currentStep={step} steps={STEPS} />
        <div
          className={cn(
            "p-8",
            "flex flex-col",
            step > STEPS.length ? "col-span-full" : "lg:col-span-2"
          )}
        >
          <AnimatePresence mode="wait">
            {step > STEPS.length ? (
              <SuccessDisplay user={user?.firstName ?? ""} />
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col justify-between h-full"
                >
                  <div className="flex-grow">
                    <AnimatePresence>
                      {showAutoFillButton && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            marginBottom: "1.5rem",
                          }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="flex justify-center">
                            <Button
                              type="button"
                              onClick={handleAutoFill}
                              variant="ghost"
                              className={cn(
                                "w-fit px-3 py-1.5 rounded-lg flex items-center gap-2",
                                "border border-cyan-400/60",
                                "bg-gradient-to-r from-cyan-900/60 to-cyan-700/30",
                                "shadow-cyan-400/10 shadow",
                                "transition-all duration-300 ease-in-out",
                                "cursor-pointer"
                              )}
                              style={{
                                color: "#b6f0ff",
                              }}
                            >
                              <Wand2 className="h-4 w-4 text-yellow-400 sdrop-shadow-glow hover:rotate-[18deg] hover:scale-110 transition-transform duration-300" />
                              <span className="text-xs font-medium tracking-tight text-cyan-100 transition-colors duration-200">
                                <span className=" font-bold">
                                  Fill with AI:{" "}
                                </span>{" "}
                                Instantly load &quot;Ek Saath&quot; details ✨
                              </span>
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {showAutoFillButton && (
                        <p className="text-[10px] font-semibold text-gray-400 w-full text-center mt-1 -mb-2">
                        (AI may make mistakes)
                        </p>
                    )}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        {...motionProps}
                        className="space-y-6"
                      >
                        <h2 className="text-2xl font-bold lg:hidden text-center mb-4">
                          {STEPS[step - 1].title}
                        </h2>
                        {step === 1 && (
                          <StepWelcome
                            control={form.control}
                            onSlugGenerate={handleSlugGeneration}
                          />
                        )}
                        {step === 2 && (
                          <StepBranding
                            control={form.control}
                            setValue={form.setValue}
                            setIsFileUploading={setIsFileUploading}
                          />
                        )}
                        {step === 3 && <StepLocation control={form.control} />}
                        {step === 4 && (
                          <StepFinancials control={form.control} />
                        )}
                        {step === 5 && (
                          <ReviewStep
                            getValues={form.getValues}
                            agreedToTerms={agreedToTerms}
                            setAgreedToTerms={setAgreedToTerms}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    {serverError && (
                      <div className="flex items-center gap-2 text-sm text-destructive mb-4 font-medium">
                        <AlertCircle size={16} /> <p>{serverError}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <Button
                        type="button"
                        onClick={handlePrevStep}
                        disabled={isNavDisabled}
                        variant="ghost"
                        className={cn(
                          "transition-transform active:scale-[0.98] cursor-pointer",
                          step === 1 && "invisible"
                        )}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      {step < STEPS.length && (
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          disabled={isNavDisabled}
                          className="transition-transform active:scale-[0.98] cursor-pointer"
                        >
                          Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                      {step === STEPS.length && (
                        <Button
                          type="submit"
                          disabled={isNavDisabled || !agreedToTerms}
                          size="lg"
                          className="transition-transform active:scale-[0.98] cursor-pointer"
                        >
                          {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                          )}
                          {isLoading ? "Submitting..." : "Launch Cafe"}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
