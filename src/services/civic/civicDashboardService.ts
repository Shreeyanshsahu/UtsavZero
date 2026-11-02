
import { createClient } from "@/lib/supabase/client";

export interface CivicDashboardStats {
  totalLocalities: number;
  totalGeographicFeatures: number;
  totalProposedZones: number;
  totalApplications: number;
  totalDecisions: number;
}

export async function getCivicDashboardStats(): Promise<CivicDashboardStats> {
  const supabase = createClient();

  // Fetch exact row counts without downloading table records.
  const [
    localitiesResult,
    featuresResult,
    zonesResult,
    applicationsResult,
    decisionsResult,
  ] = await Promise.all([
    supabase
      .from("localities")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("geographic_features")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("proposed_zones")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("zone_applications")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("zone_decisions")
      .select("id", { count: "exact", head: true }),
  ]);

  // Check for errors from every query.
  const errors = [
    localitiesResult.error,
    featuresResult.error,
    zonesResult.error,
    applicationsResult.error,
    decisionsResult.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    throw new Error(
      errors.map((error) => error!.message).join("; ")
    );
  }

  return {
    totalLocalities: localitiesResult.count ?? 0,
    totalGeographicFeatures: featuresResult.count ?? 0,
    totalProposedZones: zonesResult.count ?? 0,
    totalApplications: applicationsResult.count ?? 0,
    totalDecisions: decisionsResult.count ?? 0,
  };
}
