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
  rolle?: string;         // = user_metadata.rolle (z.B. "anbieter")
}

interface AuthContextType {
  user: AppUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ needsConfirmation: boolean }>;
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
  const rolle = (supabaseUser.user_metadata?.rolle as string | undefined) ?? undefined;
  return {
    uid: supabaseUser.id,
    id: supabaseUser.id,
    email: supabaseUser.email ?? null,
    displayName,
    photoURL,
    metadata: { creationTime },
    rolle,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("users")
      .select("id, display_name, avatar_url, created_at, bio, xp, level, notification_prefs")
      .eq("id", uid)
      .maybeSingle();
    if (error || !data) return null;
    // Supabase users table → UserProfile camelCase
    return {
      uid: data.id,
      email: "",          // not stored in users table; use auth.user.email instead
      displayName: data.display_name ?? null,
      createdAt: data.created_at,
      savedTrips: [],     // stored in saved_trips table (Firestore legacy)
      favoriteDestinations: [],
      preferences: data.notification_prefs ?? undefined,
      checklist: undefined,
      notes: data.bio ?? undefined,
    } as UserProfile;
  };

  const ensureProfile = async (
    uid: string,
    _email: string,
    displayName: string | null
  ): Promise<UserProfile | null> => {
    // The Supabase trigger handle_new_user() auto-creates the users row.
    // We just check and return the profile.
    const existing = await fetchProfile(uid);
    if (existing) return existing;

    // Fallback: manual insert if trigger didn't fire (e.g. Google OAuth)
    const supabase = getSupabase();
    await supabase.from("users").upsert({
      id: uid,
      display_name: displayName,
    }, { onConflict: "id", ignoreDuplicates: true });
    return fetchProfile(uid);
  };

  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const su = session?.user ?? null;
      if (su) {
        const appUser = mapToAppUser(su);
        setUser(appUser);
        fetchProfile(su.id).then(setUserProfile).catch(() => {}).finally(() => setLoading(false));
      } else {
        setUser(null);
        setLoading(false);
      }
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const su = session?.user ?? null;
      if (su) {
        const appUser = mapToAppUser(su);
        setUser(appUser);
        fetchProfile(su.id).then(setUserProfile).catch(() => {});
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

  const register = async (email: string, password: string, name: string): Promise<{ needsConfirmation: boolean }> => {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw error;
    // session is null when email confirmation is required
    const needsConfirmation = !data.session;
    if (data.user && data.session) {
      // Immediately logged in (email confirmation disabled)
      const profile = await ensureProfile(data.user.id, email, name);
      setUserProfile(profile);
    }
    return { needsConfirmation };
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
