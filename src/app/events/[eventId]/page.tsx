
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { useTheme } from "@/context/ThemeContext";
import { fetchPublicEvent } from "@/services/events/publicEventService";
import type { Event } from "@/types/event";

import EventHero from "@/components/Events/Details/EventHero";
import EventInformation from "@/components/Events/Details/EventInformation";
import SeatAvailability from "@/components/Events/Details/SeatAvailability";
import EventDescription from "@/components/Events/Details/EventDescription";
import EventGuidelines from "@/components/Events/Details/EventGuidelines";

export default function EventDetailsPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;

  const { isDarkMode, setIsDarkMode } = useTheme();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEvent() {
      try {
        setLoading(true);
        setError("");

        const result = await fetchPublicEvent(eventId);

        if (active) {
          setEvent(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this celebration."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (eventId) loadEvent();

    return () => {
      active = false;
    };
  }, [eventId]);

  const pageStyle = isDarkMode
    ? "bg-[#171A19] text-[#FFF0D7]"
    : "bg-[#FFF8EB] text-[#3D2923]";

  const backLink = (
    <Link
      href="/events"
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#F0440A] hover:underline"
    >
      <ArrowLeft size={16} />
      Back to celebrations
    </Link>
  );

  return (
    <div className={`min-h-screen ${pageStyle}`}>
      <Navbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-[#F0440A]" size={32} />
            <p className="text-sm opacity-70">
              Loading celebration details...
            </p>
          </div>
        ) : error ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <h1 className="font-lora text-2xl font-bold">
              Unable to load event
            </h1>
            <p className="mt-3 max-w-lg text-sm opacity-70">
              {error}
            </p>
            <div className="mt-6">{backLink}</div>
          </div>
        ) : !event ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <h1 className="font-lora text-3xl font-bold">
              Event not found
            </h1>
            <p className="mt-3 text-sm opacity-70">
              This celebration may have ended or is no longer available.
            </p>
            <div className="mt-6">{backLink}</div>
          </div>
        ) : (
          <>
            <div className="mb-5">{backLink}</div>

            <EventHero event={event} />

            <EventInformation event={event} />

            <SeatAvailability event={event} />

            <EventDescription event={event} />

            <EventGuidelines event={event} />

            <div className="mt-8 flex flex-col gap-3 border-t border-[#EADCC9] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">
                  Ready to celebrate responsibly?
                </p>
                <p className="mt-1 text-sm opacity-70">
                  Reserve your group entry for this firecracker-free event.
                </p>
              </div>

              {event.totalSeats - event.bookedSeats <= 0 ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-gray-400 px-6 py-3.5 text-sm font-bold text-white opacity-70"
                >
                  Fully Booked
                </button>
              ) : (
                <Link
                  href={`/events/${event.id}/book`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F0440A] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#D93808]"
                >
                  Book Your Tickets
                  <ArrowRight size={17} />
                </Link>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
