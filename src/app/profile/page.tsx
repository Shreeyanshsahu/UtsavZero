
"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, profile } = useAuth();

  return (
    <main className="min-h-screen bg-[#FFF8EB] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-[#38231C]">
          Welcome, {profile?.full_name || user?.email}!
        </h1>

        <p className="mt-2 text-[#806B5D]">
          Your UtsavZero dashboard.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {["My Bookings", "Saved Events", "My Profile"].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-[#EADCC9] bg-white p-6 shadow-sm"
            >
              <h2 className="font-semibold text-[#38231C]">{item}</h2>
              <p className="mt-2 text-sm text-[#806B5D]">
                Coming soon.
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
