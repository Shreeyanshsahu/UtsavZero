
"use client";

import { useTheme } from "@/context/ThemeContext";

interface EventDetailsFormProps {
  title: string;
  description: string;
  category: string;
  venueName: string;
  address: string;
  onChange: (field: string, value: string) => void;
}

export default function EventDetailsForm({
  title,
  description,
  category,
  venueName,
  address,
  onChange,
}: EventDetailsFormProps) {
  const { isDarkMode } = useTheme();

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#F0440A] focus:ring-2 focus:ring-[#F0440A]/10 ${
    isDarkMode
      ? "border-[#343B36] bg-[#202522] text-[#FFF8EB]"
      : "border-[#EADCC9] bg-white text-[#38231C]"
  }`;

  const labelClass = `mb-2 block text-sm font-semibold ${
    isDarkMode ? "text-[#FFF8EB]" : "text-[#38231C]"
  }`;

  const mutedClass = isDarkMode
    ? "text-[#B7B0A5]"
    : "text-[#806B5D]";

  return (
    <section className="space-y-5">
      <div>
        <h2
          className={`font-[var(--font-lora)] text-lg font-bold ${
            isDarkMode ? "text-[#FFF8EB]" : "text-[#38231C]"
          }`}
        >
          Event Details
        </h2>

        <p className={`mt-1 text-sm ${mutedClass}`}>
          Tell people what your celebration is about.
        </p>
      </div>

      <div>
        <label className={labelClass}>Event Title *</label>
        <input
          required
          maxLength={100}
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="e.g. Diwali Cultural Celebration"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          required
          rows={4}
          maxLength={2000}
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe the activities, performances and experience..."
          className={inputClass}
        />

        <p className={`mt-1 text-right text-xs ${mutedClass}`}>
          {description.length}/2000
        </p>
      </div>

      <div>
        <label className={labelClass}>Event Category *</label>
        <select
          required
          value={category}
          onChange={(e) => onChange("category", e.target.value)}
          className={inputClass}
        >
          <option value="">Select a category</option>
          <option value="cultural">Cultural</option>
          <option value="music">Music</option>
          <option value="food">Food & Cuisine</option>
          <option value="workshop">Workshop</option>
          <option value="family">Family & Kids</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Venue Name *</label>
          <input
            required
            value={venueName}
            onChange={(e) => onChange("venueName", e.target.value)}
            placeholder="Community centre"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Address *</label>
          <input
            required
            value={address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Full event address"
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
}
