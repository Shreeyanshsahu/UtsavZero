
"use client";

import { useTheme } from "@/context/ThemeContext";
import { MapPin, CalendarDays, Ticket, Leaf } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Discover",
    subtitle: "Events Near You",
    iconColor: "text-[#FF6A16]",
  },
  {
    icon: CalendarDays,
    title: "Check",
    subtitle: "Event Details",
    iconColor: "text-[#FF6A16]",
  },
  {
    icon: Ticket,
    title: "Book",
    subtitle: "Your Spot",
    iconColor: "text-[#FF6A16]",
  },
  {
    icon: Leaf,
    title: "Be a Part of",
    subtitle: "Cleaner Celebrations",
    iconColor: "text-[#4CAF50]",
  },
];

export default function ComplimentsCards() {
  const { isDarkMode } = useTheme();

  return (
    <section
      className={`w-full px-4 py-3 transition-colors duration-200 ${
        isDarkMode ? "bg-[#171A19]" : "bg-[#FFF8EB]"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, subtitle, iconColor }) => (
          <div
            key={title}
            className={`flex min-h-[60px] items-center gap-4 rounded-xl px-5 py-3 transition-colors duration-200 ${
              isDarkMode
                ? "bg-[#222925]"
                : title === "Check"
                  ? "bg-[#FFF0D6]"
                  : title === "Be a Part of"
                    ? "bg-[#E7F3E6]"
                    : "bg-[#FBE8DE]"
            }`}
          >
            <Icon
              size={22}
              strokeWidth={1.6}
              className={`${iconColor} shrink-0`}
              aria-hidden="true"
            />

            <div className="min-w-0">
              <h3
                className={`text-sm font-semibold ${
                  isDarkMode ? "text-[#FFF0D7]" : "text-[#3D3028]"
                }`}
              >
                {title}
              </h3>

              <p
                className={`text-xs ${
                  isDarkMode ? "text-[#B9AD99]" : "text-[#8A796D]"
                }`}
              >
                {subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
