
"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = async () => {
    if (!email) {
      setError("Email address is missing. Please sign up again.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Verification email sent. Please check your inbox.");
      }
    } catch {
      setError("Unable to resend the email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-[#FFF8EB] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#EADCC9] bg-white p-8 text-center shadow-xl sm:p-10">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
          <Mail size={38} className="text-[#F0440A]" />
        </div>

        <h1 className="text-3xl font-bold text-[#38231C]">
          Verify your email
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#806B5D]">
          You&apos;re almost there! We&apos;ve sent a verification link to:
        </p>

        <p className="mt-3 break-all font-semibold text-[#38231C]">
          {email || "Your registered email"}
        </p>

        <p className="mt-5 text-sm leading-6 text-[#806B5D]">
          Open your inbox and click the verification link to activate
          your UtsavZero account. You can continue once your email
          has been verified.
        </p>

        <div className="mt-7 rounded-xl bg-[#FFF8EB] p-4 text-left text-sm text-[#806B5D]">
          <p className="font-semibold text-[#38231C]">
            Didn&apos;t receive the email?
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Check your spam or junk folder.</li>
            <li>Make sure your email address is correct.</li>
            <li>Try requesting another verification email.</li>
          </ul>
        </div>

        {message && (
          <p role="status" className="mt-5 flex items-center justify-center gap-2 text-sm text-green-700">
            <CheckCircle2 size={18} />
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={handleResend}
          disabled={loading || !email}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] py-3 font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
        >
          {loading && <Loader2 size={19} className="animate-spin" />}
          {loading ? "Sending..." : "Resend verification email"}
        </button>

        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-semibold text-[#F0440A] hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#FFF8EB]" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
