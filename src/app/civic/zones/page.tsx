
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
      <div className="flex h-[600px] items-center justify-center rounded-2xl bg-[#FFF8EB] text-[#806B5D]">
        <LoaderCircle className="mr-2 animate-spin" size={18} />
        Loading zone drawing map...
      </div>
    ),
  }
);

// Database locality structure.
interface Locality {
  id: string;
  name: string;
  city: string;
  state: string;
  source_feature_id: string | null;
  locality_type: string;
}

// Combined locality and boundary loading result.
type PlanningResult = {
  id: string;
  status: "success" | "error";
  locality?: Locality;
  boundary?: WardBoundaryFeature;
  message?: string;
};

// Geometry draft is associated with a particular ward.
interface GeometryDraft {
  localityId: string;
  geometry: GeoJsonObject | null;
}

function ZonePlanningContent() {
  const searchParams = useSearchParams();
  const localityId = searchParams.get("localityId");

  const [result, setResult] =
    useState<PlanningResult | null>(null);

  const [geometryDraft, setGeometryDraft] =
    useState<GeometryDraft | null>(null);

  // Only use geometry belonging to the currently selected ward.
  const proposedGeometry =
    localityId &&
    geometryDraft?.localityId === localityId
      ? geometryDraft.geometry
      : null;

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
        <div className="rounded-2xl border border-[#EADCC9] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#FFF0D8] p-3">
              <MapPinned
                className="text-[#F0440A]"
                size={22}
              />
            </div>

            <div>
              <h2 className="font-bold text-[#38231C]">
                Planning Locality
              </h2>

              <p className="text-sm text-[#806B5D]">
                Selected ward for zone planning
              </p>
            </div>
          </div>

          {loading ? (
            <div className="mt-5 flex items-center gap-2 text-sm text-[#806B5D]">
              <LoaderCircle
                className="animate-spin"
                size={17}
              />
              Loading locality...
            </div>
          ) : error ? (
            <div className="mt-5 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={17} />
              {error}
            </div>
          ) : locality ? (
            <div className="mt-5 rounded-xl border border-[#EADCC9] bg-[#FFF8EB] p-4">
              <h3 className="text-lg font-bold text-[#38231C]">
                {locality.name}
              </h3>

              <p className="mt-1 text-sm text-[#806B5D]">
                {locality.city}, {locality.state}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#FFF0D8] px-3 py-1 text-xs font-semibold text-[#E65B16]">
                  Ward locality
                </span>

                <span className="rounded-full bg-[#F1EDE6] px-3 py-1 text-xs text-[#806B5D]">
                  Source:{" "}
                  {locality.source_feature_id ??
                    "Unavailable"}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-[#D8C7B5] p-6 text-center">
              <MapPin
                size={28}
                className="mx-auto text-[#F0440A]"
              />

              <h3 className="mt-3 font-bold text-[#38231C]">
                No locality selected
              </h3>

              <p className="mt-1 text-sm text-[#806B5D]">
                Visit Locality Explorer and select a ward
                to begin planning.
              </p>
            </div>
          )}
        </div>

        {/* Zone Drawing Workspace */}
        <div className="rounded-2xl border border-[#EADCC9] bg-white p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#38231C]">
                Zone Drawing Workspace
              </h2>

              <p className="mt-1 text-sm text-[#806B5D]">
                Draw and edit a proposed zone inside the
                selected ward.
              </p>
            </div>

            <span className="rounded-full bg-[#FFF0D8] px-3 py-1 text-xs font-semibold text-[#E65B16]">
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
                  <p className="text-sm text-[#806B5D]">
                    {proposedGeometry
                      ? "Proposed boundary captured successfully."
                      : "Use the polygon tool on the map to draw a boundary."}
                  </p>

                  <span className="rounded-full bg-[#F1EDE6] px-3 py-1 text-xs font-medium text-[#806B5D]">
                    {proposedGeometry
                      ? "Draft available"
                      : "No draft yet"}
                  </span>
                </div>

                {/* Area measurements */}
                {proposedArea !== null &&
                  areaInHectares !== null && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-[#EADCC9] bg-[#FFF8EB] p-4">
                        <p className="text-sm text-[#806B5D]">
                          Proposed Zone Area
                        </p>

                        <p className="mt-2 text-2xl font-bold text-[#38231C]">
                          {proposedArea.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                        </p>

                        <p className="text-xs text-[#806B5D]">
                          Square metres (m²)
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#EADCC9] bg-[#FFF8EB] p-4">
                        <p className="text-sm text-[#806B5D]">
                          Area in Hectares
                        </p>

                        <p className="mt-2 text-2xl font-bold text-[#38231C]">
                          {areaInHectares.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 4,
                            }
                          )}
                        </p>

                        <p className="text-xs text-[#806B5D]">
                          Hectares (ha)
                        </p>
                      </div>
                    </div>
                  )}

                {/* Ward containment validation */}
                <div className="rounded-xl border border-[#EADCC9] bg-[#FFF8EB] p-4">
                  <div className="flex items-center gap-2">
                    <MapPinned
                      size={19}
                      className="text-[#F0440A]"
                    />

                    <h3 className="font-bold text-[#38231C]">
                      Ward Boundary Validation
                    </h3>
                  </div>

                  <p className="mt-1 text-sm text-[#806B5D]">
                    Checking whether your proposed zone
                    fits inside the selected ward.
                  </p>

                  {loading ? (
                    <p className="mt-3 flex items-center gap-2 text-sm text-[#806B5D]">
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                      Loading ward boundary...
                    </p>
                  ) : !wardBoundary ? (
                    <p className="mt-3 flex items-center gap-2 text-sm text-amber-700">
                      <AlertTriangle size={16} />
                      Ward boundary is unavailable.
                    </p>
                  ) : !proposedGeometry ? (
                    <p className="mt-3 text-sm text-[#806B5D]">
                      Draw a polygon to validate its boundary.
                    </p>
                  ) : isWithinWard === true ? (
                    <p className="mt-3 flex items-center gap-2 font-semibold text-green-700">
                      <CheckCircle2 size={18} />
                      Valid — Polygon is within the selected ward.
                    </p>
                  ) : (
                    <p className="mt-3 flex items-center gap-2 font-semibold text-red-600">
                      <XCircle size={18} />
                      Invalid — Polygon extends outside the
                      selected ward or geometry validation failed.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-[#D8C7B5] p-6 text-center">
              <MapPinned
                size={32}
                className="text-[#F0440A]"
              />

              <h3 className="mt-3 font-bold text-[#38231C]">
                Select a ward first
              </h3>

              <p className="mt-1 max-w-md text-sm text-[#806B5D]">
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
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] animate-pulse rounded-2xl bg-gray-100" />
      }
    >
      <ZonePlanningContent />
    </Suspense>
  );
}
