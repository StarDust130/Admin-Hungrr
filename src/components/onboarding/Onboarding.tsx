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

const useRouter = () => ({
  push: (path: string) => console.log(`Navigating to: ${path}`),
});
const completeOnboarding = async (data: OnboardingData) => {
  console.log("Submitting form data to server:", data);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { message: "Onboarding successful!" };
};

export default function Onboarding() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [serverError, setServerError] = useState("");
 
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
    },
  });

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      form.setValue("email", user.primaryEmailAddress.emailAddress);
    }
  }, [user?.primaryEmailAddress?.emailAddress , form]);
  

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        form.setValue("ipAddress", data.ip);
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

  const handleNextStep = async () => {
    const fields = STEPS[step - 1].fields;
    const isValid = await form.trigger(fields as (keyof OnboardingData)[]);
    if (isValid) setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: OnboardingData) => {
    setIsLoading(true);
    setServerError("");
    const res = await completeOnboarding(data);
    setIsLoading(false);
    
    if (user) {
      await user.update({
        unsafeMetadata: {
          onboardingComplete: true,
        },
      });
      
    }
    
    if (res.message) {
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
                          <ReviewStep getValues={form.getValues} />
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
                          "transition-transform active:scale-[0.98]",
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
                          className="transition-transform active:scale-[0.98]"
                        >
                          Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                      {step === STEPS.length && (
                        <Button
                          type="submit"
                          disabled={isNavDisabled}
                          size="lg"
                          className="transition-transform active:scale-[0.98]"
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
