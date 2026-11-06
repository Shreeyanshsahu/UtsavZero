
"use client";

import Navbar from "@/components/layout/Navbar";
import DiwaliPollutionComparison from "@/components/environmental/DiwaliPollutionComparision";
import { useTheme } from "@/context/ThemeContext";
import { Activity, Leaf } from "lucide-react";

export default function ImpactPage() {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${
        isDarkMode ? "bg-[#171A19]" : "bg-[#FFFAF1]"
      }`}
    >
      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 -right-32 h-[450px] w-[450px] rounded-full blur-[120px] ${
            isDarkMode ? "bg-orange-900/10" : "bg-orange-200/35"
          }`}
        />
        <div
          className={`absolute top-[850px] -left-40 h-[400px] w-[400px] rounded-full blur-[120px] ${
            isDarkMode ? "bg-emerald-900/10" : "bg-amber-100/50"
          }`}
        />
      </div>

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-12 sm:px-8 lg:px-10">

        {/* Page introduction */}
        <section className="mb-10 max-w-3xl">
          <div
            className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide ${
              isDarkMode
                ? "border-orange-900/50 bg-orange-950/30 text-orange-300"
                : "border-orange-200 bg-orange-50 text-orange-700"
            }`}
          >
            <Activity size={15} />
            UTSAVZERO · ENVIRONMENTAL IMPACT
          </div>

          <h1
            className={`text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl ${
              isDarkMode ? "text-[#F8F1E7]" : "text-[#38231C]"
            }`}
            style={{ fontFamily: "var(--font-lora)" }}
          >
            Celebrations can be
            <span className="block bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] bg-clip-text text-transparent">
              part of the solution.
            </span>
          </h1>

          <p
            className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${
              isDarkMode ? "text-[#A9B1A8]" : "text-[#806B5D]"
            }`}
          >
            Explore historical air-quality observations around
            Diwali, understand particulate matter trends, and see
            how environmental intelligence can support more
            responsible community celebrations.
          </p>

          <div
            className={`mt-7 flex items-center gap-3 border-l-2 pl-4 text-xs leading-6 ${
              isDarkMode
                ? "border-orange-500/60 text-[#A9B1A8]"
                : "border-orange-400 text-[#806B5D]"
            }`}
          >
            <Leaf
              size={18}
              className="shrink-0 text-orange-500"
            />
            <p>
              Our mission is an aspirational vision for a cleaner
              Delhi. The observations below describe historical
              environmental conditions, not measured reductions
              caused by UtsavZero.
            </p>
          </div>
        </section>

        {/* Environmental analysis */}
        <section>
          <DiwaliPollutionComparison />
        </section>

        {/* Footer note */}
        <div
          className={`mt-12 border-t pt-6 text-center text-xs ${
            isDarkMode
              ? "border-[#343D36] text-[#78847A]"
              : "border-[#EADCC9] text-[#A18D79]"
          }`}
        >
          UtsavZero · Evidence-led planning · Responsible celebrations
        </div>
      </main>
    </div>
  );
}
