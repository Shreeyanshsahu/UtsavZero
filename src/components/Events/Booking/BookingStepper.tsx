
"use client";

import { Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface BookingStepperProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { id: 1, label: "Details" },
  { id: 2, label: "Review" },
  { id: 3, label: "Confirmation" },
] as const;

export default function BookingStepper({
  currentStep,
}: BookingStepperProps) {
  const { isDarkMode } = useTheme();

  const inactiveCircle = isDarkMode
    ? "border-[#505751] bg-transparent text-[#AFA99C]"
    : "border-[#D8CABB] bg-transparent text-[#927F70]";

  const inactiveLabel = isDarkMode
    ? "text-[#AFA99C]"
    : "text-[#927F70]";

  const connectorBackground = isDarkMode
    ? "bg-[#414943]"
    : "bg-[#EADCC9]";

  return (
    <section
      className="w-full py-3 sm:py-4"
      aria-label="Booking progress"
    >
      <div className="flex w-full items-start">

        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex min-w-0 items-start ${
                index !== steps.length - 1 ? "flex-1" : "shrink-0"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              {/* Step Circle and Label */}
              <div className="flex min-w-0 shrink-0 flex-col items-center gap-2">

                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-10 sm:w-10 ${
                    isCompleted
                      ? "border-[#F0440A] bg-[#F0440A] text-white"
                      : isActive
                        ? isDarkMode
                          ? "border-[#F0440A] bg-[#353B36] text-[#FF6A16]"
                          : "border-[#F0440A] bg-[#FFF0D8] text-[#F0440A]"
                        : inactiveCircle
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <span className="text-xs font-bold sm:text-sm">
                      {step.id}
                    </span>
                  )}
                </div>

                <span
                  className={`max-w-full text-center text-[10px] font-semibold leading-tight transition-colors sm:text-xs ${
                    isActive || isCompleted
                      ? "text-[#F0440A]"
                      : inactiveLabel
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {index !== steps.length - 1 && (
                <div
                  className={`mx-1.5 mt-4 h-[2px] min-w-2 flex-1 overflow-hidden rounded-full sm:mx-3 sm:mt-5 ${connectorBackground}`}
                  aria-hidden="true"
                >
                  <div
                    className={`h-full rounded-full bg-[#F0440A] transition-all duration-500 ${
                      isCompleted ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
