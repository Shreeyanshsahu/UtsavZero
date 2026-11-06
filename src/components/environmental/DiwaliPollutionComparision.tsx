
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Info,
  Wind,
  RadioTower,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/context/ThemeContext";

type Comparison = {
  year: number;
  pollutant: string;
  stations_compared: number;
  avg_pre_diwali: number;
  avg_diwali_day: number;
  avg_post_diwali: number;
  diwali_change_percent: number;
};

const POLLUTANTS = ["PM2.5", "PM10"] as const;

const formatValue = (value: number) =>
  Number(value).toFixed(1);

export default function DiwaliPollutionComparison() {
  const { isDarkMode } = useTheme();

  const supabase = useMemo(() => createClient(), []);

  const [data, setData] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollutant, setPollutant] =
    useState<(typeof POLLUTANTS)[number]>("PM2.5");

  const dark = isDarkMode;

  const theme = {
    background: dark ? "#171A19" : "#FFF8EB",
    surface: dark ? "#202522" : "#FFFFFF",
    surfaceAlt: dark ? "#252B27" : "#FFF3E2",
    border: dark ? "#343D36" : "#EADCC9",
    text: dark ? "#F8F1E7" : "#38231C",
    muted: dark ? "#A9B1A8" : "#806B5D",
    subtle: dark ? "#78847A" : "#A18D79",
    orange: dark ? "#FF914D" : "#F0440A",
    orangeSoft: dark ? "#39291F" : "#FFF0DC",
    green: dark ? "#A3C49A" : "#64865C",
  };

  useEffect(() => {
    let active = true;

    async function fetchComparison() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc(
        "get_diwali_pollution_comparison"
      );

      if (!active) return;

      if (error) {
        console.error("Diwali comparison error:", error);
        setError("Unable to load historical pollution observations.");
      } else {
        setData((data ?? []) as Comparison[]);
      }

      setLoading(false);
    }

    fetchComparison();

    return () => {
      active = false;
    };
  }, [supabase]);

  const rows = useMemo(
    () =>
      data
        .filter((item) => item.pollutant === pollutant)
        .sort((a, b) => a.year - b.year),
    [data, pollutant]
  );

  const latest = rows[rows.length - 1];

  const highestChange = rows.reduce<Comparison | null>(
    (highest, item) =>
      !highest ||
      Number(item.diwali_change_percent) >
        Number(highest.diwali_change_percent)
        ? item
        : highest,
    null
  );

  const maxValue = Math.max(
    1,
    ...rows.flatMap((item) => [
      Number(item.avg_pre_diwali),
      Number(item.avg_diwali_day),
      Number(item.avg_post_diwali),
    ])
  );

  const cardStyle = {
    backgroundColor: theme.surface,
    borderColor: theme.border,
  };

  if (loading) {
    return (
      <div
        className="animate-pulse rounded-3xl border p-8"
        style={cardStyle}
      >
        <div
          className="h-6 w-52 rounded-lg"
          style={{ backgroundColor: theme.border }}
        />
        <div
          className="mt-6 h-48 rounded-2xl"
          style={{ backgroundColor: theme.surfaceAlt }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-2xl border p-6 text-sm"
        style={{
          ...cardStyle,
          color: theme.orange,
        }}
      >
        {error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div
        className="rounded-2xl border p-8 text-center"
        style={cardStyle}
      >
        <Wind
          className="mx-auto mb-3"
          size={32}
          color={theme.orange}
        />
        <p className="font-semibold" style={{ color: theme.text }}>
          No historical observations available
        </p>
        <p className="mt-2 text-sm" style={{ color: theme.muted }}>
          The comparison dataset is currently empty.
        </p>
      </div>
    );
  }

  return (
    <section
      className="space-y-7"
      style={{ color: theme.text }}
    >
      {/* INTRODUCTION */}
      <div
        className="relative overflow-hidden rounded-[28px] border p-6 sm:p-9"
        style={{
          background: dark
            ? "linear-gradient(125deg, #252B27 0%, #30251E 100%)"
            : "linear-gradient(125deg, #FFF4E3 0%, #FFE6C7 55%, #FFF8EB 100%)",
          borderColor: theme.border,
        }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full blur-3xl"
          style={{
            backgroundColor: dark
              ? "rgba(240,68,10,0.12)"
              : "rgba(255,106,22,0.14)",
          }}
        />

        <div className="relative">
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-[0.15em]"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.surface,
              color: theme.orange,
            }}
          >
            <Activity size={14} />
            ENVIRONMENTAL INTELLIGENCE
          </div>

          <h2
            className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            Understanding the air.
            <span
              className="block"
              style={{ color: theme.orange }}
            >
              Learning from five Diwalis.
            </span>
          </h2>

          <p
            className="mt-4 max-w-xl text-sm leading-7 sm:text-base"
            style={{ color: theme.muted }}
          >
            A historical analysis of particulate matter
            concentrations across Delhi&apos;s air quality monitoring
            network, comparing conditions before, during and
            after Diwali.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {[
              { label: "Historical period", value: "2020 — 2024" },
              { label: "Monitoring stations", value: "36 — 39" },
              { label: "Pollutants", value: "PM2.5 / PM10" },
            ].map((item) => (
              <div
                key={item.label}
                className="min-w-[125px] rounded-2xl border px-4 py-3"
                style={{
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.035)"
                    : "rgba(255,255,255,0.65)",
                  borderColor: theme.border,
                }}
              >
                <p
                  className="text-[11px]"
                  style={{ color: theme.muted }}
                >
                  {item.label}
                </p>
                <p className="mt-1 text-base font-bold">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ANALYSIS HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p
            className="text-xs font-bold uppercase tracking-[0.15em]"
            style={{ color: theme.orange }}
          >
            Historical observations
          </p>

          <h3
            className="mt-2 text-2xl font-bold"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            Pollution trends
          </h3>

          <p className="mt-2 text-sm" style={{ color: theme.muted }}>
            Compare average daily concentrations across three periods.
          </p>
        </div>

        <div
          className="flex w-fit rounded-xl border p-1"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
        >
          {POLLUTANTS.map((item) => (
            <button
              key={item}
              onClick={() => setPollutant(item)}
              className="rounded-lg px-5 py-2.5 text-sm font-bold transition-all"
              style={{
                background:
                  pollutant === item
                    ? "linear-gradient(110deg, #FFBE45, #FF6A16, #F0440A)"
                    : "transparent",
                color:
                  pollutant === item
                    ? "#FFFFFF"
                    : theme.muted,
                boxShadow:
                  pollutant === item
                    ? "0 4px 14px rgba(240,68,10,0.18)"
                    : "none",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* SUMMARY CARDS */}
      {latest && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div
            className="rounded-2xl border p-5"
            style={cardStyle}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: theme.muted }}>
                Latest Diwali · {latest.year}
              </span>
              <CalendarDays size={17} color={theme.orange} />
            </div>

            <p className="mt-4 text-3xl font-bold tabular-nums">
              {formatValue(Number(latest.avg_diwali_day))}
              <span
                className="ml-1 text-xs font-medium"
                style={{ color: theme.muted }}
              >
                µg/m³
              </span>
            </p>

            <p className="mt-2 text-xs" style={{ color: theme.muted }}>
              Diwali-day average concentration
            </p>
          </div>

          <div
            className="rounded-2xl border p-5"
            style={cardStyle}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: theme.muted }}>
                Change from pre-Diwali
              </span>

              {Number(latest.diwali_change_percent) >= 0 ? (
                <ArrowUpRight size={18} color={theme.orange} />
              ) : (
                <ArrowDownRight size={18} color={theme.green} />
              )}
            </div>

            <p
              className="mt-4 text-3xl font-bold tabular-nums"
              style={{
                color:
                  Number(latest.diwali_change_percent) >= 0
                    ? theme.orange
                    : theme.green,
              }}
            >
              {Number(latest.diwali_change_percent) > 0 ? "+" : ""}
              {formatValue(Number(latest.diwali_change_percent))}%
            </p>

            <p className="mt-2 text-xs" style={{ color: theme.muted }}>
              Observed concentration difference
            </p>
          </div>

          <div
            className="rounded-2xl border p-5"
            style={cardStyle}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: theme.muted }}>
                Monitoring coverage
              </span>
              <RadioTower size={18} color={theme.orange} />
            </div>

            <p className="mt-4 text-3xl font-bold tabular-nums">
              {latest.stations_compared}
            </p>

            <p className="mt-2 text-xs" style={{ color: theme.muted }}>
              Qualifying monitoring stations
            </p>
          </div>
        </div>
      )}

      {/* BAR CHART */}
      <div
        className="rounded-[24px] border p-5 sm:p-8"
        style={cardStyle}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">
              Year-by-year comparison
            </h3>
            <p className="mt-1 text-xs" style={{ color: theme.muted }}>
              Average concentration · µg/m³
            </p>
          </div>

          <span
            className="rounded-lg px-3 py-1.5 text-xs font-bold"
            style={{
              color: theme.orange,
              backgroundColor: theme.orangeSoft,
            }}
          >
            {pollutant}
          </span>
        </div>

        <div className="mt-8 space-y-8">
          {rows.map((item) => {
            const periods = [
              {
                label: "Before",
                value: Number(item.avg_pre_diwali),
                color: "#D6A66B",
              },
              {
                label: "Diwali",
                value: Number(item.avg_diwali_day),
                color: "#F0440A",
              },
              {
                label: "After",
                value: Number(item.avg_post_diwali),
                color: "#849A77",
              },
            ];

            const change = Number(item.diwali_change_percent);

            return (
              <div key={item.year}>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-bold">
                    {item.year}
                  </span>

                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{
                      color: change >= 0 ? theme.orange : theme.green,
                    }}
                  >
                    {change > 0 ? "+" : ""}
                    {formatValue(change)}%
                  </span>
                </div>

                <div className="space-y-3">
                  {periods.map((period) => (
                    <div
                      key={period.label}
                      className="grid grid-cols-[65px_minmax(0,1fr)_58px] items-center gap-3"
                    >
                      <span
                        className="text-xs"
                        style={{ color: theme.muted }}
                      >
                        {period.label}
                      </span>

                      <div
                        className="h-3 overflow-hidden rounded-full"
                        style={{
                          backgroundColor: theme.surfaceAlt,
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(
                              0,
                              (period.value / maxValue) * 100
                            )}%`,
                            backgroundColor: period.color,
                          }}
                        />
                      </div>

                      <span className="text-right text-xs font-semibold tabular-nums">
                        {formatValue(period.value)}
                      </span>
                    </div>
                  ))}
                </div>

                <p
                  className="mt-3 text-right text-[11px]"
                  style={{ color: theme.subtle }}
                >
                  {item.stations_compared} stations included
                </p>
              </div>
            );
          })}
        </div>

        <div
          className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t pt-5"
          style={{ borderColor: theme.border }}
        >
          {[
            { label: "Before Diwali", color: "#D6A66B" },
            { label: "Diwali day", color: "#F0440A" },
            { label: "After Diwali", color: "#849A77" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs" style={{ color: theme.muted }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* HISTORICAL INSIGHT */}
      {highestChange && (
        <div
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            backgroundColor: theme.orangeSoft,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: dark ? "#493020" : "#FFE0B5",
                color: theme.orange,
              }}
            >
              <Activity size={20} />
            </div>

            <div>
              <p className="text-sm font-bold">
                Historical observation
              </p>
              <p
                className="mt-2 text-sm leading-6"
                style={{ color: theme.muted }}
              >
                The largest Diwali-day increase in this dataset for{" "}
                {pollutant} occurred in {highestChange.year}, when
                the average concentration was{" "}
                {formatValue(Number(highestChange.diwali_change_percent))}%
                {" "}higher than the preceding seven-day average.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* METHODOLOGY */}
      <div
        className="rounded-2xl border p-5 sm:p-6"
        style={cardStyle}
      >
        <div className="flex items-start gap-3">
          <Info
            size={20}
            className="mt-0.5 shrink-0"
            color={theme.orange}
          />

          <div>
            <h4 className="text-sm font-bold">
              Data, methodology and limitations
            </h4>

            <div
              className="mt-3 space-y-2 text-xs leading-6"
              style={{ color: theme.muted }}
            >
              <p>
                <strong>Comparison windows:</strong> Seven days
                before Diwali, Diwali day itself, and seven days
                after Diwali.
              </p>

              <p>
                <strong>Station eligibility:</strong> At least five
                valid pre-Diwali days, one Diwali-day observation,
                and five valid post-Diwali days.
              </p>

              <p>
                <strong>Measurement:</strong> Daily mean PM2.5 and
                PM10 concentrations in µg/m³. These are pollutant
                concentrations, not AQI index values.
              </p>

              <p>
                <strong>Geographic coverage:</strong> Delhi-wide
                monitoring stations. These values must not be
                interpreted as ward-specific measurements.
              </p>

              <p>
                <strong>Interpretation:</strong> Observed differences
                do not establish fireworks as the cause. Weather,
                traffic, regional pollution and other sources may
                influence concentrations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
