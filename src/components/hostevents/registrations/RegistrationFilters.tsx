
"use client";

import { Search, Filter, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import type { RegistrationEvent } from "@/services/hostevents/registrationService";

interface RegistrationFiltersProps {
  events: RegistrationEvent[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedEvent: string;
  onEventChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

export default function RegistrationFilters({
  events,
  searchQuery,
  onSearchChange,
  selectedEvent,
  onEventChange,
  selectedStatus,
  onStatusChange,
}: RegistrationFiltersProps) {
  const { isDarkMode } = useTheme();

  const inputClasses = `h-11 w-full rounded-xl border px-3 text-sm outline-none transition-colors focus:border-[#6D9977] focus:ring-2 focus:ring-[#6D9977]/20 ${
    isDarkMode
      ? "border-[#3A4B3E] bg-[#202C24] text-[#FFF8EB] placeholder:text-[#89968B]"
      : "border-[#E5E7DF] bg-white text-[#38231C] placeholder:text-[#A49A8E]"
  }`;

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedEvent !== "all" ||
    selectedStatus !== "all";

  const clearFilters = () => {
    onSearchChange("");
    onEventChange("all");
    onStatusChange("all");
  };

  return (
    <div
      className={`mb-5 rounded-2xl border p-4 ${
        isDarkMode
          ? "border-[#34463A] bg-[#202C24]"
          : "border-[#E9E8DF] bg-white"
      }`}
    >
      {/* Filter heading */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter
            size={18}
            className={
              isDarkMode ? "text-[#B9DFBF]" : "text-[#52765B]"
            }
          />

          <h3
            className={`text-sm font-semibold ${
              isDarkMode ? "text-[#FFF8EB]" : "text-[#38231C]"
            }`}
          >
            Filter Registrations
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              isDarkMode
                ? "text-[#B9DFBF] hover:text-white"
                : "text-[#52765B] hover:text-[#294333]"
            }`}
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>

      {/* Filter controls */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <label
            htmlFor="registration-search"
            className={`mb-2 block text-xs font-medium ${
              isDarkMode ? "text-[#B7B0A5]" : "text-[#806B5D]"
            }`}
          >
            Search registrations
          </label>

          <Search
            size={17}
            className={`pointer-events-none absolute left-3 top-[42px] ${
              isDarkMode ? "text-[#89968B]" : "text-[#A49A8E]"
            }`}
          />

          <input
            id="registration-search"
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Name, email, reference..."
            className={`${inputClasses} pl-10`}
          />
        </div>

        {/* Event selection */}
        <div>
          <label
            htmlFor="registration-event"
            className={`mb-2 block text-xs font-medium ${
              isDarkMode ? "text-[#B7B0A5]" : "text-[#806B5D]"
            }`}
          >
            Filter by event
          </label>

          <select
            id="registration-event"
            value={selectedEvent}
            onChange={(event) => onEventChange(event.target.value)}
            className={inputClasses}
          >
            <option value="all">All Events</option>

            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        {/* Booking status */}
        <div>
          <label
            htmlFor="registration-status"
            className={`mb-2 block text-xs font-medium ${
              isDarkMode ? "text-[#B7B0A5]" : "text-[#806B5D]"
            }`}
          >
            Booking status
          </label>

          <select
            id="registration-status"
            value={selectedStatus}
            onChange={(event) => onStatusChange(event.target.value)}
            className={inputClasses}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
    </div>
  );
}
