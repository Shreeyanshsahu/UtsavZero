
"use client";

import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export default function ThemeToggle({
  isDarkMode,
  setIsDarkMode,
}: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={() => setIsDarkMode(!isDarkMode)}
      aria-label={
        isDarkMode ? "Switch to light mode" : "Switch to dark mode"
      }
      title={isDarkMode ? "Light mode" : "Dark mode"}
      className={`
        flex h-11 w-11 shrink-0 items-center justify-center
        rounded-full transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-[#FF8A32]
        ${
          isDarkMode
            ? "bg-[#292E2B] text-[#FFBE45] hover:bg-[#343B36]"
            : "bg-[#FFF0D8] text-[#F0440A] hover:bg-[#FFE5C0]"
        }
      `}
    >
      {isDarkMode ? (
        <Sun size={19} strokeWidth={2} />
      ) : (
        <Moon size={19} strokeWidth={2} />
      )}
    </button>
  );
}
