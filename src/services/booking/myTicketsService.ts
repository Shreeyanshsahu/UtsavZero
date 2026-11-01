import { createClient } from "@/lib/supabase/client";

export interface MyTicket {
  ticket_id: string;
  ticket_number: string;
  ticket_status: string;
  checked_in_at: string | null;
  qr_token: string;
  booking_id: string;
  booking_reference: string;
  booking_status: string;
  quantity: number;
  attendee_name: string;
  attendee_email: string;
  total_amount: number;
  currency: string;
  event_id: string;
  event_title: string;
  venue_name: string | null;
  address: string | null;
  starts_at: string;
  ends_at: string;
  cover_image_key: string | null;
}

export async function getMyTickets(): Promise<MyTicket[]> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Please log in to view your tickets.");
  }

  const { data, error } = await supabase.rpc("get_my_tickets");

  if (error) {
    throw new Error(error.message);
  }

  if (!Array.isArray(data)) {
    throw new Error("Unexpected response while loading your tickets.");
  }

  return data as MyTicket[];
}