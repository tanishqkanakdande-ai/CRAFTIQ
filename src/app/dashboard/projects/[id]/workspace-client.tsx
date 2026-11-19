"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { ArrowLeft, Check, FileQuestion, NotebookPen, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PlanView } from "@/components/plan/plan-view";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/store/auth";
import { progressPercent, useProjects } from "@/lib/store/projects";

export function WorkspaceClient({ id }: { id: string }) {
  const router = useRouter();
  const { user, ready: authReady } = useAuth();
  const { get, ready, setNotes, remove } = useProjects();
  const project = get(id);
  const [notes, setLocalNotes] = React.useState("");
  const [savedAt, setSavedAt] = React.useState<number | null>(null);
  const loaded = React.useRef(false);

  React.useEffect(() => {
    if (project && !loaded.current) {
      setLocalNotes(project.progress.notes);
      loaded.current = true;
    }
  }, [project]);

  React.useEffect(() => {
    if (!project || notes === project.progress.notes) return;
    const t = setTimeout(() => { setNotes(id, notes); setSavedAt(Date.now()); }, 600);
    return () => clearTimeout(t);
  }, [notes, id, project, setNotes]);

  if (!authReady || (user && !ready)) return <div className="mx-auto max-w-7xl px-4 py-10"><Skeleton className="h-72" /></div>;
  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState icon={FileQuestion} title="Project not found" description={user ? "It may have been removed from your dashboard." : "Log in to open your saved projects."}>
          <Button asChild><Link href={user ? "/dashboard" : "/login?next=/dashboard"}>{user ? "Back to dashboard" : "Log in"}</Link></Button>
        </EmptyState>
      </div>
    );
  }

  const pct = progressPercent(project);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm"><Link href="/dashboard"><ArrowLeft /> Dashboard</Link></Button>
          <Button variant="ghost" size="sm" className="text-rose-300" onClick={() => { remove(id); toast(`Removed “${project.plan.title}”`); router.push("/dashboard"); }}><Trash2 /> Remove</Button>
        </div>
        <section id="notes-panel" aria-labelledby="notes-title" className="mt-4 scroll-mt-24 rounded-xl border border-border bg-card/70 p-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 id="notes-title" className="flex items-center gap-2 font-semibold"><NotebookPen className="size-4 text-electric" aria-hidden /> My build notes</h2>
            <span className="text-xs text-muted-foreground" aria-live="polite">{savedAt ? <span className="inline-flex items-center gap-1 text-neon"><Check className="size-3" aria-hidden /> Saved</span> : `${pct}% complete`}</span>
          </div>
          <Textarea value={notes} onChange={(e) => setLocalNotes(e.target.value)} placeholder="Measurements, ideas, what worked, what to try next…" aria-labelledby="notes-title" className="min-h-20" />
        </section>
      </div>
      <PlanView plan={project.plan} savedId={id} />
    </>
  );
}
