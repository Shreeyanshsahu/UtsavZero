
#!/usr/bin/env python3

import argparse
import csv
import os
import sys
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

BASE_URL = "https://airquality.xkdr.org"
MEASUREMENTS_URL = f"{BASE_URL}/v1/measurements"
STATIONS_URL = f"{BASE_URL}/v1/stations"

SOURCE_URL = "https://airquality.xkdr.org/"

WINDOWS = [
    ("2020-10-01", "2020-11-30"),
    ("2021-10-01", "2021-11-30"),
    ("2022-10-01", "2022-11-30"),
    ("2023-10-01", "2023-11-30"),
    ("2024-10-01", "2024-11-30"),
]

FIELDS = [
    "locality_id",
    "station_name",
    "provider",
    "pollutant",
    "concentration",
    "unit",
    "observed_at",
    "source_url",
]


def api_request(url, api_key):
    request = Request(
        url,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Accept": "text/csv",
            "User-Agent": "UtsavZero-AQI-Importer/2.0",
        },
    )

    with urlopen(request, timeout=90) as response:
        return response.read().decode("utf-8-sig")


def get_stations(api_key):
    print("Fetching Delhi monitoring station metadata...")

    params = urlencode({
        "city": "Delhi",
        "format": "csv",
    })

    body = api_request(
        f"{STATIONS_URL}?{params}",
        api_key,
    )

    reader = csv.DictReader(body.splitlines())

    stations = {}

    for row in reader:
        station_id = row.get("station_id", "").strip()

        if not station_id:
            continue

        name = (
            row.get("station_name")
            or row.get("name")
            or station_id
        ).strip()

        source = row.get("source", "").strip()

        stations[station_id] = {
            "name": name,
            "source": source,
        }

    if not stations:
        raise RuntimeError(
            "No Delhi stations returned. "
            "Check the station API response."
        )

    print(f"Found {len(stations)} monitoring stations.")
    return stations


def get_provider(station_id, source):
    if source == "cpcb_caaqm":
        return "CPCB CAAQM via XKDR Forum"

    if source == "us_embassy":
        return "US Department of State / AirNow via XKDR Forum"

    if station_id.startswith("DS"):
        return "US Department of State / AirNow via XKDR Forum"

    return "CPCB CAAQM via XKDR Forum"


def normalize_timestamp(value):
    parsed = datetime.fromisoformat(value.strip())

    if parsed.tzinfo is None:
        return parsed.isoformat(timespec="seconds") + "+05:30"

    return parsed.isoformat(timespec="seconds")


def main():

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--output",
        default="aqi_observations.csv",
    )

    args = parser.parse_args()

    api_key = os.environ.get("XKDR_API_KEY", "").strip()

    if not api_key:
        sys.exit("XKDR_API_KEY is missing.")

    try:
        stations = get_stations(api_key)
    except Exception as error:
        sys.exit(f"Station metadata error: {error}")

    output = Path(args.output)

    seen = set()
    total = 0

    with output.open(
        "w",
        newline="",
        encoding="utf-8",
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=FIELDS,
        )

        writer.writeheader()

        for start, end in WINDOWS:

            print(
                f"\nFetching Delhi daily PM2.5/PM10: "
                f"{start} to {end} ..."
            )

            params = [
                ("city", "Delhi"),
                ("parameter", "PM2.5"),
                ("parameter", "PM10"),
                ("start", start),
                ("end", end),
                ("agg", "daily"),
                ("format", "csv"),
            ]

            url = (
                f"{MEASUREMENTS_URL}?"
                f"{urlencode(params)}"
            )

            try:
                body = api_request(url, api_key)
            except Exception as error:
                print(f"API request failed: {error}")
                continue

            reader = csv.DictReader(body.splitlines())

            rows = list(reader)

            print(f"API returned {len(rows)} rows.")

            period_count = 0

            for row in rows:

                station_id = row.get("station_id", "").strip()
                pollutant = row.get("parameter_name", "").strip()

                # Daily aggregated measurements use mean.
                value = row.get("mean", "").strip()

                timestamp = row.get("period_start", "").strip()

                unit = row.get("unit", "").strip()

                if not all([
                    station_id,
                    pollutant,
                    value,
                    timestamp,
                ]):
                    continue

                if pollutant not in ("PM2.5", "PM10"):
                    continue

                try:
                    concentration = float(value)
                    observed_at = normalize_timestamp(timestamp)
                except (ValueError, TypeError):
                    continue

                station = stations.get(station_id)

                if station:
                    station_name = station["name"]
                    source = station["source"]
                else:
                    # Preserve the station identifier rather than
                    # silently discarding an otherwise valid reading.
                    station_name = f"Unknown station ({station_id})"
                    source = ""

                provider = get_provider(
                    station_id,
                    source,
                )

                key = (
                    station_id,
                    pollutant,
                    observed_at,
                )

                if key in seen:
                    continue

                seen.add(key)

                writer.writerow({
                    "locality_id": "",
                    "station_name": (
                        f"{station_name} [{station_id}]"
                    ),
                    "provider": provider,
                    "pollutant": pollutant,
                    "concentration": concentration,
                    "unit": unit or "µg/m³",
                    "observed_at": observed_at,
                    "source_url": SOURCE_URL,
                })

                total += 1
                period_count += 1

            file.flush()

            print(
                f"Normalized and written: "
                f"{period_count} rows."
            )

            time.sleep(0.2)

    if total == 0:
        output.unlink(missing_ok=True)
        sys.exit("No valid observations were generated.")

    print("\n================================")
    print("AQI DATA EXPORT SUCCESSFUL")
    print("================================")
    print(f"Total observations: {total:,}")
    print(f"Output file: {output.resolve()}")
    print("Pollutants: PM2.5, PM10")
    print("Aggregation: Daily mean")
    print("Values are NOT AQI index values.")


if __name__ == "__main__":
    main()
