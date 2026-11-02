
import { createClient } from "@/lib/supabase/client";

// Individual event information displayed in the registrations dashboard.
export interface RegistrationEvent {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
}

// Ticket information associated with a group booking.
export interface RegistrationTicket {
  id: string;
  ticket_number: string;
  status: "active" | "cancelled" | "expired" | "checked_in";
  issued_at: string;
  checked_in_at: string | null;
}

// One registration represents one group booking.
// The quantity field represents the number of attendees.
export interface OrganizerRegistration {
  id: string;
  event_id: string;
  user_id: string | null;
  booking_reference: string;
  quantity: number;
  status: "confirmed" | "cancelled" | "expired";
  created_at: string;
  cancelled_at: string | null;

  attendee_name: string;
  attendee_email: string;
  attendee_phone: string | null;

  unit_price: number;
  total_amount: number;
  currency: string;
  payment_status: string;

  event: RegistrationEvent;
  ticket: RegistrationTicket | null;
}

// Fetch all registrations belonging to the logged-in organiser.
export async function getOrganizerRegistrations(): Promise<
  OrganizerRegistration[]
> {
  const supabase = createClient();

  // 1. Verify the currently authenticated user.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Please log in to view organiser registrations.");
  }

  // 2. Fetch events owned by this organiser.
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("id, title, starts_at, ends_at")
    .eq("organizer_id", user.id);

  if (eventsError) {
    throw new Error(
      `Unable to load your events: ${eventsError.message}`
    );
  }

  // No events means there cannot be any registrations.
  if (!events || events.length === 0) {
    return [];
  }

  const eventIds = events.map((event) => event.id);

  // 3. Fetch bookings associated with the organiser's events.
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select(`
      id,
      event_id,
      user_id,
      quantity,
      booking_reference,
      status,
      created_at,
      cancelled_at,
      attendee_name,
      attendee_email,
      attendee_phone,
      unit_price,
      total_amount,
      currency,
      payment_status
    `)
    .in("event_id", eventIds)
    .order("created_at", { ascending: false });

  if (bookingsError) {
    throw new Error(
      `Unable to load registrations: ${bookingsError.message}`
    );
  }

  if (!bookings || bookings.length === 0) {
    return [];
  }

  // 4. Fetch tickets belonging to these bookings.
  const bookingIds = bookings.map((booking) => booking.id);

  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select(`
      id,
      booking_id,
      ticket_number,
      status,
      issued_at,
      checked_in_at
    `)
    .in("booking_id", bookingIds);

  if (ticketsError) {
    throw new Error(
      `Unable to load registration tickets: ${ticketsError.message}`
    );
  }

  // 5. Create lookup maps to avoid repeatedly searching arrays.
  const eventMap = new Map(
    events.map((event) => [event.id, event])
  );

  const ticketMap = new Map(
    (tickets ?? []).map((ticket) => [ticket.booking_id, ticket])
  );

  // 6. Combine bookings, events and tickets.
  return bookings.map((booking) => {
    const event = eventMap.get(booking.event_id);

    if (!event) {
      throw new Error(
        `Event information missing for booking ${booking.booking_reference}.`
      );
    }

    return {
      ...booking,
      event,
      ticket: ticketMap.get(booking.id) ?? null,
    } as OrganizerRegistration;
  });
}
