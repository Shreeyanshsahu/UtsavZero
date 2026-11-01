"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Ticket,
  Users,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import Navbar from "@/components/layout/Navbar";
import BookingQRCode from "@/components/Events/Ticket/BookingQRCode";
import {
  getMyTickets,
  type MyTicket,
} from "@/services/booking/myTicketsService";

function getTicketStatus(ticket: MyTicket) {
  if (
    ticket.booking_status === "cancelled" ||
    ticket.ticket_status === "cancelled"
  ) {
    return {
      label: "Cancelled",
      icon: XCircle,
      style: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    };
  }

  if (
    ticket.booking_status === "expired" ||
    ticket.ticket_status === "expired" ||
    new Date(ticket.ends_at).getTime() < Date.now()
  ) {
    return {
      label: "Expired",
      icon: Clock,
      style: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    };
  }

  if (ticket.ticket_status === "checked_in") {
    return {
      label: "Checked in",
      icon: CheckCircle2,
      style: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    };
  }

  return {
    label: "Upcoming",
    icon: AlertCircle,
    style: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  };
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { isDarkMode, setIsDarkMode } = useTheme();

  const [tickets, setTickets] = useState<MyTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyTickets();
      setTickets(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your tickets."
      );
    } finally {
      setLoading(false);
    }
  }, []);

 useEffect(() => {
  if (authLoading || !user) return;

  let cancelled = false;

  getMyTickets()
    .then((data) => {
      if (!cancelled) {
        setTickets(data);
        setError("");
      }
    })
    .catch((err) => {
      if (!cancelled) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your tickets."
        );
      }
    })
    .finally(() => {
      if (!cancelled) setLoading(false);
    });

  return () => {
    cancelled = true;
  };
}, [authLoading, user]);

  const background = isDarkMode
    ? "bg-[#171A19] text-[#FFF8EB]"
    : "bg-[#FFF8EB] text-[#38231C]";

  const cardStyle = isDarkMode
    ? "border-[#414943] bg-[#222725]"
    : "border-[#EADCC9] bg-white";

  const mutedText = isDarkMode
    ? "text-[#AFA99C]"
    : "text-[#806B5D]";

  if (authLoading) {
    return (
      <main className={`min-h-screen ${background}`}>
        <Navbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
        <div className="flex min-h-[60vh] items-center justify-center">
          Loading your account...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={`min-h-screen ${background}`}>
        <Navbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <Ticket size={42} className="mx-auto text-[#F0440A]" />
          <h1 className="mt-5 text-2xl font-bold">
            Sign in to view your tickets
          </h1>
          <p className={`mt-2 ${mutedText}`}>
            Your event bookings and QR tickets will appear here.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-[#F0440A] px-6 py-3 font-semibold text-white"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen transition-colors ${background}`}>
      <Navbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0440A]">
              Your UtsavZero account
            </p>

            <h1 className="mt-2 font-[var(--font-lora)] text-3xl font-bold sm:text-4xl">
              My Tickets
            </h1>

            <p className={`mt-2 ${mutedText}`}>
              Welcome, {profile?.full_name || user.email}.
              {" "}Your celebrations, all in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchTickets}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold disabled:opacity-50 ${
              isDarkMode
                ? "border-[#414943] hover:bg-[#292E2B]"
                : "border-[#EADCC9] hover:bg-[#FFF0D8]"
            }`}
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh tickets
          </button>
        </div>

        {/* Ticket count */}
        <div className={`mt-8 flex items-center gap-4 rounded-2xl border p-5 ${cardStyle}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#F0440A] dark:bg-orange-950">
            <Ticket size={24} />
          </div>

          <div>
            <p className="text-2xl font-bold tabular-nums">
              {tickets.length}
            </p>
            <p className={`text-sm ${mutedText}`}>
              Group booking{tickets.length === 1 ? "" : "s"} found
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-[#F0440A]"
            />
            <p className={`mt-4 text-sm ${mutedText}`}>
              Loading your tickets...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-300 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <p className="font-semibold">Unable to load tickets</p>
            <p className="mt-2 text-sm">{error}</p>
            <button
              onClick={fetchTickets}
              className="mt-4 rounded-lg bg-[#F0440A] px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && tickets.length === 0 && (
          <div className={`mt-8 rounded-2xl border px-6 py-16 text-center ${cardStyle}`}>
            <Ticket
              size={46}
              className="mx-auto text-[#F0440A]"
            />
            <h2 className="mt-5 text-xl font-bold">
              No tickets yet
            </h2>
            <p className={`mx-auto mt-2 max-w-md text-sm ${mutedText}`}>
              You haven&apos;t booked any celebrations yet.
              Explore community events and find your next celebration.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[#FFBE45] to-[#F0440A] px-6 py-3 text-sm font-bold text-white"
            >
              Explore events
            </Link>
          </div>
        )}

        {/* Tickets */}
        {!loading && !error && tickets.length > 0 && (
          <div className="mt-8 space-y-6">
            {tickets.map((ticket) => {
              const status = getTicketStatus(ticket);
              const StatusIcon = status.icon;

              return (
                <article
                  key={ticket.ticket_id}
                  className={`overflow-hidden rounded-2xl border shadow-sm ${cardStyle}`}
                >
                  <div className="grid md:grid-cols-[1fr_280px]">
                    {/* Ticket information */}
                    <div className="p-5 sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                          UTSAVZERO GROUP TICKET
                        </span>

                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.style}`}>
                          <StatusIcon size={14} />
                          {status.label}
                        </span>
                      </div>

                      <h2 className="mt-5 text-2xl font-bold">
                        {ticket.event_title}
                      </h2>

                      <div className={`mt-5 space-y-3 text-sm ${mutedText}`}>
                        <p className="flex items-center gap-3">
                          <CalendarDays size={17} className="shrink-0 text-[#F0440A]" />
                          {formatDate(ticket.starts_at)}
                        </p>

                        <p className="flex items-center gap-3">
                          <Clock size={17} className="shrink-0 text-[#F0440A]" />
                          {formatTime(ticket.starts_at)}
                          {" – "}
                          {formatTime(ticket.ends_at)}
                        </p>

                        <p className="flex items-center gap-3">
                          <MapPin size={17} className="shrink-0 text-[#F0440A]" />
                          {ticket.venue_name || ticket.address || "Venue details unavailable"}
                        </p>

                        <p className="flex items-center gap-3">
                          <Users size={17} className="shrink-0 text-[#F0440A]" />
                          {ticket.quantity} {ticket.quantity === 1 ? "person" : "people"} included
                        </p>
                      </div>

                      <div className={`mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2 ${
                        isDarkMode ? "border-[#414943]" : "border-[#EADCC9]"
                      }`}>
                        <div>
                          <p className={`text-xs ${mutedText}`}>
                            Booking reference
                          </p>
                          <p className="mt-1 font-mono text-sm font-bold">
                            {ticket.booking_reference}
                          </p>
                        </div>

                        <div>
                          <p className={`text-xs ${mutedText}`}>
                            Ticket number
                          </p>
                          <p className="mt-1 font-mono text-sm font-bold">
                            {ticket.ticket_number}
                          </p>
                        </div>

                        <div>
                          <p className={`text-xs ${mutedText}`}>
                            Booked by
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {ticket.attendee_name}
                          </p>
                        </div>

                        <div>
                          <p className={`text-xs ${mutedText}`}>
                            Booking amount
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: ticket.currency || "INR",
                              maximumFractionDigits: 2,
                            }).format(Number(ticket.total_amount) || 0)}
                          </p>
                        </div>
                      </div>

                      {ticket.ticket_status === "checked_in" && (
                        <p className="mt-5 rounded-xl bg-green-100 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
                          Checked in
                          {ticket.checked_in_at
                            ? ` on ${new Date(ticket.checked_in_at).toLocaleString("en-IN")}`
                            : "."}
                        </p>
                      )}

                      {ticket.booking_status === "confirmed" &&
                        Number(ticket.total_amount) > 0 && (
                          <p className="mt-4 text-xs text-amber-600 dark:text-amber-400">
                            Demo booking: payment is not processed through a live payment gateway.
                          </p>
                        )}
                    </div>

                    {/* QR code */}
                    <div className={`flex flex-col items-center justify-center border-t p-6 md:border-l md:border-t-0 ${
                      isDarkMode
                        ? "border-[#414943] bg-[#1D2220]"
                        : "border-[#EADCC9] bg-[#FFF9F0]"
                    }`}>
                      <p className="mb-4 text-sm font-bold">
                        Your entry QR
                      </p>

                      {ticket.qr_token ? (
                        <BookingQRCode
                          value={ticket.qr_token}
                          size={190}
                        />
                      ) : (
                        <p className="text-sm text-red-500">
                          QR code unavailable
                        </p>
                      )}

                      <p className={`mt-4 max-w-[220px] text-center text-xs ${mutedText}`}>
                        Present this QR code at the event entrance.
                        One scan verifies the entire group booking.
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/events"
            className="text-sm font-semibold text-[#F0440A] hover:underline"
          >
            Discover more celebrations →
          </Link>
        </div>
      </div>
    </main>
  );
}