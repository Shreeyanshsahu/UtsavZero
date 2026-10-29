"use client";
import Image from "next/image";
import PrimaryButton from "@/components/Primarybutton";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";
const navLinks = [
  { name: "Home", href: "/", active: true },
  { name: "Events", href: "/events", active: false },
  { name: "About", href: "/about", active: false },
  { name: "Impact", href: "/impact", active: false },
];
type NavbarProps = {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
};
import { usePathname } from "next/navigation";
export default function Navbar({ isDarkMode, setIsDarkMode }: NavbarProps) {
  const pathname = usePathname();
  return (
    <div
      className={`flex  bg-transparent
        }  items-center justify-between p-4 font-sans w-full h-[60px]`}
    >
      <Image
        src="/UtsavZeroLogo.png"
        alt="UtsavZero Logo"
        width={180}
        height={55}
      />
      {/* Navigation links */}
      <div className="flex items-center gap-3">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-5 py-3 text-sm transition-colors ${isActive
                ? "bg-linear-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] bg-clip-text text-transparent font-bold"
                : isDarkMode
                  ? "font-normal text-[#FFF8EB] hover:text-[#FFBE45]"
                  : "font-normal text-[#38231C] hover:text-[#F0440A]"
                }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
      {/* Dark mode toggle button */}
      <PrimaryButton
        onClick={() => setIsDarkMode(!isDarkMode)}
        text={
          isDarkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )
        }
        width="40px"
        height="40px"
      />
    </div>
  );
}