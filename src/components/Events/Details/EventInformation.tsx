
"use client";

import { MapPin } from "lucide-react";

import type { Event } from "@/types/event";
import { useTheme } from "@/context/ThemeContext";

interface EventInformationProps {
  event: Event;
}

export default function EventInformation({
  event,
}: EventInformationProps) {
  const { isDarkMode } = useTheme();

  const eventDate = new Date(event.startDate);

  const day = eventDate.toLocaleDateString("en-IN", {
    day: "2-digit",
  });

  const month = eventDate.toLocaleDateString("en-IN", {
    month: "short",
  });

  const priceLabel =
    event.price === 0 ? "Free Entry" : `₹${event.price}`;

  const mapQuery = encodeURIComponent(
    `${event.venue}, ${event.address}, ${event.city}`
  );

  const headingColor = isDarkMode
    ? "text-[#FFF0D7]"
    : "text-[#3D2923]";

  const mutedColor = isDarkMode
    ? "text-[#B8B7A9]"
    : "text-[#806E61]";

  const dateTile = isDarkMode
    ? "bg-[#222725]"
    : "bg-white";

  return (
    <section className="mt-4 sm:mt-5">

      {/* Date, Title and Entry Price */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">

        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-5">

          {/* Date Tile */}
          <div
            className={`flex h-[66px] w-[52px] shrink-0 flex-col items-center justify-center rounded-lg transition-colors duration-300 ${dateTile}`}
          >
            <span className={`font-lora text-2xl font-bold leading-none ${headingColor}`}>
              {day}
            </span>

            <span className={`mt-1 text-[11px] ${mutedColor}`}>
              {month}
            </span>
          </div>

          {/* Event Title and Description */}
          <div className="min-w-0 flex-1">
            <h1 className={`font-lora text-xl font-bold leading-tight sm:text-2xl lg:text-3xl ${headingColor}`}>
              {event.title}
            </h1>

            <p className={`mt-1.5 line-clamp-2 text-xs leading-relaxed sm:text-sm ${mutedColor}`}>
              {event.description}
            </p>
          </div>
        </div>

        {/* Entry Price */}
        <div className="shrink-0 pl-[64px] sm:pl-0 sm:text-right">
          <p className="text-base font-bold text-[#F0440A] sm:text-lg">
            {priceLabel}
          </p>
        </div>

      </div>

      {/* Venue and Map */}
      <div className={`mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs sm:text-sm ${headingColor}`}>

        <MapPin
          size={17}
          className="shrink-0 text-[#F0440A]"
        />

        <span className="min-w-0 font-medium">
          {event.venue}, {event.city}
        </span>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-8 items-center text-xs font-semibold text-[#F0440A] transition hover:underline sm:ml-1 sm:text-sm"
        >
          View Map ↗
        </a>

      </div>

    </section>
  );
}
