"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { useParams, useRouter } from "next/navigation";

import {

  ArrowLeft,

  ArrowRight,

  ShieldCheck,

  Loader2,

} from "lucide-react";

import Navbar from "@/components/layout/Navbar";

import { useAuth } from "@/context/AuthContext";

import { useTheme } from "@/context/ThemeContext";

import {

  fetchBookableEvent,

  createGroupBooking,

type BookableEvent,

type BookingResult,

} from "@/services/booking/bookingService";

import type { Event } from "@/types/event";

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

  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const { isDarkMode, setIsDarkMode } = useTheme();

  const [event, setEvent] = useState<BookableEvent | null>(null);

  const [eventLoading, setEventLoading] = useState(true);

  const [pageError, setPageError] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);

  const [bookingResult, setBookingResult] =

    useState<BookingResult | null>(null);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [quantity, setQuantity] = useState(1);

  const [attendee, setAttendee] = useState<AttendeeDetails>({

    fullName: "",

    email: "",

    phone: "",

  });

  // Load the authenticated user's event from Supabase.

  useEffect(() => {

if (authLoading) return;

if (!user) {

      router.replace(

        `/login?next=${encodeURIComponent(

          `/events/${params.eventId}/book`

        )}`

      );

return;

    }

    let active = true;

    const loadEvent = async () => {

      setEventLoading(true);

      setPageError("");

try {

        const result = await fetchBookableEvent(params.eventId);

if (active) {

          setEvent(result);

        }

      } catch (error) {

if (active) {

          setPageError(

            error instanceof Error

              ? error.message

              : "Unable to load this event."

          );

        }

      } finally {

if (active) {

          setEventLoading(false);

        }

      }

    };

    loadEvent();

return () => {

      active = false;

    };

  }, [authLoading, user, params.eventId, router]);

  const availableSeats = event

    ? Math.max(0, event.capacity - event.reserved_count)

    : 0;

  // Existing booking components use the older Event interface.

  // Convert the database event into that interface here.

  const displayEvent: Event | null = useMemo(() => {

if (!event) return null;

return {

      id: event.id,

      title: event.title,

      description: event.description ?? "",

      category: Array.isArray(event.category)

        ? event.category

        : [String(event.category ?? "Community")],

      image: "/images/Event1.jpg",

      venue: event.venue_name || "Venue to be announced",

      address: event.address || "",

      city: event.address || "",

      latitude: Number(event.latitude ?? 0),

      longitude: Number(event.longitude ?? 0),

      startDate: event.starts_at,

      endDate: event.ends_at,

      totalSeats: event.capacity,

      bookedSeats: event.reserved_count,

      price: Number(event.ticket_price ?? 0),

      isFirecrackerFree: event.is_firecracker_free,

      isFamilyFriendly: false,

    };

  }, [event]);

  // Theme styles.

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

  // Validate attendee details and move to review.

  const handleContinue = () => {

if (!event || !displayEvent) return;

if (

      availableSeats <= 0 ||

      quantity < 1 ||

      quantity > Math.min(availableSeats, 20)

    ) {

      setPageError("Please select a valid ticket quantity.");

return;

    }

if (attendee.fullName.trim().length < 2) {

      setPageError("Please enter your full name.");

return;

    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(attendee.email.trim())) {

      setPageError("Please enter a valid email address.");

return;

    }

    const phoneRegex = /^[6-9]\d{9}$/;

if (!phoneRegex.test(attendee.phone.trim())) {

      setPageError(

        "Please enter a valid 10-digit Indian mobile number."

      );

return;

    }

    setPageError("");

    setCurrentStep(2);

    window.scrollTo({ top: 0, behavior: "smooth" });

  };

  // Create a real booking through the Supabase RPC.

  const handleConfirm = async () => {

if (!event || bookingLoading) return;

if (

      quantity < 1 ||

      quantity > Math.min(availableSeats, 20)

    ) {

      setPageError(

        "The selected seats may no longer be available. Please review your quantity."

      );

      setCurrentStep(1);

return;

    }

    setBookingLoading(true);

    setPageError("");

try {

      const result = await createGroupBooking({

        eventId: event.id,

        quantity,

        attendee: {

          fullName: attendee.fullName.trim(),

          email: attendee.email.trim().toLowerCase(),

          phone: attendee.phone.trim(),

        },

      });

      setBookingResult(result);

      setCurrentStep(3);

      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {

      setPageError(

        error instanceof Error

          ? error.message

          : "Unable to complete your booking. Please try again."

      );

    } finally {

      setBookingLoading(false);

    }

  };

  // Authentication is still being initialized.

if (authLoading || (!user && eventLoading)) {

return (

      <div

        className={`flex min-h-dvh flex-col ${background} ${foreground}`}

      >

        <Navbar

          isDarkMode={isDarkMode}

          setIsDarkMode={setIsDarkMode}

        />

        <main className="flex flex-1 items-center justify-center">

          <div className="flex items-center gap-3 text-sm">

            <Loader2 className="animate-spin" size={20} />

            Checking your account...

          </div>

        </main>

      </div>

    );

  }

  // Event loading state.

if (eventLoading) {

return (

      <div

        className={`flex min-h-dvh flex-col ${background} ${foreground}`}

      >

        <Navbar

          isDarkMode={isDarkMode}

          setIsDarkMode={setIsDarkMode}

        />

        <main className="flex flex-1 items-center justify-center">

          <div className="flex items-center gap-3 text-sm">

            <Loader2 className="animate-spin" size={20} />

            Loading event details...

          </div>

        </main>

      </div>

    );

  }

  // Event not found or unavailable.

if (!event || !displayEvent) {

return (

      <div className={`min-h-dvh w-full ${background} ${foreground}`}>

        <Navbar

          isDarkMode={isDarkMode}

          setIsDarkMode={setIsDarkMode}

        />

        <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center px-5 text-center">

          <h1 className="font-lora text-2xl font-bold sm:text-3xl">

            Event unavailable

          </h1>

          <p className={`mt-3 text-sm ${muted}`}>

            {pageError ||

              "We couldn't find the event you're trying to book."}

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

        {/* Back navigation */}

        {currentStep !== 3 && (

          <Link

            href={`/events/${event.id}`}

            className={`mb-5 inline-flex items-center gap-2 text-sm transition hover:text-[#F0440A] ${muted}`}

          >

            <ArrowLeft size={16} />

            Back to event

          </Link>

        )}

        {/* Page heading */}

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

              "Your reservation has been successfully recorded."}

          </p>

        </div>

        <BookingStepper currentStep={currentStep} />

        {/* Selected event */}

        {currentStep !== 3 && (

          <div className="mt-5">

            <EventSummary event={displayEvent} />

          </div>

        )}

        {/* Error message */}

        {pageError && (

          <div

            role="alert"

            className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700"

          >

            {pageError}

          </div>

        )}

        {/* STEP 1: Booking details */}

        {currentStep === 1 && (

          <div className="mt-6 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[1fr_0.9fr]">

            <div className="min-w-0 space-y-5">

              <BookingSummary

                event={displayEvent}

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

                <p>

                  Available seats: {availableSeats}

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

        {/* STEP 2: Review */}

        {currentStep === 2 && (

          <div className="mt-6">

            <BookingReview

              event={displayEvent}

              attendee={attendee}

              quantity={quantity}

            />

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

              <button

                type="button"

                disabled={bookingLoading}

                onClick={() => {

                  setPageError("");

                  setCurrentStep(1);

                }}

                className={`flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition disabled:opacity-50 ${secondaryButtonStyle}`}

              >

                <ArrowLeft size={16} />

                Edit Details

              </button>

              <button

                type="button"

                onClick={handleConfirm}

                disabled={bookingLoading}

                className="flex items-center justify-center gap-2 rounded-full bg-[#F0440A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D93808] disabled:cursor-not-allowed disabled:opacity-60"

              >

                {bookingLoading ? (

                  <>

                    <Loader2 size={17} className="animate-spin" />

                    Confirming...

                  </>

                ) : (

                  <>

                    Confirm Reservation

                    <ShieldCheck size={17} />

                  </>

                )}

              </button>

            </div>

          </div>

        )}

        {/* STEP 3: Confirmed booking */}

        {currentStep === 3 && bookingResult && (

          <div className="mx-auto mt-6 w-full max-w-2xl">

            <div

              className={`mb-5 rounded-xl border p-4 ${cardStyle}`}

            >

              <p className="text-sm font-semibold text-green-600">

                Booking Confirmed!

              </p>

              <p className={`mt-1 text-xs leading-5 ${muted}`}>

                Your reservation has been saved successfully.

              </p>

              <div className="mt-3 space-y-1 text-sm">

                <p>

                  Booking reference:{" "}

                  <span className="font-semibold">

                    {bookingResult.booking_reference}

                  </span>

                </p>

                <p>

                  Ticket number:{" "}

                  <span className="font-semibold">

                    {bookingResult.ticket_number}

                  </span>

                </p>

                <p>
                  Tickets reserved:{" "}
                  <span className="font-semibold">
                    {bookingResult.quantity}
                  </span>
                </p>

                <p>
                  Total amount:{" "}
                  <span className="font-semibold">
                    {bookingResult.total_amount === 0
                      ? "Free"
                      : new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: bookingResult.currency || "INR",
                          maximumFractionDigits: 2,
                        }).format(bookingResult.total_amount)}
                  </span>
                </p>

                <p className="font-medium">
                  {bookingResult.payment_status === "not_required"
                    ? "No payment required."
                    : bookingResult.payment_status === "demo_unpaid"
                      ? "Demo booking — payment has not been collected."
                      : "Payment status unavailable for this booking."}
                </p>

              </div>

            </div>

            <BookingTicket
              event={displayEvent}
              attendee={attendee}
              quantity={bookingResult.quantity}
              bookingReference={bookingResult.booking_reference}
              qrToken={bookingResult.qr_token}
              unitPrice={bookingResult.unit_price}
              totalAmount={bookingResult.total_amount}
              currency={bookingResult.currency}
              paymentStatus={bookingResult.payment_status}
            />

            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">

              <DownloadTicket

                bookingReference={bookingResult.booking_reference}

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
