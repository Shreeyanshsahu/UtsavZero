
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";

const pageNames: Record<string, string> = {
  "/organizer": "Overview",
  "/organizer/organize": "Manage Events",
  "/organizer/registrations": "Registrations",
  "/organizer/check-in": "Check-in Centre",
};

export default function OrganizerHeader() {
  const pathname = usePathname();

  const currentPage =
    pageNames[pathname] ??
    (pathname.startsWith("/organizer/organize")
      ? "Manage Events"
      : "Organizer Workspace");

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#e4eae1] bg-white/90 px-4 backdrop-blur-md dark:border-[#293a30] dark:bg-[#17271e]/90 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile brand marker */}
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f1e8] text-sm font-bold text-[#28613d] dark:bg-[#294333] dark:text-[#b9dfbf] md:hidden">
          U
        </div>

        <div>
          <p className="text-xs font-medium text-[#87958a] dark:text-[#9aafa0]">
            Organizer Workspace
          </p>
          <h2 className="text-sm font-semibold text-[#234b32] dark:text-[#e6f0e7] sm:text-base">
            {currentPage}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden rounded-full bg-[#eaf3e9] px-3 py-1.5 text-xs font-medium text-[#367148] dark:bg-[#294333] dark:text-[#b9dfbf] sm:inline-flex">
          Private Organizer
        </span>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-[#e4eae1] px-3 py-2 text-xs font-semibold text-[#52675a] transition-colors hover:bg-[#f3f6f1] dark:border-[#34463a] dark:text-[#c0d0c3] dark:hover:bg-[#22372a] sm:text-sm"
        >
          <span>Public Website</span>
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </header>
  );
}
