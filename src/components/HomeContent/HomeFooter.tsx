
"use client";

import { useRouter } from "next/navigation";
import { Globe2, ArrowRight } from "lucide-react";

export default function HomeFooter() {
  const router = useRouter();

  return (
    <footer className="w-full border-l-2 border-[#FFBE45] bg-[#FFE5A3] px-5 py-2 sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        {/* Mission statement */}
        <div className="flex min-w-0 items-center gap-3">
          <Globe2
            size={29}
            strokeWidth={1.3}
            className="shrink-0 text-[#65A85B]"
          />

          <p className="font-lora text-xs font-bold leading-[1.35] text-[#3D2923] sm:text-sm">
            A Cleaner, Brighter Delhi
            <br />
            Through Community Celebrations
          </p>
        </div>

        {/* Impact button */}
        <button
          type="button"
          onClick={() => router.push("/impact")}
          className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] px-4 py-2 font-lora text-[10px] font-semibold text-white transition-transform hover:scale-[1.02] sm:px-5 sm:text-[11px]"
        >
          Learn About Our Impact
          <ArrowRight size={14} />
        </button>
      </div>
    </footer>
  );
}
