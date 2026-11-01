
"use client";

import { useEffect, useMemo, useState } from "react";

import { useTheme } from "@/context/ThemeContext";
import Navbar from "@/components/layout/Navbar";

import EventMap from "@/components/Events/Discovery/EventMap";
import EventList from "@/components/Events/Discovery/EventList";
import EventSearchBar from "@/components/Events/Discovery/EventSearchBar";
import EventCategoryFilter from "@/components/Events/Discovery/EventCategoryFilter";

import { fetchPublicEvents } from "@/services/events/publicEventService";
import type { Event } from "@/types/event";

export default function Events() {
  const { isDarkMode, setIsDarkMode } = useTheme();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Events");

  const [selectedEventId, setSelectedEventId] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const result = await fetchPublicEvents();

        if (active) {
          setEvents(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load celebrations."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      active = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query) ||
        event.address.toLowerCase().includes(query) ||
        event.city.toLowerCase().includes(query);

      const categories = event.category.map((category) =>
        category.toLowerCase()
      );

      let matchesCategory = true;

      if (selectedCategory === "Family Friendly") {
        matchesCategory = event.isFamilyFriendly;
      } else if (selectedCategory !== "All Events") {
        const selected = selectedCategory.toLowerCase();

        if (selected === "art & craft") {
          matchesCategory = categories.some(
            (category) =>
              category.includes("art") ||
              category.includes("craft") ||
              category.includes("workshop")
          );
        } else {
          matchesCategory = categories.some((category) =>
            category.includes(selected)
          );
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  const eventsWithCoordinates = filteredEvents.filter(
    (
      event
    ): event is Event & {
      latitude: number;
      longitude: number;
    } =>
      event.latitude !== null &&
      event.longitude !== null &&
      Number.isFinite(event.latitude) &&
      Number.isFinite(event.longitude)
  );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Events");
    setSelectedEventId(null);
  };

  return (
    <div
      className={`
        flex min-h-screen w-full flex-col
        font-sans transition-colors duration-300
        ${
          isDarkMode
            ? "bg-[#171A19] text-[#FFF0D7]"
            : "bg-[#FFF8EB] text-[#3D2923]"
        }
      `}
    >
      <Navbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <main
        className="
          mx-auto w-full max-w-[1440px]
          px-4 pb-10 pt-8
          sm:px-6 lg:px-10
        "
      >
        <div className="mb-6">
          <h1 className="font-lora text-2xl font-bold sm:text-3xl">
            Discover Celebrations
          </h1>

          <p className="mt-2 text-sm opacity-70">
            Find cleaner, community-driven celebrations around Delhi.
          </p>
        </div>

        <div className="mb-5">
          <EventSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        <div className="mb-6">
          <EventCategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <p className="text-sm opacity-70">
              Loading celebrations from UtsavZero...
            </p>
          </div>
        ) : error ? (
          <div
            className="rounded-2xl border border-red-300 bg-red-50 p-6 text-center"
            role="alert"
          >
            <p className="font-semibold text-red-700">
              Unable to load celebrations
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-[#F0440A] px-5 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium opacity-80">
                {filteredEvents.length} celebrations found
              </p>

              {(searchQuery ||
                selectedCategory !== "All Events") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-[#F0440A] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div
              className="
                grid grid-cols-1 gap-6
                lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]
                lg:items-start
              "
            >
              <section className="min-w-0">
                <EventList
                  events={filteredEvents}
                  selectedEventId={selectedEventId}
                  onEventSelect={setSelectedEventId}
                />
              </section>

              <section
                className="
                  h-[450px] w-full overflow-hidden rounded-2xl
                  sm:h-[550px] lg:sticky lg:top-6 lg:h-[650px]
                "
              >
                <EventMap
                  events={eventsWithCoordinates}
                  selectedEventId={
                    eventsWithCoordinates.some(
                      (event) => event.id === selectedEventId
                    )
                      ? selectedEventId
                      : null
                  }
                  onEventSelect={setSelectedEventId}
                />
              </section>
            </div>

            {filteredEvents.length > 0 &&
              eventsWithCoordinates.length < filteredEvents.length && (
                <p className="mt-4 text-xs opacity-60">
                  Some celebrations do not have map coordinates yet and
                  are shown in the event list only.
                </p>
              )}
          </>
        )}
      </main>
    </div>
  );
}
