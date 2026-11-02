
import { createClient } from "@/lib/supabase/client";
import type { CivicActivity } from "@/components/civic/dashboard/CivicRecentActivity";

export async function getCivicRecentActivity(): Promise<CivicActivity[]> {
  const supabase = createClient();

  const [zonesResult, applicationsResult, decisionsResult] =
    await Promise.all([
      supabase
        .from("proposed_zones")
        .select("id, name, description, created_at")
        .order("created_at", { ascending: false })
        .limit(10),

      supabase
        .from("zone_applications")
        .select("id, zone_id, status, submitted_at")
        .order("submitted_at", { ascending: false })
        .limit(10),

      supabase
        .from("zone_decisions")
        .select("id, zone_id, decision, remarks, decided_at")
        .order("decided_at", { ascending: false })
        .limit(10),
    ]);

  const errors = [
    zonesResult.error,
    applicationsResult.error,
    decisionsResult.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    throw new Error(errors.map((error) => error!.message).join("; "));
  }

  const activities: CivicActivity[] = [];

  for (const zone of zonesResult.data ?? []) {
    activities.push({
      id: `zone-${zone.id}`,
      type: "zone_proposed",
      title: zone.name || "New zone proposed",
      description:
        zone.description || "A new zone proposal was created.",
      createdAt: zone.created_at,
    });
  }

  for (const application of applicationsResult.data ?? []) {
    activities.push({
      id: `application-${application.id}`,
      type: "application_submitted",
      title: "Zone application submitted",
      description: `Application for zone ${application.zone_id.slice(0, 8)} · Status: ${application.status.replaceAll("_", " ")}`,
      createdAt: application.submitted_at,
    });
  }

  for (const decision of decisionsResult.data ?? []) {
    activities.push({
      id: `decision-${decision.id}`,
      type: "decision_recorded",
      title: `Zone decision: ${decision.decision.replaceAll("_", " ")}`,
      description:
        decision.remarks ||
        `A decision was recorded for zone ${decision.zone_id.slice(0, 8)}.`,
      createdAt: decision.decided_at,
    });
  }

  return activities
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 10);
}
