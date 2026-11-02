
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getOrganizerRegistrations,
  type OrganizerRegistration,
} from "@/services/hostevents/registrationService";

export function useRegistrations() {
  const [registrations, setRegistrations] = useState<
    OrganizerRegistration[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // Fetch registrations from Supabase.
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getOrganizerRegistrations();

      setRegistrations(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load registrations.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Automatically fetch registrations when the hook is first used.
useEffect(() => {
  let cancelled = false;

  const loadRegistrations = async () => {
    try {
      const data = await getOrganizerRegistrations();

      if (!cancelled) {
        setRegistrations(data);
      }
    } catch (err) {
      if (!cancelled) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load registrations.";

        setError(message);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  void loadRegistrations();

  return () => {
    cancelled = true;
  };
}, []);
  return {
    registrations,
    loading,
    error,
    refresh,
  };
}
