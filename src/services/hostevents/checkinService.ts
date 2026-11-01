import { createClient } from "@/lib/supabase/client";

export type CheckinStatus =
  | "success"
  | "already_used"
  | "invalid"
  | "cancelled"
  | "expired"
  | "not_authorized";

export async function checkInTicket(
  qrToken: string
): Promise<CheckinStatus> {
  const token = qrToken.trim();

  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return "invalid";
  }

  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Please log in to scan tickets.");
  }

  const { data, error } = await supabase.rpc(
    "check_in_group_ticket",
    {
      p_qr_token: token,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  const validStatuses: CheckinStatus[] = [
    "success",
    "already_used",
    "invalid",
    "cancelled",
    "expired",
    "not_authorized",
  ];

  if (
    typeof data !== "string" ||
    !validStatuses.includes(data as CheckinStatus)
  ) {
    throw new Error("Unexpected response from ticket verification.");
  }

  return data as CheckinStatus;
}

export function getCheckinMessage(status: CheckinStatus): string {
  const messages: Record<CheckinStatus, string> = {
    success: "Ticket verified. Check-in successful.",
    already_used: "This ticket has already been used.",
    invalid: "Invalid ticket. No matching booking was found.",
    cancelled: "This booking has been cancelled.",
    expired: "This ticket has expired.",
    not_authorized: "You are not authorised to check in this ticket.",
  };

  return messages[status];
}