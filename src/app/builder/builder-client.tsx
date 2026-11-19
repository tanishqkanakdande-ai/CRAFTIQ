"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { AlertCircle, RotateCcw, Sparkles } from "lucide-react";
import { IdeaPrompt } from "@/components/builder/idea-prompt";
import { type Answers, ClarifyPanel, answersToPrefs } from "@/components/builder/clarify-panel";
import { GeneratingState } from "@/components/builder/generating-state";
import { PlanView } from "@/components/plan/plan-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/store/auth";
import { KEYS, readJSON, writeJSON } from "@/lib/store/storage";
import type { BuildPreferences, ClarifyResponse, ProjectPlan } from "@/lib/types";

type Phase =
  | { name: "idle" }
  | { name: "clarifying"; idea: string }
  | { name: "questions"; idea: string; clarify: ClarifyResponse }
  | { name: "generating"; idea: string }
  | { name: "plan"; idea: string; plan: ProjectPlan }
  | { name: "error"; idea: string; message: string; retry: () => void };

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error?.message ?? "The mentor is unavailable right now. Please try again.");
  return data as T;
}

export function BuilderClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, ready } = useAuth();
  const [phase, setPhase] = React.useState<Phase>({ name: "idle" });
  const started = React.useRef<string | null>(null);

  const knownFromProfile = React.useCallback((): BuildPreferences => {
    if (!user || !user.onboarded) return {};
    return {
      skillLevel: user.skillLevel,
      currency: user.currency,
      country: user.country || undefined,
      tools: user.tools.length ? user.tools : undefined,
    };
  }, [user]);

  const generate = React.useCallback(async (idea: string, prefs: BuildPreferences) => {
    setPhase({ name: "generating", idea });
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const { plan } = await postJSON<{ plan: ProjectPlan }>("/api/ai/generate", { idea, preferences: prefs });
      writeJSON(KEYS.lastPlan, plan);
      setPhase({ name: "plan", idea, plan });
    } catch (err) {
      setPhase({ name: "error", idea, message: err instanceof Error ? err.message : "Something went wrong.", retry: () => generate(idea, prefs) });
    }
  }, []);

  const start = React.useCallback(
    async (idea: string) => {
      setPhase({ name: "clarifying", idea });
      router.replace(`/builder?idea=${encodeURIComponent(idea)}`, { scroll: false });
      try {
        const clarify = await postJSON<ClarifyResponse>("/api/ai/clarify", { idea, known: knownFromProfile() });
        if (clarify.questions.length === 0) await generate(idea, clarify.inferred);
        else setPhase({ name: "questions", idea, clarify });
      } catch (err) {
        setPhase({ name: "error", idea, message: err instanceof Error ? err.message : "Something went wrong.", retry: () => start(idea) });
      }
    },
    [generate, knownFromProfile, router]
  );

  React.useEffect(() => {
    if (!ready) return;
    const idea = params.get("idea");
    if (idea && started.current !== idea) {
      started.current = idea;
      const last = readJSON<ProjectPlan | null>(KEYS.lastPlan, null);
      if (last?.idea === idea) setPhase({ name: "plan", idea, plan: last });
      else start(idea);
    }
  }, [params, ready, start]);

  function reset() {
    started.current = null;
    writeJSON(KEYS.lastPlan, null);
    setPhase({ name: "idle" });
    router.replace("/builder", { scroll: false });
  }

  if (phase.name === "plan") {
    return (
      <PlanView
        plan={phase.plan}
        onPlanChange={(p) => { writeJSON(KEYS.lastPlan, p); setPhase({ ...phase, plan: p }); }}
        headerSlot={
          <div className="no-print flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">Plan for: <span className="text-foreground">“{phase.idea}”</span></p>
            <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> New idea</Button>
          </div>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 text-center">
        <Badge variant="violet" className="mb-4"><Sparkles /> AI Project Builder</Badge>
        <h1 className="text-4xl font-bold sm:text-5xl">What do you want to <span className="text-gradient">make</span>?</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Describe your idea in your own words. Mention your budget, skill level or tools if you like, and your mentor will only ask about what's missing.
        </p>
      </div>

      {phase.name === "idle" && (
        <div className="mx-auto max-w-3xl">
          <IdeaPrompt onSubmit={start} autoFocus />
          {user && !user.onboarded && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Tip: <a className="text-electric underline-offset-4 hover:underline" href="/onboarding">finish your maker profile</a> and the mentor will skip questions it already knows.
            </p>
          )}
        </div>
      )}

      {phase.name === "clarifying" && <GeneratingState label="Reading your idea" />}
      {phase.name === "generating" && <GeneratingState />}

      {phase.name === "questions" && (
        <ClarifyPanel idea={phase.idea} clarify={phase.clarify} onSubmit={(answers: Answers) => generate(phase.idea, answersToPrefs(phase.clarify.inferred, answers))} />
      )}

      {phase.name === "error" && (
        <div role="alert" className="mx-auto flex max-w-xl flex-col items-center rounded-xl border border-destructive/40 bg-destructive/10 p-8 text-center">
          <AlertCircle className="size-10 text-rose-300" aria-hidden />
          <h2 className="mt-3 text-lg font-semibold">The mentor hit a snag</h2>
          <p className="mt-1 text-sm text-muted-foreground">{phase.message}</p>
          <div className="mt-5 flex gap-2">
            <Button onClick={phase.retry}><RotateCcw /> Try again</Button>
            <Button variant="outline" onClick={reset}>Start over</Button>
          </div>
        </div>
      )}
    </div>
  );
}
