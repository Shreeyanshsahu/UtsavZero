
"use client";

import {
  ClipboardList,
  Users,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

import { useTheme } from "@/context/ThemeContext";
import type { OrganizerRegistration } from "@/services/hostevents/registrationService";

interface RegistrationStatsProps {
  registrations: OrganizerRegistration[];
}

export default function RegistrationStats({
  registrations,
}: RegistrationStatsProps) {
  const { isDarkMode } = useTheme();

  // Count confirmed bookings.
  const confirmedBookings = registrations.filter(
    (registration) => registration.status === "confirmed"
  );

  // Sum the number of attendees in confirmed group bookings.
  const totalAttendees = confirmedBookings.reduce(
    (total, registration) => total + registration.quantity,
    0
  );

  // Count attendees belonging to group tickets marked as checked in.
  const checkedInAttendees = confirmedBookings.reduce(
    (total, registration) => {
      if (registration.ticket?.status === "checked_in") {
        return total + registration.quantity;
      }

      return total;
    },
    0
  );

  const stats = [
    {
      label: "Total Registrations",
      value: registrations.length,
      icon: ClipboardList,
      iconColor: "text-blue-500",
      iconBackground: isDarkMode ? "bg-blue-500/10" : "bg-blue-50",
    },
    {
      label: "Confirmed Bookings",
      value: confirmedBookings.length,
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      iconBackground: isDarkMode
        ? "bg-emerald-500/10"
        : "bg-emerald-50",
    },
    {
      label: "Total Attendees",
      value: totalAttendees,
      icon: Users,
      iconColor: "text-orange-500",
      iconBackground: isDarkMode
        ? "bg-orange-500/10"
        : "bg-orange-50",
    },
    {
      label: "Checked-in Attendees",
      value: checkedInAttendees,
      icon: UserCheck,
      iconColor: "text-purple-500",
      iconBackground: isDarkMode
        ? "bg-purple-500/10"
        : "bg-purple-50",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className={`rounded-2xl border p-5 transition-colors ${
              isDarkMode
                ? "border-[#34463A] bg-[#202C24]"
                : "border-[#E9E8DF] bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDarkMode
                      ? "text-[#B7B0A5]"
                      : "text-[#806B5D]"
                  }`}
                >
                  {stat.label}
                </p>

                <p
                  className={`mt-3 text-3xl font-bold tabular-nums ${
                    isDarkMode
                      ? "text-[#FFF8EB]"
                      : "text-[#38231C]"
                  }`}
                >
                  {stat.value.toLocaleString("en-IN")}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBackground}`}
              >
                <Icon size={22} className={stat.iconColor} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
