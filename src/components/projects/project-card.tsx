import Link from "next/link";
import { Clock, Heart, Hammer, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/common/difficulty-badge";
import { planCostUSD } from "@/lib/data/projects";
import type { ProjectPlan } from "@/lib/types";
import { cn, formatHours, formatMoney } from "@/lib/utils";

export function ProjectCover({ plan, className }: { plan: Pick<ProjectPlan, "cover" | "emoji" | "title">; className?: string }) {
  return (
    <div
      className={cn("relative grid place-items-center overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${plan.cover[0]}55, ${plan.cover[1]}33), #0a1029` }}
    >
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute -right-6 -bottom-8 size-32 rounded-full blur-2xl" style={{ background: plan.cover[1] }} aria-hidden />
      <span className="relative text-5xl drop-shadow-[0_6px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110" role="img" aria-label={plan.title}>
        {plan.emoji}
      </span>
    </div>
  );
}

export function ProjectCard({ plan, className }: { plan: ProjectPlan; className?: string }) {
  const cost = planCostUSD(plan, false);
  const savings = Math.max(0, plan.retailComparison.priceUSD - cost);
  return (
    <Link
      href={`/projects/${plan.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-electric/50 hover:shadow-[0_20px_50px_-20px_rgb(59_130_246/0.5)] focus-visible:ring-2 focus-visible:ring-electric outline-none",
        className
      )}
    >
      <ProjectCover plan={plan} className="h-36" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={plan.difficulty} />
          {plan.categories.slice(0, 1).map((c) => (
            <Badge key={c} variant="outline">{c}</Badge>
          ))}
        </div>
        <div>
          <h3 className="font-semibold leading-snug group-hover:text-electric">{plan.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{plan.tagline}</p>
        </div>
        <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><Wallet className="size-3.5 text-neon" aria-hidden /><dt className="sr-only">Cost</dt><dd>{formatMoney(cost)}</dd></div>
          <div className="flex items-center gap-1"><Clock className="size-3.5 text-electric" aria-hidden /><dt className="sr-only">Time</dt><dd>{formatHours(plan.timeHours)}</dd></div>
          <div className="flex items-center gap-1"><Hammer className="size-3.5 text-violet" aria-hidden /><dt className="sr-only">Builds</dt><dd>{(plan.builds ?? 0).toLocaleString()}</dd></div>
        </dl>
        {savings > 0 && (
          <p className="flex items-center gap-1 text-xs font-medium text-neon">
            <Heart className="size-3" aria-hidden /> Save ~{formatMoney(savings)} vs. buying
          </p>
        )}
      </div>
    </Link>
  );
}
