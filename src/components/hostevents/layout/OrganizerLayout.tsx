
"use client";

import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import OrganizerSidebar from "@/components/hostevents/layout/OrganizerSidebar";
import { useTheme } from "@/context/ThemeContext";

interface OrganizerLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function OrganizerLayout({
  children,
  title,
  description,
}: OrganizerLayoutProps) {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-[#171A19] text-[#FFF8EB]"
          : "bg-[#FFF8EB] text-[#38231C]"
      }`}
    >
      {/* Existing public navbar - unchanged */}
      <Navbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 pb-10 sm:px-6 lg:px-8">

        {/* Organizer navigation */}
        <OrganizerSidebar />

        {/* Main dashboard content */}
        <main className="min-w-0 flex-1 py-7 sm:py-8">

          <div className="mb-7">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F0440A]">
              Delhi Community Collective
            </p>

            <h1 className="font-[var(--font-lora)] text-2xl font-bold sm:text-3xl">
              {title}
            </h1>

            {description && (
              <p
                className={`mt-2 text-sm sm:text-base ${
                  isDarkMode
                    ? "text-[#B7B0A5]"
                    : "text-[#806B5D]"
                }`}
              >
                {description}
              </p>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
