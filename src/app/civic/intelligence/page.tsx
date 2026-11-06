
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Hospital,
  Map,
  MapPin,
  RefreshCw,
  School,
  ShieldCheck,
  TrendingUp,
  Trees,
  Route,
} from "lucide-react";

import CivicLayout from "@/components/civic/layout/CivicLayout";
import { useTheme } from "@/context/ThemeContext";
import { createClient } from "@/lib/supabase/client";

import {
  getWardIntelligenceReport,
  type WardIntelligenceReport,
} from "@/lib/services/wardIntelligence";

const DEFAULT_WARD_ID =
  "33d079d2-75ee-5e95-a65e-e42be6bb0976";

interface WardOption {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
}
interface CivicAIAnalysis {
  executive_summary: string;
  geographic_findings: string[];
  environmental_findings: string[];
  planning_recommendations: string[];
  data_limitations: string[];
  conclusion: string;
}
interface DiwaliComparison {
  year: number;
  pollutant: string;
  stations_compared: number;
  avg_pre_diwali: number;
  avg_diwali_day: number;
  avg_post_diwali: number;
  diwali_change_percent: number;
}

const statusLabels: Record<string, string> = {
  requires_field_verification: "Field verification required",
  requires_site_specific_review: "Site-specific review",
  regional_context_only: "Regional context only",
  mandatory_human_verification: "Human verification required",
};

function formatNumber(
  value: number | null | undefined
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  dark,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  dark: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${dark
        ? "border-[#343B36] bg-[#202522]"
        : "border-[#EADCC9] bg-white"
        }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className={
            dark
              ? "text-sm text-[#B8B0A4]"
              : "text-sm text-[#806B5D]"
          }
        >
          {title}
        </p>

        <div className="rounded-xl bg-[#F0440A]/10 p-2.5 text-[#F0440A]">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold">
        {value}
      </p>

      <p
        className={`mt-2 text-xs leading-5 ${dark
          ? "text-[#A9A99F]"
          : "text-[#806B5D]"
          }`}
      >
        {description}
      </p>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  icon: Icon,
  children,
  dark,
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  dark: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border p-5 sm:p-6 ${dark
        ? "border-[#343B36] bg-[#202522]"
        : "border-[#EADCC9] bg-white"
        }`}
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-xl bg-[#F0440A]/10 p-2.5 text-[#F0440A]">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="text-lg font-bold">
            {title}
          </h2>

          {subtitle && (
            <p
              className={`mt-1 text-sm ${dark
                ? "text-[#B8B0A4]"
                : "text-[#806B5D]"
                }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

function StatusBadge({
  status,
  dark,
}: {
  status: string;
  dark: boolean;
}) {
  const warning =
    status === "mandatory_human_verification";

  const regional =
    status === "regional_context_only";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${warning
        ? "bg-red-500/10 text-red-500"
        : regional
          ? "bg-blue-500/10 text-blue-500"
          : dark
            ? "bg-[#39271D] text-[#FF9A57]"
            : "bg-[#FFF0D8] text-[#E65B16]"
        }`}
    >
      {statusLabels[status] ??
        status.replaceAll("_", " ")}
    </span>
  );
}

export default function PlanningIntelligencePage() {
  const { isDarkMode } = useTheme();

  // Stable Supabase client.
  const supabase = useMemo(
    () => createClient(),
    []
  );
  const [aiAnalysis, setAiAnalysis] =
    useState<CivicAIAnalysis | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiGeneratedAt, setAiGeneratedAt] = useState("");
  const [wards, setWards] = useState<WardOption[]>([]);

  const [selectedWardId, setSelectedWardId] =
    useState(DEFAULT_WARD_ID);

  const [report, setReport] =
    useState<WardIntelligenceReport | null>(null);

  const [comparisons, setComparisons] =
    useState<DiwaliComparison[]>([]);

  const [loadingWards, setLoadingWards] =
    useState(true);

  const [loadingReport, setLoadingReport] =
    useState(false);

  const [error, setError] = useState("");

  const dark = isDarkMode;

  const colors = {
    muted: dark
      ? "text-[#B8B0A4]"
      : "text-[#806B5D]",

    border: dark
      ? "border-[#343B36]"
      : "border-[#EADCC9]",

    surface: dark
      ? "bg-[#202522]"
      : "bg-white",

    input: dark
      ? "border-[#343B36] bg-[#171A19] text-[#F5EBDD]"
      : "border-[#EADCC9] bg-white text-[#38231C]",
  };

  // Load a ward intelligence report.
  const loadReport = useCallback(
    async (wardId: string) => {
      if (!wardId) return;

      setLoadingReport(true);
      setError("");

      try {
        const [
          wardReport,
          comparisonResult,
        ] = await Promise.all([
          getWardIntelligenceReport(wardId),

          supabase.rpc(
            "get_diwali_pollution_comparison"
          ),
        ]);

        setReport(wardReport);

        if (comparisonResult.error) {
          console.error(
            "Historical comparison error:",
            comparisonResult.error
          );

          setComparisons([]);
        } else {
          setComparisons(
            (comparisonResult.data ??
              []) as DiwaliComparison[]
          );
        }
      } catch (err) {
        console.error(
          "Planning intelligence error:",
          err
        );

        setReport(null);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load the intelligence report."
        );
      } finally {
        setLoadingReport(false);
      }
    },
    [supabase]
  );
  const generateAIBriefing = async () => {
    if (!selectedWardId) return;

    setAiLoading(true);
    setAiError("");
    setAiAnalysis(null);

    try {
      const response = await fetch(
        "/api/civic/intelligence",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            localityId: selectedWardId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to generate AI briefing."
        );
      }

      if (!result.analysis?.executive_summary) {
        throw new Error("Gemini returned an incomplete report.");
      }

      setAiAnalysis(result.analysis);
      setAiGeneratedAt(result.generatedAt);
    } catch (error) {
      console.error("AI briefing error:", error);

      setAiError(
        error instanceof Error
          ? error.message
          : "Unable to generate AI briefing."
      );
    } finally {
      setAiLoading(false);
    }
  };
  // Load available wards and immediately fetch the initial report.
  useEffect(() => {
    let active = true;

    async function loadWards() {
      setLoadingWards(true);

      const { data, error } = await supabase
        .from("localities")
        .select("id, name, city, state")
        .eq("locality_type", "ward")
        .order("name");

      if (!active) return;

      if (error) {
        setError(
          `Unable to load wards: ${error.message}`
        );

        setLoadingWards(false);
        return;
      }

      const options = (data ?? []) as WardOption[];

      setWards(options);

      if (options.length > 0) {
        const defaultExists = options.some(
          (ward) => ward.id === DEFAULT_WARD_ID
        );

        const initialWardId = defaultExists
          ? DEFAULT_WARD_ID
          : options[0].id;

        setSelectedWardId(initialWardId);

        // Fetch the initial report directly.
        void loadReport(initialWardId);
      } else {
        setError(
          "No wards were returned. Check locality access and RLS policies."
        );
      }

      setLoadingWards(false);
    }

    void loadWards();

    return () => {
      active = false;
    };
  }, [supabase, loadReport]);

  const pm25 = comparisons.filter(
    (item) => item.pollutant === "PM2.5"
  );

  const pm10 = comparisons.filter(
    (item) => item.pollutant === "PM10"
  );

  const warnings = [
    ...(report?.data_quality.geographic_warnings ?? []),
    ...(report?.data_quality.environmental_warnings ?? []),
  ];

  const generatedAt = report?.metadata.generated_at
    ? new Date(
      report.metadata.generated_at
    ).toLocaleString("en-IN")
    : "—";

  return (
    <CivicLayout
      title="Planning Intelligence"
      description="Explore ward-level geographic infrastructure, historical environmental evidence, and transparent civic planning considerations."
    >
      <div className="space-y-6">

        {/* Ward selector */}
        <div
          className={`flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-end sm:justify-between ${colors.border} ${colors.surface}`}
        >
          <div className="min-w-0 flex-1">
            <label
              htmlFor="ward-selector"
              className={`mb-2 block text-xs font-bold uppercase tracking-wider ${colors.muted}`}
            >
              Select municipal ward
            </label>

            <select
              id="ward-selector"
              value={selectedWardId}
              onChange={(event) => {
                const wardId = event.target.value;

                setSelectedWardId(wardId);
                void loadReport(wardId);
              }}
              disabled={
                loadingWards || wards.length === 0
              }
              className={`w-full max-w-xl rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#F0440A] ${colors.input}`}
            >
              {loadingWards && (
                <option value="">
                  Loading wards...
                </option>
              )}

              {wards.map((ward) => (
                <option
                  key={ward.id}
                  value={ward.id}
                >
                  {ward.name}
                </option>
              ))}
            </select>

            <p className={`mt-2 text-xs ${colors.muted}`}>
              Reports are generated independently of proposed-zone assessments.
            </p>
          </div>

          <button
            onClick={() =>
              void loadReport(selectedWardId)
            }
            disabled={
              loadingReport || !selectedWardId
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] px-5 py-3 text-sm font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                loadingReport ? "animate-spin" : ""
              }
            />

            {loadingReport
              ? "Refreshing..."
              : "Refresh report"}
          </button>
          <button
            onClick={generateAIBriefing}
            disabled={aiLoading || loadingReport || !report}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F0440A]/40 px-5 py-3 text-sm font-bold text-[#F0440A] transition hover:bg-[#F0440A]/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Activity
              size={16}
              className={aiLoading ? "animate-pulse" : ""}
            />

            {aiLoading
              ? "Generating AI briefing..."
              : "Generate AI briefing"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0"
            />
            <div>{error}</div>
          </div>
        )}

        {/* Loading */}
        {loadingReport && !report && (
          <div
            className={`rounded-2xl border p-12 text-center ${colors.border} ${colors.surface}`}
          >
            <RefreshCw
              className="mx-auto mb-3 animate-spin text-[#F0440A]"
              size={28}
            />

            <p className="font-semibold">
              Generating ward intelligence...
            </p>

            <p className={`mt-2 text-sm ${colors.muted}`}>
              Fetching geographic and environmental information from Supabase.
            </p>
          </div>
        )}

        {report && (
          <>
            {/* Ward identity */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F0440A]">
                  <ShieldCheck size={15} />
                  Civic intelligence report
                </div>

                <h2 className="text-xl font-bold sm:text-2xl">
                  {report.ward.name}
                </h2>

                <p className={`mt-1 text-sm ${colors.muted}`}>
                  {report.ward.city},{" "}
                  {report.ward.state} ·{" "}
                  {formatNumber(
                    report.ward_overview.area_hectares
                  )}{" "}
                  hectares
                </p>
              </div>

              {report.ward.boundary_valid ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-500">
                  <CheckCircle2 size={14} />
                  Valid ward boundary
                </span>
              ) : (
                <span className="rounded-full bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-500">
                  Boundary needs review
                </span>
              )}
            </div>

            {/* Overview metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Ward area"
                value={`${formatNumber(report.ward_overview.area_hectares)} ha`}
                description="Area of the selected ward boundary"
                icon={MapPin}
                dark={dark}
              />

              <MetricCard
                title="Mapped features"
                value={formatNumber(report.ward_overview.total_mapped_features)}
                description="Geographic features assigned to this ward"
                icon={Map}
                dark={dark}
              />

              <MetricCard
                title="Geometry coverage"
                value={`${formatNumber(report.ward_overview.geometry_coverage_percent)}%`}
                description="Mapped features with geometry"
                icon={Database}
                dark={dark}
              />

              <MetricCard
                title="Source coverage"
                value={`${formatNumber(report.ward_overview.source_coverage_percent)}%`}
                description="Mapped features with source information"
                icon={FileText}
                dark={dark}
              />
            </div>

            {/* Infrastructure */}
            <SectionCard
              title="Geographic infrastructure"
              subtitle="Ward-wide inventory of mapped geographic features."
              icon={Building2}
              dark={dark}
            >
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  {
                    label: "Roads",
                    value: report.infrastructure_assessment.mapped_roads,
                    icon: Route,
                  },
                  {
                    label: "Residential areas",
                    value: report.infrastructure_assessment.mapped_residential_areas,
                    icon: Trees,
                  },
                  {
                    label: "Schools",
                    value: report.infrastructure_assessment.mapped_schools,
                    icon: School,
                  },
                  {
                    label: "Hospitals",
                    value: report.infrastructure_assessment.mapped_hospitals,
                    icon: Hospital,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-xl border p-4 ${colors.border} ${dark
                      ? "bg-[#171A19]"
                      : "bg-[#FFFAF1]"
                      }`}
                  >
                    <item.icon
                      className="mb-3 text-[#F0440A]"
                      size={20}
                    />

                    <p className="text-2xl font-bold">
                      {formatNumber(item.value)}
                    </p>

                    <p className={`mt-1 text-xs ${colors.muted}`}>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <p className={`mt-4 text-xs leading-5 ${colors.muted}`}>
                {report.infrastructure_assessment.interpretation}
              </p>
            </SectionCard>

            {/* Environmental evidence */}
            <SectionCard
              title="Historical environmental evidence"
              subtitle="Delhi-wide Diwali-period pollutant comparisons, 2020–2024."
              icon={Activity}
              dark={dark}
            >
              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className={`rounded-xl p-4 ${dark ? "bg-[#171A19]" : "bg-[#FFFAF1]"}`}>
                  <p className={`text-xs ${colors.muted}`}>
                    Comparison records
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {report.environmental_assessment.comparison_records}
                  </p>
                </div>

                <div className={`rounded-xl p-4 ${dark ? "bg-[#171A19]" : "bg-[#FFFAF1]"}`}>
                  <p className={`text-xs ${colors.muted}`}>
                    Years covered
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {report.environmental_assessment.historical_comparison_years.join(", ")}
                  </p>
                </div>

                <div className={`rounded-xl p-4 ${dark ? "bg-[#171A19]" : "bg-[#FFFAF1]"}`}>
                  <p className={`text-xs ${colors.muted}`}>
                    Ward-linked AQ data
                  </p>

                  <p className="mt-2 text-lg font-bold text-amber-500">
                    {report.environmental_assessment.ward_specific_observations_available
                      ? "Available"
                      : "Unavailable"}
                  </p>
                </div>
              </div>

              {comparisons.length > 0 ? (
                <div className="space-y-6">
                  {[
                    { title: "PM2.5", rows: pm25 },
                    { title: "PM10", rows: pm10 },
                  ].map((group) => (
                    <div key={group.title}>
                      <h3 className="mb-3 font-bold">
                        {group.title}
                      </h3>

                      <div className="space-y-3">
                        {group.rows.map((row) => {
                          const max = Math.max(
                            row.avg_pre_diwali,
                            row.avg_diwali_day,
                            row.avg_post_diwali,
                            1
                          );

                          return (
                            <div
                              key={`${row.year}-${row.pollutant}`}
                              className={`rounded-xl border p-4 ${colors.border}`}
                            >
                              <div className="mb-3 flex items-center justify-between">
                                <span className="font-bold">
                                  {row.year}
                                </span>

                                <span
                                  className={`text-xs font-bold ${row.diwali_change_percent > 0
                                    ? "text-red-500"
                                    : "text-emerald-500"
                                    }`}
                                >
                                  {row.diwali_change_percent > 0
                                    ? "+"
                                    : ""}
                                  {formatNumber(row.diwali_change_percent)}%
                                  {" "}Diwali-day change
                                </span>
                              </div>

                              {[
                                {
                                  label: "Pre-Diwali",
                                  value: row.avg_pre_diwali,
                                },
                                {
                                  label: "Diwali day",
                                  value: row.avg_diwali_day,
                                },
                                {
                                  label: "Post-Diwali",
                                  value: row.avg_post_diwali,
                                },
                              ].map((bar) => (
                                <div
                                  key={bar.label}
                                  className="mb-2 last:mb-0"
                                >
                                  <div className="mb-1 flex justify-between text-xs">
                                    <span className={colors.muted}>
                                      {bar.label}
                                    </span>

                                    <span className="font-semibold">
                                      {formatNumber(bar.value)}
                                    </span>
                                  </div>

                                  <div
                                    className={`h-2 overflow-hidden rounded-full ${dark
                                      ? "bg-[#343B36]"
                                      : "bg-[#F1E6D8]"
                                      }`}
                                  >
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-[#FFBE45] to-[#F0440A]"
                                      style={{
                                        width: `${(bar.value / max) * 100}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}

                              <p className={`mt-3 text-[10px] ${colors.muted}`}>
                                {row.stations_compared} monitoring stations compared
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${colors.muted}`}>
                  Historical comparison data could not be loaded.
                </p>
              )}

              <p className={`mt-5 text-xs leading-5 ${colors.muted}`}>
                {report.environmental_assessment.interpretation}
              </p>
            </SectionCard>

            {/* Planning considerations */}
            <SectionCard
              title="Civic planning considerations"
              subtitle="Evidence-based checks for human review. These are not automated approvals."
              icon={TrendingUp}
              dark={dark}
            >
              <div className="space-y-3">
                {report.planning_considerations.map(
                  (item, index) => (
                    <div
                      key={`${item.category}-${index}`}
                      className={`rounded-xl border p-4 ${colors.border}`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-bold">
                            {item.category}
                          </h3>

                          <p className={`mt-1 text-sm ${colors.muted}`}>
                            {item.finding}
                          </p>
                        </div>

                        <StatusBadge
                          status={item.status}
                          dark={dark}
                        />
                      </div>

                      <div
                        className={`mt-3 rounded-lg p-3 text-sm leading-6 ${dark
                          ? "bg-[#171A19] text-[#D8D0C4]"
                          : "bg-[#FFFAF1] text-[#665448]"
                          }`}
                      >
                        {item.consideration}
                      </div>
                    </div>
                  )
                )}
              </div>
            </SectionCard>
            {/* AI Civic Briefing */}
            <SectionCard
              title="AI Civic Intelligence Briefing"
              subtitle="Gemini-generated interpretation of verified ward intelligence."
              icon={Activity}
              dark={dark}
            >
              {aiError && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                  {aiError}
                </div>
              )}

              {aiLoading && (
                <div className="py-8 text-center">
                  <RefreshCw
                    size={26}
                    className="mx-auto mb-3 animate-spin text-[#F0440A]"
                  />
                  <p className="font-semibold">
                    Gemini is analysing the ward...
                  </p>
                  <p className={`mt-2 text-xs ${colors.muted}`}>
                    Interpreting geographic and environmental evidence.
                  </p>
                </div>
              )}

              {!aiLoading && !aiAnalysis && !aiError && (
                <div className="py-8 text-center">
                  <Activity
                    size={28}
                    className="mx-auto mb-3 text-[#F0440A]"
                  />
                  <p className="font-semibold">
                    No AI briefing generated yet.
                  </p>
                  <p className={`mt-2 text-sm ${colors.muted}`}>
                    Select Generate AI Briefing to create a civic interpretation.
                  </p>
                </div>
              )}

              {aiAnalysis && (
                <div className="space-y-5">
                  <div className={`rounded-xl p-4 ${dark ? "bg-[#171A19]" : "bg-[#FFFAF1]"
                    }`}>
                    <h3 className="mb-2 font-bold">
                      Executive Summary
                    </h3>
                    <p className="text-sm leading-7">
                      {aiAnalysis.executive_summary}
                    </p>
                  </div>

                  {[
                    {
                      title: "Geographic Findings",
                      items: aiAnalysis.geographic_findings,
                    },
                    {
                      title: "Environmental Findings",
                      items: aiAnalysis.environmental_findings,
                    },
                    {
                      title: "Planning Recommendations",
                      items: aiAnalysis.planning_recommendations,
                    },
                    {
                      title: "Data Limitations",
                      items: aiAnalysis.data_limitations,
                    },
                  ].map((section) => (
                    <div key={section.title}>
                      <h3 className="mb-3 font-bold">
                        {section.title}
                      </h3>

                      <ul className="space-y-2">
                        {section.items.map((item, index) => (
                          <li
                            key={index}
                            className={`rounded-lg p-3 text-sm leading-6 ${dark ? "bg-[#171A19]" : "bg-[#FFFAF1]"
                              }`}
                          >
                            <span className="mr-2 text-[#F0440A]">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="rounded-xl border border-[#F0440A]/30 p-4">
                    <h3 className="mb-2 font-bold">
                      Conclusion
                    </h3>
                    <p className="text-sm leading-7">
                      {aiAnalysis.conclusion}
                    </p>
                  </div>

                  <p className={`text-xs ${colors.muted}`}>
                    Generated by Gemini · {new Date(aiGeneratedAt).toLocaleString("en-IN")}
                  </p>

                  <p className="text-xs text-amber-500">
                    AI-generated interpretation. Verify findings with original
                    sources and authorized civic authorities. This is not an
                    approval or safety certification.
                  </p>
                </div>
              )}
            </SectionCard>
            {/* Data quality */}
            <SectionCard
              title="Data quality and limitations"
              subtitle="Warnings that should accompany interpretation of this report."
              icon={AlertTriangle}
              dark={dark}
            >
              <div className="space-y-3">
                {warnings.map((warning, index) => (
                  <div
                    key={`${warning}-${index}`}
                    className={`flex items-start gap-3 rounded-xl p-3 ${dark
                      ? "bg-[#171A19]"
                      : "bg-[#FFFAF1]"
                      }`}
                  >
                    <AlertTriangle
                      size={16}
                      className="mt-0.5 shrink-0 text-amber-500"
                    />

                    <p className="text-sm leading-6">
                      {warning}
                    </p>
                  </div>
                ))}
              </div>

              <div className={`mt-5 border-t pt-4 ${colors.border}`}>
                <h3 className="mb-2 text-sm font-bold">
                  Decision authority
                </h3>

                <p className={`text-sm leading-6 ${colors.muted}`}>
                  {report.decision_guidance.interpretation}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge
                    status="mandatory_human_verification"
                    dark={dark}
                  />

                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-bold text-red-500">
                    No automated approval
                  </span>

                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-bold text-red-500">
                    No safety certification
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Sources and methodology */}
            <SectionCard
              title="Sources and methodology"
              subtitle="Report provenance and calculation information."
              icon={FileText}
              dark={dark}
            >
              <div className="space-y-3 text-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className={colors.muted}>
                    Ward boundary source
                  </span>

                  <span className="sm:max-w-[65%] sm:text-right">
                    {report.ward.data_source ?? "Not specified"}
                  </span>
                </div>

                <div className={`border-t ${colors.border}`} />

                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className={colors.muted}>
                    Environmental source
                  </span>

                  <a
                    href="https://airquality.xkdr.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#F0440A] hover:underline"
                  >
                    XKDR India Air Quality Database
                  </a>
                </div>

                <div className={`border-t ${colors.border}`} />

                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className={colors.muted}>
                    Report method
                  </span>

                  <span className="sm:max-w-[65%] sm:text-right">
                    {report.metadata.method}
                  </span>
                </div>

                <div className={`border-t ${colors.border}`} />

                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className={colors.muted}>
                    Generated at
                  </span>

                  <span>{generatedAt}</span>
                </div>

                <div className={`border-t ${colors.border}`} />

                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className={colors.muted}>
                    Environmental scope
                  </span>

                  <span>
                    {report.environmental_assessment.geographic_scope}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Footer */}
            <div
              className={`flex flex-col gap-2 rounded-xl border p-4 text-xs sm:flex-row sm:items-center sm:justify-between ${colors.border} ${colors.surface} ${colors.muted}`}
            >
              <span className="inline-flex items-center gap-2">
                <Clock size={14} />
                Last generated: {generatedAt}
              </span>

              <span>
                UtsavZero · Civic Intelligence · Demonstration prototype
              </span>
            </div>
          </>
        )}
      </div>
    </CivicLayout>
  );
}
