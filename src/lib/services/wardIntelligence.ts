
import { createClient } from "@/lib/supabase/client";

export interface WardIntelligenceReport {
  report_type: "ward_civic_intelligence";

  ward: {
    id: string;
    name: string;
    city: string;
    state: string;
    area_hectares: number;
    geometry_type: string;
    locality_type: string;
    boundary_valid: boolean;
    data_source: string | null;
    source_date: string | null;
  };

  ward_overview: {
    area_hectares: number;
    boundary_valid: boolean;
    total_mapped_features: number;
    geometry_coverage_percent: number;
    source_coverage_percent: number;
  };

  infrastructure_assessment: {
    mapped_roads: number;
    mapped_residential_areas: number;
    mapped_schools: number;
    mapped_hospitals: number;
    interpretation: string;
  };

  environmental_assessment: {
    geographic_scope: string;
    historical_comparison_years: number[];
    comparison_records: number;
    ward_specific_observations_available: boolean;
    interpretation: string;
  };

  planning_considerations: {
    category: string;
    finding: string;
    consideration: string;
    status:
      | "requires_field_verification"
      | "requires_site_specific_review"
      | "regional_context_only"
      | "mandatory_human_verification";
  }[];

  data_quality: {
    geographic_warnings: string[];
    environmental_warnings: string[];
  };

  decision_guidance: {
    automated_approval: boolean;
    automated_safety_certification: boolean;
    final_decision_authority: string;
    interpretation: string;
  };

  metadata: {
    generated_at: string;
    source_report: string;
    method: string;
    calculation_policy: string;
  };
}

export async function getWardIntelligenceReport(
  localityId: string
): Promise<WardIntelligenceReport> {
  if (!localityId) {
    throw new Error("Ward ID is required.");
  }

  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "get_ward_civic_intelligence_report",
    {
      p_locality_id: localityId,
    }
  );

  if (error) {
    console.error("Ward intelligence error:", error);
    throw new Error(error.message);
  }

  if (!data || data.report_type !== "ward_civic_intelligence") {
    throw new Error("Invalid ward intelligence response.");
  }

  return data as WardIntelligenceReport;
}
