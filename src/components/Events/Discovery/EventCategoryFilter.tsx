
"use client";

import {
  Sparkles,
  Flame,
  Music,
  Utensils,
  Palette,
  Church,
  Users,
} from "lucide-react";

import { useTheme } from "@/context/ThemeContext";

interface EventCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { name: "All Events", icon: Sparkles },
  { name: "Cultural", icon: Flame },
  { name: "Music", icon: Music },
  { name: "Food", icon: Utensils },
  { name: "Art & Craft", icon: Palette },
  { name: "Religious", icon: Church },
  { name: "Family Friendly", icon: Users },
];

export default function EventCategoryFilter({
  selectedCategory,
  onCategoryChange,
}: EventCategoryFilterProps) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className="
        flex w-full items-center gap-2
        overflow-x-auto pb-1
        scrollbar-none
      "
      role="group"
      aria-label="Filter events by category"
    >
      {categories.map(({ name, icon: Icon }) => {
        const isActive = selectedCategory === name;

        return (
          <button
            key={name}
            type="button"
            onClick={() => onCategoryChange(name)}
            aria-pressed={isActive}
            className={`
              inline-flex shrink-0 items-center justify-center
              gap-1.5 rounded-full
              px-3 py-2
              font-lora text-[11px] font-medium
              transition-all duration-200
              sm:px-3.5 sm:py-2.5 sm:text-xs

              ${
                isActive
                  ? "bg-[#FF641A] text-white shadow-sm"
                  : isDarkMode
                    ? "bg-[#252C28] text-[#D9C9B8] hover:bg-[#333C35]"
                    : "bg-[#FFF1DD] text-[#49362C] hover:bg-[#FFE6C7]"
              }
            `}
          >
            <Icon
              size={13}
              strokeWidth={2}
              className="shrink-0"
            />

            {name}
          </button>
        );
      })}
    </div>
  );
}
