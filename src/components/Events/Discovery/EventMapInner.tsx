
"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import type { Event } from "@/types/event";
import { useTheme } from "@/context/ThemeContext";
import EventMapMarker from "./EventMapMarker";

type EventWithCoordinates = Event & {
  latitude: number;
  longitude: number;
};

interface EventMapInnerProps {
  events: Event[];
  selectedEventId: string | null;
  onEventSelect: (id: string) => void;
}

function MapController({
  selectedEvent,
}: {
  selectedEvent: EventWithCoordinates | undefined;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedEvent) {
      map.flyTo(
        [selectedEvent.latitude, selectedEvent.longitude],
        14,
        { duration: 1.2 }
      );
    } else {
      map.flyTo([28.6139, 77.2090], 11, {
        duration: 1.2,
      });
    }
  }, [selectedEvent, map]);

  return null;
}

export default function EventMapInner({
  events,
  selectedEventId,
  onEventSelect,
}: EventMapInnerProps) {
  const { isDarkMode } = useTheme();

  // Only events with valid coordinates can appear on the map.
  const eventsWithCoordinates = events.filter(
    (event): event is EventWithCoordinates =>
      event.latitude !== null &&
      event.longitude !== null
  );

  // Only fly to an event if it has valid coordinates.
  const selectedEvent = eventsWithCoordinates.find(
    (event) => event.id === selectedEventId
  );

  return (
    <MapContainer
      center={[28.6139, 77.2090]}
      zoom={11}
      scrollWheelZoom={true}
      className={`h-full w-full ${
        isDarkMode ? "utsav-dark-map" : ""
      }`}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        maxZoom={19}
      />

      <MapController selectedEvent={selectedEvent} />

      {eventsWithCoordinates.map((event) => (
        <EventMapMarker
          key={event.id}
          event={event}
          isSelected={event.id === selectedEventId}
          onSelect={onEventSelect}
        />
      ))}
    </MapContainer>
  );
}
