
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Building2,
  UserRound,
  Mail,
  FileText,
  Loader2,
  Clock3,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type ExistingApplication = {
  id: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  review_remarks: string | null;
};

export default function GovernmentAuthorizationApplyPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [application, setApplication] =
    useState<ExistingApplication | null>(null);

  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [reason, setReason] = useState("");

  const loadApplication = useCallback(async () => {
    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError || !authData.user) {
      router.replace("/login?next=/government-authorization/apply");
      return;
    }

    const currentUser = authData.user;

    setUserId(currentUser.id);
    setFullName(
      String(currentUser.user_metadata?.full_name ?? "")
    );
    setOfficialEmail(currentUser.email ?? "");

    const { data, error: applicationError } = await supabase
      .from("government_authorization_applications")
      .select("id, status, submitted_at, review_remarks")
      .eq("user_id", currentUser.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (applicationError) {
      console.error("Application lookup failed:", applicationError);
      setError("Unable to check your application. Please refresh.");
    } else {
      setApplication(data);
    }

    setChecking(false);
  }, [router, supabase]);

 useEffect(() => {
  let cancelled = false;

  const initialize = async () => {
    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (cancelled) return;

    if (authError || !authData.user) {
      router.replace("/login?next=/government-authorization/apply");
      return;
    }

    const currentUser = authData.user;

    setUserId(currentUser.id);
    setFullName(
      String(currentUser.user_metadata?.full_name ?? "")
    );
    setOfficialEmail(currentUser.email ?? "");

    const { data, error: applicationError } = await supabase
      .from("government_authorization_applications")
      .select("id, status, submitted_at, review_remarks")
      .eq("user_id", currentUser.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cancelled) return;

    if (applicationError) {
      console.error("Application lookup failed:", applicationError);
      setError("Unable to check your application. Please refresh.");
    } else {
      setApplication(data);
    }

    setChecking(false);
  };

  void initialize();

  return () => {
    cancelled = true;
  };
}, [router, supabase]);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!userId) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    if (
      !fullName.trim() ||
      !department.trim() ||
      !designation.trim() ||
      !officialEmail.trim() ||
      !reason.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const { data, error: insertError } = await supabase
        .from("government_authorization_applications")
        .insert({
          user_id: userId,
          full_name: fullName.trim(),
          department: department.trim(),
          designation: designation.trim(),
          official_email: officialEmail.trim(),
          reason: reason.trim(),
          supporting_documents: [],
          status: "pending",
          reviewed_by: null,
          reviewed_at: null,
        })
        .select("id, status, submitted_at, review_remarks")
        .single();

      if (insertError) {
        console.error("Government application submission failed:", insertError);
        setError(insertError.message);
        return;
      }

      setApplication(data);
    } catch (err) {
      console.error("Application submission error:", err);
      setError("Something went wrong while submitting your application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FFF8EB]">
        <Loader2 className="animate-spin text-[#F0440A]" size={30} />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[#FFF8EB] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#806B5D] hover:text-[#F0440A]"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </Link>

        <div className="rounded-3xl border border-[#EADCC9] bg-white p-6 shadow-xl sm:p-9">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0D8] text-[#F0440A]">
              <ShieldCheck size={28} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F0440A]">
                Government Access Verification
              </p>
              <h1 className="mt-1 text-2xl font-bold text-[#38231C] sm:text-3xl">
                Authorization Application
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#806B5D]">
                Provide your official details to request government organizer access.
              </p>
            </div>
          </div>

          {application ? (
            <div className="rounded-2xl border border-[#EADCC9] bg-[#FFF8EB] p-6">
              <div className="flex items-center gap-3">
                {application.status === "approved" ? (
                  <CheckCircle2 className="text-green-600" size={25} />
                ) : application.status === "rejected" ? (
                  <FileText className="text-red-600" size={25} />
                ) : (
                  <Clock3 className="text-[#F0440A]" size={25} />
                )}

                <div>
                  <h2 className="font-semibold text-[#38231C]">
                    Application {application.status}
                  </h2>
                  <p className="text-sm text-[#806B5D]">
                    Submitted on{" "}
                    {new Date(application.submitted_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#806B5D]">
                {application.status === "pending"
                  ? "Your application is waiting for review by the designated UtsavZero reviewer."
                  : application.status === "approved"
                  ? "Your government organizer access has been approved. Sign in again if your permissions have not refreshed."
                  : "Your application was rejected. Please contact the designated reviewer for further information."}
              </p>

              {application.review_remarks && (
                <div className="mt-4 rounded-xl bg-white p-4 text-sm text-[#806B5D]">
                  <strong className="text-[#38231C]">Reviewer remarks:</strong>
                  <p className="mt-1">{application.review_remarks}</p>
                </div>
              )}

              <Link
                href="/profile"
                className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[#FFBE45] to-[#F0440A] px-5 py-3 text-sm font-semibold text-white"
              >
                Go to Profile
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 rounded-xl border border-[#F4D5B7] bg-[#FFF8EB] p-4 text-sm leading-6 text-[#806B5D]">
                <strong className="text-[#38231C]">Please note:</strong>{" "}
                Submitting this application does not automatically grant government access.
                Your account remains a citizen account until the designated reviewer approves it.
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#38231C]">
                    Full name
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-[#EADCC9] px-4">
                    <UserRound size={18} className="text-[#806B5D]" />
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your official full name"
                      className="w-full bg-transparent py-3 text-sm text-[#38231C] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#38231C]">
                    Government department / organization
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-[#EADCC9] px-4">
                    <Building2 size={18} className="text-[#806B5D]" />
                    <input
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Department or organization"
                      className="w-full bg-transparent py-3 text-sm text-[#38231C] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#38231C]">
                    Designation
                  </label>
                  <input
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Your official designation"
                    className="w-full rounded-xl border border-[#EADCC9] px-4 py-3 text-sm text-[#38231C] outline-none focus:border-[#F0440A]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#38231C]">
                    Official email address
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-[#EADCC9] px-4">
                    <Mail size={18} className="text-[#806B5D]" />
                    <input
                      type="email"
                      required
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      placeholder="Official email address"
                      className="w-full bg-transparent py-3 text-sm text-[#38231C] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#38231C]">
                    Reason for requesting access
                  </label>
                  <textarea
                    required
                    minLength={30}
                    maxLength={2000}
                    rows={5}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain your role and why you need access to UtsavZero's civic planning tools..."
                    className="w-full resize-y rounded-xl border border-[#EADCC9] px-4 py-3 text-sm text-[#38231C] outline-none focus:border-[#F0440A]"
                  />
                  <p className="mt-1 text-right text-xs text-[#806B5D]">
                    {reason.length}/2000
                  </p>
                </div>

                {error && (
                  <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] py-3 font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
                >
                  {submitting && <Loader2 size={19} className="animate-spin" />}
                  {submitting ? "Submitting application..." : "Submit for Review"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
