
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import type { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { isDarkMode } = useTheme();

  const cardBackground = isDarkMode
    ? "bg-[#222826] border border-[#333]"
    : "bg-white";

  const titleColor = isDarkMode
    ? "text-[#FFF0D7]"
    : "text-[#3D2923]";

  const mutedColor = isDarkMode
    ? "text-[#A89587]"
    : "text-[#8B7769]";

  return (
    <Link
      href={`/events/${event.id}`}
      aria-label={`View ${event.title}`}
      className={`
        group block w-full overflow-hidden rounded-xl
        border border-transparent
        transition-all duration-300 ease-in-out
        hover:border-[#F6A044]
        hover:shadow-[0_4px_16px_rgba(240,100,20,0.12)]
        focus-visible:outline-2
        focus-visible:outline-orange-500
        ${cardBackground}
      `}
    >
      <article
        className="
          flex w-full flex-row
          sm:group-hover:flex-col
          sm:group-focus:flex-col
        "
      >
        {/* Event Image */}
        <div
          className="
            relative h-24 w-24 shrink-0 overflow-hidden
            sm:h-36 sm:w-40
            sm:group-hover:h-[125px]
            sm:group-hover:w-full
            sm:group-focus:h-[125px]
            sm:group-focus:w-full
            transition-all duration-300 ease-in-out
          "
        >
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 96px, 100vw"
            className="
              object-cover
              transition-transform duration-500
              group-hover:scale-105
            "
          />
        </div>

        {/* Event Details */}
        <div
          className="
            flex min-w-0 flex-1 flex-col justify-center
            gap-1.5 px-3 py-3
            sm:gap-1.5 sm:px-4 sm:py-3
          "
        >
          {/* Title */}
          <h3
            className={`
              truncate font-lora text-[14px] font-bold leading-5
              sm:text-[17px]
              ${titleColor}
            `}
          >
            {event.title}
          </h3>

          {/* Location */}
          <p
            className={`
              flex items-center gap-1 truncate
              font-lora text-[10px] leading-4
              sm:text-[12px]
              ${mutedColor}
            `}
          >
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">
              {event.venue}, {event.city}
            </span>
          </p>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            {event.category.slice(0, 1).map((category) => (
              <span
                key={category}
                className="
                  rounded-[5px] bg-[#FDE9DF]
                  px-2 py-1
                  font-lora text-[9px] font-medium
                  leading-3 text-[#F0440A]
                  sm:text-[11px]
                "
              >
                {category}
              </span>
            ))}

            {event.isFirecrackerFree && (
              <span
                className="
                  rounded-[5px] bg-[#E8F3E8]
                  px-2 py-1
                  font-lora text-[9px] font-medium
                  leading-3 text-[#557B4B]
                  sm:text-[11px]
                "
              >
                Firecracker-Free
              </span>
            )}
          </div>

          {/* Seats and Arrow */}
          <div className="flex items-center justify-between gap-2">
            <p
              className={`
                font-lora text-[10px] font-medium
                sm:text-[13px]
                ${titleColor}
              `}
            >
              {event.bookedSeats}/{event.totalSeats} seats
            </p>

            <span
              className="
                flex h-7 w-7 shrink-0 items-center justify-center
                rounded-full
                bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A]
                text-white
                transition-transform duration-300
                group-hover:scale-110
              "
            >
              <ArrowRight size={15} strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
