
import { NextRequest, NextResponse } from "next/server";
interface GeoapifyPlace {
    place_id?: string;
    name?: string;
    address_line1?: string;
    address_line2?: string;
    formatted?: string;
    lat: number;
    lon: number;
    distance?: number;
    result_type?: string;
}

interface GeoapifyResponse {
    results?: GeoapifyPlace[];
}
export async function GET(request: NextRequest) {
    try {
        const apiKey = process.env.GEOAPIFY_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Geoapify API key is not configured." },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(request.url);

        const text = searchParams.get("text")?.trim();
        const latParam = searchParams.get("lat");
        const lonParam = searchParams.get("lon");

        if (!text || text.length < 2) {
            return NextResponse.json({ results: [] });
        }

        if (text.length > 200) {
            return NextResponse.json(
                { error: "Search query is too long." },
                { status: 400 }
            );
        }

        const lat = latParam === null ? null : Number(latParam);
        const lon = lonParam === null ? null : Number(lonParam);

        const hasValidLocation =
            lat !== null &&
            lon !== null &&
            Number.isFinite(lat) &&
            Number.isFinite(lon) &&
            lat >= -90 &&
            lat <= 90 &&
            lon >= -180 &&
            lon <= 180;

        const params = new URLSearchParams({
            text,
            apiKey,
            format: "json",
            limit: "6",
            lang: "en",
            filter: "countrycode:in",
        });

        if (hasValidLocation) {
            params.set("bias", `proximity:${lon},${lat}`);
        }

        const response = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`,
            { cache: "no-store" }
        );

        if (!response.ok) {
            console.error("Geoapify error:", response.status);

            return NextResponse.json(
                { error: "Location search is temporarily unavailable." },
                { status: 502 }
            );
        }
        const data: GeoapifyResponse = await response.json();

        const results = (data.results ?? [])
            .filter(
                (place: GeoapifyPlace) =>
                    Number.isFinite(place.lat) &&
                    Number.isFinite(place.lon)
            )
            .map((place: GeoapifyPlace) => ({
                id: place.place_id ?? `${place.lat},${place.lon}`,
                name: place.name || place.address_line1 || place.formatted || "Unknown location",
                address:
                    place.address_line2 ||
                    place.formatted ||
                    place.address_line1 ||
                    "",
                formatted: place.formatted || "",
                lat: place.lat,
                lon: place.lon,
                distance: place.distance ?? null,
                resultType: place.result_type ?? "unknown",
            }));

        return NextResponse.json({ results });

    } catch (error) {
        console.error("Location autocomplete error:", error);

        return NextResponse.json(
            { error: "Something went wrong while searching locations." },
            { status: 500 }
        );
    }
}
