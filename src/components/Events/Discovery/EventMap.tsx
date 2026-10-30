
"use client";

import dynamic from "next/dynamic";
import type { Event } from "@/types/event";

interface EventMapProps {
  events: Event[];
  selectedEventId: string | null;
  onEventSelect: (id: string) => void;
}

const EventMapInner = dynamic(
  () => import("./EventMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full min-h-[400px] animate-pulse rounded-2xl bg-gray-200" />
    ),
  }
);

export default function EventMap({
  events,
  selectedEventId,
  onEventSelect,
}: EventMapProps) {
  return (
    <EventMapInner
      events={events}
      selectedEventId={selectedEventId}
      onEventSelect={onEventSelect}
    />
  );
}
