
"use client";

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

import type { Event } from "@/types/event";

interface EventMapMarkerProps {
  event: Event;
  isSelected: boolean;
  onSelect: (eventId: string) => void;
}

function getMarkerColor(event: Event) {
  if (event.category.includes("Cultural")) return "#F0440A";
  if (event.category.includes("Music")) return "#4CAF50";
  if (event.category.includes("Workshop")) return "#FFC247";
  if (event.category.includes("Food")) return "#E87B32";

  return "#D58BA8";
}

export default function EventMapMarker({
  event,
  isSelected,
  onSelect,
}: EventMapMarkerProps) {
  const color = getMarkerColor(event);

  const markerSize = isSelected ? 34 : 26;

  const markerIcon = useMemo(() => {
    return L.divIcon({
      className: "utsav-map-marker",

      html: `
        <div style="
          width: ${markerSize}px;
          height: ${markerSize}px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
      `,

      iconSize: [markerSize, markerSize],
      iconAnchor: [markerSize / 2, markerSize],
      popupAnchor: [0, -30],
    });
  }, [color, markerSize]);

  return (
    <Marker
      position={[event.latitude, event.longitude]}
      icon={markerIcon}
      eventHandlers={{
        click: () => onSelect(event.id),
      }}
    >
      <Popup>
        <div className="min-w-[150px] font-lora">
          <p className="font-bold text-[#3D2923]">
            {event.title}
          </p>

          <p className="mt-1 text-xs text-[#8B7769]">
            {event.venue}
          </p>

          <p className="mt-1 text-xs text-[#F0440A]">
            {event.bookedSeats}/{event.totalSeats} seats
          </p>

          <Link
            href={`/events/${event.id}`}
            className="mt-2 inline-block text-xs font-semibold text-orange-600"
          >
            View event →
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
