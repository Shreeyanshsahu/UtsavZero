
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
  return (
    <section
      aria-label="UtsavZero mission highlights"
      className={`w-full border-y ${isDarkMode ? "border-[#0d1310]" : "border-[#E0D5C7]"} ${isDarkMode ? "bg-[#1b1e1c]" : "bg-[#FFF3DF]"} px-4 py-3`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {items.map(({ icon: Icon, title, subtitle, color }) => (
          <div
            key={title}
            className="flex items-center justify-center gap-3"
          >
            <Icon
              size={23}
              strokeWidth={1.7}
              className={color}
              aria-hidden="true"
            />

            <div>
              <h2 className={`text-sm font-bold ${isDarkMode ? "text-[#FFF0D7]" : "text-[#493126]"} sm:text-base`}>
                {title}
              </h2>
              <p className="text-xs text-[#8B7769]">
                {subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
