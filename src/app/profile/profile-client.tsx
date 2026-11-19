"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { LogIn, LogOut, Save } from "lucide-react";
import { InterestPicker, LocationPicker, SkillPicker, ToolPicker } from "@/components/auth/profile-fields";
import { EmptyState } from "@/components/common/empty-state";
import { initials } from "@/components/layout/site-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/store/auth";
import { useProjects } from "@/lib/store/projects";
import type { UserProfile } from "@/lib/types";

export function ProfileClient() {
  const router = useRouter();
  const { user, ready, updateProfile, logout } = useAuth();
  const { projects } = useProjects();
  const [draft, setDraft] = React.useState<UserProfile | null>(null);

  React.useEffect(() => { if (user) setDraft(user); }, [user]);

  if (!ready) return <div className="mx-auto max-w-3xl px-4 py-12"><Skeleton className="h-96" /></div>;
  if (!user || !draft) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState icon={LogIn} title="You're not logged in" description="Log in to edit your maker profile.">
          <Button asChild><Link href="/login?next=/profile">Log in</Link></Button>
        </EmptyState>
      </div>
    );
  }

  const set = (patch: Partial<UserProfile>) => setDraft((d) => (d ? { ...d, ...patch } : d));
  const nameError = draft.name.trim().length < 2;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar className="size-16"><AvatarFallback className="text-lg">{initials(user.name)}</AvatarFallback></Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="truncate text-sm text-muted-foreground">{user.email} · signed in with {user.provider === "google" ? "Google" : "email"}</p>
        </div>
        <Badge variant="neon">{projects.length} saved project{projects.length === 1 ? "" : "s"}</Badge>
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (nameError) return;
          updateProfile({ ...draft, name: draft.name.trim(), onboarded: true });
          toast.success("Profile saved");
        }}
      >
        <Card>
          <CardHeader><CardTitle>Account</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            <Label htmlFor="pname">Display name</Label>
            <Input id="pname" value={draft.name} onChange={(e) => set({ name: e.target.value })} aria-invalid={nameError} />
            {nameError && <p className="text-xs text-rose-300">Name must be at least 2 characters.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Skill level</CardTitle><CardDescription>Changes how the mentor explains things.</CardDescription></CardHeader>
          <CardContent><SkillPicker value={draft.skillLevel} onChange={(skillLevel) => set({ skillLevel })} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Interests</CardTitle></CardHeader>
          <CardContent><InterestPicker value={draft.interests} onChange={(interests) => set({ interests })} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tools you own</CardTitle></CardHeader>
          <CardContent><ToolPicker value={draft.tools} onChange={(tools) => set({ tools })} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Location & currency</CardTitle></CardHeader>
          <CardContent><LocationPicker country={draft.country} currency={draft.currency} onChange={(v) => set(v)} /></CardContent>
        </Card>
        <div className="flex flex-wrap justify-between gap-3">
          <Button type="button" variant="outline" onClick={() => { logout(); router.push("/"); }}><LogOut /> Log out</Button>
          <Button type="submit" disabled={nameError}><Save /> Save changes</Button>
        </div>
      </form>
    </div>
  );
}
