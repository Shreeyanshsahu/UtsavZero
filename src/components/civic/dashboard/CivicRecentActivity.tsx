
"use client";

import {
  Activity,
  MapPinned,
  FileText,
  ClipboardCheck,
  Clock3,
} from "lucide-react";

import { useTheme } from "@/context/ThemeContext";

export type CivicActivityType =
  | "zone_proposed"
  | "application_submitted"
  | "decision_recorded";

export interface CivicActivity {
  id: string;
  type: CivicActivityType;
  title: string;
  description: string;
  createdAt: string;
}

interface CivicRecentActivityProps {
  activities: CivicActivity[];
  loading: boolean;
}

const activityConfig = {
  zone_proposed: {
    label: "Zone proposal",
    icon: MapPinned,
  },
  application_submitted: {
    label: "Application",
    icon: FileText,
  },
  decision_recorded: {
    label: "Decision",
    icon: ClipboardCheck,
  },
} satisfies Record<
  CivicActivityType,
  {
    label: string;
    icon: React.ElementType;
  }
>;

function formatActivityDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function CivicRecentActivity({
  activities,
  loading,
}: CivicRecentActivityProps) {
  const { isDarkMode } = useTheme();

  const colors = {
    card: isDarkMode
      ? "border-[#343B36] bg-[#202522]"
      : "border-[#EADCC9] bg-white",

    primary: isDarkMode
      ? "text-[#F5EBDD]"
      : "text-[#38231C]",

    secondary: isDarkMode
      ? "text-[#B7B0A5]"
      : "text-[#806B5D]",

    muted: isDarkMode
      ? "text-[#99958B]"
      : "text-[#A18D7D]",

    iconBackground: isDarkMode
      ? "bg-[#292E2B]"
      : "bg-[#FFF0D8]",

    accent: isDarkMode
      ? "text-[#FF6A16]"
      : "text-[#F0440A]",

    divider: isDarkMode
      ? "divide-[#343B36]"
      : "divide-[#EADCC9]",

    skeleton: isDarkMode
      ? "bg-[#343B36]"
      : "bg-[#F2E9DC]",

    badge: isDarkMode
      ? "bg-[#292E2B] text-[#B7B0A5]"
      : "bg-[#F2E9DC] text-[#806B5D]",
  };

  return (
    <section
      className={`rounded-2xl border p-6 shadow-sm ${colors.card}`}
    >
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2.5 ${colors.iconBackground}`}>
          <Activity className={`h-5 w-5 ${colors.accent}`} />
        </div>

        <div>
          <h2 className={`text-lg font-semibold ${colors.primary}`}>
            Recent Activity
          </h2>

          <p className={`text-sm ${colors.secondary}`}>
            Latest actions across the civic portal
          </p>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex animate-pulse gap-3">
                <div
                  className={`h-10 w-10 rounded-xl ${colors.skeleton}`}
                />

                <div className="flex-1 space-y-2 py-1">
                  <div
                    className={`h-3 w-2/5 rounded ${colors.skeleton}`}
                  />
                  <div
                    className={`h-3 w-4/5 rounded ${colors.skeleton}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Clock3 className={`h-8 w-8 ${colors.muted}`} />

            <p className={`mt-3 font-medium ${colors.primary}`}>
              No activity yet
            </p>

            <p className={`mt-1 text-sm ${colors.secondary}`}>
              Civic actions will appear here as they happen.
            </p>
          </div>
        ) : (
          <div className={`divide-y ${colors.divider}`}>
            {activities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;

              return (
                <div
                  key={activity.id}
                  className="flex gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div
                    className={`h-fit rounded-xl p-2.5 ${colors.iconBackground} ${colors.accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`font-medium ${colors.primary}`}>
                        {activity.title}
                      </p>

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${colors.badge}`}
                      >
                        {config.label}
                      </span>
                    </div>

                    <p className={`mt-1 text-sm ${colors.secondary}`}>
                      {activity.description}
                    </p>

                    <p className={`mt-2 text-xs ${colors.muted}`}>
                      {formatActivityDate(activity.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
