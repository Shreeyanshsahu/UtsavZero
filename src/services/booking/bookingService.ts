
import { createClient } from "@/lib/supabase/client";
import type { AttendeeDetails } from "@/components/Events/Booking/AttendeeForm";

export interface BookableEvent {
  id: string;
  title: string;
  description: string;
  category: string[];
  venue_name: string;
  address: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  reserved_count: number;
  ticket_price: number;
  status: string;
  event_type: string;
  is_firecracker_free: boolean;
  latitude: number | null;
  longitude: number | null;
  cover_image_key: string | null;
}

export interface BookingResult {
  booking_id: string;
  booking_reference: string;
  ticket_number: string;
  quantity: number;
  qr_token: string;
  unit_price: number;
  total_amount: number;
  currency: string;
  payment_status: "not_required" | "demo_unpaid" | "legacy_unknown";
  
}

export async function fetchBookableEvent(
  eventId: string
): Promise<BookableEvent> {
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
      starts_at,
      ends_at,
      capacity,
      reserved_count,
      ticket_price,
      status,
      event_type,
      is_firecracker_free,
      latitude,
      longitude,
      cover_image_key
    `)
    .eq("id", eventId)
    .eq("status", "published")
    .eq("event_type", "community")
    .eq("is_firecracker_free", true)
    .single();

  if (error) {
    throw new Error(
      error.code === "PGRST116"
        ? "This event is unavailable or does not exist."
        : `Unable to load event: ${error.message}`
    );
  }

  return {
    ...data,
    ticket_price: Number(data.ticket_price ?? 0),
  } as BookableEvent;
}

export async function createGroupBooking(input: {
  eventId: string;
  quantity: number;
  attendee: AttendeeDetails;
}): Promise<BookingResult> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Please log in before booking.");
  }

  const { data, error } = await supabase.rpc(
    "create_group_booking",
    {
      p_event_id: input.eventId,
      p_quantity: input.quantity,
      p_attendee_name: input.attendee.fullName.trim(),
      p_attendee_email: input.attendee.email.trim().toLowerCase(),
      p_attendee_phone: input.attendee.phone.trim(),
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!data || typeof data !== "object") {
    throw new Error("The booking service returned an invalid response.");
  }

  return {
    ...(data as BookingResult),
    unit_price: Number((data as BookingResult).unit_price),
    total_amount: Number((data as BookingResult).total_amount),
  };
}
