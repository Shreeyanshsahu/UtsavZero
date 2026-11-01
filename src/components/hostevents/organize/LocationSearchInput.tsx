
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LocateFixed,
  LoaderCircle,
  MapPin,
  Search,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface NominatimResult {
  id: string;
  name: string;
  address: string;
  formatted: string;
  lat: number;
  lon: number;
  distance: number | null;
  resultType: string;
}

interface LocationSearchInputProps {
  onSelect: (result: NominatimResult) => void;
  onCurrentLocationDetected?: (
    latitude: number,
    longitude: number
  ) => void;
}

interface AutocompleteResponse {
  results?: NominatimResult[];
  error?: string;
}

export default function LocationSearchInput({
  onSelect,
  onCurrentLocationDetected,
}: LocationSearchInputProps) {
  const { isDarkMode } = useTheme();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const [locationMessage, setLocationMessage] = useState("");
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  const textClass = isDarkMode
    ? "text-[#FFF8EB]"
    : "text-[#38231C]";

  const mutedClass = isDarkMode
    ? "text-[#B7B0A5]"
    : "text-[#806B5D]";

  const inputClass = isDarkMode
    ? "border-[#454C47] bg-[#292E2B] text-[#FFF8EB] placeholder:text-[#8F968F]"
    : "border-[#EADCC9] bg-white text-[#38231C] placeholder:text-[#A39486]";

  const cardClass = isDarkMode
    ? "border-[#454C47] bg-[#292E2B]"
    : "border-[#EADCC9] bg-white";

  // Detect the user's current location.
  // Handle successful location detection.
function handleLocationSuccess(position: GeolocationPosition) {
  setLatitude(position.coords.latitude);
  setLongitude(position.coords.longitude);
  setLocating(false);
  setLocationMessage("Searching near your current location.");
  onCurrentLocationDetected?.(
  position.coords.latitude,
  position.coords.longitude
);
}

// Handle location detection errors.
function handleLocationError(error: GeolocationPositionError) {
  setLocating(false);

  if (error.code === error.PERMISSION_DENIED) {
    setLocationMessage(
      "Location permission denied. You can still search manually."
    );
  } else if (error.code === error.TIMEOUT) {
    setLocationMessage(
      "Location request timed out. Please try again."
    );
  } else {
    setLocationMessage(
      "Couldn't detect your location. You can search manually."
    );
  }
}

// Automatically request location when the picker opens.
useEffect(() => {
  if (!navigator.geolocation) {
    return;
  }

  navigator.geolocation.getCurrentPosition(
    handleLocationSuccess,
    handleLocationError,
    {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 60000,
    }
  );
}, []);
const requestCurrentLocation = () => {
  if (!navigator.geolocation) {
    setLocationMessage(
      "Location detection is not supported by this browser."
    );
    return;
  }

  setLocating(true);
  setLocationMessage("");

  navigator.geolocation.getCurrentPosition(
    handleLocationSuccess,
    handleLocationError,
    {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 60000,
    }
  );
};
  // Live autocomplete with a 350ms debounce.
  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          text: trimmedQuery,
        });

        if (latitude !== null && longitude !== null) {
          params.set("lat", String(latitude));
          params.set("lon", String(longitude));
        }

        const response = await fetch(
          `/api/places/autocomplete?${params.toString()}`,
          { signal: controller.signal }
        );

        const data: AutocompleteResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Location search failed."
          );
        }

        setResults(data.results ?? []);
        setShowResults(true);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to search locations."
        );

        setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, latitude, longitude]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setShowResults(true);

    // Clear previous results immediately.
    setResults([]);
    setError("");
    setLoading(false);
  }

  function handleSelect(result: NominatimResult) {
    setQuery(result.name);
    setShowResults(false);
    setResults([]);

    onSelect(result);
  }

  function formatDistance(distance: number | null) {
    if (distance === null || !Number.isFinite(distance)) {
      return "";
    }

    return distance < 1000
      ? `${Math.round(distance)} m away`
      : `${(distance / 1000).toFixed(1)} km away`;
  }

  return (
    <div className="relative space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search
          size={18}
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`}
        />

        <input
          type="text"
          value={query}
          onChange={(event) =>
            handleQueryChange(event.target.value)
          }
          onFocus={() => setShowResults(true)}
          placeholder="Search school, college, park, venue..."
          autoComplete="off"
          className={`w-full rounded-xl border py-3 pl-10 pr-11 text-sm outline-none focus:border-[#F0440A] focus:ring-1 focus:ring-[#F0440A] ${inputClass}`}
        />

        {loading && (
          <LoaderCircle
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#F0440A]"
          />
        )}
      </div>

      {/* Current location */}
      <button
        type="button"
        onClick={requestCurrentLocation}
        disabled={locating}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition hover:border-[#F0440A] ${cardClass} ${textClass}`}
      >
        {locating ? (
          <LoaderCircle size={17} className="animate-spin" />
        ) : (
          <LocateFixed
            size={17}
            className="text-[#F0440A]"
          />
        )}

        {locating
          ? "Detecting your location..."
          : "Use my current location"}
      </button>

      {locationMessage && (
        <p className={`text-xs ${mutedClass}`}>
          {locationMessage}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {query.trim().length === 1 && (
        <p className={`text-xs ${mutedClass}`}>
          Type at least 2 characters to search.
        </p>
      )}

      {/* Autocomplete suggestions */}
      {showResults && results.length > 0 && (
        <div
          className={`absolute left-0 right-0 z-[1000] max-h-72 overflow-y-auto rounded-xl border shadow-xl ${cardClass}`}
        >
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect(result)}
              className="flex w-full items-start gap-3 border-b p-3 text-left last:border-b-0 hover:bg-[#F0440A]/10"
            >
              <MapPin
                size={18}
                className="mt-1 shrink-0 text-[#F0440A]"
              />

              <span className="min-w-0 flex-1">
                <span
                  className={`block text-sm font-semibold ${textClass}`}
                >
                  {result.name}
                </span>

                <span
                  className={`mt-1 block text-xs ${mutedClass}`}
                >
                  {result.address}
                </span>

                {result.distance !== null && (
                  <span className="mt-1 block text-xs text-[#F0440A]">
                    {formatDistance(result.distance)}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}

      {showResults &&
        !loading &&
        query.trim().length >= 2 &&
        results.length === 0 &&
        !error && (
          <p className={`text-xs ${mutedClass}`}>
            No locations found. Try a different search.
          </p>
        )}
    </div>
  );
}
