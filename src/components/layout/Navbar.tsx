
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sun,
  Moon,
  Menu,
  X,
  UserRound,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "About", href: "/about" },
  { name: "Impact", href: "/impact" },
];

interface NavbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export default function Navbar({
  isDarkMode,
  setIsDarkMode,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const { user, profile, roles, loading, signOut } = useAuth();

  const getLinkStyle = (href: string) => {
    const isActive = pathname === href;

    if (isActive) {
      return "bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] bg-clip-text font-bold text-transparent";
    }

    return isDarkMode
      ? "text-[#FFF8EB] hover:text-[#FFBE45]"
      : "text-[#38231C] hover:text-[#F0440A]";
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);

    const { error } = await signOut();

    if (error) {
      console.error("Logout error:", error.message);
      setSigningOut(false);
      return;
    }

    closeMobileMenu();
    router.replace("/");
    router.refresh();
    setSigningOut(false);
  };

  const displayName =
    profile?.full_name ||
    user?.email?.split("@")[0] ||
    "My Account";

  const getRoleLabel = () => {
    const labels: string[] = [];

    if (roles.includes("citizen")) labels.push("Citizen");
    if (roles.includes("private_organizer")) labels.push("Organizer");
    if (roles.includes("civic_demo_admin")) labels.push("Civic Admin");

    return labels.join(" · ");
  };

  const themeButton = (
    <button
      type="button"
      onClick={() => setIsDarkMode(!isDarkMode)}
      aria-label={
        isDarkMode ? "Switch to light mode" : "Switch to dark mode"
      }
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
        isDarkMode
          ? "bg-[#292E2B] text-[#FFBE45] hover:bg-[#343B36]"
          : "bg-[#FFF0D8] text-[#F0440A] hover:bg-[#FFE5C0]"
      }`}
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );

  const authActions = (
    <>
      {loading ? (
        <div className="h-9 w-24 animate-pulse rounded-lg bg-black/10" />
      ) : user ? (
        <>
          <div className="flex min-w-0 flex-col">
            <span
              className={`max-w-[150px] truncate text-sm font-semibold ${
                isDarkMode ? "text-[#FFF8EB]" : "text-[#38231C]"
              }`}
            >
              {displayName}
            </span>

            <span className="text-xs text-gray-500">
              {getRoleLabel()}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              isDarkMode
                ? "border-[#454B46] text-[#FFF8EB] hover:bg-[#292E2B]"
                : "border-[#EADCC9] text-[#38231C] hover:bg-[#FFF0D8]"
            }`}
          >
            <LogOut size={16} />
            {signingOut ? "Signing out..." : "Sign Out"}
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isDarkMode
                ? "text-[#FFF8EB] hover:text-[#FFBE45]"
                : "text-[#38231C] hover:text-[#F0440A]"
            }`}
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <header
      className={`relative z-50 w-full transition-colors duration-300 ${
        isDarkMode ? "bg-[#171A19]" : "bg-[#FFF8EB]"
      }`}
    >
      <nav className="mx-auto flex h-[68px] w-full items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="shrink-0"
          aria-label="UtsavZero Home"
        >
          <Image
            src="/UtsavZeroLogo.png"
            alt="UtsavZero"
            width={160}
            height={50}
            priority
            className="h-auto w-[125px] sm:w-[145px] md:w-[160px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex lg:gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`rounded-lg px-4 py-2 text-sm transition-colors duration-200 lg:px-5 ${getLinkStyle(
                link.href
              )}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {authActions}
          {themeButton}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          {themeButton}

          <button
            type="button"
            onClick={() =>
              setIsMobileMenuOpen((previous) => !previous)
            }
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              isDarkMode
                ? "text-[#FFF8EB] hover:bg-[#292E2B]"
                : "text-[#38231C] hover:bg-[#FFF0D8]"
            }`}
          >
            {isMobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          className={`absolute left-0 top-full w-full border-t px-4 pb-5 pt-3 shadow-xl md:hidden ${
            isDarkMode
              ? "border-[#343B36] bg-[#171A19]"
              : "border-[#EADCC9] bg-[#FFF8EB]"
          }`}
        >
          <div className="mx-auto flex max-w-lg flex-col gap-1">

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`rounded-lg px-4 py-3 text-sm transition-colors ${
                  getLinkStyle(link.href)
                } ${
                  pathname === link.href
                    ? isDarkMode
                      ? "bg-[#292E2B]"
                      : "bg-[#FFF0D8]"
                    : "hover:bg-black/5"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Authentication */}
            <div
              className={`mt-3 border-t pt-4 ${
                isDarkMode
                  ? "border-[#343B36]"
                  : "border-[#EADCC9]"
              }`}
            >
              {loading ? (
                <p className="px-4 py-2 text-sm text-gray-500">
                  Loading account...
                </p>
              ) : user ? (
                <div className="space-y-3 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isDarkMode
                          ? "bg-[#292E2B] text-[#FFBE45]"
                          : "bg-[#FFF0D8] text-[#F0440A]"
                      }`}
                    >
                      <UserRound size={20} />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm font-semibold ${
                          isDarkMode
                            ? "text-[#FFF8EB]"
                            : "text-[#38231C]"
                        }`}
                      >
                        {displayName}
                      </p>

                      <p className="text-xs text-gray-500">
                        {getRoleLabel()}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F0440A] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    <LogOut size={16} />
                    {signingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 px-4">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className={`flex-1 rounded-lg border px-4 py-3 text-center text-sm font-medium ${
                      isDarkMode
                        ? "border-[#454B46] text-[#FFF8EB]"
                        : "border-[#EADCC9] text-[#38231C]"
                    }`}
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    onClick={closeMobileMenu}
                    className="flex-1 rounded-lg bg-gradient-to-r from-[#FFBE45] to-[#F0440A] px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
