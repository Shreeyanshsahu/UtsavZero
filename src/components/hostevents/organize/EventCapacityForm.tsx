
"use client";

import { useTheme } from "@/context/ThemeContext";

interface EventCapacityFormProps {
  capacity: number;
  onChange: (field: string, value: number) => void;
}

export default function EventCapacityForm({
  capacity,
  onChange,
}: EventCapacityFormProps) {
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

  const infoCardClass = isDarkMode
    ? "border-[#343B36] bg-[#292E2B]"
    : "border-[#EADCC9] bg-[#FFF4E3]";

  return (
    <section className="space-y-5">
      <div>
        <h2 className={`font-[var(--font-lora)] text-lg font-bold ${headingClass}`}>
          Capacity & Registration
        </h2>

        <p className={`mt-1 text-sm ${mutedClass}`}>
          Set the maximum number of individual attendees for your event.
        </p>
      </div>

      <div>
        <label
          htmlFor="event-capacity"
          className={`mb-2 block text-sm font-semibold ${headingClass}`}
        >
          Maximum Attendee Capacity *
        </label>

        <input
          id="event-capacity"
          type="number"
          min={1}
          max={10000}
          required
          value={capacity}
          onChange={(e) =>
            onChange("capacity", Number(e.target.value))
          }
          className={inputClass}
        />

        <p className={`mt-1 text-xs ${mutedClass}`}>
          Capacity represents individual attendees, not the number of bookings.
        </p>
      </div>

      <div className={`rounded-xl border p-4 ${infoCardClass}`}>
        <p className={`text-sm font-semibold ${headingClass}`}>
          Group booking system
        </p>

        <p className={`mt-1 text-xs leading-5 ${mutedClass}`}>
          Each booking generates one QR ticket for the entire group.
          Scanning that ticket checks in the whole group.
        </p>
      </div>
    </section>
  );
}
