
"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { useTheme } from "@/context/ThemeContext";

interface DownloadTicketProps {
  ticketElementId?: string;
  bookingReference: string;
}

export default function DownloadTicket({
  ticketElementId = "utsavzero-ticket",
  bookingReference,
}: DownloadTicketProps) {
  const { isDarkMode } = useTheme();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const ticketElement = document.getElementById(ticketElementId);

    if (!ticketElement) {
      alert("Ticket could not be found. Please try again.");
      return;
    }

    try {
      setIsDownloading(true);

      // Wait for ticket images to finish loading.
      const images = Array.from(ticketElement.querySelectorAll("img"));

      await Promise.all(
        images.map((image) => {
          if (image.complete) return Promise.resolve();

          return new Promise<void>((resolve) => {
            image.onload = () => resolve();
            image.onerror = () => resolve();
          });
        })
      );

      // Capture the complete ticket.
      const canvas = await html2canvas(ticketElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDarkMode ? "#222725" : "#FFFFFF",
        logging: false,
      });

      const imageData = canvas.toDataURL("image/png");

      // Convert canvas dimensions to millimetres.
      const width = canvas.width * 0.264583;
      const height = canvas.height * 0.264583;

      // Create a PDF matching the ticket dimensions.
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [width, height],
      });

      pdf.addImage(
        imageData,
        "PNG",
        0,
        0,
        width,
        height
      );

      const safeReference = bookingReference.replace(
        /[^a-zA-Z0-9-_]/g,
        "-"
      );

      pdf.save(`UtsavZero-Ticket-${safeReference}.pdf`);
    } catch (error) {
      console.error("Ticket download failed:", error);
      alert("Unable to download your ticket. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
        isDarkMode
          ? "border border-[#414943] bg-[#292E2B] text-[#FFF0D7] hover:bg-[#353B36]"
          : "border border-[#EADCC9] bg-white text-[#3D2923] hover:bg-[#FFF0D8]"
      }`}
    >
      {isDownloading ? (
        <>
          <Loader2 size={17} className="animate-spin" />
          Preparing PDF...
        </>
      ) : (
        <>
          <Download size={17} />
          Download Ticket
        </>
      )}
    </button>
  );
}
