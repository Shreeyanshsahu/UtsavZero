
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/types/event";

interface DatabaseEvent {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  venue_name: string | null;
  address: string | null;
  locality_id: string | null;
  starts_at: string;
  ends_at: string;
  capacity: number;
  reserved_count: number;
  ticket_price: number | string;
  is_firecracker_free: boolean;
  latitude: number | null;
  longitude: number | null;
  cover_image_key: string | null;
}

interface DatabaseLocality {
  name: string;
  city: string;
  state: string;
}

function getEventImage(key: string | null): string {
  const publicBaseUrl =
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/+$/, "");

  if (!key || !publicBaseUrl) {
    return "/images/Event1.jpg";
  }

  return `${publicBaseUrl}/${key}`;
}

function mapDatabaseEvent(
  event: DatabaseEvent,
  locality: DatabaseLocality | null
): Event {
  return {
    id: event.id,
    title: event.title,
    description: event.description ?? "Join your community for a responsible celebration.",
    category: event.category ? [event.category] : ["Community"],
    image: getEventImage(event.cover_image_key),
    venue: event.venue_name || "Venue to be announced",
    address: event.address || "",
    city: locality
      ? `${locality.city}, ${locality.state}`
      : "Delhi",
    latitude: event.latitude,
    longitude: event.longitude,
    startDate: event.starts_at,
    endDate: event.ends_at,
    totalSeats: event.capacity,
    bookedSeats: event.reserved_count,
    price: Number(event.ticket_price),
    isFirecrackerFree: event.is_firecracker_free,
    isFamilyFriendly: false,
  };
}

async function fetchLocality(
  localityId: string | null
): Promise<DatabaseLocality | null> {
  if (!localityId) return null;

  const supabase = createClient();

  const { data, error } = await supabase
    .from("localities")
    .select("name, city, state")
    .eq("id", localityId)
    .maybeSingle();

  if (error) {
    console.error("Unable to fetch event locality:", error.message);
    return null;
  }

  return data as DatabaseLocality | null;
}

export async function fetchPublicEvents(): Promise<Event[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      category,
      venue_name,
      address,
      locality_id,
      starts_at,
      ends_at,
      capacity,
      reserved_count,
      is_firecracker_free,
      latitude,
      longitude,
      cover_image_key,ticket_price
    `)
    .eq("status", "published")
    .eq("event_type", "community")
    .eq("is_firecracker_free", true)
    .gt("ends_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  if (error) {
    throw new Error(`Unable to load celebrations: ${error.message}`);
  }

  const rows = (data ?? []) as DatabaseEvent[];

  return Promise.all(
    rows.map(async (event) => {
      const locality = await fetchLocality(event.locality_id);
      return mapDatabaseEvent(event, locality);
    })
  );
}

export async function fetchPublicEvent(
  eventId: string
): Promise<Event | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      category,
      venue_name,
      address,
      locality_id,
      starts_at,
      ends_at,
      capacity,
      reserved_count,
      is_firecracker_free,
      latitude,
      longitude,
      cover_image_key,
      ticket_price
    `)
    .eq("id", eventId)
    .eq("status", "published")
    .eq("event_type", "community")
    .eq("is_firecracker_free", true)
    .gt("ends_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load event: ${error.message}`);
  }

  if (!data) return null;

  const event = data as DatabaseEvent;
  const locality = await fetchLocality(event.locality_id);

  return mapDatabaseEvent(event, locality);
}
