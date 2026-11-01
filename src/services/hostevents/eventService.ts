
import { createClient } from "@/lib/supabase/client";

export interface Locality {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  category: string;
  venueName: string;
  address: string;
  localityId: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  status: "draft" | "published";
  coverImageKey?: string | null;
  latitude: number | null;
  longitude: number | null;
}

export async function fetchLocalities(): Promise<Locality[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("localities")
    .select("id, name, city, state")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Unable to load localities: ${error.message}`);
  }

  return data ?? [];
}

export async function createEvent(input: CreateEventInput) {
  const supabase = createClient();

  // Get the currently authenticated organizer.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in to create an event.");
  }

  if (!input.title.trim()) {
    throw new Error("Event title is required.");
  }

  if (
    !Number.isInteger(input.capacity) ||
    input.capacity < 1
  ) {
    throw new Error("Event capacity must be a positive whole number.");
  }

  const startsAt = new Date(input.startsAt);
  const endsAt = new Date(input.endsAt);

  if (
    Number.isNaN(startsAt.getTime()) ||
    Number.isNaN(endsAt.getTime()) ||
    startsAt <= new Date() ||
    endsAt <= startsAt
  ) {
    throw new Error("Please provide a valid future event schedule.");
  }
  const { latitude, longitude } = input;

  if (
    (latitude === null) !== (longitude === null)
  ) {
    throw new Error("Please select a complete event location.");
  }

  if (
    latitude !== null &&
    longitude !== null &&
    (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    )
  ) {
    throw new Error("Please select valid geographic coordinates.");
  }
  const { data, error } = await supabase
    .from("events")
    .insert({
      organizer_id: user.id,
      locality_id: input.localityId || null,
      title: input.title.trim(),
      description: input.description.trim() || null,
      event_type: "community",
      category: input.category,
      venue_name: input.venueName.trim() || null,
      address: input.address.trim() || null,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      capacity: input.capacity,
      status: input.status,
      is_firecracker_free: true,
      cover_image_key: input.coverImageKey ?? null,
      latitude: input.latitude,
      longitude: input.longitude,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Unable to create event: ${error.message}`);
  }

  return data;
}



export async function uploadEventImage(file: File): Promise<string> {
  const response = await fetch("/api/uploads/event-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contentType: file.type,
      fileSize: file.size,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Unable to prepare image upload.");
  }

  const uploadResponse = await fetch(result.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Image upload to Cloudflare R2 failed.");
  }

  return result.objectKey as string;
}
