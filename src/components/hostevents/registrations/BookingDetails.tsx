
"use client";

import {
  X,
  User,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  Users,
  Ticket,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useTheme } from "@/context/ThemeContext";

import type {
  OrganizerRegistration,
} from "@/services/hostevents/registrationService";

interface BookingDetailsProps {
  registration: OrganizerRegistration | null;
  onClose: () => void;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function BookingDetails({
  registration,
  onClose,
}: BookingDetailsProps) {
  const { isDarkMode } = useTheme();

  if (!registration) {
    return null;
  }

  const isCheckedIn =
    registration.ticket?.status === "checked_in";

  const cardClass = isDarkMode
    ? "border-[#34463A] bg-[#202C24]"
    : "border-[#E9E8DF] bg-white";

  const headingClass = isDarkMode
    ? "text-[#FFF8EB]"
    : "text-[#38231C]";

  const secondaryClass = isDarkMode
    ? "text-[#AFAFA5]"
    : "text-[#806B5D]";

  const detailRows = [
    {
      label: "Attendee name",
      value: registration.attendee_name,
      icon: User,
    },
    {
      label: "Email address",
      value: registration.attendee_email,
      icon: Mail,
    },
    {
      label: "Phone number",
      value: registration.attendee_phone || "Not provided",
      icon: Phone,
    },
    {
      label: "Event",
      value: registration.event.title,
      icon: MapPin,
    },
    {
      label: "Event date",
      value: formatDate(registration.event.starts_at),
      icon: CalendarDays,
    },
    {
      label: "Booking date",
      value: formatDate(registration.created_at),
      icon: Clock,
    },
    {
      label: "Participants",
      value: `${registration.quantity} attendee${
        registration.quantity !== 1 ? "s" : ""
      }`,
      icon: Users,
    },
    {
      label: "Booking reference",
      value: registration.booking_reference,
      icon: Ticket,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-details-title"
        className={`max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border shadow-2xl ${cardClass}`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between border-b p-5 ${
            isDarkMode
              ? "border-[#34463A] bg-[#202C24]"
              : "border-[#E9E8DF] bg-white"
          }`}
        >
          <div>
            <h2
              id="booking-details-title"
              className={`text-xl font-bold ${headingClass}`}
            >
              Registration Details
            </h2>

            <p className={`mt-1 text-xs ${secondaryClass}`}>
              Booking reference: {registration.booking_reference}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close registration details"
            className={`rounded-xl p-2 transition-colors ${
              isDarkMode
                ? "text-[#B7B0A5] hover:bg-[#34463A]"
                : "text-[#806B5D] hover:bg-[#F0F3EC]"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* Attendee information */}
          <section>
            <h3 className={`mb-3 text-sm font-bold ${headingClass}`}>
              Attendee Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {detailRows.slice(0, 3).map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={`rounded-xl border p-3 ${cardClass}`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Icon size={15} className="text-[#72977A]" />
                      <span className={`text-xs ${secondaryClass}`}>
                        {item.label}
                      </span>
                    </div>

                    <p className={`break-words text-sm font-semibold ${headingClass}`}>
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Event and booking information */}
          <section>
            <h3 className={`mb-3 text-sm font-bold ${headingClass}`}>
              Event & Booking Information
            </h3>

            <div className={`divide-y rounded-xl border px-4 ${cardClass}`}>
              {detailRows.slice(3).map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={`flex items-start gap-3 py-3 ${
                      isDarkMode
                        ? "border-[#34463A]"
                        : "border-[#F0EFE8]"
                    }`}
                  >
                    <Icon
                      size={16}
                      className="mt-0.5 shrink-0 text-[#72977A]"
                    />

                    <div className="min-w-0">
                      <p className={`text-xs ${secondaryClass}`}>
                        {item.label}
                      </p>

                      <p className={`mt-1 break-words text-sm font-medium ${headingClass}`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Payment information */}
          <section>
            <h3 className={`mb-3 text-sm font-bold ${headingClass}`}>
              Payment Information
            </h3>

            <div className={`rounded-xl border p-4 ${cardClass}`}>
              <div className="mb-3 flex items-center gap-2">
                <CreditCard size={17} className="text-[#72977A]" />
                <span className={`text-sm font-semibold ${headingClass}`}>
                  Payment Summary
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between gap-3 text-sm">
                  <span className={secondaryClass}>Price per attendee</span>
                  <span className={headingClass}>
                    {formatCurrency(
                      registration.unit_price,
                      registration.currency
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className={secondaryClass}>Participants</span>
                  <span className={headingClass}>
                    {registration.quantity}
                  </span>
                </div>

                <div
                  className={`flex justify-between gap-3 border-t pt-3 ${
                    isDarkMode
                      ? "border-[#34463A]"
                      : "border-[#E9E8DF]"
                  }`}
                >
                  <span className={`font-semibold ${headingClass}`}>
                    Total amount
                  </span>

                  <span className={`font-bold ${headingClass}`}>
                    {formatCurrency(
                      registration.total_amount,
                      registration.currency
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-3 pt-1 text-sm">
                  <span className={secondaryClass}>Payment status</span>
                  <span className={`font-semibold capitalize ${headingClass}`}>
                    {registration.payment_status.replaceAll("_", " ")}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Ticket information */}
          <section>
            <h3 className={`mb-3 text-sm font-bold ${headingClass}`}>
              Ticket & Check-in
            </h3>

            <div className={`rounded-xl border p-4 ${cardClass}`}>
              {registration.ticket ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-xs ${secondaryClass}`}>
                        Ticket number
                      </p>

                      <p className={`mt-1 font-mono text-sm font-bold ${headingClass}`}>
                        {registration.ticket.ticket_number}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isCheckedIn
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-orange-500/10 text-orange-500"
                      }`}
                    >
                      {registration.ticket.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div
                    className={`mt-4 flex items-center gap-2 text-sm ${
                      isCheckedIn
                        ? "text-emerald-500"
                        : secondaryClass
                    }`}
                  >
                    {isCheckedIn ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <Clock size={17} />
                    )}

                    {isCheckedIn
                      ? `Checked in on ${formatDate(
                          registration.ticket.checked_in_at ||
                            registration.ticket.issued_at
                        )}`
                      : "This group ticket has not been checked in."}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <XCircle size={17} className="text-orange-500" />
                  <span className={secondaryClass}>
                    No ticket information is available for this booking.
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          className={`flex justify-end border-t p-5 ${
            isDarkMode
              ? "border-[#34463A]"
              : "border-[#E9E8DF]"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#52765B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#416249]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
