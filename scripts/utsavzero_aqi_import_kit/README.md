# UtsavZero AQI Import Kit — corrected daily aggregation parser

## What changed

The first importer incorrectly expected the daily API response to contain a `value`
column. XKDR documents that aggregated responses return `mean`, `min`, `max`, and `n`;
the `value` column belongs to raw observations. This corrected script reads `mean`
first and uses the daily timestamp `period_start`.

It also removes the October-November 2025 default window because the published
CPCB CAAQM archive coverage documented by XKDR ends at 2025-09. The default
historical seasonal comparison therefore covers 2020–2024.

## Run

From the UtsavZero project root, after loading `.env.local` into the shell:

```bash
set -a
source .env.local
set +a

python3 scripts/utsavzero_aqi_import_kit/prepare_aqi_csv.py
```

The script creates `aqi_observations.csv` in the current working directory.

## Import

Supabase → Table Editor → `air_quality_observations` → Insert → Import data from CSV.
Map the eight CSV columns. Do not map `id` or `created_at`; PostgreSQL supplies them.

Keep `locality_id` blank unless you have verified the station's coordinates belong
to a specific ward. This script does not assign all Delhi stations to Ward 111.

## Data semantics

- `PM2.5` and `PM10` are daily mean pollutant concentrations, usually `µg/m³`.
- They are not AQI index values.
- The provider label is derived from the API `source` field where available.
- XKDR says readings are published as received and are not independently validated
  for regulatory, legal or health decisions.
- Attribute: XKDR Forum, India Air Quality Database; underlying CPCB CAAQM network
  and US Department of State via AirNow, as applicable.

Official API documentation: https://github.com/xKDR/Air-Quality-Database/blob/main/docs/PUBLIC_API.md
