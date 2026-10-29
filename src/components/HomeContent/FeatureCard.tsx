
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";

interface FeatureCardProps {
  title: string;
  location: string;
  image: string;
  category: string;
  seatsAvailable: number;
  totalSeats: number;
  onClick?: () => void;
}
import { useTheme } from "@/context/ThemeContext";
export default function FeatureCard({
  title,
  location,
  image,
  category,
  seatsAvailable,
  totalSeats,
  onClick,
}: FeatureCardProps) {
  const { isDarkMode } = useTheme();
  return (
    <article className={`w-full overflow-hidden rounded-xl ${isDarkMode ? "bg-[#222826]" : "bg-white"}
     ${isDarkMode ? "shadow-[0_2px_4px_rgba(0,0,0,0.5)]" : "shadow-md"}
     ${isDarkMode ? "border border-[#333]" : "border-0"}`}>
      {/* Compact image banner */}
      <div className="relative h-[76px] w-full sm:h-[84px]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 85vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Compact event details */}
      <div className="px-2.5 pb-2.5 pt-2">
        <h3 className={`truncate font-lora text-[14px] font-bold leading-5 ${isDarkMode ? "text-[#FFF0D7]" : "text-[#3D2923]"} sm:text-[15px]`}>
          {title}
        </h3>

        <p className={`mt-0.5 flex items-center gap-1 truncate font-lora text-[10px] leading-4 ${isDarkMode ? "text-[#927D70]" : "text-[#8B7769]"} sm:text-[11px]`}>
          <MapPin size={10} className="shrink-0" />
          <span className="truncate">{location}</span>
        </p>

        {/* Small category pills */}
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className={`rounded-[4px] bg-[#FDE9DF] px-2 py-0.5 font-lora text-[9px] font-medium leading-3 text-[#F0440A]`}>
            {category}
          </span>

          <span className={`rounded-[4px] bg-[#E8F3E8] px-2 py-0.5 font-lora text-[9px] font-medium leading-3 text-[#557B4B]`}>
            Firecracker-Free
          </span>
        </div>

        {/* Seats and small arrow */}
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className={`font-lora text-[10px] font-medium leading-4 ${isDarkMode ? "text-[#FFF0D7]" : "text-[#3D2923]"} sm:text-[11px]`}>
            {seatsAvailable}/{totalSeats} seats
          </p>

          <button
            type="button"
            onClick={onClick}
            aria-label={`View ${title}`}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] text-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
}
