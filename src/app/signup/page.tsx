
"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  UserRound,
  Building2,
  ShieldCheck,
  Mail,
  Lock,
  Loader2,
} from "lucide-react";
import { useAuth, type SignupRole } from "@/context/AuthContext";

const accountTypes: {
  role: SignupRole;
  title: string;
  description: string;
  icon: typeof UserRound;
  note: string;
}[] = [
  {
    role: "citizen",
    title: "Citizen",
    description: "Discover events, book tickets and participate in cleaner celebrations.",
    icon: UserRound,
    note: "Create your personal UtsavZero account.",
  },
  {
    role: "government_personnel",
    title: "Government Personnel",
    description: "Apply for verified government organizer access.",
    icon: ShieldCheck,
    note: "Government access requires review and approval by the designated reviewer.",
  },
  {
    role: "private_organizer",
    title: "Private Organizer",
    description: "Host and manage private, firecracker-free community events.",
    icon: Building2,
    note: "You can manage events after registration.",
  },
];

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, signInWithGoogle } = useAuth();

  const roleParam = searchParams.get("role");

  const selectedRole = accountTypes.find(
    (item) => item.role === roleParam
  )?.role;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!selectedRole) return;

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(
        email.trim(),
        password,
        fullName.trim(),
        selectedRole
      );

      if (result.error) {
        setError(result.error.message);
        return;
      }

      const destination =
        selectedRole === "government_personnel"
          ? "/government-authorization/apply"
          : selectedRole === "private_organizer"
          ? "/organizer"
          : "/profile";

      if (result.session && result.user) {
        router.replace(destination);
        router.refresh();
        return;
      }

      if (result.user && !result.session) {
        router.replace(
          `/verify-email?email=${encodeURIComponent(email.trim())}`
        );
        return;
      }

      setError("Signup could not be completed. Please try again.");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const { error } = await signInWithGoogle("/profile");

      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error("Google signup error:", err);
      setError("Unable to start Google sign-in. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-[#FFF8EB] px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-[#EADCC9] bg-white p-6 shadow-xl sm:p-9">

        {!selectedRole ? (
          <>
            <div className="mb-8 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F0440A]">
                Welcome to UtsavZero
              </p>

              <h1 className="text-3xl font-bold text-[#38231C]">
                Join the celebration
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#806B5D]">
                Choose how you want to participate in cleaner celebrations.
              </p>
            </div>

            <div className="space-y-3">
              {accountTypes.map((account) => {
                const Icon = account.icon;

                return (
                  <Link
                    key={account.role}
                    href={`/signup?role=${account.role}`}
                    className="group flex items-center gap-4 rounded-2xl border border-[#EADCC9] p-4 transition hover:border-[#F0440A] hover:bg-[#FFF8EB] sm:p-5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF0D8] text-[#F0440A]">
                      <Icon size={23} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-[#38231C]">
                        {account.title}
                      </h2>
                      <p className="mt-1 text-xs leading-5 text-[#806B5D]">
                        {account.description}
                      </p>
                    </div>

                    <ArrowRight
                      size={20}
                      className="shrink-0 text-[#A58B78] transition group-hover:translate-x-1 group-hover:text-[#F0440A]"
                    />
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <Link
              href="/signup"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#806B5D] hover:text-[#F0440A]"
            >
              <ArrowLeft size={16} />
              Change account type
            </Link>

            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F0440A]">
                Create your account
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#38231C]">
                {accountTypes.find((item) => item.role === selectedRole)?.title}
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#806B5D]">
                {accountTypes.find((item) => item.role === selectedRole)?.note}
              </p>
            </div>

            {selectedRole === "citizen" && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={googleLoading || loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#EADCC9] px-4 py-3 font-medium text-[#38231C] transition hover:bg-[#FFF8EB] disabled:opacity-60"
                >
                  {googleLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <svg viewBox="0 0 48 48" className="h-5 w-5">
                      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.7 9.5 24 9.5Z" />
                      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.2-3.2-.5-4.7H24v9h12.4c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7-10.1 7-17.3Z" />
                      <path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.8l7.8-6.1Z" />
                      <path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.4-5.8l-7.5-5.8c-2.1 1.4-4.8 2.2-7.9 2.2-6.3 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48Z" />
                    </svg>
                  )}
                  Continue with Google
                </button>

                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#EADCC9]" />
                  <span className="text-xs text-[#806B5D]">
                    OR SIGN UP WITH EMAIL
                  </span>
                  <div className="h-px flex-1 bg-[#EADCC9]" />
                </div>
              </>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-[#38231C]">
                  Full name
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-[#EADCC9] px-4">
                  <UserRound size={18} className="text-[#806B5D]" />
                  <input
                    id="fullName"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-transparent py-3 text-sm text-[#38231C] outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#38231C]">
                  Email address
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-[#EADCC9] px-4">
                  <Mail size={18} className="text-[#806B5D]" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent py-3 text-sm text-[#38231C] outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#38231C]">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-[#EADCC9] px-4">
                  <Lock size={18} className="text-[#806B5D]" />
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-transparent py-3 text-sm text-[#38231C] outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[#38231C]">
                  Confirm password
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-[#EADCC9] px-4">
                  <Lock size={18} className="text-[#806B5D]" />
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full bg-transparent py-3 text-sm text-[#38231C] outline-none"
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A] py-3 font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
              >
                {loading && <Loader2 size={19} className="animate-spin" />}
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </>
        )}

        <p className="mt-7 text-center text-sm text-[#806B5D]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#F0440A] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#FFF8EB]" />}>
      <SignupContent />
    </Suspense>
  );
}
