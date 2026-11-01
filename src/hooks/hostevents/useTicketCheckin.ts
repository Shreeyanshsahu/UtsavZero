"use client";

import { useCallback, useState } from "react";
import {
  checkInTicket,
  type CheckinStatus,
} from "@/services/hostevents/checkinService";

export function useTicketCheckin() {
  const [result, setResult] = useState<CheckinStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async (qrToken: string) => {
    if (loading) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await checkInTicket(qrToken);
      setResult(response);
      return response;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Ticket verification failed.";

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    loading,
    error,
    scan,
    reset,
  };
}