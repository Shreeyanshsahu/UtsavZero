
"use client";

import { useTheme } from "../../context/ThemeContext";

export default function CelebrateSection() {
  const { isDarkMode } = useTheme();

  return (
    <section
      className={`flex w-full flex-col items-center justify-center px-4 py-7 transition-colors duration-300 sm:px-6 sm:py-9 lg:py-10 ${
        isDarkMode ? "bg-[#171A19]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-1 sm:px-4">
        <h1
          className={`text-center font-lora text-[clamp(1.5rem,5vw,2.5rem)] font-bold leading-tight tracking-tight ${
            isDarkMode ? "text-[#FFF0D7]" : "text-[#3D2923]"
          }`}
        >
          Celebrate Together, Breathe Better
        </h1>
      </div>

      <div className="mx-auto mt-3 w-full max-w-3xl px-1 sm:mt-4">
        <p
          className={`text-center font-lora text-sm font-normal leading-relaxed sm:text-base md:text-lg ${
            isDarkMode ? "text-[#B9AD99]" : "text-[#927D70]"
          }`}
        >
          UtsavZero makes it easy to find and join organised,
          firecracker-free celebrations happening across Delhi,
          from cultural festivals to community events.
        </p>
      </div>
    </section>
  );
}
