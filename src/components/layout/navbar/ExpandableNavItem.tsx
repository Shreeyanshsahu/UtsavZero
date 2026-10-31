
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface ExpandableNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isDarkMode: boolean;
}

export default function ExpandableNavItem({
  href,
  label,
  icon: Icon,
  isActive,
  isDarkMode,
}: ExpandableNavItemProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      title={label}
      className={`
        group relative flex h-11 w-11 shrink-0 items-center
        overflow-hidden rounded-full
        transition-[width,background-color,box-shadow]
        duration-300 ease-in-out
        hover:w-[150px] focus-visible:w-[150px]
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-[#FF8A32]
        ${
          isActive
            ? "w-[150px] bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] text-white shadow-md"
            : isDarkMode
            ? "bg-[#292E2B] text-[#FFF8EB] hover:bg-[#343B36]"
            : "bg-[#FFF0D8] text-[#38231C] hover:bg-[#FFE5C0]"
        }
      `}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center">
        <Icon size={19} strokeWidth={2} />
      </span>

      <span
        className={`
          whitespace-nowrap pr-4 text-sm font-semibold
          transition-all duration-300
          ${
            isActive
              ? "opacity-100"
              : "max-w-0 -translate-x-2 opacity-0 group-hover:max-w-[100px] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:max-w-[100px] group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          }
        `}
      >
        {label}
      </span>
    </Link>
  );
}
