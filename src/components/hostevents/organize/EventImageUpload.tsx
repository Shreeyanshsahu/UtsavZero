
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, X, Image as ImageIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface EventImageUploadProps {
  image: File | null;
  onChange: (file: File | null) => void;
}

export default function EventImageUpload({
  image,
  onChange,
}: EventImageUploadProps) {
  const { isDarkMode } = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const preview = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image]
  );

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const headingClass = isDarkMode
    ? "text-[#FFF8EB]"
    : "text-[#38231C]";

  const mutedClass = isDarkMode
    ? "text-[#B7B0A5]"
    : "text-[#806B5D]";

  const uploadAreaClass = isDarkMode
    ? "border-[#454B46] bg-[#202522] hover:bg-[#292E2B]"
    : "border-[#EADCC9] bg-white hover:bg-[#FFF9F0]";

  const previewBorderClass = isDarkMode
    ? "border-[#343B36]"
    : "border-[#EADCC9]";

  function handleFileChange(file?: File) {
    setError("");

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    onChange(file);
  }

  function removeImage() {
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setError("");
  }

  return (
    <section className="space-y-5">
      <div>
        <h2
          className={`font-[var(--font-lora)] text-lg font-bold ${headingClass}`}
        >
          Event Cover Image
        </h2>

        <p className={`mt-1 text-sm ${mutedClass}`}>
          Add an image that represents your celebration.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0])}
      />

      {preview ? (
        <div
          className={`relative overflow-hidden rounded-2xl border ${previewBorderClass}`}
        >
          <img
            src={preview}
            alt="Event cover preview"
            className="h-56 w-full object-cover"
          />

          <div className="absolute right-3 top-3 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#38231C] shadow-md"
            >
              Replace
            </button>

            <button
              type="button"
              onClick={removeImage}
              aria-label="Remove event image"
              className="rounded-lg bg-white p-2 text-[#F0440A] shadow-md"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-colors hover:border-[#F0440A] ${uploadAreaClass}`}
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0D8] text-[#F0440A]">
            <ImagePlus size={23} />
          </div>

          <span className={`text-sm font-semibold ${headingClass}`}>
            Click to upload event image
          </span>

          <span className={`mt-2 text-xs ${mutedClass}`}>
            JPG, PNG or WebP · Maximum 5 MB
          </span>
        </button>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <p className={`flex items-center gap-2 text-xs ${mutedClass}`}>
        <ImageIcon size={14} />
        A clear landscape image works best for event cards.
      </p>
    </section>
  );
}
