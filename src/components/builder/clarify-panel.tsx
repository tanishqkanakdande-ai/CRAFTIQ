"use client";

import * as React from "react";
import { Bot, Check, SkipForward, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BuildPreferences, ClarifyQuestion, ClarifyResponse } from "@/lib/types";
import { cn, type CurrencyCode } from "@/lib/utils";

export type Answers = Partial<Record<ClarifyQuestion["field"], string | string[]>>;

export function answersToPrefs(inferred: BuildPreferences, answers: Answers): BuildPreferences {
  const p: BuildPreferences = { ...inferred };
  if (typeof answers.budgetUSD === "string") p.budgetUSD = Number(answers.budgetUSD);
  if (typeof answers.skillLevel === "string") p.skillLevel = answers.skillLevel as BuildPreferences["skillLevel"];
  if (Array.isArray(answers.tools)) p.tools = answers.tools.length ? answers.tools : undefined;
  if (typeof answers.currency === "string") p.currency = answers.currency as CurrencyCode;
  if (typeof answers.size === "string") p.size = answers.size as BuildPreferences["size"];
  if (typeof answers.purpose === "string" && answers.purpose.trim()) p.purpose = answers.purpose.trim();
  return p;
}

export function ClarifyPanel({ idea, clarify, onSubmit, busy }: { idea: string; clarify: ClarifyResponse; onSubmit: (answers: Answers) => void; busy?: boolean }) {
  const [answers, setAnswers] = React.useState<Answers>({});
  const answered = clarify.questions.filter((q) => {
    const a = answers[q.field];
    return Array.isArray(a) ? a.length > 0 : !!a;
  }).length;

  function pick(q: ClarifyQuestion, value: string) {
    setAnswers((prev) => {
      if (!q.multi) return { ...prev, [q.field]: prev[q.field] === value ? undefined : value };
      const list = (prev[q.field] as string[] | undefined) ?? [];
      return { ...prev, [q.field]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] };
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-white shadow-lg">{idea}</p>
      </div>
      <div className="flex gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-electric to-violet"><Bot className="size-5 text-white" aria-hidden /></div>
        <div className="min-w-0 flex-1 space-y-4">
          <p className="rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 text-sm">{clarify.message}</p>
          {clarify.questions.map((q, i) => {
            const groupId = `q-${q.field}`;
            const current = answers[q.field];
            return (
              <fieldset key={q.field} aria-labelledby={groupId} className="animate-fade-up rounded-xl border border-border bg-card/70 p-4" style={{ animationDelay: `${i * 80}ms` }}>
                <p id={groupId} className="font-medium">{q.question}</p>
                <p className="mb-3 text-xs text-muted-foreground">{q.why}{q.multi && " Pick all that apply."}</p>
                <div className="flex flex-wrap gap-2" role={q.multi ? "group" : "radiogroup"} aria-labelledby={groupId}>
                  {q.options.map((o) => {
                    const selected = Array.isArray(current) ? current.includes(o.value) : current === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        role={q.multi ? "checkbox" : "radio"}
                        aria-checked={selected}
                        onClick={() => pick(q, o.value)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-electric cursor-pointer",
                          selected ? "border-neon bg-neon/15 text-neon" : "border-border bg-secondary/50 text-muted-foreground hover:border-electric/50 hover:text-foreground"
                        )}
                      >
                        {selected && <Check className="size-3.5" aria-hidden />} {o.label}
                      </button>
                    );
                  })}
                </div>
                {q.allowCustom && (
                  <Input className="mt-3" placeholder="Or type your own…" aria-label={`${q.question} (custom answer)`} onChange={(e) => setAnswers((p) => ({ ...p, [q.field]: e.target.value }))} />
                )}
              </fieldset>
            );
          })}
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => onSubmit(answers)} disabled={busy}><Sparkles /> Generate my plan</Button>
            {answered < clarify.questions.length && (
              <Button variant="ghost" onClick={() => onSubmit(answers)} disabled={busy}><SkipForward /> Skip, use sensible defaults</Button>
            )}
            <span className="text-xs text-muted-foreground">{answered}/{clarify.questions.length} answered</span>
          </div>
        </div>
      </div>
    </div>
  );
}
