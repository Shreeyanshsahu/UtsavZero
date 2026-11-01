"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

interface EventLocationMapProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (latitude: number, longitude: number) => void;
}
interface EventLocationMapProps {
  latitude: number | null;
  longitude: number | null;
  mapCenter: [number, number] | null;
  onLocationChange: (latitude: number, longitude: number) => void;
}
const DEFAULT_POSITION: [number, number] = [28.6139, 77.209];

const markerIcon = L.divIcon({
  className: "event-location-marker",
  html: `
    <div style="
      width: 34px;
      height: 34px;
      background: #F0440A;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      onLocationChange(
        event.latlng.lat,
        event.latlng.lng
      );
    },
  });

  return null;
}

function MapController({
  position,
  mapCenter,
}: {
  position: [number, number] | null;
  mapCenter: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 0.8 });
    } else if (mapCenter) {
      map.flyTo(mapCenter, 15, { duration: 0.8 });
    }
  }, [position, mapCenter, map]);

  return null;
}
export default function EventLocationMap({
  latitude,
  longitude,
  mapCenter,
  onLocationChange,
}: EventLocationMapProps) {
  const position: [number, number] | null =
    latitude !== null && longitude !== null
      ? [latitude, longitude]
      : null;

  return (
    <MapContainer
      center={position ?? mapCenter ?? DEFAULT_POSITION}
      zoom={position ? 16 : mapCenter ? 15 : 11}
      scrollWheelZoom
      className="h-[320px] w-full rounded-xl"
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        maxZoom={19}
      />

      <MapClickHandler onLocationChange={onLocationChange} />

      <MapController
        position={position}
        mapCenter={mapCenter}
      />

      {position && (
        <Marker
          position={position}
          icon={markerIcon}
          draggable
          eventHandlers={{
            dragend(event) {
              const marker = event.target;
              const newPosition = marker.getLatLng();

              onLocationChange(
                newPosition.lat,
                newPosition.lng
              );
            },
          }}
        />
      )}
      {mapCenter && (
        <Marker
          position={mapCenter}
          icon={L.divIcon({
            className: "current-location-marker",
            html: `
        <div style="
          width: 18px;
          height: 18px;
          background: #2563EB;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 0 8px rgba(37,99,235,0.2);
        "></div>
      `,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          })}
          interactive={false}
        />
      )}
    </MapContainer>
  );
}