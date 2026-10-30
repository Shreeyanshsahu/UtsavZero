
"use client";

import { MapPin, Users, Leaf } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const items = [
  {
    icon: MapPin,
    title: "Community Celebrations",
    subtitle: "Discover events across Delhi",
    color: "text-orange-600",
  },
  {
    icon: Users,
    title: "Celebrate Together",
    subtitle: "Find your local festivities",
    color: "text-orange-600",
  },
  {
    icon: Leaf,
    title: "A Cleaner Delhi",
    subtitle: "Our shared vision",
    color: "text-green-600",
  },
];

export default function CommunityBar() {
  const { isDarkMode } = useTheme();

  const headingColor = isDarkMode
    ? "text-[#FFF0D7]"
    : "text-[#493126]";

  const subtitleColor = isDarkMode
    ? "text-[#B8B7A9]"
    : "text-[#8B7769]";

  return (
    <section
      aria-label="UtsavZero mission highlights"
      className={`w-full border-y px-4 py-4 transition-colors duration-300 sm:px-6 sm:py-5 ${
        isDarkMode
          ? "border-[#343B36] bg-[#1B1E1C]"
          : "border-[#E0D5C7] bg-[#FFF3DF]"
      }`}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-8">
        {items.map(({ icon: Icon, title, subtitle, color }) => (
          <div
            key={title}
            className="flex min-w-0 items-center justify-center gap-3 sm:justify-center"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11 ${
                isDarkMode ? "bg-[#292E2B]" : "bg-[#FFE8C8]"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={1.7}
                className={color}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2
                className={`text-sm font-bold leading-snug sm:text-base ${headingColor}`}
              >
                {title}
              </h2>

              <p
                className={`mt-0.5 text-xs leading-relaxed sm:text-sm ${subtitleColor}`}
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
