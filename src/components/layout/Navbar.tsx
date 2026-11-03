
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

import NavbarLogo from "./navbar/NavbarLogo";
import RoleNavigation from "./navbar/RoleNavigation";
import LogoutButton from "./navbar/LogoutButton";
import ThemeToggle from "./navbar/ThemeToggle";
import MobileNavigation from "./navbar/MobileNavigation";

interface NavbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export default function Navbar({
  isDarkMode,
  setIsDarkMode,
}: NavbarProps) {
  const { user, roles, loading } = useAuth();

  const isCivicAdmin = roles.includes("civic_demo_admin");

  const canHostEvents =
    roles.includes("private_organizer") ||
    roles.includes("government_organizer");

  // Determine the correct account destination.
  const profileHref = isCivicAdmin
    ? "/civic"
    : canHostEvents
    ? "/organizer"
    : "/profile";

  const profileLabel = isCivicAdmin
    ? "Civic Portal"
    : canHostEvents
    ? "Dashboard"
    : "Profile";

  // Public navigation links.
  const publicLinks = !user
    ? [
        { name: "Home", href: "/" },
        { name: "Events", href: "/events" },
        { name: "About", href: "/about" },
        { name: "Impact", href: "/impact" },
      ]
    : isCivicAdmin
    ? [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Impact", href: "/impact" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Events", href: "/events" },
        { name: "About", href: "/about" },
        { name: "Impact", href: "/impact" },
      ];

  // Mobile navigation links.
  const mobileLinks = [
    ...publicLinks,
    ...(user
      ? [
          {
            name: profileLabel,
            href: profileHref,
          },
          ...(canHostEvents
            ? [
                {
                  name: "Host Event",
                  href: "/organizer/organize",
                },
              ]
            : []),
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-3 py-2 sm:px-6 sm:py-3">
      <nav
        className={`
          relative mx-auto flex h-[68px] max-w-7xl
          items-center justify-between rounded-2xl border
          px-3 shadow-lg backdrop-blur-xl transition-colors
          duration-300 sm:px-5
          ${
            isDarkMode
              ? "border-[#343B36] bg-[#171A19]/95 shadow-black/20"
              : "border-[#EADCC9] bg-[#FFF8EB]/95 shadow-[#38231C]/10"
          }
        `}
      >
        <NavbarLogo />

        {/* Desktop public navigation */}
        <div className="hidden items-center gap-2 lg:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                rounded-lg px-3 py-2 text-sm font-medium
                transition-colors
                ${
                  isDarkMode
                    ? "text-[#FFF8EB] hover:bg-[#292E2B] hover:text-[#FFBE45]"
                    : "text-[#38231C] hover:bg-[#FFF0D8] hover:text-[#F0440A]"
                }
              `}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop account actions */}
        <div className="hidden items-center gap-2 md:flex">
          {!loading && user && (
            <>
              <RoleNavigation isDarkMode={isDarkMode} />

              <div
                className={`mx-1 h-7 w-px ${
                  isDarkMode ? "bg-[#454B46]" : "bg-[#EADCC9]"
                }`}
              />

              <LogoutButton isDarkMode={isDarkMode} />
            </>
          )}

          {!loading && !user && (
            <>
              <Link
                href="/login"
                className={`
                  rounded-lg px-3 py-2 text-sm font-medium
                  ${
                    isDarkMode
                      ? "text-[#FFF8EB] hover:text-[#FFBE45]"
                      : "text-[#38231C] hover:text-[#F0440A]"
                  }
                `}
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="
                  rounded-xl bg-gradient-to-r
                  from-[#FFBE45] via-[#FF6A16] to-[#F0440A]
                  px-4 py-2 text-sm font-semibold text-white
                  transition-opacity hover:opacity-90
                "
              >
                Sign Up
              </Link>
            </>
          )}

          <ThemeToggle
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />

          <MobileNavigation
            links={mobileLinks}
            isDarkMode={isDarkMode}
          />
        </div>
      </nav>
    </header>
  );
}
