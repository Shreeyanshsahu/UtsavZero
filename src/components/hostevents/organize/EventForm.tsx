
"use client";

import { useEffect, useState } from "react";
import { Save, Send } from "lucide-react";

import { useTheme } from "@/context/ThemeContext";

import EventDetailsForm from "./EventDetailsForm";
import EventScheduleForm from "./EventScheduleForm";
import EventCapacityForm from "./EventCapacityForm";
import EventImageUpload from "./EventImageUpload";
import EventLocalitySelect from "./EventLocalitySelect";

import {
  createEvent,
  fetchLocalities,
  uploadEventImage,
  type Locality,
} from "@/services/hostevents/eventService";
interface EventFormData {
  title: string;
  description: string;
  category: string;
  venueName: string;
  address: string;
  localityId: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  image: File | null;
}
interface EventFormProps {
  onEventCreated?: () => void;
}
const initialFormData: EventFormData = {
  title: "",
  description: "",
  category: "",
  venueName: "",
  address: "",
  localityId: "",
  startsAt: "",
  endsAt: "",
  capacity: 100,
  image: null,
};

export default function EventForm({
  onEventCreated,
}: EventFormProps) {
    const { isDarkMode } = useTheme();

  const [formData, setFormData] =
    useState<EventFormData>(initialFormData);

  const [localities, setLocalities] = useState<Locality[]>([]);
  const [loadingLocalities, setLoadingLocalities] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const cardClass = isDarkMode
    ? "border-[#343B36] bg-[#202522]"
    : "border-[#EADCC9] bg-white";

  const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

  const messageClass =
    messageType === "success"
      ? isDarkMode
        ? "border-[#343B36] bg-[#292E2B] text-[#FFF8EB]"
        : "border-[#EADCC9] bg-[#FFF4E3] text-[#806B5D]"
      : isDarkMode
        ? "border-red-900 bg-red-950/30 text-red-300"
        : "border-red-200 bg-red-50 text-red-700";

  useEffect(() => {
    let active = true;

    fetchLocalities()
      .then((data) => {
        if (active) setLocalities(data);
      })
      .catch((error: unknown) => {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to load localities."
          );
          setMessageType("error");
        }
      })
      .finally(() => {
        if (active) setLoadingLocalities(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleTextChange(field: string, value: string) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
    setMessage("");
  }

  function handleCapacityChange(field: string, value: number) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
    setMessage("");
  }

  function validateForm() {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.venueName.trim() ||
      !formData.address.trim() ||
      !formData.startsAt ||
      !formData.endsAt
    ) {
      setMessage("Please complete all required event details.");
      setMessageType("error");
      return false;
    }

    const start = new Date(formData.startsAt);
    const end = new Date(formData.endsAt);

    if (Number.isNaN(start.getTime()) || start <= new Date()) {
      setMessage("Please select a valid future start time.");
      setMessageType("error");
      return false;
    }

    if (Number.isNaN(end.getTime()) || end <= start) {
      setMessage("Event end time must be later than its start time.");
      setMessageType("error");
      return false;
    }

    if (
      !Number.isInteger(formData.capacity) ||
      formData.capacity < 1 ||
      formData.capacity > 10000
    ) {
      setMessage("Capacity must be between 1 and 10,000.");
      setMessageType("error");
      return false;
    }

    return true;
  }

  const handleSubmit = async (status: "draft" | "published") => {
  setMessage("");

  if (
    !formData.title.trim() ||
    !formData.description.trim() ||
    !formData.category ||
    !formData.venueName.trim() ||
    !formData.address.trim() ||
    !formData.startsAt ||
    !formData.endsAt
  ) {
    setMessageType("error");
    setMessage("Please complete all required fields.");
    return;
  }

  const start = new Date(formData.startsAt);
  const end = new Date(formData.endsAt);

  if (start <= new Date() || end <= start) {
    setMessageType("error");
    setMessage("Please select a valid future event schedule.");
    return;
  }

  if (
    !Number.isInteger(formData.capacity) ||
    formData.capacity < 1 ||
    formData.capacity > 10000
  ) {
    setMessageType("error");
    setMessage("Capacity must be between 1 and 10,000.");
    return;
  }

  setSaving(true);

  try {
    // Upload selected image to Cloudflare R2.
    let coverImageKey: string | null = null;

    if (formData.image) {
      coverImageKey = await uploadEventImage(formData.image);
    }

    // Create the event and save its R2 image reference.
    await createEvent({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      venueName: formData.venueName,
      address: formData.address,
      localityId: formData.localityId,
      startsAt: formData.startsAt,
      endsAt: formData.endsAt,
      capacity: formData.capacity,
      coverImageKey,
      status,
    });
    onEventCreated?.();
    setMessageType("success");
    setMessage(
      status === "draft"
        ? "Event saved as draft successfully!"
        : "Event published successfully!"
    );

    setFormData(initialFormData);
  } catch (error) {
    setMessageType("error");
    setMessage(
      error instanceof Error
        ? error.message
        : "Something went wrong while creating your event."
    );
  } finally {
    setSaving(false);
  }
};

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6"
    >
      <div className={`rounded-2xl border p-5 sm:p-7 ${cardClass}`}>
        <EventDetailsForm
          title={formData.title}
          description={formData.description}
          category={formData.category}
          venueName={formData.venueName}
          address={formData.address}
          onChange={handleTextChange}
        />
      </div>

      <div className={`rounded-2xl border p-5 sm:p-7 ${cardClass}`}>
        <EventLocalitySelect
          localities={localities}
          localityId={formData.localityId}
          onChange={(localityId) => {
            setFormData((previous) => ({
              ...previous,
              localityId,
            }));
            setMessage("");
          }}
          loading={loadingLocalities}
        />
      </div>

      <div className={`rounded-2xl border p-5 sm:p-7 ${cardClass}`}>
        <EventScheduleForm
          startsAt={formData.startsAt}
          endsAt={formData.endsAt}
          onChange={handleTextChange}
        />
      </div>

      <div className={`rounded-2xl border p-5 sm:p-7 ${cardClass}`}>
        <EventCapacityForm
          capacity={formData.capacity}
          onChange={handleCapacityChange}
        />
      </div>

      <div className={`rounded-2xl border p-5 sm:p-7 ${cardClass}`}>
        <EventImageUpload
          image={formData.image}
          onChange={(image) => {
            setFormData((previous) => ({
              ...previous,
              image,
            }));
            setMessage("");
          }}
        />
      </div>

      {message && (
        <p
          role="status"
          className={`rounded-xl border p-4 text-sm ${messageClass}`}
        >
          {message}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSubmit("draft")}
          className={`${buttonClass} ${
            isDarkMode
              ? "border border-[#454B46] bg-[#202522] text-[#FFF8EB] hover:bg-[#292E2B]"
              : "border border-[#EADCC9] bg-white text-[#38231C] hover:bg-[#FFF4E3]"
          }`}
        >
          <Save size={17} />
          {saving ? "Saving..." : "Save Draft"}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={() => handleSubmit("published")}
          className={`${buttonClass} bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] text-white shadow-md hover:brightness-105`}
        >
          <Send size={16} />
          {saving ? "Saving..." : "Publish Event"}
        </button>
      </div>
    </form>
  );
}
