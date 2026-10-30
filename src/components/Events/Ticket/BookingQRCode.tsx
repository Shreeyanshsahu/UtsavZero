"use client";

import { QRCodeSVG } from "qrcode.react";
import { useTheme } from "@/context/ThemeContext";

interface BookingQRCodeProps {
  value: string;
  size?: number;
}

export default function BookingQRCode({
  value,
  size = 180,
}: BookingQRCodeProps) {
  const { isDarkMode } = useTheme();

  const background = isDarkMode
    ? "bg-[#222725]"
    : "bg-white";

  const border = isDarkMode
    ? "border-[#414943]"
    : "border-[#EADCC9]";

  const textColor = isDarkMode
    ? "text-[#AFA99C]"
    : "text-[#927F70]";

  if (!value.trim()) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border p-6 ${background} ${border}`}
      >
        <p className={`text-xs ${textColor}`}>
          QR code unavailable
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* QR Code */}
      <div
        className={`rounded-xl border p-3 ${background} ${border}`}
      >
        <QRCodeSVG
          value={value}
          size={size}
          level="H"
          bgColor="#FFFFFF"
          fgColor="#171A19"
          marginSize={2}
          title="UtsavZero booking verification QR code"
        />
      </div>

      <p className={`text-center text-xs ${textColor}`}>
        Scan this QR code to verify your ticket
      </p>
    </div>
  );
}
