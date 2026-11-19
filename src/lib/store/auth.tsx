"use client";

import * as React from "react";
import type { UserProfile } from "@/lib/types";
import { KEYS, readJSON, writeJSON } from "./storage";

interface AuthContextValue {
  user: UserProfile | null;
  ready: boolean;
  login(email: string, password: string): Promise<UserProfile>;
  loginWithGoogle(): Promise<UserProfile>;
  signup(name: string, email: string, password: string): Promise<UserProfile>;
  logout(): void;
  updateProfile(patch: Partial<UserProfile>): void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export const DEMO_EMAIL = "demo@craftiq.app";

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message ?? "Something went wrong. Please try again.");
  return data as T;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setUser(readJSON<UserProfile | null>(KEYS.user, null));
    setReady(true);
  }, []);

  const persist = React.useCallback((u: UserProfile | null) => {
    setUser(u);
    writeJSON(KEYS.user, u);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      async login(email, password) {
        const { user: u } = await post<{ user: UserProfile }>("/api/auth/login", { email, password });
        const existing = readJSON<UserProfile | null>(KEYS.user, null);
        const merged = existing?.email === u.email ? existing : u.email === DEMO_EMAIL ? { ...u, name: "Demo Maker", country: "United States", interests: ["Arduino", "Low-Cost Alternatives"] as UserProfile["interests"] } : u;
        persist(merged);
        return merged;
      },
      async loginWithGoogle() {
        // Placeholder: a real build would redirect to Google OAuth via Auth.js.
        const { user: u } = await post<{ user: UserProfile }>("/api/auth/login", { email: "google.maker@craftiq.app", password: "oauth-placeholder", provider: "google" });
        const g = { ...u, name: "Google Maker", provider: "google" as const };
        persist(g);
        return g;
      },
      async signup(name, email, password) {
        const { user: u } = await post<{ user: UserProfile }>("/api/auth/signup", { name, email, password });
        persist(u);
        return u;
      },
      logout() {
        persist(null);
      },
      updateProfile(patch) {
        setUser((prev) => {
          if (!prev) return prev;
          const next = { ...prev, ...patch };
          writeJSON(KEYS.user, next);
          return next;
        });
      },
    }),
    [user, ready, persist]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
