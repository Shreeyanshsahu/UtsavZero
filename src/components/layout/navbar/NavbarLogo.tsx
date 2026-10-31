
import Image from "next/image";
import Link from "next/link";

interface NavbarLogoProps {
  onClick?: () => void;
}

export default function NavbarLogo({ onClick }: NavbarLogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="UtsavZero Home"
      className="flex shrink-0 items-center transition-transform duration-200 hover:scale-[1.03]"
    >
      <Image
        src="/UtsavZeroLogo.png"
        alt="UtsavZero"
        width={160}
        height={50}
        priority
        className="h-auto w-[125px] sm:w-[145px]"
      />
    </Link>
  );
}
