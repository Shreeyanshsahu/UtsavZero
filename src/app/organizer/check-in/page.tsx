
"use client";

import { useState } from "react";
import OrganizerLayout from "@/components/hostevents/layout/OrganizerLayout";
import CameraScanner from "@/components/hostevents/checkin/CameraScanner";
import { useTicketCheckin } from "@/hooks/hostevents/useTicketCheckin";
import { useTheme } from "@/context/ThemeContext";
import {
  ScanLine,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  TicketCheck,
  Loader2,
} from "lucide-react";

const resultConfig = {
  success: {
    title: "Ticket Verified",
    message: "Check-in successful. This ticket has been marked as used.",
    icon: CheckCircle2,
    light: "border-green-200 bg-green-50 text-green-800",
    dark: "border-green-900 bg-green-950/40 text-green-300",
  },
  already_used: {
    title: "Already Checked In",
    message: "This ticket has already been used. Do not allow another entry.",
    icon: AlertCircle,
    light: "border-amber-200 bg-amber-50 text-amber-800",
    dark: "border-amber-900 bg-amber-950/40 text-amber-300",
  },
  invalid: {
    title: "Invalid Ticket",
    message: "This QR code is not associated with a valid ticket.",
    icon: XCircle,
    light: "border-red-200 bg-red-50 text-red-800",
    dark: "border-red-900 bg-red-950/40 text-red-300",
  },
  cancelled: {
    title: "Booking Cancelled",
    message: "This booking or ticket has been cancelled.",
    icon: XCircle,
    light: "border-red-200 bg-red-50 text-red-800",
    dark: "border-red-900 bg-red-950/40 text-red-300",
  },
  expired: {
    title: "Ticket Expired",
    message: "This ticket has expired and cannot be checked in.",
    icon: AlertCircle,
    light: "border-amber-200 bg-amber-50 text-amber-800",
    dark: "border-amber-900 bg-amber-950/40 text-amber-300",
  },
  not_authorized: {
    title: "Not Authorised",
    message: "You are not authorised to verify tickets for this event.",
    icon: ShieldCheck,
    light: "border-red-200 bg-red-50 text-red-800",
    dark: "border-red-900 bg-red-950/40 text-red-300",
  },
};

export default function CheckInPage() {
  const { isDarkMode } = useTheme();
  const { result, loading, error, scan, reset } = useTicketCheckin();

  const [scannerKey, setScannerKey] = useState(0);

  const dark = isDarkMode;

  const panel = dark
    ? "border-[#343B36] bg-[#202522]"
    : "border-[#EADCC9] bg-white";

  const muted = dark ? "text-[#B7B0A5]" : "text-[#806B5D]";

  const handleScan = async (token: string) => {
    await scan(token);
  };

  const handleNextScan = () => {
    reset();
    setScannerKey((previous) => previous + 1);
  };

  const currentResult = result ? resultConfig[result] : null;
  const ResultIcon = currentResult?.icon;

  return (
    <OrganizerLayout
      title="Ticket Check-in"
      description="Scan attendee tickets and securely verify event entry."
    >
      <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">

        {/* Top information */}
        <section className={`rounded-2xl border p-4 sm:p-5 ${panel}`}>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0D8] text-[#F0440A] dark:bg-[#3A2B20]">
              <TicketCheck size={22} />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold">
                Event entry verification
              </h2>
              <p className={`mt-1 text-sm leading-relaxed ${muted}`}>
                Scan the QR code displayed on an attendee&apos;s digital ticket.
                Each valid ticket can only be checked in once.
              </p>
            </div>
          </div>

          <div className={`mt-4 grid grid-cols-2 gap-3 border-t pt-4 ${dark ? "border-[#343B36]" : "border-[#EADCC9]"}`}>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <ShieldCheck size={17} className="shrink-0 text-green-500" />
              <span className={muted}>Secure verification</span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <ScanLine size={17} className="shrink-0 text-[#F0440A]" />
              <span className={muted}>One-time check-in</span>
            </div>
          </div>
        </section>

        {/* Scanner */}
        {!result && (
          <section className={`overflow-hidden rounded-2xl border p-3 sm:p-5 ${panel}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">QR Scanner</h2>
                <p className={`mt-1 text-xs sm:text-sm ${muted}`}>
                  Position the attendee&apos;s QR code inside the frame.
                </p>
              </div>

              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1.5 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-300">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Ready
              </span>
            </div>

            <CameraScanner
              key={scannerKey}
              onScan={handleScan}
              disabled={loading}
            />

            {loading && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#FFF0D8] p-4 text-sm font-semibold text-[#A83A12] dark:bg-[#3A2B20] dark:text-[#FFBE45]">
                <Loader2 size={18} className="animate-spin" />
                Verifying ticket with UtsavZero...
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </section>
        )}

        {/* Verification result */}
        {currentResult && ResultIcon && (
          <section className={`rounded-2xl border p-5 sm:p-7 ${panel}`}>
            <div className="text-center">
              <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                result === "success"
                  ? "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-300"
                  : result === "already_used" || result === "expired"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300"
              }`}>
                <ResultIcon size={38} />
              </div>

              <h2 className="mt-5 text-xl font-bold sm:text-2xl">
                {currentResult.title}
              </h2>

              <p className={`mx-auto mt-2 max-w-md text-sm leading-relaxed ${muted}`}>
                {currentResult.message}
              </p>
            </div>

            <div className={`mt-6 rounded-xl border p-4 ${dark ? currentResult.dark : currentResult.light}`}>
              <div className="flex items-center gap-2">
                <ResultIcon size={19} />
                <span className="text-sm font-semibold">
                  {result === "success"
                    ? "Entry permitted"
                    : "Entry not permitted"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextScan}
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F0440A] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#D93808] active:scale-[0.99]"
            >
              <RefreshCw size={18} />
              Scan Next Ticket
            </button>
          </section>
        )}

        {/* Instructions */}
        {!result && (
          <section className={`rounded-2xl border p-4 sm:p-5 ${panel}`}>
            <h3 className="text-sm font-semibold">
              How check-in works
            </h3>

            <ol className={`mt-3 space-y-3 text-sm ${muted}`}>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFF0D8] text-xs font-bold text-[#F0440A] dark:bg-[#3A2B20]">
                  1
                </span>
                Ask the attendee to open their UtsavZero digital ticket.
              </li>

              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFF0D8] text-xs font-bold text-[#F0440A] dark:bg-[#3A2B20]">
                  2
                </span>
                Scan the QR code using the camera above.
              </li>

              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFF0D8] text-xs font-bold text-[#F0440A] dark:bg-[#3A2B20]">
                  3
                </span>
                Allow entry only when the result says Ticket Verified.
              </li>
            </ol>
          </section>
        )}

        <p className={`px-2 text-center text-xs ${muted}`}>
          UtsavZero securely validates tickets through its booking database.
        </p>
      </div>
    </OrganizerLayout>
  );
}
