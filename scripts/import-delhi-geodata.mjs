
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data/geodata");

const BOUNDARY_FILE = path.join(DATA_DIR, "delhi_boundary.geojson");
const WARDS_FILE = path.join(DATA_DIR, "delhi_wards.geojson");

const SOURCE_NAME = "India Geodata - Delhi Municipal Boundaries";

const SOURCE_URLS = {
  boundary:
    "https://raw.githubusercontent.com/yashveeeeeeer/india-geodata/main/data/urban/municipal-boundaries/delhi/Delhi_Boundary.geojson",

  wards:
    "https://raw.githubusercontent.com/yashveeeeeeer/india-geodata/main/data/urban/municipal-boundaries/delhi/Delhi_Wards.geojson",
};

// Stable UUID v5 generation.
const NAMESPACE = Buffer.from(
    "6ba7b8109dad11d180b400c04fd430c8",
    "hex"
);

function stableUUID(value) {
    const hash = crypto
        .createHash("sha1")
        .update(Buffer.concat([NAMESPACE, Buffer.from(value)]))
        .digest();

    hash[6] = (hash[6] & 0x0f) | 0x50;
    hash[8] = (hash[8] & 0x3f) | 0x80;

    const hex = hash.subarray(0, 16).toString("hex");

    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20),
    ].join("-");
}

function readGeoJSON(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function validateFeatureCollection(data, label) {
    if (data.type !== "FeatureCollection") {
        throw new Error(`${label} is not a FeatureCollection.`);
    }

    if (!Array.isArray(data.features)) {
        throw new Error(`${label} has no features array.`);
    }

    for (const [index, feature] of data.features.entries()) {
        if (feature.type !== "Feature") {
            throw new Error(`${label}: feature ${index} is invalid.`);
        }

        if (
            !feature.geometry ||
            !["Polygon", "MultiPolygon"].includes(feature.geometry.type)
        ) {
            throw new Error(
                `${label}: feature ${index} has an unsupported geometry.`
            );
        }

        if (!Array.isArray(feature.geometry.coordinates)) {
            throw new Error(
                `${label}: feature ${index} has invalid coordinates.`
            );
        }
    }

    return data.features;
}

function buildRecords() {
    const boundaryData = readGeoJSON(BOUNDARY_FILE);
    const wardsData = readGeoJSON(WARDS_FILE);

    const boundaryFeatures = validateFeatureCollection(
        boundaryData,
        "Delhi boundary"
    );

    const wardFeatures = validateFeatureCollection(
        wardsData,
        "Delhi wards"
    );

    if (boundaryFeatures.length !== 1) {
        throw new Error(
            `Expected 1 Delhi boundary, found ${boundaryFeatures.length}.`
        );
    }

    if (wardFeatures.length !== 290) {
        throw new Error(
            `Expected 290 ward features, found ${wardFeatures.length}.`
        );
    }

    const boundary = boundaryFeatures[0];

    const records = [
        {
            id: stableUUID("utsavzero:locality:delhi-boundary"),
            name: "Delhi",
            city: "Delhi",
            state: "Delhi",
            boundary_geojson: boundary,
            data_source: `${SOURCE_NAME} | ${SOURCE_URLS.boundary}`,
            source_date: null,
            source_feature_id: "delhi-boundary",
            locality_type: "city",
        },
    ];

    const seenWardNumbers = new Set();

    wardFeatures.forEach((feature, index) => {
        const properties = feature.properties ?? {};

        const wardNumber = properties.Ward_No;
        const wardName = properties.Ward_Name;

        const hasWardNumber =
            wardNumber !== null &&
            wardNumber !== undefined &&
            String(wardNumber).trim() !== "";

        const sourceFeatureId = hasWardNumber
            ? `ward-${String(wardNumber).trim()}`
            : `unidentified-${index + 1}`;

        if (hasWardNumber) {
            if (seenWardNumbers.has(String(wardNumber))) {
                throw new Error(`Duplicate ward number: ${wardNumber}`);
            }

            seenWardNumbers.add(String(wardNumber));
        }

        const name =
            hasWardNumber && wardName
                ? `Ward ${wardNumber} - ${wardName}`
                : `Unidentified ward (source feature ${index + 1})`;

        records.push({
            id: stableUUID(`utsavzero:locality:${sourceFeatureId}`),
            name,
            city: "Delhi",
            state: "Delhi",
            boundary_geojson: feature,
            data_source: `${SOURCE_NAME} | ${SOURCE_URLS.wards}`,
            source_date: null,
            source_feature_id: sourceFeatureId,
            locality_type: "ward",
        });
    });

    return {
        records,
        unidentifiedCount: wardFeatures.filter((feature) => {
            const props = feature.properties ?? {};

            return (
                props.Ward_No == null ||
                String(props.Ward_No).trim() === ""
            );
        }).length,
    };
}

async function main() {
    const { records, unidentifiedCount } = buildRecords();

    console.log("\n========== UTSAVZERO GEO DATA ==========");
    console.log("Delhi boundary records:", 1);
    console.log("Ward records:", records.length - 1);
    console.log("Total locality records:", records.length);
    console.log("Unidentified ward features:", unidentifiedCount);

    console.log("\nSample records:");

    for (const record of [
        records[0],
        records[1],
        records[records.length - 1],
    ]) {
        console.log({
            id: record.id,
            name: record.name,
            locality_type: record.locality_type,
            source_feature_id: record.source_feature_id,
            geometry_type: record.boundary_geojson.geometry.type,
        });
    }

    if (!process.argv.includes("--apply")) {
        console.log("\nDRY RUN COMPLETE.");
        console.log("No database records were inserted or updated.");
        console.log("Use --apply only after reviewing this output.");
        return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY."
        );
    }

    const supabase = createClient(supabaseUrl, secretKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    // Refuse to import if the target table is not empty.
    // This avoids silently mixing this dataset with unrelated records.
    // Allow safe retries, but refuse to overwrite unrelated localities.
    const expectedIds = new Set(records.map((record) => record.id));

    const { data: existingRows, error: existingError } = await supabase
        .from("localities")
        .select("id");

    if (existingError) {
        throw new Error(
            `Unable to inspect existing localities: ${existingError.message}`
        );
    }

    const unrelatedRecords = (existingRows ?? []).filter(
        (row) => !expectedIds.has(row.id)
    );

    if (unrelatedRecords.length > 0) {
        throw new Error(
            `Import stopped: found ${unrelatedRecords.length} unrelated locality records.`
        );
    }

    const BATCH_SIZE = 50;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);

        const { error } = await supabase
            .from("localities")
            .upsert(batch, { onConflict: "id" });

        if (error) {
            throw new Error(
                `Import failed at batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`
            );
        }

        console.log(
            `Inserted ${Math.min(i + BATCH_SIZE, records.length)} / ${records.length}`
        );
    }

    const { count: finalCount, error: verifyError } = await supabase
        .from("localities")
        .select("id", { count: "exact", head: true });

    if (verifyError) {
        throw new Error(`Verification failed: ${verifyError.message}`);
    }

    console.log("\nIMPORT COMPLETE");
    console.log("Verified locality records:", finalCount);
}

main().catch((error) => {
    console.error("\nIMPORT ERROR:", error.message);
    process.exitCode = 1;
});
