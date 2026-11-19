"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const STAGES = ["Understanding your idea", "Choosing affordable parts", "Finding household substitutes", "Checking safety risks", "Drawing the wiring", "Writing your step-by-step tutorial"];

export function GeneratingState({ label = "Designing your build plan" }: { label?: string }) {
  const [stage, setStage] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 380);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mx-auto max-w-3xl" role="status" aria-live="polite">
      <div className="glass glow-border rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="relative grid size-12 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-neon/20" aria-hidden />
            <span className="relative grid size-12 place-items-center rounded-full bg-gradient-to-br from-electric to-violet"><Loader2 className="size-6 animate-spin text-white" aria-hidden /></span>
          </div>
          <div>
            <p className="font-display text-lg font-semibold">{label}…</p>
            <p className="text-sm text-muted-foreground">{STAGES[stage]}</p>
          </div>
        </div>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {STAGES.map((s, i) => (
            <li key={s} className={cn("flex items-center gap-2 text-sm transition-colors", i <= stage ? "text-foreground" : "text-muted-foreground/50")}>
              <span className={cn("grid size-5 place-items-center rounded-full border", i < stage ? "border-neon bg-neon text-[#04120a]" : i === stage ? "border-electric" : "border-border")}>
                {i < stage ? <Check className="size-3" strokeWidth={3} aria-hidden /> : i === stage ? <span className="size-1.5 animate-pulse rounded-full bg-electric" /> : null}
              </span>
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3" aria-hidden>
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-40 sm:col-span-3" />
      </div>
    </div>
  );
}
