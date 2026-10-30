
"use client";

import { useRouter } from "next/navigation";
import { Globe2, ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Footer() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <footer
      className={`w-full border-l-2 border-[#FFBE45] px-4 py-4 transition-colors duration-300 sm:px-8 sm:py-3 ${
        isDarkMode ? "bg-[#292E2B]" : "bg-[#FFE5A3]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">

        {/* Mission Statement */}
        <div className="flex min-w-0 items-center justify-center gap-3 sm:justify-start">
          <Globe2
            size={29}
            strokeWidth={1.3}
            className="shrink-0 text-[#65A85B]"
            aria-hidden="true"
          />

          <p
            className={`text-center font-lora text-xs font-bold leading-relaxed sm:text-left sm:text-sm ${
              isDarkMode ? "text-[#FFF0D7]" : "text-[#3D2923]"
            }`}
          >
            A Cleaner, Brighter Delhi
            <br />
            Through Community Celebrations
          </p>
        </div>

        {/* Impact Button */}
        <button
          type="button"
          onClick={() => router.push("/impact")}
          className="
            flex min-h-10 w-full max-w-[240px] shrink-0
            items-center justify-center gap-2
            rounded-full
            bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A]
            px-4 py-2
            font-lora text-xs font-semibold text-white
            shadow-sm
            transition-all duration-300
            hover:scale-[1.02] hover:shadow-md
            active:scale-[0.98]
            focus-visible:outline-2
            focus-visible:outline-offset-4
            focus-visible:outline-orange-500
            sm:w-auto sm:max-w-none sm:px-5 sm:text-sm
          "
        >
          Learn About Our Impact
          <ArrowRight size={15} />
        </button>

      </div>
    </footer>
  );
}
