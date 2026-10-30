
"use client";

import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  User,
  Ticket,
  Clock,
  IndianRupee,
} from "lucide-react";

import type { Event } from "@/types/event";
import type { AttendeeDetails } from "@/components/Events/Booking/AttendeeForm";

import { useTheme } from "@/context/ThemeContext";
import BookingQRCode from "./BookingQRCode";

interface BookingTicketProps {
  event: Event;
  attendee: AttendeeDetails;
  quantity: number;
  bookingReference: string;
}

export default function BookingTicket({
  event,
  attendee,
  quantity,
  bookingReference,
}: BookingTicketProps) {
  const { isDarkMode } = useTheme();

  const formattedDate = new Date(event.startDate).toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const formattedTime = new Date(event.startDate).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const totalPrice = event.price * quantity;

  const cardStyle = isDarkMode
    ? "border-[#343B36] bg-[#222725]"
    : "border-[#EADCC9] bg-white";

  const headingColor = isDarkMode
    ? "text-[#FFF0D7]"
    : "text-[#3D2923]";

  const mutedColor = isDarkMode
    ? "text-[#AFA99C]"
    : "text-[#927F70]";

  const dividerStyle = isDarkMode
    ? "border-[#414943]"
    : "border-[#EADCC9]";

  const softBackground = isDarkMode
    ? "bg-[#292E2B]"
    : "bg-[#FFF8EB]";

  return (
    <article
      id="utsavzero-ticket"
      className={`mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border shadow-sm ${cardStyle}`}
    >
      {/* Ticket Header */}
      <div className="relative overflow-hidden bg-[#F0440A] px-5 py-6 text-white sm:px-8">
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              UtsavZero
            </p>

            <h1 className="mt-2 font-lora text-2xl font-bold sm:text-3xl">
              Your Event Ticket
            </h1>

            <p className="mt-1 text-xs text-white/80 sm:text-sm">
              Celebrate responsibly. Celebrate together.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Ticket size={25} />
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border-[18px] border-white/10" />
        <div className="absolute -bottom-16 right-20 h-28 w-28 rounded-full bg-white/10" />
      </div>

      {/* Event Image */}
      <div className="relative h-48 w-full sm:h-60">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, 672px"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-2">
            {event.category.map((category) => (
              <span
                key={category}
                className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-[#F0440A]"
              >
                {category}
              </span>
            ))}
          </div>

          <h2 className="mt-2 font-lora text-2xl font-bold text-white sm:text-3xl">
            {event.title}
          </h2>
        </div>
      </div>

      {/* Event Information */}
      <div className="space-y-5 p-5 sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="flex items-start gap-3">
            <CalendarDays
              size={19}
              className="mt-0.5 shrink-0 text-[#F0440A]"
            />

            <div className="min-w-0">
              <p className={`text-xs ${mutedColor}`}>
                Event Date
              </p>

              <p className={`mt-1 text-sm font-semibold ${headingColor}`}>
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock
              size={19}
              className="mt-0.5 shrink-0 text-[#F0440A]"
            />

            <div className="min-w-0">
              <p className={`text-xs ${mutedColor}`}>
                Start Time
              </p>

              <p className={`mt-1 text-sm font-semibold ${headingColor}`}>
                {formattedTime}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:col-span-2">
            <MapPin
              size={19}
              className="mt-0.5 shrink-0 text-[#F0440A]"
            />

            <div className="min-w-0">
              <p className={`text-xs ${mutedColor}`}>
                Venue
              </p>

              <p className={`mt-1 break-words text-sm font-semibold ${headingColor}`}>
                {event.venue}, {event.address}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t border-dashed ${dividerStyle}`} />

        {/* Attendee Information */}
        <div>
          <h3 className={`font-lora text-lg font-bold ${headingColor}`}>
            Attendee Details
          </h3>

          <div className={`mt-3 flex items-start gap-3 rounded-xl p-4 ${softBackground}`}>
            <User
              size={20}
              className="mt-0.5 shrink-0 text-[#F0440A]"
            />

            <div className="min-w-0">
              <p className={`text-xs ${mutedColor}`}>
                Booking Holder
              </p>

              <p className={`mt-1 break-words text-sm font-semibold ${headingColor}`}>
                {attendee.fullName}
              </p>

              <p className={`mt-1 break-all text-xs ${mutedColor}`}>
                {attendee.email}
              </p>

              <p className={`mt-1 text-xs ${mutedColor}`}>
                {attendee.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Ticket and Payment Details */}
        <div className={`grid grid-cols-2 gap-3 rounded-xl p-4 ${softBackground}`}>
          <div>
            <p className={`text-xs ${mutedColor}`}>
              Tickets
            </p>

            <p className={`mt-1 text-lg font-bold ${headingColor}`}>
              {quantity}
            </p>
          </div>

          <div>
            <p className={`text-xs ${mutedColor}`}>
              Total Amount
            </p>

            <p className="mt-1 flex items-center gap-1 text-lg font-bold text-[#F0440A]">
              {totalPrice === 0 ? (
                "Free"
              ) : (
                <>
                  <IndianRupee size={16} />
                  {totalPrice}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t border-dashed ${dividerStyle}`} />

        {/* QR Code */}
        <div className="flex flex-col items-center py-2">
          <h3 className={`font-lora text-lg font-bold ${headingColor}`}>
            Ticket QR Code
          </h3>

          <p className={`mt-1 mb-4 text-center text-xs ${mutedColor}`}>
            Present this code at the event entrance
          </p>

          <BookingQRCode
            value={bookingReference}
            size={170}
          />

          <p className={`mt-4 text-xs ${mutedColor}`}>
            Booking Reference
          </p>

          <p className="mt-1 break-all text-center font-mono text-sm font-bold text-[#F0440A]">
            {bookingReference}
          </p>
        </div>
      </div>

      {/* Ticket Footer */}
      <div className={`border-t px-5 py-4 text-center sm:px-8 ${dividerStyle}`}>
        <p className={`text-xs leading-relaxed ${mutedColor}`}>
          This is a demonstration ticket generated by UtsavZero.
          A valid reservation must be confirmed by the booking system.
        </p>

        <p className="mt-2 text-xs font-semibold text-[#F0440A]">
          Same Celebration. Cleaner Tomorrow.
        </p>
      </div>
    </article>
  );
}
