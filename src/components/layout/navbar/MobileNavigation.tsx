
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, UserRound, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavLink {
  name: string;
  href: string;
}

interface MobileNavigationProps {
  links: NavLink[];
  isDarkMode: boolean;
}

export default function MobileNavigation({
  links,
  isDarkMode,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, loading, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    if (signingOut) return;

    setSigningOut(true);
    const { error } = await signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      setSigningOut(false);
      return;
    }

    closeMenu();
    window.location.href = "/";
  };

  const displayName =
    profile?.full_name || user?.email?.split("@")[0] || "My Account";

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
          isDarkMode
            ? "bg-[#292E2B] text-[#FFF8EB]"
            : "bg-[#FFF0D8] text-[#38231C]"
        }`}
      >
        {isOpen ? <X size={21} /> : <Menu size={21} />}
      </button>

      {isOpen && (
        <div
          id="mobile-navigation"
          className={`absolute left-0 top-full w-full border-t px-4 pb-5 pt-3 shadow-xl ${
            isDarkMode
              ? "border-[#343B36] bg-[#171A19]"
              : "border-[#EADCC9] bg-[#FFF8EB]"
          }`}
        >
          <nav className="mx-auto flex max-w-lg flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isDarkMode
                    ? "text-[#FFF8EB] hover:bg-[#292E2B]"
                    : "text-[#38231C] hover:bg-[#FFF0D8]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div
            className={`mx-auto mt-3 max-w-lg border-t pt-4 ${
              isDarkMode ? "border-[#343B36]" : "border-[#EADCC9]"
            }`}
          >
            {loading ? (
              <p className="px-4 py-2 text-sm text-gray-500">
                Loading account...
              </p>
            ) : user ? (
              <div className="flex items-center justify-between gap-3 px-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isDarkMode
                        ? "bg-[#292E2B] text-[#FFBE45]"
                        : "bg-[#FFF0D8] text-[#F0440A]"
                    }`}
                  >
                    <UserRound size={19} />
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
                      Signed in
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={signingOut}
                  aria-label="Sign out"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0440A] text-white disabled:opacity-50"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-3 px-4">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className={`flex-1 rounded-xl border px-4 py-3 text-center text-sm font-medium ${
                    isDarkMode
                      ? "border-[#454B46] text-[#FFF8EB]"
                      : "border-[#EADCC9] text-[#38231C]"
                  }`}
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#FFBE45] to-[#F0440A] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
