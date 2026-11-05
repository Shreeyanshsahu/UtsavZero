
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const OSM_DIR = path.join(ROOT, "data/geodata/osm");
const BULK_DIR = path.join(OSM_DIR, "bulk");

const wardId = process.argv[2];

if (!wardId || !/^[A-Za-z0-9_-]+$/.test(wardId)) {
    console.error(
    "Usage: node scripts/preview-osm-classification.mjs <ward-id>"
  );
  process.exit(1);
}

const BULK_INPUT = path.join(
  BULK_DIR,
  "converted",
  `ward-${wardId}-osm.geojson`
);

const LEGACY_INPUT = path.join(
  OSM_DIR,
  `ward-${wardId}-osm.geojson`
);

const BULK_OUTPUT = path.join(
  BULK_DIR,
  "classified",
  `ward-${wardId}-classified-preview.geojson`
);

const LEGACY_OUTPUT = path.join(
  OSM_DIR,
  `ward-${wardId}-classified-preview.geojson`
);

async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function classifyFeature(properties) {
  const matches = [];

  if (
    properties.amenity === "hospital" ||
    properties.healthcare === "hospital"
  ) {
    matches.push("hospital");
  }

  if (
    ["school", "college", "university"].includes(properties.amenity)
  ) {
    matches.push("school");
  }

  if (properties.landuse === "residential") {
    matches.push("residential_area");
  }

  if (properties.highway) {
    matches.push("road");
  }

  return matches;
}

async function main() {
  console.log(`Classifying OSM features for ward ${wardId}...`);

  const useBulk = await fileExists(BULK_INPUT);

  const INPUT = useBulk ? BULK_INPUT : LEGACY_INPUT;
  const OUTPUT = useBulk ? BULK_OUTPUT : LEGACY_OUTPUT;

  if (!(await fileExists(INPUT))) {
    throw new Error(`Converted GeoJSON file not found: ${INPUT}`);
  }

  console.log("Input:", INPUT);

  const geojson = JSON.parse(await fs.readFile(INPUT, "utf8"));

  if (!Array.isArray(geojson.features)) {
    throw new Error("Invalid GeoJSON: features array missing.");
  }

  const classified = [];
  const counts = {};
  const multipleMatches = [];
  let unclassified = 0;

  for (const feature of geojson.features) {
    const properties = feature.properties ?? {};
    const matches = classifyFeature(properties);

    if (matches.length === 0) {
      unclassified++;
      continue;
    }

    if (matches.length > 1) {
      multipleMatches.push({
        name: properties.name ?? "Unnamed",
        matches,
      });
      continue;
    }

    const featureType = matches[0];

    counts[featureType] = (counts[featureType] || 0) + 1;

    classified.push({
      ...feature,
      properties: {
        ...properties,
        utsavzero_feature_type: featureType,
      },
    });
  }

  const output = {
    type: "FeatureCollection",
    features: classified,
  };

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });

  await fs.writeFile(
    OUTPUT,
    JSON.stringify(output, null, 2),
    "utf8"
  );

  console.log("\nClassification summary:");

  for (const category of [
    "hospital",
    "school",
    "residential_area",
    "road",
  ]) {
    console.log(`${category}: ${counts[category] ?? 0}`);
  }

  console.log("Unclassified features:", unclassified);
  console.log("Multiple-category features:", multipleMatches.length);
  console.log("Classified features:", classified.length);
  console.log("Saved preview:", OUTPUT);

  if (multipleMatches.length > 0) {
    console.log("\nFeatures requiring manual review:");
    console.table(multipleMatches);
  }
}

main().catch((error) => {
  console.error("Classification failed:", error.message);
  process.exitCode = 1;
});
