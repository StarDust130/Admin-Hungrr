"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Control } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UtensilsCrossed,
  Image as ImageIcon,
  Wallet,
  PartyPopper,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  Home,
  Clock,
  Sparkles,
  Link as LinkIcon,
  CheckCircle,
  Building,
  ScanLine,
  FileText,
  Percent,
  Landmark,
} from "lucide-react";

// --- SHADCN/UI COMPONENTS ---
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- MOCK UTILS & HOOKS ---
const useUser = () => ({
  user: {
    id: "user_2fB4x6y5z1aBcDefGhiJkLmnOpq",
    fullName: "Maria",
    reload: async () => console.log("User reloaded"),
  },
});
const useRouter = () => ({
  push: (path: string) => console.log(`Navigating to: ${path}`),
});

const completeOnboarding = async (data: OnboardingData) => {
  console.log("Submitting form data to server:", data);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // To test error state:
  // return { error: "A cafe with this GST number already exists." };
  return { message: "Onboarding successful!" };
};

const handleImageUpload = async (file: File): Promise<string | null> => {
  if (!file) return null;
  console.log(`Simulating upload for ${file.name}...`);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const randomId = Math.random().toString(36).substring(7);
  const mockUrl = `https://ik.imagekit.io/demo/${file.name}?tr=w-1280,h-720&id=${randomId}`;
  console.log(`Upload complete: ${mockUrl}`);
  return mockUrl;
};

// --- TYPESCRIPT DEFINITIONS ---
const FormSchema = z.object({
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
    .max(15, "Phone number seems too long."),
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

type OnboardingData = z.infer<typeof FormSchema>;

interface Step {
  id: number;
  name: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  fields?: (keyof OnboardingData)[];
}

// --- REFINED UI COMPONENTS ---

const GuidancePanel = ({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: Step[];
}) => {
  const stepInfo = steps[currentStep - 1];
  return (
    <div className="hidden lg:flex flex-col justify-between p-8 bg-secondary h-full rounded-l-2xl">
      <div>
        <div className="flex items-center gap-2 font-bold text-2xl text-primary">
          <UtensilsCrossed />
          <span>CafeSetup</span>
        </div>
        <div className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center text-primary bg-primary/10 rounded-xl w-20 h-20 mb-6"
            >
              {React.cloneElement(stepInfo.icon, { size: 40 })}
            </motion.div>
          </AnimatePresence>
          <h2 className="text-3xl font-bold">{stepInfo.title}</h2>
          <p className="text-muted-foreground mt-2">{stepInfo.description}</p>
        </div>
      </div>
      <VerticalStepper currentStep={currentStep} steps={steps} />
    </div>
  );
};

const VerticalStepper = ({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: Step[];
}) => (
  <ol className="relative border-l border-border/50">
    {steps.map((step, index) => (
      <li key={step.id} className="mb-6 ml-6">
        <span
          className={cn(
            "absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-background transition-all",
            currentStep > index + 1
              ? "bg-green-500 text-white"
              : "bg-secondary",
            currentStep === index + 1
              ? "bg-primary text-primary-foreground"
              : ""
          )}
        >
          {currentStep > index + 1 ? (
            <CheckCircle size={14} />
          ) : (
            <span className="text-xs font-bold">{step.id}</span>
          )}
        </span>
        <h3
          className={cn(
            "font-medium",
            currentStep === index + 1
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {step.name}
        </h3>
      </li>
    ))}
  </ol>
);

// --- IMPROVED FILE UPLOAD COMPONENT ---
interface FileUploadFieldProps {
  control: Control<OnboardingData>;
  name: keyof OnboardingData;
  label: string;
  description: string;
  setIsFileUploading: React.Dispatch<React.SetStateAction<boolean>>;
  previewStyle?: "square" | "wide";
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  control,
  name,
  label,
  description,
  setIsFileUploading,
  previewStyle = "square",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isWide = previewStyle === "wide";

  const previewContainerClasses = isWide
    ? "w-full aspect-video rounded-lg"
    : "w-32 h-32 rounded-lg";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const handleFileChange = async (
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          const file = event.target.files?.[0];
          if (file) {
            setIsUploading(true);
            setIsFileUploading(true);
            const url = await handleImageUpload(file);
            if (url) onChange(url);
            setIsUploading(false);
            setIsFileUploading(false);
          }
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div
              className={cn("flex gap-4", isWide ? "flex-col" : "items-center")}
            >
              <div
                className={cn(
                  "flex-shrink-0 bg-secondary flex items-center justify-center overflow-hidden border-2 border-dashed",
                  previewContainerClasses
                )}
              >
                {isUploading ? (
                  <Loader2 className="animate-spin text-muted-foreground" />
                ) : value ? (
                  <img
                    src={value as string}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex-grow">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Choose File"}
                </Button>
                <input
                  ref={inputRef}
                  id={name}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  disabled={isUploading}
                />
                <FormDescription className="mt-2 text-xs">
                  {description}
                </FormDescription>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

// --- ELEGANT REVIEW STEP ---
const ReviewStep = ({ getValues }: { getValues: () => OnboardingData }) => {
  const data = getValues();
  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactElement;
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

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      <div className="h-32 bg-secondary overflow-hidden">
        <img
          src={data.bannerUrl}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4 -mt-16">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-card bg-secondary shrink-0">
            <img
              src={data.logoUrl}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{data.name}</h3>
            <p className="text-sm text-muted-foreground">{data.tagline}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <InfoItem
            icon={<LinkIcon />}
            label="URL Slug"
            value={`.../menu/${data.slug}`}
          />
          <InfoItem icon={<Home />} label="Address" value={data.address} />
          <InfoItem icon={<Mail />} label="Email" value={data.email} />
          <InfoItem icon={<Phone />} label="Phone" value={data.phone} />
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

// --- MAIN ONBOARDING COMPONENT ---
export default function ProfessionalOnboarding() {
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
      openingTime: "9:00 AM - 9:00 PM",
      gstNo: "",
      gstPercentage: 5,
      payment_url: "",
      ipAddress: "",
    },
  });

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        form.setValue("ipAddress", data.ip);
      } catch (error) {
        console.error("Failed to fetch IP address:", error);
        form.setValue("ipAddress", "not_found");
      }
    };
    fetchIp();
  }, [form]);

  const STEPS: Step[] = [
    {
      id: 1,
      name: "Welcome",
      title: "Let's Get Started",
      description: "First, let's get the basic details for your new cafe.",
      icon: <Building />,
      fields: ["name", "slug", "tagline"],
    },
    {
      id: 2,
      name: "Branding",
      title: "Brand Identity",
      description: "Upload your logo and a banner to make your page stand out.",
      icon: <ImageIcon />,
      fields: ["logoUrl", "bannerUrl"],
    },
    {
      id: 3,
      name: "Location & Contact",
      title: "Find & Contact",
      description: "How can customers find you and get in touch?",
      icon: <Home />,
      fields: ["address", "openingTime", "email", "phone"],
    },
    {
      id: 4,
      name: "Financials",
      title: "Business & Payments",
      description:
        "Provide your business info for invoicing and setup payments.",
      icon: <Landmark />,
      fields: ["gstNo", "gstPercentage", "payment_url"],
    },
    {
      id: 5,
      name: "Review",
      title: "Final Review",
      description: "One last look at everything before we go live.",
      icon: <CheckCircle />,
    },
  ];

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
    const isValid = await form.trigger(fields as (keyof OnboardingData)[], {
      shouldFocus: true,
    });
    if (isValid) {
      if (step < STEPS.length) setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data: OnboardingData) => {
    setIsLoading(true);
    setServerError("");
    const finalData = { ...data, owner_id: user.id };
    const res = await completeOnboarding(finalData);
    setIsLoading(false);

    if (res.message) {
      setStep(STEPS.length + 1);
      await user.reload();
      setTimeout(() => router.push("/dashboard"), 3000);
    } else if (res.error) {
      setServerError(res.error);
    }
  };

  const isNavDisabled = isLoading || isFileUploading;
  const motionProps = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.4, ease: "easeInOut" },
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background font-sans">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 bg-card rounded-2xl shadow-2xl shadow-primary/5 min-h-[680px]">
        <GuidancePanel currentStep={step} steps={STEPS} />

        <div className="p-8 lg:col-span-2">
          <AnimatePresence mode="wait">
            {step > STEPS.length ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center flex flex-col items-center justify-center h-full"
              >
                <PartyPopper className="w-24 h-24 text-green-500 mb-6" />
                <h2 className="text-3xl font-bold">
                  All Set, {user.fullName}!
                </h2>
                <p className="text-muted-foreground mt-2">
                  Your cafe is ready to brew. Redirecting you to the
                  dashboard...
                </p>
              </motion.div>
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
                          <>
                            <FormField
                              name="name"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cafe Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., The Daily Grind"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        handleSlugGeneration(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="slug"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>URL Slug</FormLabel>
                                  <FormControl>
                                    <div className="flex items-center">
                                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-secondary text-sm text-muted-foreground h-10">
                                        hungrr.in/menu/
                                      </span>
                                      <Input
                                        placeholder="the-daily-grind"
                                        className="rounded-l-none"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="tagline"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tagline (Optional)</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="e.g., Where every cup is a story."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}

                        {step === 2 && (
                          <>
                            <FileUploadField
                              control={form.control}
                              name="logoUrl"
                              label="Cafe Logo"
                              description="Square (1:1), max 2MB. (.png, .jpg)"
                              setIsFileUploading={setIsFileUploading}
                              previewStyle="square"
                            />
                            <FileUploadField
                              control={form.control}
                              name="bannerUrl"
                              label="Cafe Banner"
                              description="Widescreen (16:9), max 5MB. (.png, .jpg)"
                              setIsFileUploading={setIsFileUploading}
                              previewStyle="wide"
                            />
                          </>
                        )}

                        {/* FIXED: Step 3 with corrected JSX and new grid layout */}
                        {step === 3 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <div className="md:col-span-2">
                              <FormField
                                name="address"
                                control={form.control}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Full Address</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="123 Coffee Lane, Bean Town"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              name="openingTime"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Opening Hours</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., 9 AM - 10 PM"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="email"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="you@example.com"
                                      type="email"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="phone"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Phone</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="+91 98765 43210"
                                      type="tel"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}

                        {/* FIXED: Step 4 with corrected JSX and new grid layout */}
                        {step === 4 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <div className="md:col-span-2">
                              <FormField
                                name="payment_url"
                                control={form.control}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>UPI ID / Payment URL</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="yourcafe@upi"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Used for generating QR codes for payment.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              name="gstNo"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>GST Number (Optional)</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="15-digit GSTIN"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="gstPercentage"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Default GST Rate</FormLabel>
                                  <Select
                                    onValueChange={(value) =>
                                      field.onChange(parseInt(value))
                                    }
                                    defaultValue={String(field.value)}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a GST rate" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="5">5%</SelectItem>
                                      <SelectItem value="12">12%</SelectItem>
                                      <SelectItem value="18">18%</SelectItem>
                                      <SelectItem value="28">28%</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                          </div>
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
                        <AlertCircle size={16} />
                        <p>{serverError}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <Button
                        type="button"
                        onClick={handlePrevStep}
                        disabled={isNavDisabled}
                        variant="ghost"
                        className={cn(step === 1 && "invisible")}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>

                      {step < STEPS.length && (
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          disabled={isNavDisabled}
                        >
                          Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}

                      {step === STEPS.length && (
                        <Button
                          type="submit"
                          disabled={isNavDisabled}
                          size="lg"
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
