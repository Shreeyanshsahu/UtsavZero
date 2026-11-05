
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import booleanValid from "@turf/boolean-valid";
import booleanIntersects from "@turf/boolean-intersects";
import { feature as turfFeature } from "@turf/helpers";
const ENV_FILE = path.join(process.cwd(), ".env.local");

try {
    process.loadEnvFile(ENV_FILE);
    console.log("Environment variables loaded from .env.local");
} catch (error) {
    if (error.code !== "ENOENT") {
        throw error;
    }

    console.warn(".env.local not found.");
}
const DATA_DIR = path.join(process.cwd(), "data/geodata");
const OSM_DIR = path.join(DATA_DIR, "osm");

const WARDS_FILE = path.join(DATA_DIR, "delhi_wards.geojson");

const wardArgIndex = process.argv.indexOf("--ward");

if (wardArgIndex === -1 || !process.argv[wardArgIndex + 1]) {
    throw new Error(
        "Usage: node scripts/import-osm-features-bulk.mjs --ward <ward-id> [--apply]"
    );
}

const WARD_ID = process.argv[wardArgIndex + 1];

if (!/^[A-Za-z0-9_-]+$/.test(WARD_ID)) {
    throw new Error(`Invalid ward identifier: ${WARD_ID}`);
}

const SOURCE_FEATURE_ID = WARD_ID.startsWith("unidentified-")
    ? WARD_ID
    : `ward-${WARD_ID}`;

const BULK_INPUT_FILE = path.join(
    OSM_DIR,
    "bulk",
    "classified",
    `ward-${WARD_ID}-classified-preview.geojson`
);

const LEGACY_INPUT_FILE = path.join(
    OSM_DIR,
    `ward-${WARD_ID}-classified-preview.geojson`
);

const APPLY = process.argv.includes("--apply");
const EXCLUDED_OSM_IDS_BY_WARD = {
    "111": new Set(["node/4180327825"]),
};

const EXCLUDED_OSM_IDS =
    EXCLUDED_OSM_IDS_BY_WARD[WARD_ID] ?? new Set();
const ALLOWED_TYPES = new Set([
    "hospital",
    "school",
    "residential_area",
    "road",
]);

function deterministicUuid(value) {
    const hash = crypto
        .createHash("sha1")
        .update(`utsavzero:geographic-feature:${value}`)
        .digest();

    const bytes = Buffer.from(hash.subarray(0, 16));

    // UUID version 5 and RFC 4122 variant bits.
    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = bytes.toString("hex");

    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20),
    ].join("-");
}

function isValidGeometry(geometry) {
    if (!geometry || !Array.isArray(geometry.coordinates)) {
        return false;
    }

    const allowedGeometryTypes = new Set([
        "Point",
        "LineString",
        "Polygon",
        "MultiPoint",
        "MultiLineString",
        "MultiPolygon",
    ]);

    if (!allowedGeometryTypes.has(geometry.type)) {
        return false;
    }

    function checkCoordinates(value) {
        if (
            Array.isArray(value) &&
            value.length >= 2 &&
            typeof value[0] === "number" &&
            typeof value[1] === "number"
        ) {
            return (
                Number.isFinite(value[0]) &&
                Number.isFinite(value[1]) &&
                value[0] >= -180 &&
                value[0] <= 180 &&
                value[1] >= -90 &&
                value[1] <= 90
            );
        }

        return (
            Array.isArray(value) &&
            value.length > 0 &&
            value.every(checkCoordinates)
        );
    }

    return checkCoordinates(geometry.coordinates);
}

function getOsmId(properties) {
    const id = properties?.id;

    if (typeof id !== "string") return null;

    const match = id.match(/^(node|way|relation)\/(\d+)$/);

    return match ? id : null;
}

function getOsmUrl(osmId) {
    return `https://www.openstreetmap.org/${osmId}`;
}
async function loadTargetWard() {
    const geojson = JSON.parse(
        await fs.readFile(WARDS_FILE, "utf8")
    );

    if (!Array.isArray(geojson.features)) {
        throw new Error("Delhi wards file is not a valid FeatureCollection.");
    }

    const matchingWards = geojson.features.filter((feature, index) => {
        // Special handling for the unidentified source feature.
        if (WARD_ID.startsWith("unidentified-")) {
            const sourceFeatureNumber = Number(
                WARD_ID.split("-")[1]
            );

            return (
                index === sourceFeatureNumber - 1 &&
                feature.properties?.Ward_No == null &&
                feature.properties?.Ward_Name == null
            );
        }

        // Normal numbered wards.
        return (
            String(feature.properties?.Ward_No ?? "").trim() === WARD_ID
        );
    });

    if (matchingWards.length !== 1) {
        throw new Error(
            `Expected exactly one matching ward for ${WARD_ID}, found ${matchingWards.length}.`
        );
    }

    const ward = matchingWards[0];

    if (
        !ward.geometry ||
        !["Polygon", "MultiPolygon"].includes(ward.geometry.type)
    ) {
        throw new Error("Target ward has an unsupported boundary geometry.");
    }

    const wardFeature = turfFeature(ward.geometry);

   if (!booleanValid(wardFeature)) {
    throw new Error(
        `Boundary geometry for ${WARD_ID} is invalid.`
    );
}

    return {
        feature: wardFeature,
        name: ward.properties?.Ward_Name ?? "Unknown",
        wardNo: WARD_ID.startsWith("unidentified-")
            ? null
            : WARD_ID,
    };
} async function loadTargetLocality(supabase) {
    const { data, error } = await supabase
        .from("localities")
        .select("id, name, source_feature_id")
        .eq("locality_type", "ward")
        .eq("source_feature_id", SOURCE_FEATURE_ID)
        .single();

    if (error) {
        throw new Error(
            `Could not resolve locality ${SOURCE_FEATURE_ID}: ${error.message}`
        );
    }

    if (!data) {
        throw new Error(
            `No locality found for ${SOURCE_FEATURE_ID}.`
        );
    }

    console.log("Resolved locality:", data.name);
    console.log("Locality ID:", data.id);

    return data;
}
function validateFeatureAgainstWard(feature, wardFeature) {
    const geometry = feature.geometry;

    if (!geometry || !booleanValid(turfFeature(geometry))) {
        return {
            valid: false,
            reason: "invalid_geometry",
        };
    }

    let intersectsWard = false;

    try {
        intersectsWard = booleanIntersects(
            turfFeature(geometry),
            wardFeature
        );
    } catch {
        return {
            valid: false,
            reason: "intersection_check_failed",
        };
    }

    if (!intersectsWard) {
        return {
            valid: false,
            reason: "outside_ward",
        };
    }

    return {
        valid: true,
        reason: null,
    };
}
function isGeometryCompatible(featureType, geometryType) {
    const allowed = {
        hospital: ["Point", "Polygon", "MultiPolygon"],
        school: ["Point", "Polygon", "MultiPolygon"],
        residential_area: ["Polygon", "MultiPolygon"],
        road: ["LineString", "MultiLineString"],
    };

    return allowed[featureType]?.includes(geometryType) ?? false;
}
async function main() {
    console.log("\n======================================");
    console.log(" UTSAVZERO OSM GEOGRAPHIC IMPORT");
    console.log("======================================\n");

    console.log(
    APPLY
        ? "Mode: APPLY — DATABASE WRITES ENABLED"
        : "Mode: DRY RUN — READ ONLY"
);

    let INPUT_FILE;

    try {
        await fs.access(BULK_INPUT_FILE);
        INPUT_FILE = BULK_INPUT_FILE;
    } catch {
        INPUT_FILE = LEGACY_INPUT_FILE;
    }

    console.log("Reading classified file:", INPUT_FILE);

    const geojson = JSON.parse(
        await fs.readFile(INPUT_FILE, "utf8")
    );
    const targetWard = await loadTargetWard();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY."
        );
    }

    const supabase = createClient(
        supabaseUrl,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );

    const targetLocality = await loadTargetLocality(supabase);

    console.log(
        targetWard.wardNo
            ? `Target ward: ${targetWard.name} (Ward ${targetWard.wardNo})`
            : `Target ward: ${targetWard.name} (Unidentified source feature)`
    );
    if (!Array.isArray(geojson.features)) {
        throw new Error("Input is not a valid GeoJSON FeatureCollection.");
    }

    const seenOsmIds = new Set();
    const records = [];
    const skipped = {
        excluded: 0,
        invalid_id: 0,
        invalid_geometry: 0,
        outside_ward: 0,
        intersection_check_failed: 0,
        unsupported_type: 0,
        duplicate_in_file: 0,
    };

    const spatialSummary = {
        intersecting: 0,
        roads_intersecting: 0,
    };

    for (const feature of geojson.features) {
        const properties = feature.properties ?? {};
        const osmId = getOsmId(properties);
        const featureType = properties.utsavzero_feature_type;

        if (!ALLOWED_TYPES.has(featureType)) {
            skipped.unsupported_type++;
            continue;
        }

        if (!osmId) {
            skipped.invalid_id++;
            continue;
        }

        if (EXCLUDED_OSM_IDS.has(osmId)) {
            skipped.excluded++;
            continue;
        }

        if (seenOsmIds.has(osmId)) {
            skipped.duplicate_in_file++;
            continue;
        }


        // 1. Validate basic GeoJSON structure and coordinates
        if (!isValidGeometry(feature.geometry)) {
            skipped.invalid_geometry++;
            continue;
        }

        // 2. Validate geometry type against feature category
        if (!isGeometryCompatible(featureType, feature.geometry.type)) {
            skipped.invalid_geometry++;
            continue;
        }

        // 3. Validate intersection with the dynamically selected ward
        const spatialCheck = validateFeatureAgainstWard(
            feature,
            targetWard.feature
        );

        if (!spatialCheck.valid) {
            skipped[spatialCheck.reason]++;
            continue;
        }

        seenOsmIds.add(osmId);

        spatialSummary.intersecting++;

        if (featureType === "road") {
            spatialSummary.roads_intersecting++;
        }
        records.push({
            id: deterministicUuid(`${targetLocality.id}:${osmId}`),
            locality_id: targetLocality.id,
            name:
                typeof properties.name === "string" &&
                    properties.name.trim()
                    ? properties.name.trim()
                    : `Unnamed ${featureType} (${osmId})`,
            feature_type: featureType,
            geometry_geojson: feature.geometry,
            source_name: "OpenStreetMap",
            source_url: getOsmUrl(osmId),
            source_date: new Date().toISOString().slice(0, 10),
            confidence: null,
        });
    }

    console.log("\n========== VALIDATION SUMMARY ==========");

    console.table({
        input_features: geojson.features.length,
        valid_records: records.length,
        ...skipped,
    });
    console.log("\n========== SPATIAL VALIDATION ==========");
    console.table(spatialSummary);
    const counts = {};

    for (const record of records) {
        counts[record.feature_type] =
            (counts[record.feature_type] ?? 0) + 1;
    }

    console.log("\n========== IMPORT BY CATEGORY ==========");
    console.table(counts);

    console.log("\n========== SAMPLE RECORDS ==========");

    console.dir(records.slice(0, 5), { depth: 4 });



    console.log("\nChecking existing database records...");

    const ids = records.map((record) => record.id);
    const existingIds = new Set();

    for (let i = 0; i < ids.length; i += 50) {
        const batch = ids.slice(i, i + 50);

        const { data, error } = await supabase
            .from("geographic_features")
            .select("id")
            .in("id", batch);

        if (error) throw error;

        for (const row of data ?? []) {
            existingIds.add(row.id);
        }
    }

    const newRecords = records.filter(
        (record) => !existingIds.has(record.id)
    );

    console.log("Already present:", existingIds.size);
    console.log("New records:", newRecords.length);

    // SAFETY: Never write to Supabase without explicit --apply.
    if (!APPLY) {
        console.log("\n========== DRY RUN COMPLETE ==========");
        console.log("No database records were inserted or modified.");
        console.log("Run with --apply only after reviewing the results.");
        return;
    }

    if (newRecords.length === 0) {
        console.log("Nothing new to insert.");
        return;
    }

    console.log("\n========== APPLY MODE ==========");
    console.log("Inserting records...");

    for (let i = 0; i < newRecords.length; i += 100) {
        const batch = newRecords.slice(i, i + 100);

        const { error } = await supabase
            .from("geographic_features")
            .insert(batch);

        if (error) {
            throw new Error(
                `Insert failed at batch ${Math.floor(i / 100) + 1}: ${error.message}`
            );
        }

        console.log(
            `Inserted ${Math.min(i + batch.length, newRecords.length)} / ${newRecords.length}`
        );
    }

    console.log("\nIMPORT COMPLETE.");
}

main().catch((error) => {
    console.error("\nIMPORT FAILED:", error);
    process.exitCode = 1;
});
