
"use client";

import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface FeatureCardProps {
  title: string;
  location: string;
  image: string;
  category: string;
  seatsAvailable: number;
  totalSeats: number;
  onClick?: () => void;
}

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

  const availableSeats = Math.max(0, seatsAvailable);
  const isFullyBooked = availableSeats === 0;

  return (
    <article
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View ${title}` : undefined}
      className={`group w-full min-w-0 overflow-hidden rounded-xl border transition-all duration-300 ${
        isDarkMode
          ? "border-[#333B36] bg-[#222826] shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          : "border-[#EADCC9] bg-white shadow-sm hover:shadow-md"
      } ${
        onClick
          ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          : ""
      }`}
    >
      {/* Event Image */}
      <div className="relative h-[100px] w-full overflow-hidden sm:h-[115px] lg:h-[125px]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 420px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>

      {/* Event Details */}
      <div className="p-3 sm:p-3.5">
        <h3
          className={`truncate font-lora text-sm font-bold leading-5 sm:text-base ${
            isDarkMode ? "text-[#FFF0D7]" : "text-[#3D2923]"
          }`}
        >
          {title}
        </h3>

        {/* Location */}
        <p
          className={`mt-1 flex min-w-0 items-center gap-1.5 font-lora text-xs leading-4 ${
            isDarkMode ? "text-[#B8B7A9]" : "text-[#8B7769]"
          }`}
        >
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{location}</span>
        </p>

        {/* Category Badges */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="max-w-full truncate rounded-md bg-[#FDE9DF] px-2 py-1 font-lora text-[10px] font-medium leading-3 text-[#F0440A]">
            {category}
          </span>

          <span className="rounded-md bg-[#E8F3E8] px-2 py-1 font-lora text-[10px] font-medium leading-3 text-[#557B4B]">
            Firecracker-Free
          </span>
        </div>

        {/* Seats and Action */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <p
            className={`min-w-0 truncate font-lora text-xs font-semibold sm:text-sm ${
              isDarkMode ? "text-[#FFF0D7]" : "text-[#3D2923]"
            }`}
          >
            {isFullyBooked
              ? "Fully Booked"
              : `${availableSeats}/${totalSeats} seats available`}
          </p>

          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] text-white transition-transform duration-200 group-hover:translate-x-1"
          >
            <ArrowRight size={16} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </article>
  );
}
