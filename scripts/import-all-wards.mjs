
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const WARDS_FILE = path.join(
    ROOT,
    "data/geodata/delhi_wards.geojson"
);

const BULK_DIR = path.join(
    ROOT,
    "data/geodata/osm/bulk"
);

const REPORT_DIR = path.join(BULK_DIR, "reports");

const APPLY = process.argv.includes("--apply");
const REFRESH = process.argv.includes("--refresh");
const RETRY_FAILED = process.argv.includes("--retry-failed");

const BATCH_SIZE = 100;

const batchIndex = process.argv.indexOf("--batch");
const batchNumber =
    batchIndex !== -1
        ? Number(process.argv[batchIndex + 1])
        : null;

const SCRIPTS = [
    "scripts/import-osm-ward.mjs",
    "scripts/convert-osm-ward.mjs",
    "scripts/preview-osm-classification.mjs",
    "scripts/import-osm-features-bulk.mjs",
];

const MODE = APPLY ? "apply" : "dry-run";

const PROGRESS_FILE = path.join(
    REPORT_DIR,
    `bulk-progress-${MODE}.json`
);

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadProgress() {
    if (!fs.existsSync(PROGRESS_FILE)) {
        return {
            mode: MODE,
            wards: {},
        };
    }

    const progress = JSON.parse(
        fs.readFileSync(PROGRESS_FILE, "utf8")
    );

    if (progress.mode !== MODE) {
        throw new Error("Progress file mode mismatch.");
    }

    return progress;
}

function saveProgress(progress) {
    const temporaryFile = `${PROGRESS_FILE}.tmp`;

    fs.writeFileSync(
        temporaryFile,
        JSON.stringify(progress, null, 2)
    );

    fs.renameSync(temporaryFile, PROGRESS_FILE);
}

function loadWardIds() {
    const geojson = JSON.parse(
        fs.readFileSync(WARDS_FILE, "utf8")
    );

    if (!Array.isArray(geojson.features)) {
        throw new Error("Invalid Delhi wards GeoJSON.");
    }

    return geojson.features.map((feature, index) => {
        const rawId = feature.properties?.Ward_No;

        const wardId =
            rawId === null ||
            rawId === undefined ||
            String(rawId).trim() === ""
                ? `unidentified-${index + 1}`
                : String(rawId).trim();

        if (!/^[A-Za-z0-9_-]+$/.test(wardId)) {
            throw new Error(
                `Unsupported ward identifier at feature ${index + 1}: ${wardId}`
            );
        }

        return wardId;
    });
}

function runScript(script, args) {
    return new Promise((resolve) => {
        console.log(
            `\n▶ Running: node ${script} ${args.join(" ")}`
        );

        const child = spawn(
            process.execPath,
            [script, ...args],
            {
                cwd: ROOT,
                stdio: "inherit",
            }
        );

        child.on("error", (error) => {
            resolve({
                success: false,
                error: error.message,
            });
        });

        child.on("close", (code, signal) => {
            resolve({
                success: code === 0,
                exitCode: code,
                signal: signal ?? null,
            });
        });
    });
}

async function processWard(wardId) {
    const stages = [];

    for (let i = 0; i < SCRIPTS.length; i++) {
        const script = SCRIPTS[i];

        let args;

        // Fetcher and importer use --ward.
        // Converter and classifier use positional IDs.
        if (i === 0 || i === 3) {
            args = ["--ward", wardId];
        } else {
            args = [wardId];
        }

        if (i === 0 && REFRESH) {
            args.push("--refresh");
        }

        // Never enable database writes accidentally.
        if (i === 3 && APPLY) {
            args.push("--apply");
        }

        const result = await runScript(script, args);

        stages.push({
            script,
            ...result,
        });

        if (!result.success) {
            return {
                success: false,
                failedAt: script,
                stages,
            };
        }
    }

    return {
        success: true,
        stages,
    };
}

async function main() {
    if (!fs.existsSync(WARDS_FILE)) {
        throw new Error(`Ward file not found: ${WARDS_FILE}`);
    }

    if (batchIndex !== -1) {
        if (
            !Number.isInteger(batchNumber) ||
            batchNumber < 1
        ) {
            throw new Error(
                "Usage: --batch <positive batch number>"
            );
        }
    }

    if (RETRY_FAILED && batchNumber !== null) {
        throw new Error(
            "Use either --retry-failed or --batch, not both."
        );
    }

    if (REFRESH && !APPLY) {
        console.log(
            "NOTE: OSM cache refresh is enabled for this dry run."
        );
    }

    fs.mkdirSync(REPORT_DIR, { recursive: true });

    const wardIds = loadWardIds();
    const progress = loadProgress();

    let selectedWards;

    if (RETRY_FAILED) {
        selectedWards = wardIds.filter((id) => {
            const entry = progress.wards[id];

            return entry && entry.success === false;
        });
    } else if (batchNumber !== null) {
        const start = (batchNumber - 1) * BATCH_SIZE;

        selectedWards = wardIds.slice(
            start,
            start + BATCH_SIZE
        );

        if (selectedWards.length === 0) {
            throw new Error(
                `Batch ${batchNumber} does not exist.`
            );
        }
    } else {
        throw new Error(
            "Specify --batch <number> or --retry-failed."
        );
    }

    console.log("\n====================================");
    console.log("UTSAVZERO — RESUMABLE OSM IMPORT");
    console.log("====================================");
    console.log(`Total source wards: ${wardIds.length}`);
    console.log(`Selected wards: ${selectedWards.length}`);
    console.log(`Batch size: ${BATCH_SIZE}`);
    console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN"}`);
    console.log(`Refresh cache: ${REFRESH}`);
    console.log(`Progress file: ${PROGRESS_FILE}`);
    console.log("====================================");

    const batchResults = [];

    for (let i = 0; i < selectedWards.length; i++) {
        const wardId = selectedWards[i];

        const previous = progress.wards[wardId];

        if (previous?.success === true) {
            console.log(
                `\n⏭ Skipping ${wardId}: already completed in ${MODE} mode.`
            );

            continue;
        }

        console.log(
            `\n\n========== WARD ${wardId} (${i + 1}/${selectedWards.length}) ==========`
        );

        const startedAt = new Date().toISOString();

        const result = await processWard(wardId);

        const wardResult = {
            wardId,
            success: result.success,
            failedAt: result.failedAt ?? null,
            startedAt,
            completedAt: new Date().toISOString(),
            stages: result.stages,
        };

        progress.wards[wardId] = wardResult;

        // Save immediately after every ward.
        saveProgress(progress);

        batchResults.push(wardResult);

        console.log(
            result.success
                ? `✅ ${wardId} completed`
                : `❌ ${wardId} failed at ${result.failedAt}`
        );

        if (i < selectedWards.length - 1) {
            await sleep(3000);
        }
    }

    const allSuccessful = Object.values(progress.wards)
        .filter((entry) => entry.success).length;

    const allFailed = Object.values(progress.wards)
        .filter((entry) => entry.success === false).length;

    const report = {
        generatedAt: new Date().toISOString(),
        mode: MODE,
        batch: RETRY_FAILED ? "retry-failed" : batchNumber,
        batchSize: BATCH_SIZE,
        selected: selectedWards.length,
        successfulThisRun: batchResults.filter(
            (entry) => entry.success
        ).length,
        failedThisRun: batchResults.filter(
            (entry) => !entry.success
        ).length,
        totalSuccessfulInProgress: allSuccessful,
        totalFailedInProgress: allFailed,
        results: batchResults,
    };

    const reportPath = path.join(
        REPORT_DIR,
        `batch-${RETRY_FAILED ? "retry" : batchNumber}-${MODE}-${Date.now()}.json`
    );

    fs.writeFileSync(
        reportPath,
        JSON.stringify(report, null, 2)
    );

    console.log("\n====================================");
    console.log("BATCH SUMMARY");
    console.log("====================================");
    console.log(`Successful this run: ${report.successfulThisRun}`);
    console.log(`Failed this run: ${report.failedThisRun}`);
    console.log(`Total successful: ${allSuccessful}`);
    console.log(`Total failed: ${allFailed}`);
    console.log(`Report: ${reportPath}`);
    console.log(`Progress: ${PROGRESS_FILE}`);
}

main().catch((error) => {
    console.error("\nBULK IMPORT STOPPED:", error);
    process.exitCode = 1;
});
