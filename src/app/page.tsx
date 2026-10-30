
"use client";

import { useTheme } from "@/context/ThemeContext";

import Navbar from "@/components/layout/Navbar";
import HomeHero from "@/components/HomeContent/HomeHero";
import HomeContent from "@/components/HomeContent/HomeContent";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <div
      className={`flex min-h-dvh w-full flex-col font-sans transition-colors duration-300 ${
        isDarkMode ? "bg-[#171A19]" : "bg-[#FFF8EB]"
      }`}
    >
      {/* Navbar */}
      <div className="sticky top-0 z-50 w-full">
        <Navbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      </div>

      {/* Main Homepage Content */}
      <div className="flex w-full flex-1 flex-col">
        <HomeHero />

        <HomeContent />
      </div>

      {/* Footer */}
      <div className="relative z-20 mt-auto w-full">
        <Footer />
      </div>
    </div>
  );
}
