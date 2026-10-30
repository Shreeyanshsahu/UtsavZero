
"use client";

import { Minus, Plus, Ticket } from "lucide-react";
import type { Event } from "@/types/event";
import { useTheme } from "@/context/ThemeContext";

interface BookingSummaryProps {
  event: Event;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export default function BookingSummary({
  event,
  quantity,
  onQuantityChange,
}: BookingSummaryProps) {
  const { isDarkMode } = useTheme();

  const availableSeats = Math.max(
    0,
    event.totalSeats - event.bookedSeats
  );

  const maxQuantity = Math.min(availableSeats, 10);
  const totalPrice = event.price * quantity;

  const decreaseQuantity = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const canDecrease = quantity > 1;
  const canIncrease = quantity < maxQuantity;

  const headingColor = isDarkMode
    ? "text-[#FFF0D7]"
    : "text-[#3D2923]";

  const mutedColor = isDarkMode
    ? "text-[#B8B7A9]"
    : "text-[#927F70]";

  const cardStyle = isDarkMode
    ? "border-[#343B36] bg-[#222725]"
    : "border-[#EADCC9] bg-white";

  const dividerStyle = isDarkMode
    ? "border-[#414943]"
    : "border-[#EADCC9]";

  const quantityButtonStyle = isDarkMode
    ? "border-[#414943] hover:bg-[#353B36]"
    : "border-[#EADCC9] hover:bg-[#FFF0D8]";

  return (
    <section
      className={`w-full min-w-0 rounded-2xl border p-4 transition-colors duration-300 sm:p-5 ${cardStyle}`}
    >
      {/* Heading */}
      <div className="flex items-center gap-2">
        <Ticket
          size={20}
          className="shrink-0 text-[#F0440A]"
          aria-hidden="true"
        />

        <h2 className={`font-lora text-lg font-bold sm:text-xl ${headingColor}`}>
          Booking Summary
        </h2>
      </div>

      {/* Ticket Selector */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold ${headingColor}`}>
            Number of tickets
          </p>

          <p className={`mt-1 text-xs leading-relaxed ${mutedColor}`}>
            Maximum 10 tickets per booking
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={!canDecrease}
            aria-label="Decrease ticket quantity"
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-[#F0440A] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${quantityButtonStyle}`}
          >
            <Minus size={15} />
          </button>

          <span
            className={`min-w-6 text-center text-sm font-bold tabular-nums ${headingColor}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {quantity}
          </span>

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={!canIncrease}
            aria-label="Increase ticket quantity"
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-[#F0440A] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${quantityButtonStyle}`}
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Availability */}
      <p className={`mt-3 text-xs ${mutedColor}`} aria-live="polite">
        {availableSeats} {availableSeats === 1 ? "seat" : "seats"} currently available
      </p>

      {availableSeats === 0 && (
        <p className="mt-2 text-xs font-medium text-red-500">
          Sorry, this event is fully booked.
        </p>
      )}

      <div className={`my-5 border-t ${dividerStyle}`} />

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className={mutedColor}>Price per ticket</span>

          <span className={`font-medium ${headingColor}`}>
            {event.price === 0 ? "Free" : `₹${event.price}`}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className={mutedColor}>Quantity</span>

          <span className={`font-medium ${headingColor}`}>
            × {quantity}
          </span>
        </div>
      </div>

      <div className={`my-4 border-t ${dividerStyle}`} />

      {/* Total */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`text-sm font-bold ${headingColor}`}>
          Total Amount
        </span>

        <span className="font-lora text-2xl font-bold text-[#F0440A]">
          {totalPrice === 0 ? "Free" : `₹${totalPrice}`}
        </span>
      </div>
    </section>
  );
}
