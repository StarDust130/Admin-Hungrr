import React from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import Image from "next/image";
import { VerticalStepper } from "./VerticalStepper";
import { Step } from "./types";

interface GuidancePanelProps {
  currentStep: number;
  steps: Step[];
}

export const GuidancePanel: React.FC<GuidancePanelProps> = ({
  currentStep,
  steps,
}) => {
  const stepInfo = steps.find((s) => s.id === currentStep);
  const itemTransition: Transition = { duration: 0.4, ease: "easeInOut" };

  if (!stepInfo) return null;

  return (
    <div className="hidden lg:flex flex-col justify-between border px-10 py-12 h-full rounded-l-2xl bg-background border-r shadow-sm">
      {/* Logo & Heading */}
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-border shadow-sm">
            <Image
              src="/icon.png"
              alt="Cafe Logo"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Cafe Onboarding
          </h1>
        </div>

        {/* Animated Step Info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={itemTransition}
              className="flex items-center justify-center rounded-xl w-16 h-16 bg-muted text-primary mb-4"
            >
              {React.cloneElement(stepInfo.icon, { size: 32 })}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ ...itemTransition, delay: 0.1 }}
              className="text-xl font-bold tracking-tight text-foreground"
            >
              {stepInfo.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ ...itemTransition, delay: 0.2 }}
              className="text-sm text-muted-foreground mt-2 leading-snug"
            >
              {stepInfo.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stepper */}
      <div className="pt-8 border-t mt-8">
        <VerticalStepper currentStep={currentStep} steps={steps} />
      </div>
    </div>
  );
};
