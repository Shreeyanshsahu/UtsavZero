
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock3,
  Building2,
  Mail,
  UserRound,
  FileText,
  CalendarDays,
  AlertCircle,
  LoaderCircle,
  LockKeyhole,
  ExternalLink,
} from "lucide-react";

import CivicLayout from "@/components/civic/layout/CivicLayout";
import { useTheme } from "@/context/ThemeContext";
import { createClient } from "@/lib/supabase/client";

const REVIEWER_EMAIL = "utsavzeroauth@gmail.com";

type ApplicationStatus = "pending" | "approved" | "rejected";

interface GovernmentApplication {
  id: string;
  user_id: string;
  full_name: string;
  department: string;
  designation: string;
  official_email: string;
  reason: string;
  supporting_documents: unknown;
  status: ApplicationStatus;
  reviewed_by: string | null;
  review_remarks: string | null;
  reviewed_at: string | null;
  submitted_at: string;
  updated_at: string;
}

type FilterType = "all" | "pending" | "approved" | "rejected";

const supabase = createClient();

function formatDate(dateString: string | null) {
  if (!dateString) return "Not available";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getDocumentName(document: unknown, index: number) {
  if (typeof document === "string") {
    return document;
  }

  if (document && typeof document === "object") {
    const item = document as Record<string, unknown>;

    if (typeof item.name === "string") return item.name;
    if (typeof item.file_name === "string") return item.file_name;
    if (typeof item.filename === "string") return item.filename;
  }

  return `Supporting document ${index + 1}`;
}

function getDocumentUrl(document: unknown): string | null {
  if (!document || typeof document !== "object") return null;

  const item = document as Record<string, unknown>;
  const url = typeof item.url === "string" ? item.url : null;

  if (!url || !url.startsWith("https://")) return null;

  return url;
}

export default function GovernmentAuthorizationsPage() {
  const { isDarkMode } = useTheme();

  const [applications, setApplications] = useState<GovernmentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterType>("all");
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const colors = {
    card: isDarkMode
      ? "border-[#343B36] bg-[#202522]"
      : "border-[#EADCC9] bg-white",

    heading: isDarkMode
      ? "text-[#F5EBDD]"
      : "text-[#38231C]",

    secondary: isDarkMode
      ? "text-[#B8B0A4]"
      : "text-[#806B5D]",

    muted: isDarkMode
      ? "text-[#99958B]"
      : "text-[#A18D7D]",

    input: isDarkMode
      ? "border-[#454B45] bg-[#171A19] text-[#F5EBDD] placeholder:text-[#77776F]"
      : "border-[#EADCC9] bg-[#FFF8EB] text-[#38231C] placeholder:text-[#A18D7D]",

    iconBackground: isDarkMode
      ? "bg-[#292E2B]"
      : "bg-[#FFF0D8]",

    divider: isDarkMode
      ? "border-[#343B36]"
      : "border-[#EADCC9]",

    neutralButton: isDarkMode
      ? "border-[#454B45] text-[#D8CFC1] hover:bg-[#292E2B]"
      : "border-[#EADCC9] text-[#806B5D] hover:bg-[#FFF8EB]",

    notice: isDarkMode
      ? "border-[#59432F] bg-[#29231D]"
      : "border-[#F0D5B8] bg-[#FFF3E4]",
  };

  const loadApplications = useCallback(async (showRefresh = false) => {
  if (showRefresh) {
    setRefreshing(true);
    setError(null);
  }

    try {
      // Verify authenticated user
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        setAuthorized(false);
        setUserEmail(null);
        return;
      }

      const email = authData.user.email?.toLowerCase() ?? "";
      setUserEmail(email);

      // Verify designated reviewer email
      if (email !== REVIEWER_EMAIL) {
        setAuthorized(false);
        return;
      }

      // Verify civic_demo_admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id);

      if (roleError) {
        throw new Error(roleError.message);
      }

      const isReviewer = (roleData ?? []).some(
        (item) => item.role === "civic_demo_admin"
      );

      if (!isReviewer) {
        setAuthorized(false);
        return;
      }

      setAuthorized(true);

      // RLS permits the designated reviewer to view all applications
      const { data, error: applicationsError } = await supabase
        .from("government_authorization_applications")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (applicationsError) {
        throw new Error(applicationsError.message);
      }

      setApplications(
        (data ?? []) as unknown as GovernmentApplication[]
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load authorization applications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
      setCheckingAccess(false);
    }
  }, []);

  useEffect(() => {
  const timer = setTimeout(() => {
    void loadApplications();
  }, 0);

  return () => clearTimeout(timer);
}, [loadApplications]);

  const pendingCount = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const approvedCount = applications.filter(
    (application) => application.status === "approved"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "rejected"
  ).length;

  const filteredApplications = useMemo(() => {
    const filtered = applications.filter((application) =>
      filter === "all" ? true : application.status === filter
    );

    // Always show pending requests first.
    return filtered.sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;

      return (
        new Date(b.submitted_at).getTime() -
        new Date(a.submitted_at).getTime()
      );
    });
  }, [applications, filter]);

  const handleReview = async (
    application: GovernmentApplication,
    decision: "approved" | "rejected"
  ) => {
    const decisionLabel = decision === "approved" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${decisionLabel} the application from ${application.full_name}?`
    );

    if (!confirmed) return;

    setProcessingId(application.id);
    setError(null);
    setSuccess(null);

    try {
      const { error: reviewError } = await supabase.rpc(
        "review_government_authorization",
        {
          p_application_id: application.id,
          p_decision: decision,
          p_remarks: remarks[application.id]?.trim() || null,
        }
      );

      if (reviewError) {
        throw new Error(reviewError.message);
      }

      setSuccess(
        `${application.full_name}'s application has been ${decision}.`
      );

      setRemarks((previous) => {
        const updated = { ...previous };
        delete updated[application.id];
        return updated;
      });

      await loadApplications(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process this application."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const statusStyle = (status: ApplicationStatus) => {
    if (status === "approved") {
      return isDarkMode
        ? "bg-[#20352C] text-[#80D6AE]"
        : "bg-emerald-50 text-emerald-700";
    }

    if (status === "rejected") {
      return isDarkMode
        ? "bg-[#3A2525] text-[#F2A3A3]"
        : "bg-red-50 text-red-700";
    }

    return isDarkMode
      ? "bg-[#39271D] text-[#FF9A57]"
      : "bg-[#FFF0D8] text-[#E65B16]";
  };

  const statCards = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: FileText,
    },
    {
      label: "Pending Review",
      value: pendingCount,
      icon: Clock3,
    },
    {
      label: "Approved",
      value: approvedCount,
      icon: CheckCircle2,
    },
    {
      label: "Rejected",
      value: rejectedCount,
      icon: XCircle,
    },
  ];

  if (checkingAccess || loading) {
    return (
      <CivicLayout
        title="Government Authorizations"
        description="Review government personnel access requests."
      >
        <div className="flex min-h-[45vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle className="h-8 w-8 animate-spin text-[#F0440A]" />
            <p className={colors.secondary}>
              Verifying reviewer access...
            </p>
          </div>
        </div>
      </CivicLayout>
    );
  }

  if (!authorized) {
    return (
      <CivicLayout
        title="Government Authorizations"
        description="Restricted application review workspace."
      >
        <div className={`mx-auto max-w-xl rounded-2xl border p-8 text-center ${colors.card}`}>
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${colors.iconBackground}`}>
            <LockKeyhole className="h-8 w-8 text-[#F0440A]" />
          </div>

          <h2 className={`mt-5 text-xl font-bold ${colors.heading}`}>
            Access Restricted
          </h2>

          <p className={`mt-2 text-sm leading-relaxed ${colors.secondary}`}>
            This workspace is restricted to the designated UtsavZero
            authorization reviewer.
          </p>

          {userEmail && (
            <p className={`mt-3 text-xs ${colors.muted}`}>
              Signed in as: {userEmail}
            </p>
          )}

          <p className="mt-5 text-xs font-medium text-[#F0440A]">
            Reviewer authorization required
          </p>
        </div>
      </CivicLayout>
    );
  }

  return (
    <CivicLayout
      title="Government Authorizations"
      description="Review and manage government personnel access requests."
    >
      <div className="space-y-7">

        {/* Reviewer notice */}
        <section className={`flex items-start gap-3 rounded-2xl border p-4 ${colors.notice}`}>
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#E66A1D]" />

          <div className="min-w-0">
            <h2 className={`text-sm font-semibold ${colors.heading}`}>
              Designated Reviewer Workspace
            </h2>

            <p className={`mt-1 text-sm ${colors.secondary}`}>
              Signed in as {userEmail}. Only this designated account can
              authorize government organizer access.
            </p>
          </div>
        </section>

        {/* Feedback */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={`rounded-2xl border p-5 shadow-sm ${colors.card}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className={`text-xs font-medium sm:text-sm ${colors.secondary}`}>
                    {item.label}
                  </p>

                  <div className={`rounded-xl p-2 ${colors.iconBackground}`}>
                    <Icon className="h-4 w-4 text-[#F0440A]" />
                  </div>
                </div>

                <p className={`mt-3 text-3xl font-bold ${colors.heading}`}>
                  {item.value.toLocaleString("en-IN")}
                </p>
              </div>
            );
          })}
        </section>

        {/* Application list heading */}
        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className={`text-xl font-bold ${colors.heading}`}>
                Applications
              </h2>

              <p className={`mt-1 text-sm ${colors.secondary}`}>
                Review submitted government personnel requests.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadApplications(true)}
              disabled={refreshing}
              className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${colors.neutralButton} disabled:opacity-50`}
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(
              ["all", "pending", "approved", "rejected"] as FilterType[]
            ).map((item) => {
              const active = filter === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                    active
                      ? "bg-gradient-to-r from-[#FF6A16] to-[#F0440A] text-white"
                      : colors.neutralButton + " border"
                  }`}
                >
                  {item === "all" ? "All applications" : item}
                </button>
              );
            })}
          </div>
        </section>

        {/* Applications */}
        <section className="space-y-5">
          {filteredApplications.length === 0 ? (
            <div className={`rounded-2xl border px-6 py-14 text-center ${colors.card}`}>
              <FileText className={`mx-auto h-10 w-10 ${colors.muted}`} />

              <h3 className={`mt-4 font-semibold ${colors.heading}`}>
                No applications found
              </h3>

              <p className={`mt-1 text-sm ${colors.secondary}`}>
                {filter === "pending"
                  ? "There are currently no pending applications."
                  : "No applications match this filter."}
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => {
              const documents = Array.isArray(application.supporting_documents)
                ? application.supporting_documents
                : [];

              const isProcessing = processingId === application.id;
              const isPending = application.status === "pending";

              return (
                <article
                  key={application.id}
                  className={`overflow-hidden rounded-2xl border shadow-sm ${colors.card}`}
                >
                  {/* Application header */}
                  <div className={`flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center ${colors.divider}`}>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-lg font-bold ${colors.heading}`}>
                          {application.full_name}
                        </h3>

                        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${statusStyle(application.status)}`}>
                          {application.status}
                        </span>
                      </div>

                      <p className={`mt-1 text-xs ${colors.muted}`}>
                        Application ID: {application.id}
                      </p>
                    </div>

                    <div className={`flex items-center gap-2 text-xs ${colors.secondary}`}>
                      <CalendarDays className="h-4 w-4" />
                      Submitted {formatDate(application.submitted_at)}
                    </div>
                  </div>

                  {/* Application details */}
                  <div className="grid gap-6 p-5 lg:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className={`text-sm font-semibold ${colors.heading}`}>
                        Applicant Information
                      </h4>

                      <div className="flex items-start gap-3">
                        <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[#F0440A]" />

                        <div>
                          <p className={`text-xs ${colors.muted}`}>
                            Full name
                          </p>
                          <p className={`text-sm font-medium ${colors.heading}`}>
                            {application.full_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#F0440A]" />

                        <div>
                          <p className={`text-xs ${colors.muted}`}>
                            Department
                          </p>
                          <p className={`text-sm font-medium ${colors.heading}`}>
                            {application.department}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#F0440A]" />

                        <div>
                          <p className={`text-xs ${colors.muted}`}>
                            Designation
                          </p>
                          <p className={`text-sm font-medium ${colors.heading}`}>
                            {application.designation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#F0440A]" />

                        <div className="min-w-0">
                          <p className={`text-xs ${colors.muted}`}>
                            Official email
                          </p>
                          <p className={`break-all text-sm font-medium ${colors.heading}`}>
                            {application.official_email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className={`text-sm font-semibold ${colors.heading}`}>
                        Request Details
                      </h4>

                      <div>
                        <p className={`text-xs ${colors.muted}`}>
                          Reason for requesting access
                        </p>

                        <p className={`mt-2 whitespace-pre-wrap text-sm leading-relaxed ${colors.secondary}`}>
                          {application.reason}
                        </p>
                      </div>

                      <div>
                        <p className={`mb-2 text-xs font-medium ${colors.muted}`}>
                          Supporting documents ({documents.length})
                        </p>

                        {documents.length === 0 ? (
                          <p className={`text-sm ${colors.muted}`}>
                            No supporting documents attached.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {documents.map((document, index) => {
                              const url = getDocumentUrl(document);

                              return (
                                <div
                                  key={index}
                                  className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${colors.divider}`}
                                >
                                  <div className="flex min-w-0 items-center gap-2">
                                    <FileText className="h-4 w-4 shrink-0 text-[#F0440A]" />

                                    <span className={`truncate text-xs ${colors.heading}`}>
                                      {getDocumentName(document, index)}
                                    </span>
                                  </div>

                                  {url && (
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="shrink-0 text-[#F0440A]"
                                      aria-label="Open supporting document"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Previous review */}
                  {!isPending && (
                    <div className={`border-t p-5 ${colors.divider}`}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className={`text-xs font-semibold ${colors.heading}`}>
                            Review Information
                          </p>

                          <p className={`mt-1 text-xs ${colors.secondary}`}>
                            Reviewed on {formatDate(application.reviewed_at)}
                          </p>
                        </div>

                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(application.status)}`}>
                          {application.status === "approved"
                            ? "Access approved"
                            : "Access rejected"}
                        </span>
                      </div>

                      {application.review_remarks && (
                        <p className={`mt-3 text-sm ${colors.secondary}`}>
                          <span className="font-semibold">Remarks: </span>
                          {application.review_remarks}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Reviewer controls */}
                  {isPending && (
                    <div className={`border-t p-5 ${colors.divider}`}>
                      <label
                        htmlFor={`remarks-${application.id}`}
                        className={`mb-2 block text-sm font-semibold ${colors.heading}`}
                      >
                        Review remarks (optional)
                      </label>

                      <textarea
                        id={`remarks-${application.id}`}
                        rows={2}
                        value={remarks[application.id] ?? ""}
                        onChange={(event) =>
                          setRemarks((previous) => ({
                            ...previous,
                            [application.id]: event.target.value,
                          }))
                        }
                        placeholder="Add a reason or note for this decision..."
                        className={`w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#F0440A] focus:ring-2 focus:ring-[#F0440A]/10 ${colors.input}`}
                        disabled={isProcessing}
                      />

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={() => void handleReview(application, "rejected")}
                          disabled={isProcessing}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          {isProcessing ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Reject Application
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleReview(application, "approved")}
                          disabled={isProcessing}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6A16] to-[#F0440A] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Approve Application
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>
      </div>
    </CivicLayout>
  );
}
