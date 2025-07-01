import React from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Step } from "./types";

interface VerticalStepperProps {
  currentStep: number;
  steps: Step[];
}

export const VerticalStepper: React.FC<VerticalStepperProps> = ({
  currentStep,
  steps,
}) => (
  <ol className="relative ml-5">
    {steps.map((step, index) => {
      const isCompleted = currentStep > index + 1;
      const isCurrent = currentStep === index + 1;

      return (
        <li
          key={step.id}
          className={cn("relative pl-6", index !== steps.length - 1 && "pb-5")}
        >
          {/* Line (except last item) */}
          {index !== steps.length - 1 && (
            <span className="absolute left-3 top-6 w-px h-full bg-border/40" />
          )}

          {/* Step Indicator */}
          <span
            className={cn(
              "absolute left-0 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors duration-200",
              isCompleted
                ? "bg-green-500 text-black border-green-500"
                : isCurrent
                ? "bg-primary text-black border-primary"
                : "bg-muted text-muted-foreground border-border"
            )}
          >
            {isCompleted ? (
              <CheckCircle size={12} strokeWidth={2} />
            ) : (
              <span className="text-[11px] font-bold">{step.id}</span>
            )}
          </span>

          {/* Step Title */}
          <h3
            className={cn(
              "ml-2 text-[15px] font-semibold leading-tight tracking-wide",
              isCurrent ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {step.name}
          </h3>
        </li>
      );
    })}
  </ol>
);
