
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { useTheme } from "@/context/ThemeContext";
import { mockEvents } from "@/data/mockEvents";

import EventHero from "@/components/Events/Details/EventHero";
import EventInformation from "@/components/Events/Details/EventInformation";
import SeatAvailability from "@/components/Events/Details/SeatAvailability";
import EventDescription from "@/components/Events/Details/EventDescription";
import EventGuidelines from "@/components/Events/Details/EventGuidelines";

export default function EventDetailsPage() {
  const params = useParams<{ eventId: string }>();

  const { isDarkMode, setIsDarkMode } = useTheme();

  // Find the selected event using its dynamic route ID.
  const event = mockEvents.find(
    (item) => item.id === params.eventId
  );

  const availableSeats = event
    ? Math.max(0, event.totalSeats - event.bookedSeats)
    : 0;

  const dark = isDarkMode;

  if (!event) {
    return (
      <div
        className={`min-h-screen ${
          dark
            ? "bg-[#171A19] text-[#FFF0D7]"
            : "bg-[#FFF8EB] text-[#3D2923]"
        }`}
      >
        <Navbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-5 text-center">
          <h1 className="font-lora text-3xl font-bold">
            Event not found
          </h1>

          <p className="mt-3 text-sm opacity-70">
            The celebration you&apos;re looking for doesn&apos;t exist.
          </p>

          <Link
            href="/events"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F0440A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#D93808]"
          >
            <ArrowLeft size={16} />
            Explore celebrations
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        dark
          ? "bg-[#171A19] text-[#FFF0D7]"
          : "bg-[#FFF8EB] text-[#3D2923]"
      }`}
    >
      {/* Navbar */}
      <Navbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-2 sm:px-6 lg:px-10">

        {/* Back navigation */}
        <Link
          href="/events"
          className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-[#927F70] transition hover:text-[#F0440A] dark:text-[#AFA99C]"
        >
          <ArrowLeft size={15} />
          Back to celebrations
        </Link>

        {/* 1. Event Hero */}
        <EventHero event={event} />

        {/* 2. Event Information */}
        <EventInformation event={event} />

        {/* 3. Seat Availability */}
        <SeatAvailability event={event} />

        {/* 4. Event Description */}
        <EventDescription event={event} />

        {/* 5. Event Guidelines */}
        <EventGuidelines event={event} />

        {/* Booking CTA */}
        <section className="mt-6">
          <Link
            href={`/events/${event.id}/book`}
            aria-disabled={availableSeats <= 0}
            className={`flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFC34F] via-[#FF8A28] to-[#F0440A] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105 hover:shadow-md ${
              availableSeats <= 0
                ? "pointer-events-none opacity-50"
                : ""
            }`}
          >
            {availableSeats > 0
              ? "Reserve Your Spot"
              : "Fully Booked"}

            <ArrowRight size={17} />
          </Link>
        </section>

      </main>
    </div>
  );
}
