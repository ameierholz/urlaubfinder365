"use client";

// Typ-only-Import – wird zur Laufzeit wegkompiliert, kein Bundle-Impact
import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { UserProfile } from "@/types";

// Alle Firebase-Laufzeit-Imports sind DYNAMISCH → kein Code im Initial-Bundle

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    const initAuth = async () => {
      // Firebase-Bundle wird erst hier geladen (separater Chunk, kein Initial-Bundle)
      const [{ onAuthStateChanged }, { auth }, { getUserProfile }] = await Promise.all([
        import("firebase/auth"),
        import("@/lib/firebase"),
        import("@/lib/firestore"),
      ]);

      unsub = onAuthStateChanged(auth(), async (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      });
    };

    // Firebase erst nach Idle-Phase laden → kein kritischer Pfad
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ric = (window as any).requestIdleCallback;
    if (typeof ric === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = ric(initAuth, { timeout: 2000 });
      return () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).cancelIdleCallback(id);
        unsub?.();
      };
    } else {
      // Safari-Fallback
      const t = setTimeout(initAuth, 1);
      return () => { clearTimeout(t); unsub?.(); };
    }
  }, []);

  const login = async (email: string, password: string) => {
    const [{ signInWithEmailAndPassword }, { auth }] = await Promise.all([
      import("firebase/auth"),
      import("@/lib/firebase"),
    ]);
    await signInWithEmailAndPassword(auth(), email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    const [
      { createUserWithEmailAndPassword, updateProfile },
      { auth },
      { createUserProfile },
    ] = await Promise.all([
      import("firebase/auth"),
      import("@/lib/firebase"),
      import("@/lib/firestore"),
    ]);
    const cred = await createUserWithEmailAndPassword(auth(), email, password);
    await updateProfile(cred.user, { displayName: name });
    const profile = await createUserProfile(cred.user.uid, email, name);
    setUserProfile(profile);
  };

  const loginWithGoogle = async () => {
    const [
      { GoogleAuthProvider, signInWithPopup },
      { auth },
      { getUserProfile, createUserProfile },
    ] = await Promise.all([
      import("firebase/auth"),
      import("@/lib/firebase"),
      import("@/lib/firestore"),
    ]);
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth(), provider);
    const existing = await getUserProfile(cred.user.uid);
    if (!existing) {
      const profile = await createUserProfile(
        cred.user.uid,
        cred.user.email!,
        cred.user.displayName
      );
      setUserProfile(profile);
    } else {
      setUserProfile(existing);
    }
  };

  const logout = async () => {
    const [{ signOut }, { auth }] = await Promise.all([
      import("firebase/auth"),
      import("@/lib/firebase"),
    ]);
    await signOut(auth());
    setUserProfile(null);
  };

  const refreshProfile = async () => {
    const { auth } = await import("@/lib/firebase");
    const { getUserProfile } = await import("@/lib/firestore");
    const firebaseUser = auth().currentUser;
    if (firebaseUser) {
      const profile = await getUserProfile(firebaseUser.uid);
      setUserProfile(profile);
    }
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
