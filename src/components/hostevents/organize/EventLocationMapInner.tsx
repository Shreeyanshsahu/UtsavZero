
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useTheme } from "@/context/ThemeContext";

interface EventLocationMapInnerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  onReverseGeocode?: (address: string) => void;
}

// Default centre: Delhi
const DEFAULT_CENTER: [number, number] = [28.6139, 77.209];
const DEFAULT_ZOOM = 11;
const SELECTED_ZOOM = 15;

/** Rate-limited reverse geocode using Nominatim */
let lastReverseGeocode = 0;

async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  const now = Date.now();
  const elapsed = now - lastReverseGeocode;

  if (elapsed < 1500) {
    await new Promise((resolve) => setTimeout(resolve, 1500 - elapsed));
  }

  lastReverseGeocode = Date.now();

  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: "json",
      addressdetails: "1",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      {
        headers: {
          "User-Agent": "UtsavZero/1.0 (community-celebrations-platform)",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.display_name || null;
  } catch {
    return null;
  }
}

function createMarkerIcon(isDarkMode: boolean) {
  return L.divIcon({
    className: "utsav-map-marker",
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: #F0440A;
        border: 3px solid ${isDarkMode ? "#FFF8EB" : "white"};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 3px 12px rgba(240,68,10,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: grab;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
}

/** Flies the map to the selected point */
function MapController({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      map.flyTo([latitude, longitude], SELECTED_ZOOM, {
        duration: 1,
      });
    }
  }, [latitude, longitude, map]);

  return null;
}

/** Handles click events on the map */
function ClickHandler({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function EventLocationMapInner({
  latitude,
  longitude,
  onLocationChange,
  onReverseGeocode,
}: EventLocationMapInnerProps) {
  const { isDarkMode } = useTheme();

  const markerRef = useRef<L.Marker | null>(null);
  const [isReversing, setIsReversing] = useState(false);

  const markerIcon = useMemo(
    () => createMarkerIcon(isDarkMode),
    [isDarkMode]
  );

  const hasLocation = latitude !== null && longitude !== null;

  const handleDragEnd = useCallback(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const pos = marker.getLatLng();
    onLocationChange(pos.lat, pos.lng);
  }, [onLocationChange]);

  // Reverse geocode when location changes
  useEffect(() => {
    if (!hasLocation || !onReverseGeocode) return;

    let cancelled = false;
    setIsReversing(true);

    reverseGeocode(latitude, longitude).then((address) => {
      if (!cancelled && address) {
        onReverseGeocode(address);
      }
      if (!cancelled) setIsReversing(false);
    });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, hasLocation, onReverseGeocode]);

  return (
    <div className="relative">
      <MapContainer
        center={
          hasLocation
            ? [latitude, longitude]
            : DEFAULT_CENTER
        }
        zoom={hasLocation ? SELECTED_ZOOM : DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className={`h-full w-full ${
          isDarkMode ? "utsav-dark-map" : ""
        }`}
        style={{ minHeight: "300px" }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          maxZoom={19}
        />

        <MapController latitude={latitude} longitude={longitude} />
        <ClickHandler onLocationChange={onLocationChange} />

        {hasLocation && (
          <Marker
            ref={markerRef}
            position={[latitude, longitude]}
            icon={markerIcon}
            draggable={true}
            eventHandlers={{
              dragend: handleDragEnd,
            }}
          />
        )}
      </MapContainer>

      {/* Reverse geocoding indicator */}
      {isReversing && (
        <div className="absolute bottom-3 left-3 z-[1000] rounded-lg bg-black/60 px-3 py-1.5 text-xs text-white">
          Looking up address…
        </div>
      )}

      {/* Instruction overlay when no location is set */}
      {!hasLocation && (
        <div className="pointer-events-none absolute inset-0 z-[400] flex items-center justify-center">
          <div
            className={`rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg ${
              isDarkMode
                ? "bg-[#202522]/90 text-[#FFF8EB]"
                : "bg-white/90 text-[#38231C]"
            }`}
          >
            Click on the map or search to select a location
          </div>
        </div>
      )}
    </div>
  );
}
