
"use client";

import { MapPin } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface Locality {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface EventLocalitySelectProps {
  localities: Locality[];
  localityId: string;
  onChange: (localityId: string) => void;
  loading?: boolean;
}

export default function EventLocalitySelect({
  localities,
  localityId,
  onChange,
  loading = false,
}: EventLocalitySelectProps) {
  const { isDarkMode } = useTheme();

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#F0440A] focus:ring-2 focus:ring-[#F0440A]/10 ${
    isDarkMode
      ? "border-[#343B36] bg-[#202522] text-[#FFF8EB]"
      : "border-[#EADCC9] bg-white text-[#38231C]"
  }`;

  const headingClass = isDarkMode
    ? "text-[#FFF8EB]"
    : "text-[#38231C]";

  const mutedClass = isDarkMode
    ? "text-[#B7B0A5]"
    : "text-[#806B5D]";

  return (
    <section className="space-y-4">
      <div>
        <h2
          className={`font-[var(--font-lora)] text-lg font-bold ${headingClass}`}
        >
          Event Location
        </h2>

        <p className={`mt-1 text-sm ${mutedClass}`}>
          Select the locality where your event will take place.
        </p>
      </div>

      <div>
        <label
          htmlFor="event-locality"
          className={`mb-2 flex items-center gap-2 text-sm font-semibold ${headingClass}`}
        >
          <MapPin size={16} className="text-[#F0440A]" />
          Locality
        </label>

        <select
          id="event-locality"
          value={localityId}
          disabled={loading}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <option value="">Select a locality (optional)</option>

          {localities.map((locality) => (
            <option key={locality.id} value={locality.id}>
              {locality.name}, {locality.city}
            </option>
          ))}
        </select>

        {loading ? (
          <p className={`mt-2 text-xs ${mutedClass}`}>
            Loading localities...
          </p>
        ) : localities.length === 0 ? (
          <p className={`mt-2 text-xs ${mutedClass}`}>
            No localities are available yet. You can still create an event
            without selecting one.
          </p>
        ) : (
          <p className={`mt-2 text-xs ${mutedClass}`}>
            Locality selection is optional for now.
          </p>
        )}
      </div>
    </section>
  );
}
