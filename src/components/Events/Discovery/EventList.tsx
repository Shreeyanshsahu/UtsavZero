
"use client";

import { useMemo } from "react";
import EventCard from "./EventCard";
import type { Event } from "@/types/event";

interface EventListProps {
  events: Event[];
  selectedEventId?: string | null;
  onEventSelect?: (eventId: string) => void;
}

export default function EventList({
  events,
  selectedEventId,
  onEventSelect,
}: EventListProps) {

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) =>
        new Date(a.startDate).getTime() -
        new Date(b.startDate).getTime()
    );
  }, [events]);

  if (sortedEvents.length === 0) {
    return (
      <div className="flex min-h-62.5 flex-col items-center justify-center rounded-xl bg-[#FFF8EC] p-6 text-center">
        <h3 className="font-lora text-lg font-bold text-[#3D2923]">
          No celebrations found
        </h3>

        <p className="mt-2 font-lora text-sm text-[#8B7769]">
          Try changing your search or selecting another category.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {sortedEvents.map((event) => (
        <div
          key={event.id}
          onMouseEnter={() => onEventSelect?.(event.id)}
          onFocus={() => onEventSelect?.(event.id)}
          className={`
            rounded-xl transition-all duration-200
            ${
              selectedEventId === event.id
                ? "ring-2 ring-[#FF8A32] ring-offset-2"
                : ""
            }
          `}
        >
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
}
