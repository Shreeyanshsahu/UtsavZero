-- Run after importing the corrected CSV. Read-only verification.
SELECT
    provider,
    pollutant,
    unit,
    COUNT(*) AS observation_count,
    MIN(observed_at) AS first_observation,
    MAX(observed_at) AS last_observation,
    COUNT(DISTINCT station_name) AS station_count
FROM public.air_quality_observations
GROUP BY provider, pollutant, unit
ORDER BY provider, pollutant, unit;

SELECT
    station_name, provider, pollutant, concentration, unit,
    observed_at, locality_id, source_url
FROM public.air_quality_observations
ORDER BY observed_at DESC
LIMIT 30;

SELECT station_name, pollutant, observed_at, COUNT(*) AS duplicate_count
FROM public.air_quality_observations
GROUP BY station_name, pollutant, observed_at
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 50;
