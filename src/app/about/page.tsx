"use client";
import { useState } from "react";
import Image from "next/image";
import PrimaryButton from "@/components/Primarybutton";
import Navbar from "@/components/Navbar";
export default function About() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div
      className={`flex flex-col ${isDarkMode ? "bg-[#171A19]" : "bg-[#FFF8EB]"
        } flex-1 items-center p-4 font-sans w-full`}
    >
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
    </div>
  );
}