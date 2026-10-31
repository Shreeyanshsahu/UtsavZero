
import Link from "next/link";
import { UserRound } from "lucide-react";

interface ProfileButtonProps {
  href: string;
  isDarkMode: boolean;
}

export default function ProfileButton({
  href,
  isDarkMode,
}: ProfileButtonProps) {
  return (
    <Link
      href={href}
      aria-label="My Profile"
      title="My Profile"
      className={`
        flex h-11 w-11 shrink-0 items-center justify-center
        rounded-full transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-[#FF8A32]
        ${
          isDarkMode
            ? "bg-[#292E2B] text-[#FFF8EB] hover:bg-[#343B36]"
            : "bg-[#FFF0D8] text-[#38231C] hover:bg-[#FFE5C0]"
        }
      `}
    >
      <UserRound size={19} strokeWidth={2} />
    </Link>
  );
}
