"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

import { useTheme } from "@/context/ThemeContext";
import LocationSearchInput, {
  type NominatimResult,
} from "./LocationSearchInput";
import { useState } from "react";

interface EventLocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (
    latitude: number,
    longitude: number
  ) => void;
}
const EventLocationMap = dynamic(
  () => import("./EventLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] w-full animate-pulse rounded-xl bg-gray-200" />
    ),
  }
);

export default function EventLocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: EventLocationPickerProps) {
  const { isDarkMode } = useTheme();
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const headingClass = isDarkMode
    ? "text-[#FFF8EB]"
    : "text-[#38231C]";

  const mutedClass = isDarkMode
    ? "text-[#B7B0A5]"
    : "text-[#806B5D]";

  function handleSearchSelect(result: NominatimResult) {
    const lat = Number(result.lat);
    const lng = Number(result.lon);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return;
    }

    onLocationChange(lat, lng);
  }
  function handleCurrentLocationDetected(
    latitude: number,
    longitude: number
  ) {
    setCurrentLocation([latitude, longitude]);
  }
  return (
    <section className="space-y-4">
      <div>
        <h2
          className={`flex items-center gap-2 font-[var(--font-lora)] text-lg font-bold ${headingClass}`}
        >
          <MapPin className="text-[#F0440A]" size={19} />
          Pinpoint Event Location
        </h2>

        <p className={`mt-1 text-sm ${mutedClass}`}>
          Search for your venue or select its exact position
          directly on the map.
        </p>
      </div>

      <LocationSearchInput
        onSelect={handleSearchSelect}
        onCurrentLocationDetected={handleCurrentLocationDetected}
      />

      <div className="overflow-hidden rounded-xl border border-[#EADCC9]">
        <EventLocationMap
          latitude={latitude}
          longitude={longitude}
          mapCenter={currentLocation}
          onLocationChange={onLocationChange}
        />
      </div>

      {latitude !== null && longitude !== null ? (
        <div
          className={`rounded-xl border p-3 text-sm ${isDarkMode
            ? "border-[#343B36] bg-[#292E2B]"
            : "border-[#EADCC9] bg-[#FFF4E3]"
            }`}
        >
          <p className={`font-semibold ${headingClass}`}>
            <MapPin
              size={15}
              className="mr-1 inline text-[#F0440A]"
            />
            Location selected
          </p>

          <p className={`mt-2 ${mutedClass}`}>
            Latitude: {latitude.toFixed(6)}
          </p>

          <p className={mutedClass}>
            Longitude: {longitude.toFixed(6)}
          </p>
        </div>
      ) : (
        <p className={`text-sm ${mutedClass}`}>
          No location selected. Search for a venue or click
          on the map to place your marker.
        </p>
      )}

      <p className={`text-xs ${mutedClass}`}>
        Tip: You can drag the marker to adjust its exact
        position.
      </p>
    </section>
  );
}