
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import OrganizerLayout from "@/components/hostevents/layout/OrganizerLayout";
import { useTheme } from "@/context/ThemeContext";
import { createClient } from "@/lib/supabase/client";
import {
  CalendarDays,
  Users,
  UsersRound,
  Plus,
  ArrowRight,
  CalendarPlus,
  MapPin,
  RefreshCw,
} from "lucide-react";

type EventStatus = "draft" | "published" | "completed" | "cancelled";

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
}

const filters: { label: string; value: EventStatus }[] = [
  { label: "Published", value: "published" },
  { label: "Drafts", value: "draft" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function OrganizerPage() {
  const { isDarkMode } = useTheme();

  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [activeFilter, setActiveFilter] =
    useState<EventStatus>("published");
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
        throw new Error("Please sign in to view your dashboard.");
      }

      const { data, error: fetchError } = await supabase
        .from("events")
        .select(
          "id, title, category, venue_name, address, starts_at, ends_at, capacity, reserved_count, status"
        )
        .eq("organizer_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setEvents((data ?? []) as OrganizerEvent[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load organizer events."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          throw new Error("Please sign in to view your dashboard.");
        }

        const { data, error: fetchError } = await supabase
          .from("events")
          .select(
            "id, title, category, venue_name, address, starts_at, ends_at, capacity, reserved_count, status"
          )
          .eq("organizer_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        if (active) setEvents((data ?? []) as OrganizerEvent[]);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load organizer events."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const publishedCount = events.filter(
    (event) => event.status === "published"
  ).length;

  const totalRegistrations = events.reduce(
    (total, event) => total + (event.reserved_count || 0),
    0
  );

  const totalCapacity = events.reduce(
    (total, event) => total + (event.capacity || 0),
    0
  );

  const filteredEvents = events.filter(
    (event) => event.status === activeFilter
  );

  const stats = [
    {
      label: "Published events",
      value: publishedCount,
      icon: CalendarDays,
    },
    {
      label: "Registrations",
      value: totalRegistrations,
      icon: Users,
    },
    {
      label: "Total capacity",
      value: totalCapacity,
      icon: UsersRound,
    },
  ];

  const cardStyle = isDarkMode
    ? "border-[#343B36] bg-[#202522]"
    : "border-[#EADCC9] bg-white";

  const headingText = isDarkMode
    ? "text-[#FFF8EB]"
    : "text-[#38231C]";

  const mutedText = isDarkMode
    ? "text-[#B7B0A5]"
    : "text-[#806B5D]";

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const statusStyle: Record<EventStatus, string> = {
    published: isDarkMode
      ? "bg-emerald-950/50 text-emerald-300"
      : "bg-emerald-50 text-emerald-700",
    draft: isDarkMode
      ? "bg-amber-950/50 text-amber-300"
      : "bg-amber-50 text-amber-700",
    completed: isDarkMode
      ? "bg-blue-950/50 text-blue-300"
      : "bg-blue-50 text-blue-700",
    cancelled: isDarkMode
      ? "bg-red-950/50 text-red-300"
      : "bg-red-50 text-red-700",
  };

  return (
    <OrganizerLayout
      title="Organiser Dashboard"
      description="Bring your community together. Manage every celebration from one place."
    >
      {/* Create Event */}
      <div className="mb-7 flex justify-end">
        <Link
          href="/organizer/organize"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <Plus size={17} />
          Create Event
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Statistics */}
      <section className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className={`rounded-2xl border p-5 shadow-sm ${cardStyle}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF0D8] text-[#F0440A]">
                  <Icon size={18} />
                </div>
                <span className={`text-sm ${mutedText}`}>
                  {stat.label}
                </span>
              </div>

              <p className={`mt-3 text-3xl font-bold ${headingText}`}>
                {loading ? "—" : stat.value.toLocaleString("en-IN")}
              </p>
            </div>
          );
        })}
      </section>

      {/* Filters */}
      <section
        className={`mb-6 flex flex-wrap items-center gap-2 border-b pb-4 ${
          isDarkMode
            ? "border-[#343B36]"
            : "border-[#EADCC9]"
        }`}
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value;

          const count = events.filter(
            (event) => event.status === filter.value
          ).length;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              aria-pressed={isActive}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#F0440A] text-white shadow-sm"
                  : isDarkMode
                    ? "bg-[#292E2B] text-[#B7B0A5] hover:text-[#FFBE45]"
                    : "bg-[#F5EBDD] text-[#806B5D] hover:text-[#F0440A]"
              }`}
            >
              {filter.label} ({loading ? "—" : count})
            </button>
          );
        })}
      </section>

      {/* Events */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={`font-[var(--font-lora)] text-lg font-bold ${headingText}`}>
            Your Events
          </h2>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchEvents}
              disabled={loading}
              aria-label="Refresh dashboard"
              className={`rounded-lg p-2 transition hover:text-[#F0440A] disabled:opacity-50 ${mutedText}`}
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
            </button>

            <Link
              href="/organizer/organize"
              className="text-sm font-semibold text-[#F0440A] hover:underline"
            >
              View all
            </Link>
          </div>
        </div>

        {loading ? (
          <div className={`flex flex-col items-center justify-center rounded-2xl border px-6 py-14 ${cardStyle}`}>
            <RefreshCw size={25} className="animate-spin text-[#F0440A]" />
            <p className={`mt-3 text-sm ${mutedText}`}>
              Loading your events...
            </p>
          </div>
        ) : error ? (
          <div className={`rounded-2xl border border-red-300 p-6 text-sm ${isDarkMode ? "bg-red-950/30 text-red-300" : "bg-red-50 text-red-700"}`}>
            <p>{error}</p>
            <button
              type="button"
              onClick={fetchEvents}
              className="mt-3 font-semibold underline"
            >
              Try again
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 text-center ${cardStyle}`}
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0D8] text-[#F0440A]">
              <CalendarPlus size={27} />
            </div>

            <h3 className={`font-[var(--font-lora)] text-lg font-bold ${headingText}`}>
              No {activeFilter} events yet
            </h3>

            <p className={`mt-2 max-w-md text-sm leading-6 ${mutedText}`}>
              Your {activeFilter} events will appear here when available.
            </p>

            <Link
              href="/organizer/organize"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Plus size={16} />
              Create an event
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const available = Math.max(
                0,
                event.capacity - event.reserved_count
              );

              const progress =
                event.capacity > 0
                  ? Math.min(
                      100,
                      (event.reserved_count / event.capacity) * 100
                    )
                  : 0;

              return (
                <article
                  key={event.id}
                  className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${cardStyle}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#F0440A]">
                        {event.category || "Community Event"}
                      </p>

                      <h3 className={`mt-2 text-lg font-bold ${headingText}`}>
                        {event.title}
                      </h3>

                      <div className={`mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm ${mutedText}`}>
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays size={15} />
                          {formatDate(event.starts_at)}
                        </span>

                        {(event.venue_name || event.address) && (
                          <span className="inline-flex items-center gap-2">
                            <MapPin size={15} />
                            {event.venue_name || event.address}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle[event.status]}`}>
                      {event.status}
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className={`font-semibold ${headingText}`}>
                        Registrations
                      </span>
                      <span className={mutedText}>
                        {event.reserved_count} / {event.capacity} seats
                      </span>
                    </div>

                    <div className={`h-2 overflow-hidden rounded-full ${isDarkMode ? "bg-[#343B36]" : "bg-[#F2E9DC]"}`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FFBE45] to-[#F0440A]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <p className={`mt-2 text-xs ${mutedText}`}>
                      {available} seats remaining
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <p className={`mt-6 text-[11px] ${mutedText}`}>
        UtsavZero Organizer Workspace · Statistics are connected to live Supabase event records.
      </p>
    </OrganizerLayout>
  );
}
