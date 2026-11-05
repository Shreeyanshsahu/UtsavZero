import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.join(
    process.cwd(),
    "data/geodata/osm/ward-111-classified-preview.geojson"
);

async function main() {
    const geojson = JSON.parse(
        await fs.readFile(FILE, "utf8")
    );
    console.log("\n========== PROPERTY STRUCTURE ==========");

    for (const feature of geojson.features.slice(0, 5)) {
        console.log({
            geometry: feature.geometry?.type,
            propertyKeys: Object.keys(feature.properties ?? {}),
            properties: feature.properties,
        });
    }
    for (const category of [
        "hospital",
        "school",
        "residential_area",
        "road",
    ]) {
        const features = geojson.features.filter(
            (feature) =>
                feature.properties.utsavzero_feature_type === category
        );

        console.log(`\n========== ${category.toUpperCase()} ==========`);

        console.table(
            features.map((feature) => {
                const p = feature.properties;

                return {
                    name: p.name ?? "Unnamed",
                    osm_id: p.id?.split("/")[1] ?? "Missing",
                    osm_type: p.id?.split("/")[0] ?? "Unknown",
                    geometry: feature.geometry?.type,
                    amenity: p.amenity ?? "",
                    healthcare: p.healthcare ?? "",
                    landuse: p.landuse ?? "",
                    highway: p.highway ?? "",
                };
            })
        );
    }
}

main().catch(console.error);