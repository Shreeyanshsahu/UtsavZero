
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

function ZonePlanningContent() {
  const { isDarkMode } = useTheme();

  const searchParams = useSearchParams();
  const localityId = searchParams.get("localityId");

  const [result, setResult] =
    useState<PlanningResult | null>(null);

  const [geometryDraft, setGeometryDraft] =
    useState<GeometryDraft | null>(null);

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
              className={`rounded-xl p-3 ${
                isDarkMode
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
                      className={`mt-3 flex items-center gap-2 font-semibold ${
                        isDarkMode
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
          className={`min-h-[400px] animate-pulse rounded-2xl ${
            isDarkMode ? "bg-[#202522]" : "bg-gray-100"
          }`}
        />
      }
    >
      <ZonePlanningContent />
    </Suspense>
  );
}
