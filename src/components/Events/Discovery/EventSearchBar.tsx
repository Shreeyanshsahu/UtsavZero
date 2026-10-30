
"use client";

import { useTheme } from "@/context/ThemeContext";
import { Search, X } from "lucide-react";

interface EventSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function EventSearchBar({
  searchQuery,
  onSearchChange,
}: EventSearchBarProps) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`
        flex w-full items-center gap-3 rounded-xl border px-4 py-3
        transition-all duration-300
        ${
          isDarkMode
            ? "border-[#414943] bg-[#222826] focus-within:border-[#FF8A32]"
            : "border-[#F0E2D0] bg-white focus-within:border-[#FF8A32]"
        }
        focus-within:shadow-[0_0_0_3px_rgba(255,138,50,0.10)]
      `}
    >
      {/* Search Icon */}
      <Search
        size={20}
        strokeWidth={1.8}
        className={`
          shrink-0
          ${isDarkMode ? "text-[#D9A16B]" : "text-[#A47B61]"}
        `}
      />

      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search events, locations or keywords..."
        aria-label="Search events, locations or keywords"
        className={`
          min-w-0 flex-1 bg-transparent outline-none
          font-lora text-sm
          placeholder:font-lora
          ${
            isDarkMode
              ? "text-[#FFF0D7] placeholder:text-[#927D70]"
              : "text-[#3D2923] placeholder:text-[#A89587]"
          }
        `}
      />

      {/* Clear Search */}
      {searchQuery && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          aria-label="Clear search"
          className={`
            flex h-7 w-7 shrink-0 items-center justify-center
            rounded-full transition-colors
            ${
              isDarkMode
                ? "text-[#A89587] hover:bg-[#343C37]"
                : "text-[#8B7769] hover:bg-[#FFF1E4]"
            }
          `}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
