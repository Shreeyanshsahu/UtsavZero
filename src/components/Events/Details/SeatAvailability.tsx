
"use client";

import {
  CalendarDays,
  Users,
  Leaf,
} from "lucide-react";

import type { Event } from "@/types/event";
import { useTheme } from "@/context/ThemeContext";

interface SeatAvailabilityProps {
  event: Event;
}

export default function SeatAvailability({
  event,
}: SeatAvailabilityProps) {
  const { isDarkMode } = useTheme();

  const availableSeats = Math.max(
    0,
    event.totalSeats - event.bookedSeats
  );

  const isFullyBooked = availableSeats === 0;

  const cardStyle = isDarkMode
    ? "bg-[#292E2B]"
    : "bg-[#FFF0D8]";

  const headingColor = isDarkMode
    ? "text-[#FFF0D7]"
    : "text-[#3D2923]";

  const mutedColor = isDarkMode
    ? "text-[#B8B7A9]"
    : "text-[#806E61]";

  const cards = [
    {
      icon: CalendarDays,
      title: `${event.bookedSeats}/${event.totalSeats}`,
      description: isFullyBooked
        ? "No Seats Available"
        : `${availableSeats} Seats Available`,
    },
    {
      icon: Users,
      title: event.isFamilyFriendly
        ? "All Ages"
        : "Audience Details",
      description: event.isFamilyFriendly
        ? "Family Friendly"
        : "Not Specified",
    },
    {
      icon: Leaf,
      title:
        event.price === 0
          ? "Free Entry"
          : `₹${event.price}`,
      description: "Registration Required",
    },
  ];

  return (
    <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`flex min-h-[76px] items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-300 sm:min-h-[82px] sm:px-4 ${cardStyle}`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Icon
                size={21}
                strokeWidth={1.7}
                className="text-[#F0440A]"
              />
            </div>

            <div className="min-w-0">
              <p className={`text-sm font-semibold leading-5 ${headingColor}`}>
                {card.title}
              </p>

              <p className={`mt-1 text-xs leading-4 ${mutedColor}`}>
                {card.description}
              </p>
            </div>
          </div>
        );
      })}

    </section>
  );
}
