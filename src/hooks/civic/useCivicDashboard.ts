
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCivicDashboardStats,
  type CivicDashboardStats,
} from "@/services/civic/civicDashboardService";

const INITIAL_STATS: CivicDashboardStats = {
  totalLocalities: 0,
  totalGeographicFeatures: 0,
  totalProposedZones: 0,
  totalApplications: 0,
  totalDecisions: 0,
};

export function useCivicDashboard() {
  const [stats, setStats] = useState<CivicDashboardStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getCivicDashboardStats();
      setStats(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load civic dashboard statistics.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const result = await getCivicDashboardStats();

        if (!cancelled) {
          setStats(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load civic dashboard statistics."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    stats,
    loading,
    error,
    refresh,
  };
}
