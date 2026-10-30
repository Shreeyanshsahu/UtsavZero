
"use client";

import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import type { Event } from "@/types/event";
import { useTheme } from "@/context/ThemeContext";

interface EventSummaryProps {
  event: Event;
}

export default function EventSummary({ event }: EventSummaryProps) {
  const { isDarkMode } = useTheme();

  const date = new Date(event.startDate);

  const formattedDate = date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const cardStyle = isDarkMode
    ? "border-[#343B36] bg-[#222725]"
    : "border-[#EADCC9] bg-white";

  const headingColor = isDarkMode
    ? "text-[#FFF0D7]"
    : "text-[#3D2923]";

  const mutedColor = isDarkMode
    ? "text-[#AFA99C]"
    : "text-[#927F70]";

  const categoryStyle = isDarkMode
    ? "bg-[#353B36] text-[#FF7547]"
    : "bg-[#FFF0D8] text-[#F0440A]";

  return (
    <section
      className={`flex w-full min-w-0 flex-col gap-4 rounded-2xl border p-4 transition-colors duration-300 sm:flex-row sm:items-center sm:p-5 ${cardStyle}`}
    >
      {/* Event Image */}
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-36 md:w-40">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, 160px"
          className="object-cover"
        />
      </div>

      {/* Event Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {event.category.map((category) => (
            <span
              key={category}
              className={`rounded-full px-3 py-1 text-[10px] font-semibold ${categoryStyle}`}
            >
              {category}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2
          className={`mt-2 break-words font-lora text-xl font-bold leading-snug sm:text-2xl ${headingColor}`}
        >
          {event.title}
        </h2>

        {/* Date and Venue */}
        <div className={`mt-3 flex flex-col gap-2 text-xs sm:text-sm ${mutedColor}`}>
          <p className="flex min-w-0 items-start gap-2">
            <CalendarDays
              size={15}
              className="mt-0.5 shrink-0 text-[#F0440A]"
              aria-hidden="true"
            />
            <span>{formattedDate}</span>
          </p>

          <p className="flex min-w-0 items-start gap-2">
            <MapPin
              size={15}
              className="mt-0.5 shrink-0 text-[#F0440A]"
              aria-hidden="true"
            />
            <span className="break-words">
              {event.venue}, {event.city}
            </span>
          </p>
        </div>

        {/* Price */}
        <p className="mt-3 text-sm font-bold text-[#F0440A]">
          {event.price === 0 ? "Free Entry" : `₹${event.price}`}
        </p>
      </div>
    </section>
  );
}
