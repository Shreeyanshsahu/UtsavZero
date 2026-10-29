"use client";
import { useTheme } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import HomeHero from "@/components/HomeContent/HomeHero";
import HomeContent from "@/components/HomeContent/HomeContent";
import HomeFooter from "@/components/HomeContent/HomeFooter";
export default function Home() {
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
      {/* Main content */}
      <div className="flex-1 w-full">
        <HomeHero />
        <HomeContent />
      </div>

      <div className="relative z-20 mt-auto w-full">

        <HomeFooter />
      </div>
    </div>
  );
}