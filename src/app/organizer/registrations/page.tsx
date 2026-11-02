
"use client";

import { useMemo, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import OrganizerLayout from "@/components/hostevents/layout/OrganizerLayout";
import RegistrationStats from "@/components/hostevents/registrations/RegistrationStats";
import RegistrationFilters from "@/components/hostevents/registrations/RegistrationFilters";
import RegistrationTable from "@/components/hostevents/registrations/RegistrationTable";
import BookingDetails from "@/components/hostevents/registrations/BookingDetails";

import { useRegistrations } from "@/hooks/hostevents/useRegistrations";
import { useTheme } from "@/context/ThemeContext";

import type {
  OrganizerRegistration,
  RegistrationEvent,
} from "@/services/hostevents/registrationService";

export default function RegistrationsPage() {
  const { isDarkMode } = useTheme();

  // Fetch registration data.
  const {
    registrations,
    loading,
    error,
    refresh,
  } = useRegistrations();

  // Search and filter state.
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Currently selected registration for the details modal.
  const [selectedRegistration, setSelectedRegistration] =
    useState<OrganizerRegistration | null>(null);

  // Extract unique events from the loaded registrations.
  const events = useMemo<RegistrationEvent[]>(() => {
    const eventMap = new Map<string, RegistrationEvent>();

    registrations.forEach((registration) => {
      eventMap.set(registration.event.id, registration.event);
    });

    return Array.from(eventMap.values());
  }, [registrations]);

  // Apply search and filters.
  const filteredRegistrations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return registrations.filter((registration) => {
      // Search by attendee, email, booking reference or ticket.
      const matchesSearch =
        query === "" ||
        registration.attendee_name.toLowerCase().includes(query) ||
        registration.attendee_email.toLowerCase().includes(query) ||
        registration.booking_reference.toLowerCase().includes(query) ||
        registration.event.title.toLowerCase().includes(query) ||
        (registration.ticket?.ticket_number ?? "")
          .toLowerCase()
          .includes(query);

      // Filter by event.
      const matchesEvent =
        selectedEvent === "all" ||
        registration.event_id === selectedEvent;

      // Filter by booking status.
      const matchesStatus =
        selectedStatus === "all" ||
        registration.status === selectedStatus;

      return matchesSearch && matchesEvent && matchesStatus;
    });
  }, [
    registrations,
    searchQuery,
    selectedEvent,
    selectedStatus,
  ]);

  const handleViewDetails = (
    registration: OrganizerRegistration
  ) => {
    setSelectedRegistration(registration);
  };

  return (
    <OrganizerLayout
      title="Registrations"
      description="Manage attendee registrations and group bookings for your events."
    >
      <div className="space-y-5">

        {/* Refresh action */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              isDarkMode
                ? "border-[#34463A] bg-[#22372A] text-[#C0D0C3] hover:bg-[#294333]"
                : "border-[#E4EAE1] bg-white text-[#52675A] hover:bg-[#F3F6F1]"
            }`}
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div
            className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
              isDarkMode
                ? "border-red-500/30 bg-red-500/10"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div>
                <p className="text-sm font-semibold text-red-500">
                  Unable to load registrations
                </p>

                <p className="mt-1 text-sm text-red-500/80">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void refresh()}
              disabled={loading}
              className="self-start rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50 sm:self-center"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && registrations.length === 0 ? (
          <div
            className={`rounded-2xl border p-12 text-center ${
              isDarkMode
                ? "border-[#34463A] bg-[#202C24]"
                : "border-[#E9E8DF] bg-white"
            }`}
          >
            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-[#72977A]"
            />

            <p
              className={`mt-4 text-sm font-medium ${
                isDarkMode
                  ? "text-[#FFF8EB]"
                  : "text-[#38231C]"
              }`}
            >
              Loading your registrations...
            </p>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <RegistrationStats
              registrations={registrations}
            />

            {/* Filters */}
            <RegistrationFilters
              events={events}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedEvent={selectedEvent}
              onEventChange={setSelectedEvent}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />

            {/* Registrations table */}
            <RegistrationTable
              registrations={filteredRegistrations}
              onViewDetails={handleViewDetails}
            />
          </>
        )}

        {/* Booking details modal */}
        <BookingDetails
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
        />

      </div>
    </OrganizerLayout>
  );
}
