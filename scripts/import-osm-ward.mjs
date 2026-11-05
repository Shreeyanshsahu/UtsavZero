
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const WARDS_FILE = path.join(
  ROOT,
  "data/geodata/delhi_wards.geojson"
);

const RAW_DIR = path.join(
  ROOT,
  "data/geodata/osm/bulk/raw"
);

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

const MAX_RETRIES = 4;
const COMPONENT_DELAY_MS = 10000;

const args = process.argv.slice(2);

function getArg(name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1] ?? null;
}

const WARD_ID = getArg("--ward");
const REFRESH = args.includes("--refresh");

if (!WARD_ID || !/^[A-Za-z0-9_-]+$/.test(WARD_ID)) {
  throw new Error(
    "Usage: node scripts/import-osm-ward.mjs --ward <ward-id> [--refresh]"
  );
}

const SOURCE_FEATURE_ID = WARD_ID.startsWith("unidentified-")
  ? WARD_ID
  : `ward-${WARD_ID}`;

const OUTPUT_FILE = path.join(
  RAW_DIR,
  `ward-${WARD_ID}-osm-raw.json`
);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadWard() {
  const file = await fs.readFile(WARDS_FILE, "utf8");
  const collection = JSON.parse(file);

  let matches;

  if (WARD_ID.startsWith("unidentified-")) {
    const sourceFeatureNumber = Number(
      WARD_ID.replace("unidentified-", "")
    );

    matches = collection.features.filter((feature, index) => {
      return (
        index + 1 === sourceFeatureNumber &&
        feature.properties?.Ward_No == null &&
        feature.properties?.Ward_Name == null
      );
    });
  } else {
    matches = collection.features.filter(
      (feature) =>
        String(feature.properties?.Ward_No ?? "").trim() === WARD_ID
    );
  }

  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one matching ward for ${WARD_ID}; found ${matches.length}.`
    );
  }

  const ward = matches[0];

  if (!ward.geometry) {
    throw new Error(`Ward ${WARD_ID} has no geometry.`);
  }

  let polygons;

  if (ward.geometry.type === "Polygon") {
    polygons = [ward.geometry.coordinates];
  } else if (ward.geometry.type === "MultiPolygon") {
    polygons = ward.geometry.coordinates;
  } else {
    throw new Error(
      `Unsupported geometry type: ${ward.geometry.type}`
    );
  }

  const components = polygons.map((polygon, index) => {
    const outerRing = polygon?.[0];

    if (!Array.isArray(outerRing) || outerRing.length < 4) {
      throw new Error(
        `Invalid polygon component ${index + 1} in ward ${WARD_ID}.`
      );
    }

    return outerRing
      .map(([longitude, latitude]) => {
        if (
          !Number.isFinite(longitude) ||
          !Number.isFinite(latitude)
        ) {
          throw new Error(
            `Invalid coordinate in component ${index + 1}.`
          );
        }

        return `${latitude} ${longitude}`;
      })
      .join(" ");
  });

  return {
    ward,
    components,
  };
}

function buildQuery(coordinates) {
  return `
[out:json][timeout:240];

(
  nwr["amenity"="hospital"](poly:"${coordinates}");
  nwr["healthcare"="hospital"](poly:"${coordinates}");

  nwr["amenity"~"^(school|college|university)$"](poly:"${coordinates}");

  nwr["landuse"="residential"](poly:"${coordinates}");

  way["highway"~"^(motorway|trunk|primary|secondary|tertiary|residential|unclassified|service)$"](poly:"${coordinates}");
);

out body;
>;
out skel qt;
`;
}

async function fetchComponent(coordinates, componentNumber) {
  const query = buildQuery(coordinates);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `Fetching component ${componentNumber} (attempt ${attempt}/${MAX_RETRIES})...`
      );

      const response = await fetch(OVERPASS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "UtsavZero/1.0 (Delhi civic planning prototype)",
        },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(270000),
      });

      if (!response.ok) {
        const retryable =
          response.status === 429 || response.status >= 500;

        if (!retryable || attempt === MAX_RETRIES) {
          throw new Error(
            `Overpass returned ${response.status} ${response.statusText}`
          );
        }

        const retryAfter = Number(
          response.headers.get("retry-after")
        );

        const delay = Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : 15000 * attempt;

        console.warn(`Request limited. Waiting ${delay / 1000}s...`);
        await sleep(delay);
        continue;
      }

      const data = await response.json();

      if (!Array.isArray(data.elements)) {
        throw new Error("Overpass response has no elements array.");
      }

      return data;
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        throw error;
      }

      const delay = 10000 * attempt;

      console.warn(
        `Component ${componentNumber} failed: ${error.message}`
      );
      console.warn(`Retrying in ${delay / 1000}s...`);

      await sleep(delay);
    }
  }

  throw new Error(`Unable to fetch component ${componentNumber}.`);
}

async function main() {
  await fs.mkdir(RAW_DIR, { recursive: true });

  if (!REFRESH) {
    try {
      await fs.access(OUTPUT_FILE);

      console.log("Cached raw OSM file already exists:");
      console.log(OUTPUT_FILE);
      console.log("Skipping network request. Use --refresh to fetch again.");
      return;
    } catch {
      // No cache exists; continue with fetching.
    }
  }

  console.log("\nReading Delhi ward boundaries...");

  const { ward, components } = await loadWard();

  console.log("Selected ward:", ward.properties?.Ward_Name ?? "Unidentified");
  console.log("Source feature ID:", SOURCE_FEATURE_ID);
  console.log("Geometry type:", ward.geometry.type);
  console.log("Polygon components:", components.length);

  const allElements = new Map();
  let firstResponse = null;

  for (let i = 0; i < components.length; i++) {
    const data = await fetchComponent(components[i], i + 1);

    if (!firstResponse) {
      firstResponse = data;
    }

    for (const element of data.elements) {
      const key = `${element.type}/${element.id}`;
      allElements.set(key, element);
    }

    console.log(
      `Component ${i + 1}: ${data.elements.length} elements returned.`
    );

    if (i < components.length - 1) {
      console.log(
        `Waiting ${COMPONENT_DELAY_MS / 1000}s before the next request...`
      );
      await sleep(COMPONENT_DELAY_MS);
    }
  }

  const elements = [...allElements.values()];

  const result = {
    ...firstResponse,
    elements,
    generator: "UtsavZero bulk OSM fetcher",
    fetched_at: new Date().toISOString(),
    source_feature_id: SOURCE_FEATURE_ID,
    polygon_components_queried: components.length,
  };

  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(result, null, 2),
    "utf8"
  );

  const counts = elements.reduce((summary, element) => {
    summary[element.type] = (summary[element.type] || 0) + 1;
    return summary;
  }, {});

  console.log("\n========== FETCH COMPLETED ==========");
  console.log("Ward:", WARD_ID);
  console.log("Unique OSM elements:", elements.length);
  console.log("Element counts:", counts);
  console.log("Saved to:", OUTPUT_FILE);
}

main().catch((error) => {
  console.error("\nOSM fetch failed:", error.message);
  process.exitCode = 1;
});
