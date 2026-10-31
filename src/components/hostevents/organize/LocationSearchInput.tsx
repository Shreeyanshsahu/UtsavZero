
"use client";

import { useCallback, useRef, useState } from "react";
import { Search, MapPin, Loader2, AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  type?: string;
}

interface LocationSearchInputProps {
  onSelect: (result: NominatimResult) => void;
}

export default function LocationSearchInput({
  onSelect,
}: LocationSearchInputProps) {
  const { isDarkMode } = useTheme();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const lastSearchRef = useRef(0);

  const inputClass = `w-full rounded-xl border px-4 py-3 pl-10 text-sm outline-none transition focus:border-[#F0440A] focus:ring-2 focus:ring-[#F0440A]/10 ${
    isDarkMode
      ? "border-[#343B36] bg-[#202522] text-[#FFF8EB] placeholder:text-[#6B6860]"
      : "border-[#EADCC9] bg-white text-[#38231C] placeholder:text-[#B7A99A]"
  }`;

  const mutedClass = isDarkMode ? "text-[#B7B0A5]" : "text-[#806B5D]";

  const resultItemClass = isDarkMode
    ? "border-[#343B36] hover:bg-[#292E2B]"
    : "border-[#EADCC9] hover:bg-[#FFF4E3]";

  const headingClass = isDarkMode ? "text-[#FFF8EB]" : "text-[#38231C]";

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();

    if (trimmed.length < 3) {
      setError("Please enter at least 3 characters to search.");
      return;
    }

    // Rate-limit: at least 1 second between requests (Nominatim policy)
    const now = Date.now();
    const elapsed = now - lastSearchRef.current;

    if (elapsed < 1000) {
      const wait = 1000 - elapsed;
      await new Promise((resolve) => setTimeout(resolve, wait));
    }

    // Abort any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");
    setResults([]);
    setSearched(true);

    try {
      lastSearchRef.current = Date.now();

      const params = new URLSearchParams({
        q: trimmed,
        format: "json",
        addressdetails: "1",
        limit: "5",
        countrycodes: "in",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        {
          signal: controller.signal,
          headers: {
            "User-Agent": "UtsavZero/1.0 (community-celebrations-platform)",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "Too many requests. Please wait a moment and try again."
          );
        }
        throw new Error("Location search failed. Please try again.");
      }

      const data: NominatimResult[] = await response.json();

      if (!controller.signal.aborted) {
        setResults(data);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;

      setError(
        err instanceof Error
          ? err.message
          : "Unable to search for locations. Please try again."
      );
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  }

  function handleSelectResult(result: NominatimResult) {
    onSelect(result);
    setQuery(result.display_name.split(",").slice(0, 2).join(",").trim());
    setResults([]);
    setSearched(false);
  }

  return (
    <div className="space-y-3">
      {/* Search input with button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${mutedClass}`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search venue, landmark or address..."
            className={inputClass}
            aria-label="Search for a location"
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || query.trim().length < 3}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Search location"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Attribution */}
      <p className={`text-[10px] ${mutedClass}`}>
        Search powered by{" "}
        <a
          href="https://nominatim.openstreetmap.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          OpenStreetMap Nominatim
        </a>
        {" · "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          © OpenStreetMap contributors
        </a>
      </p>

      {/* Error */}
      {error && (
        <div
          className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
            isDarkMode
              ? "border-red-900 bg-red-950/30 text-red-300"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <ul
          className={`max-h-60 overflow-y-auto rounded-xl border ${
            isDarkMode ? "border-[#343B36] bg-[#202522]" : "border-[#EADCC9] bg-white"
          }`}
          role="listbox"
          aria-label="Location search results"
        >
          {results.map((result) => (
            <li key={result.place_id}>
              <button
                type="button"
                onClick={() => handleSelectResult(result)}
                className={`flex w-full items-start gap-3 border-b px-4 py-3 text-left text-sm transition last:border-b-0 ${resultItemClass}`}
                role="option"
                aria-selected={false}
              >
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[#F0440A]"
                />
                <span className={headingClass}>
                  {result.display_name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {searched && !loading && !error && results.length === 0 && (
        <p className={`text-sm ${mutedClass}`}>
          No locations found. Try a different search term.
        </p>
      )}
    </div>
  );
}
