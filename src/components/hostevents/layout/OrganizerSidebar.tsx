
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  ScanLine,
  ChartNoAxesCombined,
  Settings,
  Leaf,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const navigation = [
  {
    label: "Overview",
    href: "/organizer",
    icon: LayoutDashboard,
  },
  {
    label: "My Events",
    href: "/organizer/organize",
    icon: CalendarDays,
  },
  {
    label: "Registrations",
    href: "/organizer/registrations",
    icon: ClipboardList,
  },
  {
    label: "Check-in",
    href: "/organizer/check-in",
    icon: ScanLine,
  },
  {
    label: "Analytics",
    href: "/organizer/analytics",
    icon: ChartNoAxesCombined,
    comingSoon: true,
  },
  {
    label: "Settings",
    href: "/organizer/settings",
    icon: Settings,
    comingSoon: true,
  },
];

export default function OrganizerSidebar() {
  const pathname = usePathname();
  const { isDarkMode } = useTheme();

  return (
    <aside
      className={`hidden w-[220px] shrink-0 flex-col border-r py-7 pr-5 md:flex ${
        isDarkMode
          ? "border-[#343B36]"
          : "border-[#EADCC9]"
      }`}
    >
      <div className="flex flex-1 flex-col">

        <p
          className={`mb-5 px-3 text-[10px] font-bold uppercase tracking-[0.18em] ${
            isDarkMode
              ? "text-[#8E968F]"
              : "text-[#A08C7D]"
          }`}
        >
          Organiser Space
        </p>

        <nav className="flex flex-col gap-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/organizer"
                ? pathname === "/organizer"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            const baseStyle =
              "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all";

            if (item.comingSoon) {
              return (
                <div
                  key={item.label}
                  title="Coming soon"
                  className={`${baseStyle} cursor-not-allowed opacity-50 ${
                    isDarkMode
                      ? "text-[#B7B0A5]"
                      : "text-[#806B5D]"
                  }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                  <span className="ml-auto text-[9px]">Soon</span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${baseStyle} ${
                  isActive
                    ? isDarkMode
                      ? "bg-[#3A3025] text-[#FFBE45]"
                      : "bg-[#FFF0D8] text-[#F0440A]"
                    : isDarkMode
                      ? "text-[#C8C1B6] hover:bg-[#292E2B] hover:text-[#FFBE45]"
                      : "text-[#806B5D] hover:bg-[#FFF0D8] hover:text-[#F0440A]"
                }`}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Brand message */}
      <div
        className={`mt-10 rounded-xl border p-3 ${
          isDarkMode
            ? "border-[#343B36] bg-[#202522]"
            : "border-[#EADCC9] bg-[#FFF4E3]"
        }`}
      >
        <div className="flex items-center gap-2">
          <Leaf size={17} className="text-[#6D9B68]" />
          <span className="text-xs font-semibold">
            A little less smoke.
          </span>
        </div>

        <p
          className={`mt-1 text-xs leading-5 ${
            isDarkMode
              ? "text-[#B7B0A5]"
              : "text-[#806B5D]"
          }`}
        >
          A lot more together.
          <br />
          Same Celebration. Cleaner Tomorrow.
        </p>
      </div>
    </aside>
  );
}
