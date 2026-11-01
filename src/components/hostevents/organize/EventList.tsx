
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  RefreshCw,
  CalendarPlus,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/context/ThemeContext";

type EventStatus = "draft" | "published" | "cancelled" | "completed";

interface OrganizerEvent {
  id: string;
  title: string;
  category: string;
  venue_name: string | null;
  address: string | null;
  starts_at: string;
  ends_at: string;
  capacity: number;
  reserved_count: number;
  status: EventStatus;
  ticket_price: number;
}

type FilterType = "all" | EventStatus;

const filters: { label: string; value: FilterType }[] = [
  { label: "All Events", value: "all" },
  { label: "Published", value: "published" },
  { label: "Drafts", value: "draft" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Completed", value: "completed" },
];
interface EventListProps {
  refreshKey: number;
}
export default function EventList({
  refreshKey,
}: EventListProps) {
  const { isDarkMode } = useTheme();

  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Please log in to view your events.");
      }

      const { data, error: fetchError } = await supabase
        .from("events")
        .select(
          "id, title, category, venue_name, address, starts_at, ends_at, capacity, reserved_count, ticket_price, status"
        )
        .eq("organizer_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setEvents((data ?? []) as OrganizerEvent[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load your events."
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const supabase = createClient();

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          throw new Error("Please log in to view your events.");
        }

        const { data, error: fetchError } = await supabase
          .from("events")
          .select(
            "id, title, category, venue_name, address, starts_at, ends_at, capacity, reserved_count, ticket_price, status"
          )
          .eq("organizer_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        if (active) {
          setEvents((data ?? []) as OrganizerEvent[]);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your events."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadEvents();

    return () => {
      active = false;
    };
  }, [refreshKey]);
  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((event) => event.status === activeFilter);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  const formatPrice = (price: number) => {
    if (price === 0) return "Free";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };
  const statusStyles: Record<EventStatus, string> = {
    published: isDarkMode
      ? "bg-emerald-950/50 text-emerald-300"
      : "bg-emerald-50 text-emerald-700",
    draft: isDarkMode
      ? "bg-amber-950/50 text-amber-300"
      : "bg-amber-50 text-amber-700",
    cancelled: isDarkMode
      ? "bg-red-950/50 text-red-300"
      : "bg-red-50 text-red-700",
    completed: isDarkMode
      ? "bg-blue-950/50 text-blue-300"
      : "bg-blue-50 text-blue-700",
  };

  const cardClass = isDarkMode
    ? "border-[#343B36] bg-[#202522]"
    : "border-[#EADCC9] bg-white";

  const headingClass = isDarkMode
    ? "text-[#FFF8EB]"
    : "text-[#38231C]";

  const mutedClass = isDarkMode
    ? "text-[#B7B0A5]"
    : "text-[#806B5D]";

  const buttonClass = isDarkMode
    ? "border-[#343B36] bg-[#292E2B] text-[#B7B0A5] hover:text-[#FFF8EB]"
    : "border-[#EADCC9] bg-white text-[#806B5D] hover:text-[#38231C]";

  return (
    <section className="space-y-6">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold ${headingClass}`}>
            Your Events
          </h2>
          <p className={`mt-1 text-sm ${mutedClass}`}>
            Manage and monitor your community celebrations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchEvents}
            disabled={loading}
            className={`rounded-xl border p-3 transition hover:border-[#F0440A] disabled:opacity-50 ${buttonClass}`}
            aria-label="Refresh events"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
          </button>

          <Link
            href="/organizer/organize"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            <CalendarPlus size={17} />
            Create Event
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => {
          const selected = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${selected
                ? "border-[#F0440A] bg-[#F0440A] text-white"
                : buttonClass
                }`}
            >
              {filter.label}
              {filter.value === "all" && (
                <span className="ml-2 opacity-75">{events.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div className={`rounded-2xl border p-10 text-center ${cardClass}`}>
          <RefreshCw
            size={24}
            className="mx-auto animate-spin text-[#F0440A]"
          />
          <p className={`mt-3 text-sm ${mutedClass}`}>
            Loading your events...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          className={`rounded-2xl border border-red-300 p-5 text-sm ${isDarkMode
            ? "bg-red-950/30 text-red-300"
            : "bg-red-50 text-red-700"
            }`}
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={fetchEvents}
            className="mt-3 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredEvents.length === 0 && (
        <div className={`rounded-2xl border px-5 py-14 text-center ${cardClass}`}>
          <CalendarDays
            size={34}
            className={`mx-auto ${mutedClass}`}
          />
          <h3 className={`mt-4 font-bold ${headingClass}`}>
            {events.length === 0
              ? "No events created yet"
              : "No events in this category"}
          </h3>
          <p className={`mx-auto mt-2 max-w-sm text-sm ${mutedClass}`}>
            {events.length === 0
              ? "Start by creating your first firecracker-free community celebration."
              : "Try selecting another filter to see your events."}
          </p>

          {events.length === 0 && (
            <Link
              href="/organizer/organize"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] px-5 py-3 text-sm font-bold text-white"
            >
              <CalendarPlus size={17} />
              Create Your First Event
            </Link>
          )}
        </div>
      )}

      {/* Event cards */}
      {!loading &&
        !error &&
        filteredEvents.map((event) => {
          const available = Math.max(
            0,
            event.capacity - event.reserved_count
          );

          const percentage =
            event.capacity > 0
              ? Math.min(
                100,
                (event.reserved_count / event.capacity) * 100
              )
              : 0;

          return (
            <article
              key={event.id}
              className={`rounded-2xl border p-5 transition hover:shadow-sm sm:p-6 ${cardClass}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#F0440A]">
                    {event.category || "Community Event"}
                  </p>

                  <h3 className={`mt-2 text-lg font-bold ${headingClass}`}>
                    {event.title}
                  </h3>

                  <div className={`mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm ${mutedClass}`}>
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={15} />
                      {formatDate(event.starts_at)}
                    </span>

                    <span>
                      {formatTime(event.starts_at)} –{" "}
                      {formatTime(event.ends_at)}
                    </span>

                    {(event.venue_name || event.address) && (
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={15} />
                        {event.venue_name || event.address}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${event.ticket_price === 0
                      ? isDarkMode
                        ? "bg-emerald-950/50 text-emerald-300"
                        : "bg-emerald-50 text-emerald-700"
                      : isDarkMode
                        ? "bg-orange-950/50 text-orange-300"
                        : "bg-orange-50 text-orange-700"
                      }`}
                  >
                    {formatPrice(Number(event.ticket_price))}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyles[event.status] ??
                      statusStyles.draft
                      }`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>

              {/* Registration progress */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className={`inline-flex items-center gap-2 text-sm font-semibold ${headingClass}`}>
                    <Users size={16} />
                    Group registrations
                  </span>

                  <span className={`text-xs ${mutedClass}`}>
                    {event.reserved_count} / {event.capacity} seats
                  </span>
                </div>

                <div
                  className={`h-2 overflow-hidden rounded-full ${isDarkMode ? "bg-[#343B36]" : "bg-[#F2E9DC]"
                    }`}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FFBE45] to-[#F0440A] transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className={`mt-2 text-xs ${mutedClass}`}>
                  {available} seats remaining
                </p>
              </div>
            </article>
          );
        })}
    </section>
  );
}
