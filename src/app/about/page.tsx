"use client";

import Navbar from "@/components/Navbar";
import { useTheme } from "@/context/ThemeContext";
export default function About() {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
      <div
          className={` relative flex flex-col ${isDarkMode ? "bg-[#171A19]" : "bg-[#FFF8EB]"
            } flex-1 items-center font-sans w-full min-h-screen`}
        >
    {/* Floating navbar */}
          <div className="absolute top-0 left-0 z-50 w-full">
            <Navbar
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          </div>
    </div>
  );
}