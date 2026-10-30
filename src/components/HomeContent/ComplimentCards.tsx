
"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  MapPin,
  CalendarDays,
  Ticket,
  Leaf,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Discover",
    subtitle: "Events Near You",
    iconColor: "text-[#FF6A16]",
    lightBg: "bg-[#FBE8DE]",
  },
  {
    icon: CalendarDays,
    title: "Check",
    subtitle: "Event Details",
    iconColor: "text-[#FF6A16]",
    lightBg: "bg-[#FFF0D6]",
  },
  {
    icon: Ticket,
    title: "Book",
    subtitle: "Your Spot",
    iconColor: "text-[#FF6A16]",
    lightBg: "bg-[#FBE8DE]",
  },
  {
    icon: Leaf,
    title: "Be a Part of",
    subtitle: "Cleaner Celebrations",
    iconColor: "text-[#4CAF50]",
    lightBg: "bg-[#E7F3E6]",
  },
];

export default function ComplimentsCards() {
  const { isDarkMode } = useTheme();

  const headingColor = isDarkMode
    ? "text-[#FFF0D7]"
    : "text-[#3D3028]";

  const subtitleColor = isDarkMode
    ? "text-[#B9AD99]"
    : "text-[#8A796D]";

  return (
    <section
      className={`w-full px-4 py-4 transition-colors duration-300 sm:px-6 sm:py-5 ${
        isDarkMode ? "bg-[#171A19]" : "bg-[#FFF8EB]"
      }`}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {features.map(
          ({ icon: Icon, title, subtitle, iconColor, lightBg }) => (
            <div
              key={title}
              className={`flex min-h-[76px] min-w-0 items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 sm:min-h-[84px] sm:gap-4 sm:px-5 ${
                isDarkMode ? "bg-[#222925]" : lightBg
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11 ${
                  isDarkMode ? "bg-[#343B36]" : "bg-white/60"
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={1.7}
                  className={iconColor}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <h3
                  className={`text-sm font-semibold leading-snug sm:text-base ${headingColor}`}
                >
                  {title}
                </h3>

                <p
                  className={`mt-0.5 text-xs leading-relaxed sm:text-sm ${subtitleColor}`}
                >
                  {subtitle}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
