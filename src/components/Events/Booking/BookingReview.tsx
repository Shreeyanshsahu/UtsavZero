
"use client";

import {
  CalendarDays,
  MapPin,
  User,
  Mail,
  Phone,
  Ticket,
  CheckCircle2,
} from "lucide-react";

import type { Event } from "@/types/event";
import type { AttendeeDetails } from "./AttendeeForm";
import { useTheme } from "@/context/ThemeContext";

interface BookingReviewProps {
  event: Event;
  attendee: AttendeeDetails;
  quantity: number;
}

export default function BookingReview({
  event,
  attendee,
  quantity,
}: BookingReviewProps) {
  const { isDarkMode } = useTheme();

  const eventDate = new Date(event.startDate);

  const formattedDate = eventDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalPrice = event.price * quantity;

  const cardStyle = isDarkMode
    ? "border-[#343B36] bg-[#222725]"
    : "border-[#EADCC9] bg-white";

  const headingColor = isDarkMode
    ? "text-[#FFF0D7]"
    : "text-[#3D2923]";

  const mutedColor = isDarkMode
    ? "text-[#B8B7A9]"
    : "text-[#927F70]";

  const iconColor = "text-[#F0440A]";

  const detailColor = isDarkMode
    ? "text-[#FFF0D7]"
    : "text-[#3D2923]";

  const sections = [
    {
      title: "Event Details",
      items: [
        {
          icon: CalendarDays,
          label: event.title,
          description: formattedDate,
        },
        {
          icon: MapPin,
          label: `${event.venue}, ${event.city}`,
        },
        {
          icon: Ticket,
          label: `${quantity} ${quantity === 1 ? "Ticket" : "Tickets"}`,
        },
      ],
    },
    {
      title: "Attendee Details",
      items: [
        {
          icon: User,
          label: attendee.fullName,
          description: "Full Name",
        },
        {
          icon: Mail,
          label: attendee.email,
          description: "Email Address",
        },
        {
          icon: Phone,
          label: attendee.phone,
          description: "Phone Number",
        },
      ],
    },
  ];

  return (
    <section className="w-full min-w-0 space-y-4 sm:space-y-5">

      {/* Event and Attendee Details */}
      {sections.map((section) => (
        <div
          key={section.title}
          className={`min-w-0 rounded-2xl border p-4 transition-colors duration-300 sm:p-5 ${cardStyle}`}
        >
          <h2 className={`font-lora text-lg font-bold sm:text-xl ${headingColor}`}>
            {section.title}
          </h2>

          <div className="mt-4 space-y-4">
            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={`${section.title}-${item.description ?? item.label}`}
                  className="flex min-w-0 items-start gap-3"
                >
                  <Icon
                    size={18}
                    className={`mt-0.5 shrink-0 ${iconColor}`}
                    aria-hidden="true"
                  />

                  <div className="min-w-0 flex-1">
                    {item.description && section.title === "Attendee Details" && (
                      <p className={`mb-0.5 text-[10px] sm:text-xs ${mutedColor}`}>
                        {item.description}
                      </p>
                    )}

                    <p className={`break-words text-sm font-medium leading-relaxed ${detailColor}`}>
                      {item.label}
                    </p>

                    {item.description && section.title === "Event Details" && (
                      <p className={`mt-1 text-xs leading-relaxed ${mutedColor}`}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Payment Summary */}
      <div
        className={`min-w-0 rounded-2xl border p-4 transition-colors duration-300 sm:p-5 ${cardStyle}`}
      >
        <h2 className={`font-lora text-lg font-bold sm:text-xl ${headingColor}`}>
          Payment Summary
        </h2>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className={mutedColor}>Ticket price</span>

            <span className={`font-medium ${detailColor}`}>
              {event.price === 0 ? "Free" : `₹${event.price}`}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <span className={mutedColor}>Quantity</span>

            <span className={`font-medium ${detailColor}`}>
              × {quantity}
            </span>
          </div>

          <div
            className={`border-t pt-3 ${
              isDarkMode ? "border-[#414943]" : "border-[#EADCC9]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className={`text-sm font-semibold ${headingColor}`}>
                Total Amount
              </span>

              <span className="font-lora text-xl font-bold text-[#F0440A] sm:text-2xl">
                {totalPrice === 0 ? "Free" : `₹${totalPrice}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Notice */}
      <div
        className={`flex items-start gap-3 rounded-xl p-4 transition-colors duration-300 ${
          isDarkMode ? "bg-[#292E2B]" : "bg-[#FFF0D8]"
        }`}
      >
        <CheckCircle2
          size={19}
          className="mt-0.5 shrink-0 text-[#F0440A]"
          aria-hidden="true"
        />

        <p className={`text-xs leading-5 sm:text-sm ${mutedColor}`}>
          Please verify your event and attendee information before
          confirming your reservation.
        </p>
      </div>
    </section>
  );
}
