
import fs from "node:fs/promises";
import path from "node:path";
import osmtogeojson from "osmtogeojson";

const ROOT = process.cwd();

const OSM_DIR = path.join(ROOT, "data/geodata/osm");
const BULK_DIR = path.join(OSM_DIR, "bulk");

const wardId = process.argv[2];

if (!wardId || !/^[A-Za-z0-9_-]+$/.test(wardId)) {
  console.error(
    "Usage: node scripts/convert-osm-ward.mjs <ward-id>"
  );
  process.exit(1);
}

const BULK_INPUT = path.join(
  BULK_DIR,
  "raw",
  `ward-${wardId}-osm-raw.json`
);

const LEGACY_INPUT = path.join(
  OSM_DIR,
  `ward-${wardId}-osm-raw.json`
);

const BULK_OUTPUT = path.join(
  BULK_DIR,
  "converted",
  `ward-${wardId}-osm.geojson`
);

const LEGACY_OUTPUT = path.join(
  OSM_DIR,
  `ward-${wardId}-osm.geojson`
);

async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log(`Converting OSM data for ward ${wardId}...`);

  // Prefer bulk data; fall back to the legacy Ward 111 directory.
  const useBulk = await fileExists(BULK_INPUT);

  const INPUT = useBulk ? BULK_INPUT : LEGACY_INPUT;
  const OUTPUT = useBulk ? BULK_OUTPUT : LEGACY_OUTPUT;

  if (!(await fileExists(INPUT))) {
    throw new Error(`Raw OSM input file not found: ${INPUT}`);
  }

  console.log("Input:", INPUT);

  const raw = JSON.parse(await fs.readFile(INPUT, "utf8"));

  if (!Array.isArray(raw.elements)) {
    throw new Error("Invalid OSM response: elements array missing.");
  }

  console.log("Raw OSM elements:", raw.elements.length);

  const geojson = osmtogeojson(raw);

  const tagCounts = {};

  for (const feature of geojson.features) {
    const tags = feature.properties ?? {};

    for (const key of [
      "amenity",
      "healthcare",
      "landuse",
      "highway",
      "building",
      "name",
      "leisure",
    ]) {
      const value = tags[key];

      if (value) {
        const label = `${key}=${value}`;
        tagCounts[label] = (tagCounts[label] || 0) + 1;
      }
    }
  }

  console.log("\nOSM tag distribution:");

  for (const [tag, count] of Object.entries(tagCounts).sort(
    (a, b) => b[1] - a[1]
  )) {
    console.log(`${tag}: ${count}`);
  }

  const geometryCounts = {};

  for (const feature of geojson.features) {
    const type = feature.geometry?.type ?? "Unknown";
    geometryCounts[type] = (geometryCounts[type] || 0) + 1;
  }

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });

  await fs.writeFile(
    OUTPUT,
    JSON.stringify(geojson, null, 2),
    "utf8"
  );

  console.log("\nConversion successful!");
  console.log("Ward:", wardId);
  console.log("Total features:", geojson.features.length);
  console.log("Geometry counts:", geometryCounts);
  console.log("Output:", OUTPUT);
}

main().catch((error) => {
  console.error("Conversion failed:", error.message);
  process.exitCode = 1;
});
