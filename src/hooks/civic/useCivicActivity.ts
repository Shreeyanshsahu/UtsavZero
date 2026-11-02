
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCivicRecentActivity,
} from "@/services/civic/civicActivityService";
import type { CivicActivity } from "@/components/civic/dashboard/CivicRecentActivity";

export function useCivicActivity() {
  const [activities, setActivities] = useState<CivicActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getCivicRecentActivity();
      setActivities(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load recent civic activity."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadActivity() {
      try {
        const result = await getCivicRecentActivity();

        if (!cancelled) {
          setActivities(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load recent civic activity."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadActivity();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    activities,
    loading,
    error,
    refresh,
  };
}
