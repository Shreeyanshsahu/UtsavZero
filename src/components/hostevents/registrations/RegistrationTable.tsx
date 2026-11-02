
"use client";

import {
  Eye,
  Users,
  CalendarDays,
  Ticket,
  Inbox,
} from "lucide-react";

import { useTheme } from "@/context/ThemeContext";

import type {
  OrganizerRegistration,
} from "@/services/hostevents/registrationService";

interface RegistrationTableProps {
  registrations: OrganizerRegistration[];
  onViewDetails: (registration: OrganizerRegistration) => void;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusClasses(status: string, isDarkMode: boolean) {
  const styles: Record<string, string> = {
    confirmed: isDarkMode
      ? "bg-emerald-500/10 text-emerald-400"
      : "bg-emerald-50 text-emerald-700",

    cancelled: isDarkMode
      ? "bg-red-500/10 text-red-400"
      : "bg-red-50 text-red-700",

    expired: isDarkMode
      ? "bg-orange-500/10 text-orange-400"
      : "bg-orange-50 text-orange-700",
  };

  return styles[status] ??
    (isDarkMode
      ? "bg-gray-500/10 text-gray-400"
      : "bg-gray-100 text-gray-600");
}

export default function RegistrationTable({
  registrations,
  onViewDetails,
}: RegistrationTableProps) {
  const { isDarkMode } = useTheme();

  const headingClass = isDarkMode
    ? "text-[#AFAFA5]"
    : "text-[#806B5D]";

  const primaryText = isDarkMode
    ? "text-[#FFF8EB]"
    : "text-[#38231C]";

  const secondaryText = isDarkMode
    ? "text-[#AFAFA5]"
    : "text-[#8A7B70]";

  // Empty state
  if (registrations.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-2xl border px-6 py-16 text-center ${
          isDarkMode
            ? "border-[#34463A] bg-[#202C24]"
            : "border-[#E9E8DF] bg-white"
        }`}
      >
        <div
          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
            isDarkMode ? "bg-[#34463A]" : "bg-[#F0F3EC]"
          }`}
        >
          <Inbox
            size={26}
            className={isDarkMode ? "text-[#B9DFBF]" : "text-[#52765B]"}
          />
        </div>

        <h3 className={`text-lg font-semibold ${primaryText}`}>
          No registrations found
        </h3>

        <p className={`mt-2 max-w-sm text-sm ${secondaryText}`}>
          There are no registrations matching your current filters.
          New bookings will appear here automatically when loaded.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        isDarkMode
          ? "border-[#34463A] bg-[#202C24]"
          : "border-[#E9E8DF] bg-white"
      }`}
    >
      {/* Table heading */}
      <div className="flex items-center justify-between gap-3 p-5">
        <div>
          <h3 className={`text-base font-bold ${primaryText}`}>
            All Registrations
          </h3>

          <p className={`mt-1 text-xs ${secondaryText}`}>
            {registrations.length} registration
            {registrations.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
            isDarkMode
              ? "bg-[#34463A] text-[#C6D4C8]"
              : "bg-[#F0F3EC] text-[#52765B]"
          }`}
        >
          <Users size={14} />
          Group bookings
        </div>
      </div>

      {/* Responsive table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left">
          <thead
            className={
              isDarkMode
                ? "border-y border-[#34463A] bg-[#26352A]"
                : "border-y border-[#E9E8DF] bg-[#F8F8F3]"
            }
          >
            <tr>
              {[
                "Attendee",
                "Event",
                "Booking Reference",
                "Participants",
                "Booking Date",
                "Booking Status",
                "Check-in",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider ${headingClass}`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {registrations.map((registration) => {
              const isCheckedIn =
                registration.ticket?.status === "checked_in";

              return (
                <tr
                  key={registration.id}
                  className={`border-b last:border-b-0 transition-colors ${
                    isDarkMode
                      ? "border-[#34463A] hover:bg-[#26352A]"
                      : "border-[#F0EFE8] hover:bg-[#FAFBF8]"
                  }`}
                >
                  {/* Attendee */}
                  <td className="px-5 py-4">
                    <p className={`whitespace-nowrap text-sm font-semibold ${primaryText}`}>
                      {registration.attendee_name}
                    </p>

                    <p className={`mt-1 text-xs ${secondaryText}`}>
                      {registration.attendee_email}
                    </p>
                  </td>

                  {/* Event */}
                  <td className="px-5 py-4">
                    <p className={`max-w-[190px] truncate text-sm font-medium ${primaryText}`}>
                      {registration.event.title}
                    </p>

                    <p className={`mt-1 whitespace-nowrap text-xs ${secondaryText}`}>
                      {formatDate(registration.event.starts_at)}
                    </p>
                  </td>

                  {/* Booking reference */}
                  <td className="px-5 py-4">
                    <span className={`whitespace-nowrap font-mono text-xs ${primaryText}`}>
                      {registration.booking_reference}
                    </span>
                  </td>

                  {/* Participants */}
                  <td className="px-5 py-4">
                    <div className={`flex items-center gap-1.5 text-sm ${primaryText}`}>
                      <Users size={14} />
                      {registration.quantity}
                    </div>
                  </td>

                  {/* Booking date */}
                  <td className="px-5 py-4">
                    <span className={`whitespace-nowrap text-sm ${secondaryText}`}>
                      {formatDate(registration.created_at)}
                    </span>
                  </td>

                  {/* Booking status */}
                  <td className="px-5 py-4">
                    <span
                      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                        registration.status,
                        isDarkMode
                      )}`}
                    >
                      {registration.status}
                    </span>
                  </td>

                  {/* Check-in */}
                  <td className="px-5 py-4">
                    <span
                      className={`whitespace-nowrap text-xs font-semibold ${
                        isCheckedIn
                          ? "text-emerald-500"
                          : secondaryText
                      }`}
                    >
                      {isCheckedIn ? "Checked in" : "Not checked in"}
                    </span>
                  </td>

                  {/* View details */}
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onViewDetails(registration)}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                        isDarkMode
                          ? "bg-[#34463A] text-[#C6D4C8] hover:bg-[#405644]"
                          : "bg-[#F0F3EC] text-[#52765B] hover:bg-[#E4EBE1]"
                      }`}
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
