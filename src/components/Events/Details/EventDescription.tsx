
"use client";

import type { Event } from "@/types/event";
import { useTheme } from "@/context/ThemeContext";

interface EventDescriptionProps {
  event: Event;
}

export default function EventDescription({
  event,
}: EventDescriptionProps) {
  const { isDarkMode } = useTheme();

  return (
    <section
      className={`mt-5 rounded-xl transition-colors duration-300 ${
        isDarkMode ? "text-[#FFF0D7]" : "text-[#3D2923]"
      }`}
    >
      <h2 className="font-lora text-xl font-bold sm:text-2xl">
        About the Event
      </h2>

      <div
        className={`mt-3 space-y-3 text-sm leading-7 sm:text-base ${
          isDarkMode ? "text-[#B8B7A9]" : "text-[#806E61]"
        }`}
      >
        <p>{event.description}</p>

        <p>
          Join your community for a memorable celebration filled
          with culture, creativity and togetherness. Celebrate
          Diwali responsibly and help make Delhi&apos;s festivities
          cleaner and more welcoming for everyone.
        </p>
      </div>
    </section>
  );
}
