"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DEMO_EMAIL, useAuth } from "@/lib/store/auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const { login, signup, loginWithGoogle } = useAuth();
  const [busy, setBusy] = React.useState<null | "form" | "google" | "demo">(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [formError, setFormError] = React.useState<string | null>(null);

  function validate(fd: FormData) {
    const e: Record<string, string> = {};
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    if (mode === "signup" && String(fd.get("name") ?? "").trim().length < 2) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address.";
    if (mode === "signup" && password.length < 8) e.password = "Use at least 8 characters.";
    if (mode === "login" && !password) e.password = "Please enter your password.";
    return e;
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const e = validate(fd);
    setErrors(e);
    setFormError(null);
    if (Object.keys(e).length) return;
    setBusy("form");
    try {
      if (mode === "signup") {
        await signup(String(fd.get("name")), String(fd.get("email")), String(fd.get("password")));
        toast.success("Welcome to CraftIQ!");
        router.push(`/onboarding${next ? `?next=${encodeURIComponent(next)}` : ""}`);
      } else {
        const u = await login(String(fd.get("email")), String(fd.get("password")));
        toast.success(`Welcome back, ${u.name.split(" ")[0]}!`);
        router.push(next ?? "/dashboard");
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  async function google() {
    setBusy("google");
    try {
      await loginWithGoogle();
      toast.info("Google sign-in is a placeholder in this prototype. You're signed in with a demo Google account.");
      router.push(next ?? "/dashboard");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setBusy(null);
    }
  }

  async function demo() {
    setBusy("demo");
    try {
      await login(DEMO_EMAIL, "demo-password");
      router.push(next ?? "/dashboard");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't open the demo account.");
    } finally {
      setBusy(null);
    }
  }

  const field = (name: string, label: string, type: string, autoComplete: string, placeholder?: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} autoComplete={autoComplete} placeholder={placeholder} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-err` : undefined} />
      {errors[name] && <p id={`${name}-err`} className="text-xs text-rose-300">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:py-20">
      <div className="glass glow-border rounded-2xl p-6 sm:p-8">
        <div className="mb-6 text-center">
          <LogoMark className="mx-auto size-11" />
          <h1 className="mt-4 text-2xl font-bold">{mode === "signup" ? "Create your maker account" : "Welcome back, maker"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{mode === "signup" ? "Save projects, track progress and get personalised plans." : "Log in to see your saved projects."}</p>
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={google} disabled={!!busy}>
          {busy === "google" ? <Loader2 className="animate-spin" /> : <GoogleIcon />} Continue with Google
        </Button>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><Separator className="flex-1" />or<Separator className="flex-1" /></div>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {mode === "signup" && field("name", "Name", "text", "name", "Ada Lovelace")}
          {field("email", "Email", "email", "email", "you@example.com")}
          {field("password", "Password", "password", mode === "signup" ? "new-password" : "current-password", mode === "signup" ? "At least 8 characters" : undefined)}
          {formError && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-rose-200">{formError}</p>}
          <Button type="submit" className="w-full" disabled={!!busy}>
            {busy === "form" && <Loader2 className="animate-spin" />} {mode === "signup" ? "Create account" : "Log in"}
          </Button>
        </form>

        {mode === "login" && (
          <Button type="button" variant="ghost" className="mt-3 w-full text-neon" onClick={demo} disabled={!!busy}>
            {busy === "demo" ? <Loader2 className="animate-spin" /> : <Sparkles />} Try the demo account
          </Button>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account? " : "New to CraftIQ? "}
          <Link className="font-medium text-electric hover:underline" href={`${mode === "signup" ? "/login" : "/signup"}${next ? `?next=${encodeURIComponent(next)}` : ""}`}>
            {mode === "signup" ? "Log in" : "Sign up free"}
          </Link>
        </p>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">Prototype: accounts are stored in your browser only.</p>
    </div>
  );
}
