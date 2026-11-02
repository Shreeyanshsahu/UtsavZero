
"use client";

import { RefreshCw, Users } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface RegistrationHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export default function RegistrationHeader({
  onRefresh,
  refreshing,
}: RegistrationHeaderProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      {/* Title and description */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              isDarkMode
                ? "bg-[#294333] text-[#B9DFBF]"
                : "bg-[#E7F1E8] text-[#28613D]"
            }`}
          >
            <Users size={18} />
          </div>

          <span
            className={`text-xs font-bold uppercase tracking-[0.15em] ${
              isDarkMode ? "text-[#9AAFA0]" : "text-[#87958A]"
            }`}
          >
            Event Management
          </span>
        </div>

        <h2
          className={`font-[var(--font-lora)] text-2xl font-bold sm:text-3xl ${
            isDarkMode ? "text-[#FFF8EB]" : "text-[#38231C]"
          }`}
        >
          Registrations
        </h2>

        <p
          className={`mt-2 max-w-xl text-sm ${
            isDarkMode ? "text-[#B7B0A5]" : "text-[#806B5D]"
          }`}
        >
          Manage attendee registrations, monitor booking activity,
          and keep track of your event participants.
        </p>
      </div>

      {/* Refresh button */}
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className={`inline-flex items-center justify-center gap-2 self-start rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:self-center ${
          isDarkMode
            ? "border-[#34463A] bg-[#22372A] text-[#C0D0C3] hover:bg-[#294333]"
            : "border-[#E4EAE1] bg-white text-[#52675A] hover:bg-[#F3F6F1]"
        }`}
      >
        <RefreshCw
          size={16}
          className={refreshing ? "animate-spin" : ""}
        />

        {refreshing ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
}
