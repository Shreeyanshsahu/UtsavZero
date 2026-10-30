
"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Share2, Check } from "lucide-react";

import type { Event } from "@/types/event";
import { useTheme } from "@/context/ThemeContext";

interface EventHeroProps {
  event: Event;
}

export default function EventHero({ event }: EventHeroProps) {
  const { isDarkMode } = useTheme();

  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: `Check out ${event.title} on UtsavZero!`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Unable to share event:", error);
      }
    }
  };

  const actionButtonStyle = isDarkMode
    ? "bg-[#222725] text-[#FF8A50] hover:bg-[#343B36]"
    : "bg-white text-[#F0440A] hover:bg-orange-50";

  return (
    <section className="relative h-[210px] w-full overflow-hidden rounded-xl sm:h-[260px] md:h-[290px] lg:h-[310px]">

      {/* Event Banner */}
      <Image
        src={event.image}
        alt={event.title}
        fill
        priority
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
        className="object-cover"
      />

      {/* Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10" />

      {/* Category Badges */}
      <div className="absolute left-3 top-3 right-3 flex flex-wrap gap-1.5 sm:left-5 sm:top-5 sm:right-5 sm:gap-2">
        {event.category.map((category) => (
          <span
            key={category}
            className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-xs"
          >
            {category}
          </span>
        ))}

        {event.isFirecrackerFree && (
          <span className="rounded-full bg-[#FFC34F] px-2.5 py-1 text-[10px] font-semibold text-[#49301A] sm:px-3 sm:py-1.5 sm:text-xs">
            Firecracker-free
          </span>
        )}
      </div>

      {/* Save and Share Actions */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 sm:bottom-auto sm:right-5 sm:top-5">

        <button
          type="button"
          onClick={() => setIsSaved((previous) => !previous)}
          aria-label={isSaved ? "Unsave event" : "Save event"}
          aria-pressed={isSaved}
          className={`flex min-h-10 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition sm:px-4 ${actionButtonStyle}`}
        >
          {isSaved ? "Saved" : "Save"}

          <Heart
            size={15}
            fill={isSaved ? "#F0440A" : "none"}
            strokeWidth={2}
          />
        </button>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Share event"
          className={`flex min-h-10 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition sm:px-4 ${actionButtonStyle}`}
        >
          {copied ? "Copied" : "Share"}

          {copied ? (
            <Check size={15} />
          ) : (
            <Share2 size={15} />
          )}
        </button>

      </div>
    </section>
  );
}
