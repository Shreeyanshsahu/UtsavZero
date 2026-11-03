
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Map,
  MapPinned,
  ClipboardCheck,
  ChartNoAxesCombined,
  History,
  ShieldCheck,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { useTheme } from "@/context/ThemeContext";

interface CivicLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const navigation = [
  {
    label: "Overview",
    href: "/civic",
    icon: LayoutDashboard,
  },
  {
    label: "Locality Explorer",
    href: "/civic/localities",
    icon: Map,
  },
  {
    label: "Zone Planning",
    href: "/civic/zones",
    icon: MapPinned,
  },
  {
    label: "Applications & Authorizations",
    href: "/civic/authorizations",
    icon: ClipboardCheck,
  },
  {
    label: "Planning Intelligence",
    href: "/civic/intelligence",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Audit History",
    href: "/civic/audit",
    icon: History,
  },
];

export default function CivicLayout({
  children,
  title,
  description,
}: CivicLayoutProps) {
  const pathname = usePathname();
  const { isDarkMode, setIsDarkMode } = useTheme();

  // Original UtsavZero theme
  const colors = {
    page: isDarkMode
      ? "bg-[#171A19] text-[#F5EBDD]"
      : "bg-[#FFF8EB] text-[#38231C]",

    heading: isDarkMode
      ? "text-[#F5EBDD]"
      : "text-[#38231C]",

    muted: isDarkMode
      ? "text-[#B8B0A4]"
      : "text-[#806B5D]",

    border: isDarkMode
      ? "border-[#343B36]"
      : "border-[#EADCC9]",

    card: isDarkMode
      ? "border-[#343B36] bg-[#202522]"
      : "border-[#EADCC9] bg-white",

    inactiveNav: isDarkMode
      ? "text-[#B8B0A4] hover:bg-[#292E2B] hover:text-[#F5EBDD]"
      : "text-[#806B5D] hover:bg-[#F5EBDD] hover:text-[#38231C]",

    mobileNav: isDarkMode
      ? "bg-[#292E2B] text-[#B8B0A4]"
      : "bg-[#F5EBDD] text-[#806B5D]",

    demoBadge: isDarkMode
      ? "bg-[#39271D] text-[#FF9A57]"
      : "bg-[#FFF0D8] text-[#E65B16]",

    footerText: isDarkMode
      ? "text-[#99958B]"
      : "text-[#A08C7D]",
  };

  const isActiveRoute = (href: string) => {
    return href === "/civic"
      ? pathname === "/civic"
      : pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${colors.page}`}
    >
      {/* Existing UtsavZero Navbar */}
      <Navbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <div className="mx-auto flex max-w-[1700px] gap-6 px-4 pb-10 sm:px-6 lg:px-8">

        {/* Civic Sidebar */}
        <aside
          className={`hidden w-[245px] shrink-0 border-r py-8 pr-5 lg:flex lg:flex-col ${colors.border}`}
        >
          <div className="mb-7 px-3">
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={20}
                className="text-[#F0440A]"
              />

              <span className="text-sm font-bold">
                Civic Workspace
              </span>
            </div>

            <p className={`mt-2 text-xs ${colors.muted}`}>
              Geospatial planning and intelligence
            </p>
          </div>

          <p
            className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] ${colors.muted}`}
          >
            Planning Modules
          </p>

          <nav className="flex flex-col gap-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-[#FF6A16] to-[#F0440A] text-white shadow-sm"
                      : colors.inactiveNav
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Access Information */}
          <div className="mt-auto px-2 pt-8">
            <div className={`rounded-xl border p-3 ${colors.card}`}>
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={16}
                  className="text-[#F0440A]"
                />

                <span className="text-xs font-bold">
                  Restricted Access
                </span>
              </div>

              <p className={`mt-2 text-[11px] leading-5 ${colors.muted}`}>
                Civic workspace access is limited to authorised
                demonstration accounts.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 py-6 sm:py-8">

          {/* Page Heading */}
          <div className="mb-6">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F0440A]">
                UtsavZero · Civic Intelligence
              </span>

              <span
                className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${colors.demoBadge}`}
              >
                Demo Environment
              </span>
            </div>

            <h1
              className={`font-[var(--font-lora)] text-2xl font-bold sm:text-3xl ${colors.heading}`}
            >
              {title}
            </h1>

            {description && (
              <p className={`mt-2 max-w-3xl text-sm sm:text-base ${colors.muted}`}>
                {description}
              </p>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                    isActive
                      ? "bg-gradient-to-r from-[#FF6A16] to-[#F0440A] text-white"
                      : colors.mobileNav
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Page Content */}
          {children}

          {/* Footer */}
          <p
            className={`mt-8 border-t pt-5 text-[10px] ${colors.border} ${colors.footerText}`}
          >
            UtsavZero Civic Intelligence · Demonstration environment ·
            Decisions are simulated and non-binding.
          </p>
        </main>
      </div>
    </div>
  );
}
