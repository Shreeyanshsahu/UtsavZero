
import { createClient } from "@/lib/supabase/client";

export interface WardBoundaryProperties {
  localityId: string;
  localityName: string;
  sourceFeatureId: string | null;
  [key: string]: unknown;
}

export interface WardBoundaryFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  properties: WardBoundaryProperties;
}

export interface WardBoundaryCollection {
  type: "FeatureCollection";
  features: WardBoundaryFeature[];
}

export async function fetchWardBoundaries(): Promise<WardBoundaryCollection> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("localities")
    .select("id, name, source_feature_id, boundary_geojson")
    .eq("locality_type", "ward")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Unable to load ward boundaries: ${error.message}`);
  }

  const features: WardBoundaryFeature[] = (data ?? []).map((locality) => {
    const storedFeature = locality.boundary_geojson as {
      type: "Feature";
      geometry: WardBoundaryFeature["geometry"];
      properties?: Record<string, unknown> | null;
    };

    if (
      storedFeature?.type !== "Feature" ||
      !storedFeature.geometry ||
      !["Polygon", "MultiPolygon"].includes(storedFeature.geometry.type)
    ) {
      throw new Error(
        `Invalid boundary GeoJSON for locality: ${locality.name}`
      );
    }

    return {
      type: "Feature",
      geometry: storedFeature.geometry,
      properties: {
        ...(storedFeature.properties ?? {}),
        localityId: locality.id,
        localityName: locality.name,
        sourceFeatureId: locality.source_feature_id,
      },
    };
  });

  return {
    type: "FeatureCollection",
    features,
  };
}
