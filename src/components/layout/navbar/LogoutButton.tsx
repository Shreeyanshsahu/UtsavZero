
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LogoutButtonProps {
  isDarkMode: boolean;
}

export default function LogoutButton({
  isDarkMode,
}: LogoutButtonProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    const { error } = await signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      setLoading(false);
      return;
    }

    router.replace("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      aria-label="Sign out"
      title="Sign out"
      className={`
        flex h-11 w-11 shrink-0 items-center justify-center
        rounded-full transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md
        disabled:cursor-not-allowed disabled:opacity-50
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-[#FF8A32]
        ${
          isDarkMode
            ? "bg-[#292E2B] text-[#FFF8EB] hover:bg-[#343B36]"
            : "bg-[#FFF0D8] text-[#38231C] hover:bg-[#FFE5C0]"
        }
      `}
    >
      {loading ? (
        <Loader2 size={19} className="animate-spin" />
      ) : (
        <LogOut size={19} strokeWidth={2} />
      )}
    </button>
  );
}
