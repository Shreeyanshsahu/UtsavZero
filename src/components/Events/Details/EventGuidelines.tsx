
"use client";

import {
  Leaf,
  Volume2,
  Users,
  Recycle,
  ShieldCheck,
} from "lucide-react";

import type { Event } from "@/types/event";
import { useTheme } from "@/context/ThemeContext";

interface EventGuidelinesProps {
  event: Event;
}

export default function EventGuidelines({
  event,
}: EventGuidelinesProps) {
  const { isDarkMode } = useTheme();

  const guidelines = [
    {
      icon: Leaf,
      title: "Celebrate without firecrackers",
      description: event.isFirecrackerFree
        ? "This event is listed as firecracker-free. Enjoy the celebration without fireworks."
        : "Follow the organiser's instructions regarding fireworks and event activities.",
    },
    {
      icon: Volume2,
      title: "Be mindful of noise",
      description:
        "Respect the surrounding community and avoid unnecessary noise.",
    },
    {
      icon: Recycle,
      title: "Keep the venue clean",
      description:
        "Dispose of waste responsibly and help maintain a clean event space.",
    },
    {
      icon: Users,
      title: "Respect everyone",
      description:
        "Be considerate of fellow attendees, families and the local community.",
    },
  ];

  const headingColor = isDarkMode
    ? "text-[#FFF0D7]"
    : "text-[#3D2923]";

  const mutedColor = isDarkMode
    ? "text-[#B8B7A9]"
    : "text-[#806E61]";

  const cardStyle = isDarkMode
    ? "bg-[#222725] border-[#343B36]"
    : "bg-white border-[#EADCC9]";

  const iconBackground = isDarkMode
    ? "bg-[#353B36]"
    : "bg-[#FFF0D8]";

  return (
    <section className="mt-7 sm:mt-8">

      {/* Section Heading */}
      <div className="flex items-center gap-2.5">
        <ShieldCheck
          size={21}
          className="shrink-0 text-[#F0440A]"
        />

        <h2 className={`font-lora text-lg font-bold sm:text-xl ${headingColor}`}>
          Responsible Celebration Guidelines
        </h2>
      </div>

      <p className={`mt-2 text-sm leading-6 ${mutedColor}`}>
        Help make every celebration safer, cleaner and more welcoming.
      </p>

      {/* Guidelines Grid */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

        {guidelines.map((guideline) => {
          const Icon = guideline.icon;

          return (
            <div
              key={guideline.title}
              className={`flex items-start gap-3 rounded-xl border p-4 transition-colors duration-300 sm:p-5 ${cardStyle}`}
            >
              {/* Icon */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBackground}`}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  className="text-[#F0440A]"
                />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <h3 className={`text-sm font-semibold leading-5 sm:text-base ${headingColor}`}>
                  {guideline.title}
                </h3>

                <p className={`mt-1.5 text-xs leading-6 sm:text-sm ${mutedColor}`}>
                  {guideline.description}
                </p>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
