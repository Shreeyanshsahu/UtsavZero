
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { useTheme } from "@/context/ThemeContext";
import { mockEvents } from "@/data/mockEvents";

import EventSummary from "@/components/Events/Booking/EventSummary";
import BookingStepper from "@/components/Events/Booking/BookingStepper";
import BookingSummary from "@/components/Events/Booking/BookingSummary";
import AttendeeForm, {
  type AttendeeDetails,
} from "@/components/Events/Booking/AttendeeForm";
import BookingReview from "@/components/Events/Booking/BookingReview";

import BookingTicket from "@/components/Events/Ticket/BookingTicket";
import DownloadTicket from "@/components/Events/Ticket/DownloadTicket";

export default function BookingPage() {
  const params = useParams<{ eventId: string }>();
  const { isDarkMode, setIsDarkMode } = useTheme();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [quantity, setQuantity] = useState(1);

  const [attendee, setAttendee] = useState<AttendeeDetails>({
    fullName: "",
    email: "",
    phone: "",
  });

  const [bookingReference, setBookingReference] = useState("");

  const event = mockEvents.find(
    (item) => item.id === params.eventId
  );

  const availableSeats = event
    ? Math.max(0, event.totalSeats - event.bookedSeats)
    : 0;

  // Theme styles
  const background = isDarkMode
    ? "bg-[#171A19]"
    : "bg-[#FFF8EB]";

  const foreground = isDarkMode
    ? "text-[#FFF0D7]"
    : "text-[#3D2923]";

  const muted = isDarkMode
    ? "text-[#AFA99C]"
    : "text-[#927F70]";

  const cardStyle = isDarkMode
    ? "border-[#343B36] bg-[#222725]"
    : "border-[#EADCC9] bg-white";

  const secondaryButtonStyle = isDarkMode
    ? "border-[#414943] hover:bg-[#292E2B]"
    : "border-[#EADCC9] hover:bg-[#FFF0D8]";

  // Continue to review
  const handleContinue = () => {
    if (!event) return;

    if (
      availableSeats === 0 ||
      quantity < 1 ||
      quantity > Math.min(availableSeats, 10)
    ) {
      alert("Please select a valid ticket quantity.");
      return;
    }

    if (!attendee.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendee.email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(attendee.phone)) {
      alert("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Confirm demo booking
  const handleConfirm = () => {
    if (
      !event ||
      quantity < 1 ||
      quantity > Math.min(availableSeats, 10)
    ) {
      alert("The selected seats are no longer available.");
      setCurrentStep(1);
      return;
    }

    // Demo reference only. No booking is saved to a database yet.
    const reference = `UZ-DEMO-${Date.now().toString().slice(-8)}`;

    setBookingReference(reference);
    setCurrentStep(3);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Event not found
  if (!event) {
    return (
      <div className={`min-h-dvh w-full ${background} ${foreground}`}>
        <Navbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center px-5 text-center">
          <h1 className="font-lora text-2xl font-bold sm:text-3xl">
            Event not found
          </h1>

          <p className={`mt-3 text-sm ${muted}`}>
            We couldn&apos;t find the event you&apos;re trying to book.
          </p>

          <Link
            href="/events"
            className="mt-6 rounded-full bg-[#F0440A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#D93808]"
          >
            Explore events
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`min-h-dvh w-full overflow-x-clip transition-colors duration-300 ${background} ${foreground}`}
    >
      <Navbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <main className="mx-auto w-full max-w-[1100px] px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:px-8">

        {/* Back Navigation */}
        {currentStep !== 3 && (
          <Link
            href={`/events/${event.id}`}
            className={`mb-5 inline-flex items-center gap-2 text-sm transition hover:text-[#F0440A] ${muted}`}
          >
            <ArrowLeft size={16} />
            Back to event
          </Link>
        )}

        {/* Page Heading */}
        <div className="mb-5">
          <h1 className="font-lora text-2xl font-bold sm:text-3xl md:text-4xl">
            {currentStep === 3
              ? "Booking Confirmation"
              : "Reserve Your Spot"}
          </h1>

          <p className={`mt-1 text-sm leading-relaxed ${muted}`}>
            {currentStep === 1 &&
              "Enter your details to reserve your tickets."}

            {currentStep === 2 &&
              "Review your information before confirming."}

            {currentStep === 3 &&
              "Your demo booking flow is complete."}
          </p>
        </div>

        {/* Progress Stepper */}
        <BookingStepper currentStep={currentStep} />

        {/* Selected Event */}
        {currentStep !== 3 && (
          <div className="mt-5">
            <EventSummary event={event} />
          </div>
        )}

        {/* STEP 1: BOOKING DETAILS */}
        {currentStep === 1 && (
          <div className="mt-6 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[1fr_0.9fr]">

            <div className="min-w-0 space-y-5">
              <BookingSummary
                event={event}
                quantity={quantity}
                onQuantityChange={setQuantity}
              />

              <AttendeeForm
                attendee={attendee}
                onAttendeeChange={setAttendee}
              />
            </div>

            <aside
              className={`h-fit min-w-0 rounded-2xl border p-4 sm:p-5 ${cardStyle}`}
            >
              <h2 className="font-lora text-lg font-bold sm:text-xl">
                Before you continue
              </h2>

              <div className={`mt-3 space-y-3 text-xs leading-5 ${muted}`}>
                <p>
                  Check your ticket quantity and ensure your contact
                  details are correct.
                </p>

                <p>
                  Your booking will be subject to seat availability
                  when the reservation is submitted.
                </p>
              </div>

              <button
                type="button"
                onClick={handleContinue}
                disabled={availableSeats === 0}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#F0440A] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#D93808] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {availableSeats === 0
                  ? "Fully Booked"
                  : "Continue to Review"}

                <ArrowRight size={17} />
              </button>
            </aside>
          </div>
        )}

        {/* STEP 2: REVIEW */}
        {currentStep === 2 && (
          <div className="mt-6">
            <BookingReview
              event={event}
              attendee={attendee}
              quantity={quantity}
            />

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition ${secondaryButtonStyle}`}
              >
                <ArrowLeft size={16} />
                Edit Details
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="flex items-center justify-center gap-2 rounded-full bg-[#F0440A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D93808]"
              >
                Confirm Reservation
                <ShieldCheck size={17} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DIGITAL TICKET */}
        {currentStep === 3 && (
          <div className="mx-auto mt-6 w-full max-w-2xl">

            {/* Demo Notice */}
            <div
              className={`mb-5 rounded-xl border p-4 ${cardStyle}`}
            >
              <p className="text-sm font-semibold text-[#F0440A]">
                Demo Booking Complete!
              </p>

              <p className={`mt-1 text-xs leading-5 ${muted}`}>
                This is a demonstration ticket. Your reservation
                has not yet been saved to a database.
              </p>
            </div>

            {/* Actual Digital Ticket */}
            <BookingTicket
              event={event}
              attendee={attendee}
              quantity={quantity}
              bookingReference={bookingReference}
            />

            {/* Download Ticket */}
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <DownloadTicket
                bookingReference={bookingReference}
              />

              <Link
                href="/events"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#F0440A] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#D93808] sm:w-auto"
              >
                Explore More Celebrations
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
