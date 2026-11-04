
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GeoJSON,
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { Layer, LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import type { WardBoundaryFeature } from "@/services/geodata/localityBoundaryService";
import { useTheme } from "@/context/ThemeContext";

import {
  fetchWardBoundaries,
  type WardBoundaryCollection,
  type WardBoundaryProperties,
} from "@/services/geodata/localityBoundaryService";

interface CivicWardMapProps {
  selectedWardId?: string | null;
  onWardSelect?: (ward: WardBoundaryProperties) => void;
}

function getWardStyle(
  feature: GeoJSON.Feature | undefined,
  selectedWardId: string | null,
  isDarkMode: boolean
): L.PathOptions {
  const properties = feature?.properties as
    | WardBoundaryProperties
    | undefined;

  const isSelected = properties?.localityId === selectedWardId;

  return {
    color: isSelected
      ? "#F0440A"
      : isDarkMode
        ? "#F4C9A8"
        : "#A66A4A",

    weight: isSelected ? 3 : 1,
    opacity: isSelected ? 1 : 0.65,

    fillColor: isSelected ? "#F0440A" : "#E8A477",
    fillOpacity: isSelected ? 0.2 : 0.025,
  };
}
function WardBoundsController({
  wardBoundaries,
}: {
  wardBoundaries: WardBoundaryCollection;
}) {
  const map = useMap();

  useEffect(() => {
    const geoJsonLayer = L.geoJSON(
      wardBoundaries as unknown as GeoJSON.FeatureCollection
    );

    const bounds = geoJsonLayer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [25, 25],
        maxZoom: 12,
        animate: true,
        duration: 1,
      });
    }
  }, [wardBoundaries, map]);

  return null;
}
function SelectedWardController({
  wardBoundaries,
  selectedWardId,
}: {
  wardBoundaries: WardBoundaryCollection | null;
  selectedWardId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!wardBoundaries || !selectedWardId) return;

    const selectedFeature = wardBoundaries.features.find(
      (feature) => feature.properties.localityId === selectedWardId
    );

    if (!selectedFeature) return;

    const bounds = L.geoJSON(
      selectedFeature as unknown as GeoJSON.Feature
    ).getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 14,
        animate: true,
        duration: 0.8,
      });
    }
  }, [wardBoundaries, selectedWardId, map]);

  return null;
}
export default function CivicWardMap({
  selectedWardId: controlledWardId,
  onWardSelect,
}: CivicWardMapProps) {
  const { isDarkMode } = useTheme();

  const [wardBoundaries, setWardBoundaries] =
    useState<WardBoundaryCollection | null>(null);
  const [wardSearch, setWardSearch] = useState("");
  const [internalSelectedWardId, setInternalSelectedWardId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [wardError, setWardError] = useState<string | null>(null);

  const selectedWardId =
    controlledWardId !== undefined
      ? controlledWardId
      : internalSelectedWardId;

  // Load ward boundaries from Supabase.
  useEffect(() => {
    let active = true;

    async function loadWardBoundaries() {
      try {
        setLoading(true);

        const data = await fetchWardBoundaries();

        if (active) {
          setWardBoundaries(data);
          setWardError(null);
        }
      } catch (error) {
        console.error("Failed to load ward boundaries:", error);

        if (active) {
          setWardError("Ward boundaries could not be loaded.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadWardBoundaries();

    return () => {
      active = false;
    };
  }, []);

  // Handle ward selection.
  const handleWardClick = useCallback(
    (event: LeafletMouseEvent) => {
      const layer = event.target as L.Layer & {
        feature?: GeoJSON.Feature;
      };

      const properties = layer.feature?.properties as
        | WardBoundaryProperties
        | undefined;

      if (!properties?.localityId) return;

      setInternalSelectedWardId(properties.localityId);
      onWardSelect?.(properties);
    },
    [onWardSelect]
  );

  // Add ward information popup and click handler.
  const onEachWard = useCallback(
    (feature: GeoJSON.Feature, layer: Layer) => {
      const properties = feature.properties as
        | WardBoundaryProperties
        | undefined;

      if (!properties) return;

      const popupContent = document.createElement("div");
      popupContent.className = "min-w-[150px]";

      const title = document.createElement("strong");

      title.textContent = String(
        properties.Ward_Name || properties.localityName
      );

      popupContent.appendChild(title);

      if (properties.Ward_No) {
        const number = document.createElement("p");

        number.textContent = `Ward ${String(properties.Ward_No)}`;
        number.className = "mt-1 text-xs";

        popupContent.appendChild(number);
      }

      layer.bindPopup(popupContent);
      layer.on("click", handleWardClick);
    },
    [handleWardClick]
  );

  // Update polygon styling when selection or theme changes.
  const wardStyle = useCallback(
    (feature: GeoJSON.Feature | undefined) =>
      getWardStyle(feature, selectedWardId, isDarkMode),
    [selectedWardId, isDarkMode]
  );

  const wardData = useMemo(
    () =>
      wardBoundaries as unknown as GeoJSON.FeatureCollection | null,
    [wardBoundaries]
  );
  const filteredWards = useMemo(() => {
    const query = wardSearch.trim().toLowerCase();

    if (!query || !wardBoundaries) return [];

    return wardBoundaries.features
      .filter((feature) => {
        const properties = feature.properties;

        const searchableValues = [
          properties.Ward_No,
          properties.Ward_Name,
          properties.localityName,
        ];

        return searchableValues.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );
      })
      .slice(0, 8);
  }, [wardSearch, wardBoundaries]);
  function handleSearchWardSelect(feature: WardBoundaryFeature) {
    const properties = feature.properties;

    setInternalSelectedWardId(properties.localityId);
    setWardSearch(properties.localityName);

    onWardSelect?.(properties);
  }
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">

      <MapContainer
        center={[28.6139, 77.209]}
        zoom={10}
        scrollWheelZoom
        className={`h-full w-full ${isDarkMode ? "utsav-dark-map" : ""
          }`}
      >
        <SelectedWardController
          wardBoundaries={wardBoundaries}
          selectedWardId={selectedWardId}
        />
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          maxZoom={19}
        />
        {wardBoundaries && (
          <WardBoundsController
            wardBoundaries={wardBoundaries}
          />
        )}
        {wardData && (
          <GeoJSON
            data={wardData}
            style={wardStyle}
            onEachFeature={onEachWard}
          />
        )}

      </MapContainer>
      {/* Ward Search */}
      <div className="absolute left-3 top-3 z-20 w-[min(320px,calc(100%-24px))]">
        <div className="overflow-hidden rounded-xl border border-[#EADCC9] bg-white shadow-lg">
          <input
            type="text"
            value={wardSearch}
            onChange={(event) => setWardSearch(event.target.value)}
            placeholder="Search ward number or locality..."
            className="w-full px-4 py-3 text-sm text-[#38231C] outline-none placeholder:text-[#A39486]"
          />

          {wardSearch.trim().length > 0 && (
            <div className="max-h-64 overflow-y-auto border-t border-[#EADCC9]">
              {filteredWards.length > 0 ? (
                filteredWards.map((feature) => {
                  const properties = feature.properties;

                  return (
                    <button
                      key={properties.localityId}
                      type="button"
                      onClick={() => handleSearchWardSelect(feature)}
                      className="flex w-full flex-col border-b border-[#F1E6D8] px-4 py-3 text-left transition hover:bg-[#FFF4E3]"
                    >
                      <span className="text-sm font-semibold text-[#38231C]">
                        {String(
                          properties.Ward_Name ??
                          properties.localityName ??
                          "Unnamed ward"
                        )}
                      </span>

                      <span className="mt-1 text-xs text-[#806B5D]">
                        {properties.Ward_No
                          ? `Ward ${properties.Ward_No}`
                          : "Ward number unavailable"}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="px-4 py-3 text-xs text-[#806B5D]">
                  No matching wards found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Loading state */}
      {loading && (
        <div className="absolute left-3 top-3 z-20 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-gray-700 shadow">
          Loading Delhi ward boundaries...
        </div>
      )}

      {/* Error state */}
      {wardError && (
        <div className="absolute left-3 top-3 z-20 rounded-lg bg-white px-3 py-2 text-xs text-red-600 shadow">
          {wardError}
        </div>
      )}

      {/* Selected ward indicator */}
      {selectedWardId && wardBoundaries && (
        <div className="absolute bottom-4 left-4 z-20 max-w-[260px] rounded-xl border border-[#EADCC9] bg-white/95 p-3 shadow-lg">
          <p className="text-xs font-semibold text-[#806B5D]">
            SELECTED LOCALITY
          </p>

          <p className="mt-1 text-sm font-bold text-[#38231C]">
            {wardBoundaries.features.find(
              (feature) =>
                feature.properties.localityId === selectedWardId
            )?.properties.localityName ?? "Selected ward"}
          </p>

          <button
            type="button"
            onClick={() => {
              setInternalSelectedWardId(null);
              onWardSelect?.({
                localityId: "",
                localityName: "",
                sourceFeatureId: null,
              });
            }}
            className="mt-2 text-xs font-semibold text-[#F0440A] hover:underline"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Ward count */}
      {wardBoundaries && (
        <div className="absolute right-3 top-3 z-20 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-[#38231C] shadow">
          {wardBoundaries.features.length} wards
        </div>
      )}
    </div>
  );
}
