
"use client";

import { useEffect, useState } from "react";
import {
    GeoJSON,
    MapContainer,
    TileLayer,
    useMap,
} from "react-leaflet";
import L from "leaflet";

import {
    fetchWardBoundaries,
    type WardBoundaryFeature,
} from "@/services/geodata/localityBoundaryService";

import "@geoman-io/leaflet-geoman-free";

interface ZoneDrawingMapProps {
    localityId: string;
    onGeometryChange?: (geometry: GeoJSON.GeoJsonObject | null) => void;
}



function DrawingControls({
    onGeometryChange,
}: {
    onGeometryChange?: ZoneDrawingMapProps["onGeometryChange"];
}) {
    const map = useMap();

    useEffect(() => {
        const geomanMap = map;

        const drawnLayers = L.featureGroup().addTo(map);

        geomanMap.pm.setGlobalOptions({
            layerGroup: drawnLayers,
            snappable: false,
            allowSelfIntersection: false,
            pathOptions: {
                color: "#ff4b0b",
                fillColor: "#ff4b0b",
                fillOpacity: 0.2,
                weight: 3,
            },
        });

        geomanMap.pm.addControls({
            position: "topleft",
            drawMarker: false,
            drawCircle: false,
            drawCircleMarker: false,
            drawPolyline: false,
            drawRectangle: false,
            drawPolygon: true,
            drawText: false,
            editMode: true,
            dragMode: true,
            removalMode: true,
            cutPolygon: false,
            rotateMode: false,
        });

        const handleCreate = (event: {
            layer: L.Layer;
        }) => {
            const createdLayer = event.layer;

            if (!(createdLayer instanceof L.Polygon)) return;

            drawnLayers.eachLayer((existingLayer) => {
                if (existingLayer !== createdLayer) {
                    drawnLayers.removeLayer(existingLayer);
                }
            });

            const geoJson = (createdLayer as L.Polygon).toGeoJSON();

            onGeometryChange?.(geoJson);
        };

        const handleEdit = () => {
            const layers = drawnLayers.getLayers();

            if (layers.length === 0) {
                onGeometryChange?.(null);
                return;
            }

            const polygon = layers[0] as L.Polygon;

            onGeometryChange?.(polygon.toGeoJSON());
        };

        const handleRemove = () => {
            onGeometryChange?.(null);
        };

        map.on("pm:create", handleCreate);
        map.on("pm:edit", handleEdit);
        map.on("pm:remove", handleRemove);

        return () => {
            map.off("pm:create", handleCreate);
            map.off("pm:edit", handleEdit);
            map.off("pm:remove", handleRemove);

            geomanMap.pm.removeControls();
            drawnLayers.remove();
        };
    }, [map, onGeometryChange]);

    return null;
}

function WardBoundaryController({
    boundary,
}: {
    boundary: WardBoundaryFeature;
}) {
    const map = useMap();

    useEffect(() => {
        const boundaryLayer = L.geoJSON(boundary as GeoJSON.GeoJsonObject, {
            style: {
                color: "#8b7566",
                weight: 2,
                fillColor: "#d9c4ae",
                fillOpacity: 0.12,
                dashArray: "6 5",
            },
            pmIgnore: true,
        } as L.GeoJSONOptions & { pmIgnore: boolean }).addTo(map);

        const bounds = boundaryLayer.getBounds();

        if (bounds.isValid()) {
            map.fitBounds(bounds, {
                padding: [35, 35],
                maxZoom: 14,
            });
        }

        return () => {
            boundaryLayer.remove();
        };
    }, [boundary, map]);

    return null;
}

export default function ZoneDrawingMap({
    localityId,
    onGeometryChange,
}: ZoneDrawingMapProps) {
    const [boundary, setBoundary] =
        useState<WardBoundaryFeature | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function loadBoundary() {
            try {
                setLoading(true);
                setError(null);
                setBoundary(null);

                const collection = await fetchWardBoundaries();

                const selectedBoundary = collection.features.find(
                    (feature) =>
                        feature.properties.localityId === localityId
                );

                if (!selectedBoundary) {
                    throw new Error("The selected ward boundary was not found.");
                }

                if (active) {
                    setBoundary(selectedBoundary);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load ward boundary."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadBoundary();

        return () => {
            active = false;
        };
    }, [localityId]);

    if (loading) {
        return (
            <div className="flex h-[600px] items-center justify-center rounded-2xl bg-[#fff8ed]">
                Loading ward boundary...
            </div>
        );
    }

    if (error || !boundary) {
        return (
            <div className="flex h-[600px] items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                {error ?? "Ward boundary unavailable."}
            </div>
        );
    }

    return (
        <div className="relative h-[600px] overflow-hidden rounded-2xl border border-[#ead8c5]">
            <MapContainer
                center={[28.6139, 77.209]}
                zoom={11}
                className="h-full w-full"
                scrollWheelZoom
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <GeoJSON
                    key={localityId}
                    data={boundary as GeoJSON.GeoJsonObject}
                    style={{
                        color: "#8b7566",
                        weight: 2,
                        fillColor: "#d9c4ae",
                        fillOpacity: 0.12,
                    }}
                />

                <WardBoundaryController boundary={boundary} />

                <DrawingControls
                    onGeometryChange={onGeometryChange}
                />
            </MapContainer>
        </div>
    );
}
