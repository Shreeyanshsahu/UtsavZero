
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type AppRole =
  | "citizen"
  | "private_organizer"
  | "civic_demo_admin";

type UserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  roles: AppRole[];
  loading: boolean;

  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{
    error: Error | null;
    session: Session | null;
    user: User | null;
  }>;

  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;

  signOut: () => Promise<{ error: Error | null }>;

  refreshProfile: () => Promise<void>;

  signInWithGoogle: () => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | null>(null);
const supabase = createClient();

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, full_name, phone, avatar_url")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Profile load error:", profileError);
      setProfile(null);
      setRoles([]);
      return;
    }

    setProfile(profileData);

    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (roleError) {
      console.error("Role load error:", roleError);
      setRoles([]);
      return;
    }

    setRoles((roleData ?? []).map((item) => item.role as AppRole));
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id);
    }
  }, [user, loadProfile]);

  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        setUser(null);
        setProfile(null);
        setRoles([]);
        setLoading(false);
        return;
      }

      setUser(data.user);
      await loadProfile(data.user.id);

      if (active) setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;

      if (event === "INITIAL_SESSION") return;

      if (!session?.user) {
        setUser(null);
        setProfile(null);
        setRoles([]);
        setLoading(false);
        return;
      }

      setUser(session.user);

      // Defer database queries until after the auth callback.
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        setTimeout(() => {
          if (active) {
            loadProfile(session.user.id);
          }
        }, 0);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    return {
      error,
      session: data.session,
      user: data.user,
    };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        roles,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
