
"use client";

import { User, Mail, Phone } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface AttendeeDetails {
  fullName: string;
  email: string;
  phone: string;
}

interface AttendeeFormProps {
  attendee: AttendeeDetails;
  onAttendeeChange: (attendee: AttendeeDetails) => void;
}

export default function AttendeeForm({
  attendee,
  onAttendeeChange,
}: AttendeeFormProps) {
  const { isDarkMode } = useTheme();

  const updateField = (
    field: keyof AttendeeDetails,
    value: string
  ) => {
    onAttendeeChange({
      ...attendee,
      [field]: value,
    });
  };

  const inputClass = `w-full min-w-0 rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition-colors duration-200 ${
    isDarkMode
      ? "border-[#414943] bg-[#171A19] text-[#FFF0D7] placeholder:text-[#777F78] focus:border-[#FF6A16] focus:ring-2 focus:ring-[#FF6A16]/15"
      : "border-[#EADCC9] bg-[#FFF8EB] text-[#3D2923] placeholder:text-[#A8998B] focus:border-[#F0440A] focus:ring-2 focus:ring-[#F0440A]/10"
  }`;

  const labelClass = `mb-2 block text-xs font-semibold ${
    isDarkMode ? "text-[#FFF0D7]" : "text-[#3D2923]"
  }`;

  const mutedColor = isDarkMode
    ? "text-[#B8B7A9]"
    : "text-[#927F70]";

  const iconColor = isDarkMode
    ? "text-[#AFA99C]"
    : "text-[#927F70]";

  return (
    <section
      className={`w-full min-w-0 rounded-2xl border p-4 transition-colors duration-300 sm:p-5 ${
        isDarkMode
          ? "border-[#343B36] bg-[#222725]"
          : "border-[#EADCC9] bg-white"
      }`}
    >
      {/* Section Heading */}
      <div className="mb-5">
        <h2
          className={`font-lora text-lg font-bold sm:text-xl ${
            isDarkMode ? "text-[#FFF0D7]" : "text-[#3D2923]"
          }`}
        >
          Attendee Information
        </h2>

        <p className={`mt-1 text-xs leading-relaxed sm:text-sm ${mutedColor}`}>
          Enter the primary attendee&apos;s contact details.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full Name
          </label>

          <div className="relative">
            <User
              size={17}
              aria-hidden="true"
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${iconColor}`}
            />

            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={attendee.fullName}
              onChange={(e) =>
                updateField("fullName", e.target.value)
              }
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelClass}>
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={17}
              aria-hidden="true"
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${iconColor}`}
            />

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={attendee.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone Number
          </label>

          <div className="relative">
            <Phone
              size={17}
              aria-hidden="true"
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${iconColor}`}
            />

            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter your phone number"
              value={attendee.phone}
              onChange={(e) =>
                updateField(
                  "phone",
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              className={inputClass}
              required
            />
          </div>

          <p className={`mt-1.5 text-[10px] sm:text-xs ${mutedColor}`}>
            Enter a 10-digit mobile number.
          </p>
        </div>
      </div>
    </section>
  );
}
