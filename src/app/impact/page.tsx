"use client";
import { useState } from "react";
import Image from "next/image";
import PrimaryButton from "@/components/Primarybutton";
import Navbar from "@/components/Navbar";
export default function Impact() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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