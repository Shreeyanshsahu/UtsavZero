
"use client";

import { useTheme } from "@/context/ThemeContext";

interface EventScheduleFormProps {
  startsAt: string;
  endsAt: string;
  onChange: (field: string, value: string) => void;
}

export default function EventScheduleForm({
  startsAt,
  endsAt,
  onChange,
}: EventScheduleFormProps) {
  const { isDarkMode } = useTheme();

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#F0440A] focus:ring-2 focus:ring-[#F0440A]/10 ${
    isDarkMode
      ? "border-[#343B36] bg-[#202522] text-[#FFF8EB]"
      : "border-[#EADCC9] bg-white text-[#38231C]"
  }`;

  const labelClass = `mb-2 block text-sm font-semibold ${
    isDarkMode ? "text-[#FFF8EB]" : "text-[#38231C]"
  }`;

  const headingClass = isDarkMode
    ? "text-[#FFF8EB]"
    : "text-[#38231C]";

  const mutedClass = isDarkMode
    ? "text-[#B7B0A5]"
    : "text-[#A08C7D]";

  // Format the current local time for datetime-local inputs.
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const today = now.toISOString().slice(0, 16);

  return (
    <section className="space-y-5">
      <div>
        <h2
          className={`font-[var(--font-lora)] text-lg font-bold ${headingClass}`}
        >
          Event Schedule
        </h2>

        <p className={`mt-1 text-sm ${mutedClass}`}>
          Choose when your celebration will take place.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="event-starts-at"
            className={labelClass}
          >
            Start Date &amp; Time *
          </label>

          <input
            id="event-starts-at"
            type="datetime-local"
            required
            min={today}
            value={startsAt}
            onChange={(e) => onChange("startsAt", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="event-ends-at"
            className={labelClass}
          >
            End Date &amp; Time *
          </label>

          <input
            id="event-ends-at"
            type="datetime-local"
            required
            min={startsAt || today}
            value={endsAt}
            onChange={(e) => onChange("endsAt", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <p className={`text-xs leading-5 ${mutedClass}`}>
        Make sure the end time is later than the start time. Events must be
        scheduled for a future date.
      </p>
    </section>
  );
}
