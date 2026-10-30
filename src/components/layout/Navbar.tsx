
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        {/* Desktop Theme Toggle */}
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
          className={`hidden h-10 w-10 items-center justify-center rounded-full transition-colors md:flex ${
            isDarkMode
              ? "bg-[#292E2B] text-[#FFBE45] hover:bg-[#343B36]"
              : "bg-[#FFF0D8] text-[#F0440A] hover:bg-[#FFE5C0]"
          }`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              isDarkMode
                ? "bg-[#292E2B] text-[#FFBE45]"
                : "bg-[#FFF0D8] text-[#F0440A]"
            }`}
          >
            {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

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
          </div>
        </div>
      )}
    </header>
  );
}
