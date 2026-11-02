
"use client";

import { useCallback } from "react";

import {
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Info,
} from "lucide-react";

import CivicLayout from "@/components/civic/layout/CivicLayout";
import CivicStatsCards from "@/components/civic/dashboard/CivicStatsCards";
import CivicRecentActivity from "@/components/civic/dashboard/CivicRecentActivity";

import { useCivicDashboard } from "@/hooks/civic/useCivicDashboard";
import { useCivicActivity } from "@/hooks/civic/useCivicActivity";
import { useTheme } from "@/context/ThemeContext";

export default function CivicPage() {
  const { isDarkMode } = useTheme();

  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refresh: refreshStats,
  } = useCivicDashboard();

  const {
    activities,
    loading: activityLoading,
    error: activityError,
    refresh: refreshActivity,
  } = useCivicActivity();

  const refreshing = statsLoading || activityLoading;

  const handleRefresh = useCallback(() => {
    void Promise.all([refreshStats(), refreshActivity()]);
  }, [refreshStats, refreshActivity]);

  const colors = {
    heading: isDarkMode
      ? "text-[#F5EBDD]"
      : "text-[#38231C]",

    secondary: isDarkMode
      ? "text-[#B8B0A4]"
      : "text-[#806B5D]",

    muted: isDarkMode
      ? "text-[#99958B]"
      : "text-[#A18D7D]",

    card: isDarkMode
      ? "border-[#343B36] bg-[#202522]"
      : "border-[#EADCC9] bg-white",

    notice: isDarkMode
      ? "border-[#59432F] bg-[#29231D]"
      : "border-[#F0D5B8] bg-[#FFF3E4]",

    noticeHeading: isDarkMode
      ? "text-[#F0C18F]"
      : "text-[#70401F]",

    noticeText: isDarkMode
      ? "text-[#C6B9A8]"
      : "text-[#806B5D]",

    badge: isDarkMode
      ? "bg-[#39271D] text-[#FF9A57]"
      : "bg-[#FFF0D8] text-[#E65B16]",

    divider: isDarkMode
      ? "border-[#343B36]"
      : "border-[#EADCC9]",

    errorBox: isDarkMode
      ? "border-red-900 bg-red-950/30"
      : "border-red-200 bg-red-50",

    errorHeading: isDarkMode
      ? "text-red-300"
      : "text-red-800",

    errorText: isDarkMode
      ? "text-red-400"
      : "text-red-700",
  };

  return (
    <CivicLayout title="Civic Intelligence">
      <div className="space-y-8">

        {/* Dashboard heading */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#F0440A]" />

              <span className="text-sm font-semibold uppercase tracking-wider text-[#F0440A]">
                Civic Administration
              </span>
            </div>


            <p className={`mt-2 max-w-2xl text-sm sm:text-base ${colors.secondary}`}>
              Monitor localities, geographic infrastructure, proposed
              zones, and simulated civic decisions from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />

            {refreshing ? "Refreshing..." : "Refresh Dashboard"}
          </button>
        </section>

        {/* Database errors */}
        {(statsError || activityError) && (
          <section
            role="alert"
            className={`flex gap-3 rounded-2xl border p-4 ${colors.errorBox}`}
          >
            <AlertCircle className={`h-5 w-5 shrink-0 ${colors.errorText}`} />

            <div>
              <h2 className={`font-semibold ${colors.errorHeading}`}>
                Some dashboard data could not be loaded
              </h2>

              {statsError && (
                <p className={`mt-1 text-sm ${colors.errorText}`}>
                  Statistics: {statsError}
                </p>
              )}

              {activityError && (
                <p className={`mt-1 text-sm ${colors.errorText}`}>
                  Recent activity: {activityError}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Statistics */}
        <section className="space-y-4">
          <div>
            <h2 className={`text-xl font-bold ${colors.heading}`}>
              Overview
            </h2>

            <p className={`mt-1 text-sm ${colors.secondary}`}>
              Live counts from your civic planning database.
            </p>
          </div>

          <CivicStatsCards
            stats={stats}
            loading={statsLoading}
          />
        </section>

        {/* Recent activity and quick information */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CivicRecentActivity
              activities={activities}
              loading={activityLoading}
            />
          </div>

          {/* Quick information */}
          <aside className="space-y-4">

            {/* Planning workspace */}
            <div className={`rounded-2xl border p-6 shadow-sm ${colors.card}`}>
              <h2 className={`text-lg font-semibold ${colors.heading}`}>
                Planning Workspace
              </h2>

              <p className={`mt-2 text-sm leading-relaxed ${colors.secondary}`}>
                Use the civic workspace to explore localities, examine
                mapped infrastructure, create demonstration zones, and
                review submitted applications.
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className={colors.secondary}>
                    Localities
                  </span>

                  <span className={`font-semibold ${colors.heading}`}>
                    {statsLoading ? "—" : stats.totalLocalities}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className={colors.secondary}>
                    Proposed zones
                  </span>

                  <span className={`font-semibold ${colors.heading}`}>
                    {statsLoading ? "—" : stats.totalProposedZones}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className={colors.secondary}>
                    Pending applications
                  </span>

                  <span className={`font-semibold ${colors.heading}`}>
                    {statsLoading ? "—" : stats.totalApplications}
                  </span>
                </div>
              </div>
            </div>

            {/* System information */}
            <div className={`rounded-2xl border p-6 shadow-sm ${colors.card}`}>
              <h2 className={`font-semibold ${colors.heading}`}>
                System Information
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className={colors.secondary}>
                    Environment
                  </span>

                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colors.badge}`}>
                    Demo
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className={colors.secondary}>
                    Data source
                  </span>

                  <span className={`font-medium ${colors.heading}`}>
                    Supabase
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className={colors.secondary}>
                    Activity records
                  </span>

                  <span className={`font-medium ${colors.heading}`}>
                    {activityLoading ? "—" : activities.length}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Footer */}
        <footer className={`border-t pt-5 text-center text-xs ${colors.divider} ${colors.muted}`}>
          UtsavZero · Civic Intelligence · Demonstration Prototype
        </footer>

      </div>
    </CivicLayout>
  );
}
