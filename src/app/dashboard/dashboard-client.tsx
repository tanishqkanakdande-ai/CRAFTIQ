"use client";

import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { ArrowRight, Bookmark, CheckCircle2, Compass, FolderOpen, ListChecks, LogIn, NotebookPen, Package, Sparkles } from "lucide-react";
import { SavedProjectCard } from "@/components/dashboard/saved-project-card";
import { EmptyState } from "@/components/common/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { projects as catalogue } from "@/lib/data/projects";
import { useAuth } from "@/lib/store/auth";
import { progressPercent, useProjects } from "@/lib/store/projects";
import { formatMoney } from "@/lib/utils";

export function DashboardClient() {
  const { user, ready: authReady } = useAuth();
  const { projects, ready, remove, save } = useProjects();

  if (!authReady || (user && !ready)) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-12 sm:px-6" aria-busy>
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState icon={LogIn} title="Log in to see your dashboard" description="Save projects, track your build progress, tick off parts and keep notes, all in one place.">
          <Button asChild><Link href="/login?next=/dashboard">Log in</Link></Button>
          <Button asChild variant="outline"><Link href="/signup?next=/dashboard">Create free account</Link></Button>
        </EmptyState>
      </div>
    );
  }

  const current = [...projects].filter((p) => progressPercent(p) < 100).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const stepsDone = projects.reduce((s, p) => s + p.progress.completedSteps.length, 0);
  const totalSteps = projects.reduce((s, p) => s + p.plan.steps.length, 0);
  const itemsDone = projects.reduce((s, p) => s + p.progress.checkedItems.length, 0);
  const totalItems = projects.reduce((s, p) => s + p.plan.components.length, 0);
  const bookmarks = projects.flatMap((p) => p.plan.components.filter((c) => p.progress.bookmarkedComponents.includes(c.id)).map((c) => ({ c, p })));
  const notes = projects.filter((p) => p.progress.notes.trim());
  const recommended = catalogue
    .filter((p) => !projects.some((s) => s.plan.slug === p.slug))
    .sort((a, b) => b.categories.filter((c) => user.interests.includes(c)).length - a.categories.filter((c) => user.interests.includes(c)).length)
    .slice(0, 3);
  const nextStep = current?.plan.steps.find((s) => !current.progress.completedSteps.includes(s.id));

  function handleDelete(id: string, title: string) {
    const removed = projects.find((p) => p.id === id);
    remove(id);
    toast(`Removed “${title}”`, { action: removed ? { label: "Undo", onClick: () => save(removed.plan) } : undefined });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-3xl font-bold sm:text-4xl">{user.name} <span aria-hidden>⚡</span></h1>
        </div>
        <Button asChild variant="neon"><Link href="/builder"><Sparkles /> New project</Link></Button>
      </div>

      {!user.onboarded && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet/40 bg-violet/10 p-4">
          <p className="text-sm">Finish your maker profile so the AI can skip questions and price things in your currency.</p>
          <Button asChild size="sm"><Link href="/onboarding?next=/dashboard">Complete profile</Link></Button>
        </div>
      )}

      <dl className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FolderOpen} label="Saved projects" value={projects.length} />
        <StatCard icon={ListChecks} label="Steps completed" value={`${stepsDone}/${totalSteps}`} />
        <StatCard icon={Package} label="Parts collected" value={`${itemsDone}/${totalItems}`} />
        <StatCard icon={Bookmark} label="Bookmarked parts" value={bookmarks.length} />
      </dl>

      {projects.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No saved projects yet" description="Describe an idea to the AI builder, or pick a starter project, then hit “Save Project” to track it here.">
          <Button asChild><Link href="/builder"><Sparkles /> Start building</Link></Button>
          <Button asChild variant="outline"><Link href="/explore"><Compass /> Explore projects</Link></Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            {current && (
              <section aria-labelledby="current-build" className="glass glow-border rounded-2xl p-6">
                <p id="current-build" className="text-xs font-semibold uppercase tracking-[0.2em] text-neon">Current build</p>
                <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold">{current.plan.emoji} {current.plan.title}</h2>
                    {nextStep && <p className="mt-1 text-sm text-muted-foreground">Next up: <span className="text-foreground">{nextStep.title}</span> · {nextStep.minutes} min</p>}
                  </div>
                  <Button asChild><Link href={`/dashboard/projects/${current.id}`}>Continue <ArrowRight /></Link></Button>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <Progress value={progressPercent(current)} aria-label="Current build progress" />
                  <span className="font-display text-lg font-bold">{progressPercent(current)}%</span>
                </div>
              </section>
            )}

            <section aria-labelledby="saved-projects">
              <h2 id="saved-projects" className="mb-4 text-xl font-bold">Saved projects</h2>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {projects.map((p) => <SavedProjectCard key={p.id} project={p} onDelete={() => handleDelete(p.id, p.plan.title)} />)}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section aria-labelledby="bookmarks" className="rounded-xl border border-border bg-card/70 p-5">
              <h2 id="bookmarks" className="flex items-center gap-2 font-semibold"><Bookmark className="size-4 text-neon" aria-hidden /> Bookmarked components</h2>
              {bookmarks.length ? (
                <ul className="mt-3 divide-y divide-border">
                  {bookmarks.map(({ c, p }) => (
                    <li key={p.id + c.id} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{c.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{p.plan.title}</p>
                      </div>
                      <span className="shrink-0 text-xs text-neon">{c.unitPriceUSD ? formatMoney(c.unitPriceUSD * c.qty, user.currency) : "Free"}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Bookmark parts in any plan to keep them handy here.</p>
              )}
            </section>
            <section aria-labelledby="notes" className="rounded-xl border border-border bg-card/70 p-5">
              <h2 id="notes" className="flex items-center gap-2 font-semibold"><NotebookPen className="size-4 text-electric" aria-hidden /> Recent notes</h2>
              {notes.length ? (
                <ul className="mt-3 space-y-3">
                  {notes.map((p) => (
                    <li key={p.id}>
                      <Link href={`/dashboard/projects/${p.id}#notes-panel`} className="block rounded-lg border border-border p-3 text-sm transition hover:border-electric/50">
                        <p className="text-xs font-medium text-electric">{p.plan.title}</p>
                        <p className="mt-1 line-clamp-3 text-muted-foreground">{p.progress.notes}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Notes you add to a project show up here.</p>
              )}
            </section>
            {projects.some((p) => progressPercent(p) === 100) && (
              <p className="flex items-center gap-2 rounded-xl border border-neon/30 bg-neon/5 p-4 text-sm"><CheckCircle2 className="size-4 text-neon" aria-hidden /> You've finished {projects.filter((p) => progressPercent(p) === 100).length} build(s). Amazing!</p>
            )}
          </aside>
        </div>
      )}

      {recommended.length > 0 && (
        <section className="mt-12" aria-labelledby="recommended">
          <h2 id="recommended" className="mb-4 text-xl font-bold">Recommended for you</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{recommended.map((p) => <ProjectCard key={p.id} plan={p} />)}</div>
        </section>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 p-4">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="size-3.5 text-electric" aria-hidden />{label}</dt>
      <dd className="mt-1 font-display text-2xl font-bold">{value}</dd>
    </div>
  );
}
