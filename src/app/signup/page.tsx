
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRound, Mail, Lock, Loader2 } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const { signUp, signInWithGoogle } = useAuth();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

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
            const { error, session, user } = await signUp(
                email.trim(),
                password,
                fullName.trim()
            );

            if (error) {
                setError(error.message);
                return;
            }

            if (session && user) {
                // Signup immediately created an authenticated session.
                router.replace("/");
                router.refresh();
                return;
            }

            if (user && !session) {
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
            const { error } = await signInWithGoogle();

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
            <div className="w-full max-w-md rounded-3xl border border-[#EADCC9] bg-white p-7 shadow-xl sm:p-9">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#38231C]">
                        Join UtsavZero
                    </h1>
                    <p className="mt-2 text-sm text-[#806B5D]">
                        Create your account and discover cleaner celebrations.
                    </p>
                </div>

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
                    <span className="text-xs text-[#806B5D]">OR SIGN UP WITH EMAIL</span>
                    <div className="h-px flex-1 bg-[#EADCC9]" />
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-[#38231C]">
                            Full name
                        </label>
                        <div className="flex items-center gap-3 rounded-xl border border-[#EADCC9] px-4">
                            <UserRound size={18} className="text-[#806B5D]" />
                            <input
                                id="fullName"
                                type="text"
                                required
                                autoComplete="name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
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
                                onChange={(e) => setEmail(e.target.value)}
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
                                onChange={(e) => setPassword(e.target.value)}
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
                                onChange={(e) => setConfirmPassword(e.target.value)}
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

                    {success && (
                        <div role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            {success}
                            <Link href="/login" className="mt-2 block font-semibold underline">
                                Go to Login
                            </Link>
                        </div>
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
