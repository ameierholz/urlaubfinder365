"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { UserProfile } from "@/types";
import { createBrowserClient } from "@supabase/ssr";

// Kompatibilitäts-Wrapper: gleiche API wie Firebase-User für alle Komponenten
export interface AppUser {
  uid: string;            // = Supabase user.id
  id: string;             // = Supabase user.id
  email: string | null;
  displayName: string | null; // = user_metadata.full_name
  photoURL: string | null;    // = user_metadata.avatar_url
  metadata: { creationTime?: string };
}

interface AuthContextType {
  user: AppUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function mapToAppUser(supabaseUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): AppUser {
  const displayName =
    (supabaseUser.user_metadata?.full_name as string | undefined) ??
    (supabaseUser.user_metadata?.name as string | undefined) ??
    null;
  const photoURL = (supabaseUser.user_metadata?.avatar_url as string | undefined) ?? null;
  const creationTime = (supabaseUser as { created_at?: string }).created_at;
  return {
    uid: supabaseUser.id,
    id: supabaseUser.id,
    email: supabaseUser.email ?? null,
    displayName,
    photoURL,
    metadata: { creationTime },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", uid)
      .maybeSingle();
    if (!data) return null;
    // Supabase snake_case → UserProfile camelCase
    return {
      uid: data.id,
      email: data.email,
      displayName: data.display_name,
      createdAt: data.created_at,
      savedTrips: data.saved_trips ?? [],
      favoriteDestinations: data.favorite_destinations ?? [],
      preferences: data.preferences,
      checklist: data.checklist,
      notes: data.notes,
    } as UserProfile;
  };

  const ensureProfile = async (
    uid: string,
    email: string,
    displayName: string | null
  ): Promise<UserProfile | null> => {
    const supabase = getSupabase();
    const existing = await fetchProfile(uid);
    if (existing) return existing;

    await supabase.from("user_profiles").insert({
      id: uid,
      email,
      display_name: displayName,
      created_at: new Date().toISOString(),
      saved_trips: [],
      favorite_destinations: [],
    });
    return fetchProfile(uid);
  };

  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const su = session?.user ?? null;
      if (su) {
        const appUser = mapToAppUser(su);
        setUser(appUser);
        setUserProfile(await fetchProfile(su.id));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const su = session?.user ?? null;
      if (su) {
        const appUser = mapToAppUser(su);
        setUser(appUser);
        setUserProfile(await fetchProfile(su.id));
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (email: string, password: string, name: string) => {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw error;
    if (data.user) {
      const profile = await ensureProfile(data.user.id, email, name);
      setUserProfile(profile);
    }
  };

  const loginWithGoogle = async () => {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  };

  const logout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
  };

  const refreshProfile = async () => {
    if (user) setUserProfile(await fetchProfile(user.uid));
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, register, loginWithGoogle, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth muss innerhalb von AuthProvider verwendet werden");
  return ctx;
}
