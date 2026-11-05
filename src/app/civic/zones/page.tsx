"use client";
import {
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  MapPinned,
  MapPin,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { area } from "@turf/area";
import { booleanWithin } from "@turf/boolean-within";
import type {
  Feature,
  GeoJsonObject,
  Polygon,
  MultiPolygon,
} from "geojson";
import CivicLayout from "@/components/civic/layout/CivicLayout";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/context/ThemeContext";
import {
  fetchWardBoundaries,
  type WardBoundaryFeature,
} from "@/services/geodata/localityBoundaryService";
// Load Leaflet map only on the client.
const ZoneDrawingMap = dynamic(
  () => import("@/components/civic/map/ZoneDrawingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] items-center justify-center rounded-2xl border border-[#343C37] bg-[#202522] text-[#AAA69E]">
        <LoaderCircle className="mr-2 animate-spin" size={18} />
        Loading zone drawing map...
      </div>
    ),
  }
);
interface Locality {
  id: string;
  name: string;
  city: string;
  state: string;
  source_feature_id: string | null;
  locality_type: string;
}
type PlanningResult = {
  id: string;
  status: "success" | "error";
  locality?: Locality;
  boundary?: WardBoundaryFeature;
  message?: string;
};
interface GeometryDraft {
  localityId: string;
  geometry: GeoJsonObject | null;
}

interface AssessmentResult {
  valid: boolean;
  locality_id: string;
  geometry_type: string;
  area_sq_m: number;
  search_radii_m: {
    hospital: number;
    school: number;
    residential_area: number;
    road: number;
  };
  nearby_feature_counts: Record<string, number>;
  displayed_feature_limit: number;
  nearby_features: {
    id: string;
    name: string;
    type: string;
    locality_name: string | null;
    intersects_zone: boolean;
    distance_m: number;
    distance_label: string;
  }[];
  warnings: string[];
}
function ZonePlanningContent() {
  const { isDarkMode } = useTheme();
  const searchParams = useSearchParams();
  const localityId = searchParams.get("localityId");
  const [result, setResult] =
    useState<PlanningResult | null>(null);
  const [geometryDraft, setGeometryDraft] =
    useState<GeometryDraft | null>(null);

  const [assessment, setAssessment] =
    useState<AssessmentResult | null>(null);

  const [assessmentLoading, setAssessmentLoading] =
    useState(false);

  const [assessmentError, setAssessmentError] =
    useState<string | null>(null);
  const proposedGeometry =
    localityId &&
      geometryDraft?.localityId === localityId
      ? geometryDraft.geometry
      : null;
  // Theme classes
  const cardClass = isDarkMode
    ? "border-[#343C37] bg-[#202522]"
    : "border-[#EADCC9] bg-white";
  const innerCardClass = isDarkMode
    ? "border-[#343C37] bg-[#252B28]"
    : "border-[#EADCC9] bg-[#FFF8EB]";
  const primaryText = isDarkMode
    ? "text-[#F5EFE5]"
    : "text-[#38231C]";
  const secondaryText = isDarkMode
    ? "text-[#AAA69E]"
    : "text-[#806B5D]";
  const mutedBadge = isDarkMode
    ? "bg-[#303833] text-[#B9B5AC]"
    : "bg-[#F1EDE6] text-[#806B5D]";
  const accentBadge = isDarkMode
    ? "bg-[#432819] text-[#FF9A52]"
    : "bg-[#FFF0D8] text-[#E65B16]";
  const dashedBorder = isDarkMode
    ? "border-[#465149]"
    : "border-[#D8C7B5]";
  // Keep the drawing callback stable.
  const handleGeometryChange = useCallback(
    (geometry: GeoJsonObject | null) => {
      if (!localityId) return;
      setGeometryDraft({
        localityId,
        geometry,
      });
      setAssessment(null);
      setAssessmentError(null);
    },
    [localityId]
  );
  // Fetch locality and its ward boundary.
  useEffect(() => {
    if (!localityId) return;
    let active = true;
    const id = localityId;
    async function loadPlanningData() {
      try {
        const supabase = createClient();
        const [localityResponse, boundaryCollection] =
          await Promise.all([
            supabase
              .from("localities")
              .select(
                "id, name, city, state, source_feature_id, locality_type"
              )
              .eq("id", id)
              .eq("locality_type", "ward")
              .single(),
            fetchWardBoundaries(),
          ]);
        if (localityResponse.error) {
          throw localityResponse.error;
        }
        const selectedBoundary =
          boundaryCollection.features.find(
            (feature) =>
              feature.properties.localityId === id
          );
        if (!selectedBoundary) {
          throw new Error(
            "Selected ward boundary was not found."
          );
        }
        if (active) {
          setResult({
            id,
            status: "success",
            locality: localityResponse.data,
            boundary: selectedBoundary,
          });
        }
      } catch (err) {
        console.error(
          "Unable to load zone planning data:",
          err
        );
        if (active) {
          setResult({
            id,
            status: "error",
            message:
              err instanceof Error
                ? err.message
                : "Unable to load the selected ward.",
          });
        }
      }
    }
    loadPlanningData();
    return () => {
      active = false;
    };
  }, [localityId]);
  // Ignore results belonging to a previously selected ward.
  const currentResult =
    result?.id === localityId ? result : null;
  const loading =
    Boolean(localityId) && !currentResult;
  const locality =
    currentResult?.status === "success"
      ? currentResult.locality ?? null
      : null;
  const wardBoundary =
    currentResult?.status === "success"
      ? currentResult.boundary ?? null
      : null;
  const error =
    currentResult?.status === "error"
      ? currentResult.message
      : null;
  // Calculate approximate polygon area.
  const proposedArea = proposedGeometry
    ? area(
      proposedGeometry as Parameters<typeof area>[0]
    )
    : null;
  const areaInHectares =
    proposedArea !== null
      ? proposedArea / 10000
      : null;
  // Preliminary client-side ward containment check.
  const isWithinWard = (() => {
    if (!proposedGeometry || !wardBoundary) {
      return null;
    }
    try {
      return booleanWithin(
        proposedGeometry as Feature<Polygon>,
        wardBoundary as unknown as Feature<
          Polygon | MultiPolygon
        >
      );
    } catch (validationError) {
      console.error(
        "Geometry validation failed:",
        validationError
      );
      return false;
    }
  })();

  async function handleAssessZone() {
    if (!locality || !proposedGeometry || isWithinWard !== true) {
      return;
    }

    setAssessmentLoading(true);
    setAssessmentError(null);
    setAssessment(null);

    try {
      const supabase = createClient();

      // PostGIS ST_GeomFromGeoJSON expects a Geometry object,
      // not a GeoJSON Feature wrapper.
      const geometryCandidate = proposedGeometry as unknown as {
        type?: string;
        geometry?: GeoJsonObject | null;
      };

      const geometryForRpc =
        geometryCandidate.type === "Feature"
          ? geometryCandidate.geometry
          : proposedGeometry;

      if (!geometryForRpc) {
        throw new Error("Unable to extract polygon geometry.");
      }

      const { data, error } = await supabase.rpc(
        "assess_proposed_zone",
        {
          p_locality_id: locality.id,
          p_geometry_geojson: geometryForRpc as never,
        }
      );

      if (error) throw error;

      if (!data) {
        throw new Error("The assessment returned no data.");
      }

      setAssessment(data as unknown as AssessmentResult);
    } catch (err: unknown) {
      console.error("Zone assessment failed — full error:", err);

      if (err && typeof err === "object") {
        const dbError = err as {
          message?: string;
          code?: string;
          details?: string;
          hint?: string;
        };

        console.error("Assessment error details:", {
          message: dbError.message,
          code: dbError.code,
          details: dbError.details,
          hint: dbError.hint,
        });

        setAssessmentError(
          [
            dbError.message || "Unknown database error",
            dbError.code ? `Code: ${dbError.code}` : "",
            dbError.details ? `Details: ${dbError.details}` : "",
            dbError.hint ? `Hint: ${dbError.hint}` : "",
          ]
            .filter(Boolean)
            .join(" | ")
        );
      } else {
        setAssessmentError(
          err instanceof Error
            ? err.message
            : String(err)
        );
      }
    } finally {
      setAssessmentLoading(false);
    }

  }

  return (
    <CivicLayout
      title="Zone Planning"
      description="Explore selected localities and plan proposed community or policy-simulation zones."
    >
      <div className="space-y-6">
        {/* Selected locality */}
        <div
          className={`rounded-2xl border p-5 ${cardClass}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`rounded-xl p-3 ${isDarkMode
                  ? "bg-[#432819]"
                  : "bg-[#FFF0D8]"
                }`}
            >
              <MapPinned
                className="text-[#F0440A]"
                size={22}
              />
            </div>
            <div>
              <h2 className={`font-bold ${primaryText}`}>
                Planning Locality
              </h2>
              <p className={`text-sm ${secondaryText}`}>
                Selected ward for zone planning
              </p>
            </div>
          </div>
          {loading ? (
            <div
              className={`mt-5 flex items-center gap-2 text-sm ${secondaryText}`}
            >
              <LoaderCircle
                className="animate-spin"
                size={17}
              />
              Loading locality...
            </div>
          ) : error ? (
            <div className="mt-5 flex items-center gap-2 text-sm text-red-500">
              <AlertCircle size={17} />
              {error}
            </div>
          ) : locality ? (
            <div
              className={`mt-5 rounded-xl border p-4 ${innerCardClass}`}
            >
              <h3 className={`text-lg font-bold ${primaryText}`}>
                {locality.name}
              </h3>
              <p className={`mt-1 text-sm ${secondaryText}`}>
                {locality.city}, {locality.state}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${accentBadge}`}
                >
                  Ward locality
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${mutedBadge}`}
                >
                  Source:{" "}
                  {locality.source_feature_id ??
                    "Unavailable"}
                </span>
              </div>
            </div>
          ) : (
            <div
              className={`mt-5 rounded-xl border border-dashed p-6 text-center ${dashedBorder}`}
            >
              <MapPin
                size={28}
                className="mx-auto text-[#F0440A]"
              />
              <h3 className={`mt-3 font-bold ${primaryText}`}>
                No locality selected
              </h3>
              <p className={`mt-1 text-sm ${secondaryText}`}>
                Visit Locality Explorer and select a ward
                to begin planning.
              </p>
            </div>
          )}
        </div>
        {/* Zone Drawing Workspace */}
        <div
          className={`rounded-2xl border p-5 ${cardClass}`}
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2
                className={`text-lg font-bold ${primaryText}`}
              >
                Zone Drawing Workspace
              </h2>
              <p className={`mt-1 text-sm ${secondaryText}`}>
                Draw and edit a proposed zone inside the
                selected ward.
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${accentBadge}`}
            >
              Interactive mapping
            </span>
          </div>
          {locality ? (
            <>
              <ZoneDrawingMap
                key={locality.id}
                localityId={locality.id}
                onGeometryChange={handleGeometryChange}
              />
              {/* Drawing status */}
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className={`text-sm ${secondaryText}`}>
                    {proposedGeometry
                      ? "Proposed boundary captured successfully."
                      : "Use the polygon tool on the map to draw a boundary."}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${mutedBadge}`}
                  >
                    {proposedGeometry
                      ? "Draft available"
                      : "No draft yet"}
                  </span>
                </div>
                {/* Area measurements */}
                {proposedArea !== null &&
                  areaInHectares !== null && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div
                        className={`rounded-xl border p-4 ${innerCardClass}`}
                      >
                        <p className={`text-sm ${secondaryText}`}>
                          Proposed Zone Area
                        </p>
                        <p
                          className={`mt-2 text-2xl font-bold ${primaryText}`}
                        >
                          {proposedArea.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                        </p>
                        <p className={`text-xs ${secondaryText}`}>
                          Square metres (m²)
                        </p>
                      </div>
                      <div
                        className={`rounded-xl border p-4 ${innerCardClass}`}
                      >
                        <p className={`text-sm ${secondaryText}`}>
                          Area in Hectares
                        </p>
                        <p
                          className={`mt-2 text-2xl font-bold ${primaryText}`}
                        >
                          {areaInHectares.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 4,
                            }
                          )}
                        </p>
                        <p className={`text-xs ${secondaryText}`}>
                          Hectares (ha)
                        </p>
                      </div>
                    </div>
                  )}
                {/* Ward containment validation */}
                <div
                  className={`rounded-xl border p-4 ${innerCardClass}`}
                >
                  <div className="flex items-center gap-2">
                    <MapPinned
                      size={19}
                      className="text-[#F0440A]"
                    />
                    <h3 className={`font-bold ${primaryText}`}>
                      Ward Boundary Validation
                    </h3>
                  </div>
                  <p className={`mt-1 text-sm ${secondaryText}`}>
                    Checking whether your proposed zone
                    fits inside the selected ward.
                  </p>
                  {loading ? (
                    <p
                      className={`mt-3 flex items-center gap-2 text-sm ${secondaryText}`}
                    >
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                      Loading ward boundary...
                    </p>
                  ) : !wardBoundary ? (
                    <p className="mt-3 flex items-center gap-2 text-sm text-amber-500">
                      <AlertTriangle size={16} />
                      Ward boundary is unavailable.
                    </p>
                  ) : !proposedGeometry ? (
                    <p className={`mt-3 text-sm ${secondaryText}`}>
                      Draw a polygon to validate its boundary.
                    </p>
                  ) : isWithinWard === true ? (
                    <p
                      className={`mt-3 flex items-center gap-2 font-semibold ${isDarkMode
                          ? "text-green-400"
                          : "text-green-700"
                        }`}
                    >
                      <CheckCircle2 size={18} />
                      Valid — Polygon is within the selected ward.
                    </p>
                  ) : (
                    <p className="mt-3 flex items-center gap-2 font-semibold text-red-500">
                      <XCircle size={18} />
                      Invalid — Polygon extends outside the
                      selected ward or geometry validation failed.
                    </p>
                  )}
                </div>

                {/* Database Spatial Assessment */}
                <div className={`rounded-xl border p-4 ${innerCardClass}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className={`font-bold ${primaryText}`}>
                        Spatial Zone Assessment
                      </h3>
                      <p className={`mt-1 text-sm ${secondaryText}`}>
                        Search mapped infrastructure around the proposed zone,
                        including neighbouring wards.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAssessZone}
                      disabled={
                        !proposedGeometry ||
                        isWithinWard !== true ||
                        assessmentLoading
                      }
                      className="rounded-xl bg-[#F0440A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#D93C08] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {assessmentLoading ? (
                        <span className="flex items-center gap-2">
                          <LoaderCircle size={16} className="animate-spin" />
                          Assessing...
                        </span>
                      ) : (
                        "Assess Zone"
                      )}
                    </button>
                  </div>

                  {assessmentError && (
                    <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                      <div className="flex items-center gap-2 font-semibold">
                        <AlertCircle size={16} />
                        Assessment failed
                      </div>
                      <p className="mt-1 break-words">{assessmentError}</p>
                    </div>
                  )}

                  {assessment && (
                    <div className="mt-5 space-y-4">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className={`rounded-lg border p-3 ${cardClass}`}>
                          <p className={`text-xs ${secondaryText}`}>
                            Database-calculated area
                          </p>
                          <p className={`mt-1 text-xl font-bold ${primaryText}`}>
                            {assessment.area_sq_m.toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                            })} m²
                          </p>
                        </div>

                        <div className={`rounded-lg border p-3 ${cardClass}`}>
                          <p className={`text-xs ${secondaryText}`}>
                            Search radii by category
                          </p>
                          <div className="mt-2 space-y-1">
                            {Object.entries(assessment.search_radii_m).map(
                              ([type, radius]) => (
                                <p
                                  key={type}
                                  className={`text-sm capitalize ${primaryText}`}
                                >
                                  {type.replaceAll("_", " ")}: {radius.toLocaleString("en-IN")} m
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className={`mb-3 font-semibold ${primaryText}`}>
                          Nearby mapped infrastructure
                        </h4>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {[
                            "hospital",
                            "school",
                            "residential_area",
                            "road",
                          ].map((type) => (
                            <div
                              key={type}
                              className={`rounded-lg border p-3 ${cardClass}`}
                            >
                              <p className={`text-xs capitalize ${secondaryText}`}>
                                {type.replaceAll("_", " ")}
                              </p>
                              <p className={`mt-1 text-lg font-bold ${primaryText}`}>
                                {assessment.nearby_feature_counts[type] ?? 0}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <h4 className={`font-semibold ${primaryText}`}>
                            Nearby feature details
                          </h4>
                          <span className={`text-xs ${secondaryText}`}>
                            Showing {assessment.nearby_features.length} of {Object.values(
                              assessment.nearby_feature_counts
                            ).reduce((sum, count) => sum + count, 0)} features
                          </span>
                        </div>

                        {assessment.nearby_features.length === 0 ? (
                          <p className={`text-sm ${secondaryText}`}>
                            No mapped features found within the configured search radii.
                          </p>
                        ) : (
                          <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                            {assessment.nearby_features.map((feature) => (
                              <div
                                key={feature.id}
                                className={`rounded-lg border p-3 ${cardClass}`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className={`text-sm font-semibold ${primaryText}`}>
                                      {feature.name}
                                    </p>
                                    <p className={`mt-1 text-xs capitalize ${secondaryText}`}>
                                      {feature.type.replaceAll("_", " ")}
                                    </p>
                                    {feature.locality_name && (
                                      <p className={`mt-1 text-xs ${secondaryText}`}>
                                        Ward: {feature.locality_name}
                                      </p>
                                    )}
                                  </div>

                                  <span
                                    className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${feature.intersects_zone
                                        ? "bg-red-500/10 text-red-500"
                                        : "bg-green-500/10 text-green-600"
                                      }`}
                                  >
                                    {feature.distance_label}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {assessment.nearby_features.length >=
                          assessment.displayed_feature_limit && (
                            <p className={`mt-2 text-xs ${secondaryText}`}>
                              Display limit reached. Counts include all matching features.
                            </p>
                          )}
                      </div>

                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                        <p className="text-sm font-semibold text-amber-600">
                          Assessment limitations
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-amber-600">
                          {assessment.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div
              className={`flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center ${dashedBorder}`}
            >
              <MapPinned
                size={32}
                className="text-[#F0440A]"
              />
              <h3 className={`mt-3 font-bold ${primaryText}`}>
                Select a ward first
              </h3>
              <p
                className={`mt-1 max-w-md text-sm ${secondaryText}`}
              >
                Select a locality in Locality Explorer to
                open its boundary and start drawing a
                proposed zone.
              </p>
            </div>
          )}
        </div>
      </div>
    </CivicLayout>
  );
}
export default function ZonePlanningPage() {
  const { isDarkMode } = useTheme();
  return (
    <Suspense
      fallback={
        <div
          className={`min-h-[400px] animate-pulse rounded-2xl ${isDarkMode ? "bg-[#202522]" : "bg-gray-100"
            }`}
        />
      }
    >
      <ZonePlanningContent />
    </Suspense>
  );
}
