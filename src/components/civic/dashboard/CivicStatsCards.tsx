"use client";

import {
  MapPinned,
  Layers3,
  Map,
  FileText,
  ClipboardCheck,
  LoaderCircle,
} from "lucide-react";

import { useTheme } from "@/context/ThemeContext";
import type { CivicDashboardStats } from "@/services/civic/civicDashboardService";

interface CivicStatsCardsProps {
  stats: CivicDashboardStats;
  loading: boolean;
}

const statItems = [
  {
    key: "totalLocalities",
    label: "Total Localities",
    description: "Areas available for civic planning",
    icon: MapPinned,
  },
  {
    key: "totalGeographicFeatures",
    label: "Geographic Features",
    description: "Mapped facilities and infrastructure",
    icon: Layers3,
  },
  {
    key: "totalProposedZones",
    label: "Proposed Zones",
    description: "Zones created for simulation",
    icon: Map,
  },
  {
    key: "totalApplications",
    label: "Zone Applications",
    description: "Applications submitted for review",
    icon: FileText,
  },
  {
    key: "totalDecisions",
    label: "Recorded Decisions",
    description: "Simulated review outcomes",
    icon: ClipboardCheck,
  },
] satisfies {
  key: keyof CivicDashboardStats;
  label: string;
  description: string;
  icon: React.ElementType;
}[];

interface StatCardProps {
  label: string;
  description: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  isDarkMode: boolean;
}

function StatCard({
  label,
  description,
  value,
  icon: Icon,
  loading,
  isDarkMode,
}: StatCardProps) {
  const cardStyle = isDarkMode
    ? "border-[#343B36] bg-[#202522]"
    : "border-[#EADCC9] bg-white";

  const primaryText = isDarkMode
    ? "text-[#F5EBDD]"
    : "text-[#38231C]";

  const secondaryText = isDarkMode
    ? "text-[#B7B0A5]"
    : "text-[#806B5D]";

  const iconContainer = isDarkMode
    ? "bg-[#292E2B]"
    : "bg-[#FFF0D8]";

  const accentColor = isDarkMode
    ? "text-[#FF6A16]"
    : "text-[#F0440A]";

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${cardStyle}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={`text-sm font-medium ${secondaryText}`}>
            {label}
          </p>

          <div className="mt-3 flex min-h-10 items-center">
            {loading ? (
              <LoaderCircle
                className={`h-6 w-6 animate-spin ${accentColor}`}
              />
            ) : (
              <span className={`text-3xl font-bold tracking-tight ${primaryText}`}>
                {value.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        <div className={`rounded-xl p-3 ${iconContainer}`}>
          <Icon className={`h-5 w-5 ${accentColor}`} />
        </div>
      </div>

      <p className={`mt-3 text-xs ${secondaryText}`}>
        {description}
      </p>
    </div>
  );
}

export default function CivicStatsCards({
  stats,
  loading,
}: CivicStatsCardsProps) {
  const { isDarkMode } = useTheme();

  return (
    <section
      aria-label="Civic dashboard statistics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
    >
      {statItems.map((item) => (
        <StatCard
          key={item.key}
          label={item.label}
          description={item.description}
          value={stats[item.key]}
          icon={item.icon}
          loading={loading}
          isDarkMode={isDarkMode}
        />
      ))}
    </section>
  );
}