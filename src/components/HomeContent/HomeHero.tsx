
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Play } from "lucide-react";

import PrimaryBtnsvg from "@/components/ui/PrimaryBtnsvg";
import SecondryBtnsvg from "@/components/ui/SecondryBtnsvg";
import { useTheme } from "@/context/ThemeContext";

export default function HomeHero() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <section
      className={`relative z-10 mx-auto flex min-h-[calc(85svh-68px)] w-full max-w-7xl flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-4 py-12 transition-colors duration-300 sm:min-h-[calc(90svh-68px)] sm:px-6 sm:py-16 lg:min-h-[calc(100vh-68px)] lg:px-8 ${
        isDarkMode ? "bg-[#171A19]" : "bg-[#FFF8EB]"
      }`}
      style={{
        backgroundImage: "url('/UtsavZerobgm.png')",
      }}
    >
      {/* Optional overlay for better text readability */}
      <div
        className={`absolute inset-0 -z-0 ${
          isDarkMode ? "bg-[#171A19]/35" : "bg-[#FFF8EB]/15"
        }`}
      />

      {/* Logo */}
      <div className="relative z-10 w-full max-w-[280px] sm:max-w-[350px] md:max-w-[420px]">
        <Image
          src="/UtsavZeroLogo.png"
          alt="UtsavZero Logo"
          width={450}
          height={65}
          priority
          className="h-auto w-full object-contain"
        />
      </div>

      {/* Main Heading */}
      <div className="relative z-10 mx-auto mt-7 w-full max-w-4xl sm:mt-9">
        <h1
          className={`text-center font-lora text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl ${
            isDarkMode ? "text-[#FFF0D7]" : "text-[#241A16]"
          }`}
        >
          Same Celebration. Cleaner Tomorrow.
        </h1>
      </div>

      {/* Description */}
      <div className="relative z-10 mx-auto mt-4 w-full max-w-2xl sm:mt-5">
        <p
          className={`text-center font-lora text-sm font-medium leading-relaxed sm:text-base md:text-lg lg:text-xl ${
            isDarkMode ? "text-[#D1C5B4]" : "text-[#74645A]"
          }`}
        >
          Discover community celebrations, cultural events and
          firecracker-free festivities across Delhi.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="relative z-10 mt-7 flex w-full max-w-md flex-col items-center justify-center gap-3 sm:mt-9 sm:flex-row sm:gap-4">
        <PrimaryBtnsvg
          text1="Explore Events"
          text2={<ArrowRight size={20} />}
          onClick={() => router.push("/events")}
          width="175px"
          height="45px"
        />

        <SecondryBtnsvg
          text1="Learn More"
          text2={<Play size={21} />}
          onClick={() => router.push("/about")}
          width="175px"
          height="45px"
        />
      </div>
    </section>
  );
}
