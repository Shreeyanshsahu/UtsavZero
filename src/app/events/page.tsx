
"use client";

import { useMemo, useState } from "react";

import { useTheme } from "@/context/ThemeContext";
import Navbar from "@/components/layout/Navbar";

import EventMap from "@/components/Events/Discovery/EventMap";
import EventList from "@/components/Events/Discovery/EventList";
import EventSearchBar from "@/components/Events/Discovery/EventSearchBar";
import EventCategoryFilter from "@/components/Events/Discovery/EventCategoryFilter";

import { mockEvents } from "@/data/mockEvents";

export default function Events() {
  const { isDarkMode, setIsDarkMode } = useTheme();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Events");

  // Shared selection state for EventList and EventMap
  const [selectedEventId, setSelectedEventId] =
    useState<string | null>(null);

  // Filter events based on search and selected category
  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const query = searchQuery.trim().toLowerCase();

      // Search across event information
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query) ||
        event.address.toLowerCase().includes(query) ||
        event.city.toLowerCase().includes(query);

      // Category filtering
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
  }, [searchQuery, selectedCategory]);

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
      {/* Navbar */}
      <Navbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <main className="
        mx-auto w-full max-w-[1440px]
        px-4 pb-10 pt-8
        sm:px-6 lg:px-10
      ">

        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="font-lora text-2xl font-bold sm:text-3xl">
            Discover Celebrations
          </h1>

          <p className="mt-2 text-sm opacity-70">
            Find cleaner, community-driven celebrations around Delhi.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-5">
          <EventSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <EventCategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium opacity-80">
            {filteredEvents.length} celebrations found
          </p>

          {(searchQuery || selectedCategory !== "All Events") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Events");
                setSelectedEventId(null);
              }}
              className="text-sm font-semibold text-[#F0440A] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Event List + Map */}
        <div className="
          grid grid-cols-1 gap-6
          lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]
          lg:items-start
        ">

          {/* Event List */}
          <section className="min-w-0">
            <EventList
              events={filteredEvents}
              selectedEventId={selectedEventId}
              onEventSelect={setSelectedEventId}
            />
          </section>

          {/* Interactive Map */}
          <section className="
            h-[450px] w-full overflow-hidden rounded-2xl
            sm:h-[550px] lg:sticky lg:top-6 lg:h-[650px]
          ">
            <EventMap
              events={filteredEvents}
              selectedEventId={selectedEventId}
              onEventSelect={setSelectedEventId}
            />
          </section>

        </div>
      </main>
    </div>
  );
}
