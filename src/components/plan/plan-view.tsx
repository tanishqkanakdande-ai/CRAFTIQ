"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ClipboardCopy,
  Clock,
  ExternalLink,
  FlaskConical,
  Info,
  Lightbulb,
  ListChecks,
  OctagonAlert,
  PiggyBank,
  Recycle,
  Rocket,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
import { ApprovalDialog, type ApprovalRequest } from "@/components/common/approval-dialog";
import { DifficultyBadge } from "@/components/common/difficulty-badge";
import { ProjectCover } from "@/components/projects/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { planCostUSD } from "@/lib/data/projects";
import { useAuth } from "@/lib/store/auth";
import { useProjects } from "@/lib/store/projects";
import type { ProjectPlan, ProjectProgress, SafetyLevel } from "@/lib/types";
import { CURRENCIES, cn, type CurrencyCode, formatHours, formatMoney } from "@/lib/utils";
import { PlanActions } from "./plan-actions";
import { WIRE_HEX, WiringDiagram } from "./wiring-diagram";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: Info },
  { id: "components", label: "Components", icon: Zap },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "shopping", label: "Shopping list", icon: ShoppingCart },
  { id: "wiring", label: "Wiring", icon: Zap },
  { id: "steps", label: "Build steps", icon: ListChecks },
  { id: "safety", label: "Safety", icon: ShieldAlert },
  { id: "testing", label: "Testing & fixes", icon: FlaskConical },
  { id: "upgrades", label: "Upgrades", icon: Rocket },
];

type ProgressKey = "completedSteps" | "checkedItems" | "bookmarkedComponents";

interface PlanViewProps {
  plan: ProjectPlan;
  onPlanChange?: (plan: ProjectPlan) => void;
  /** Saved project id: progress is read from and written to the dashboard store. */
  savedId?: string;
  headerSlot?: React.ReactNode;
}

export function PlanView({ plan: initialPlan, onPlanChange, savedId, headerSlot }: PlanViewProps) {
  const { user } = useAuth();
  const store = useProjects();
  const [plan, setPlan] = React.useState(initialPlan);
  React.useEffect(() => setPlan(initialPlan), [initialPlan]);

  const [localProgress, setLocalProgress] = React.useState<ProjectProgress>({ completedSteps: [], checkedItems: [], bookmarkedComponents: [], notes: "" });
  const saved = savedId ? store.get(savedId) : undefined;
  const progress = saved?.progress ?? localProgress;

  const toggle = (key: ProgressKey, value: string) => {
    if (savedId) store.toggle(savedId, key, value);
    else setLocalProgress((p) => ({ ...p, [key]: p[key].includes(value) ? p[key].filter((x) => x !== value) : [...p[key], value] }));
  };

  const [currency, setCurrency] = React.useState<CurrencyCode>(plan.generatedFor?.currency ?? user?.currency ?? "USD");
  React.useEffect(() => {
    if (plan.generatedFor?.currency) setCurrency(plan.generatedFor.currency);
  }, [plan.generatedFor?.currency]);

  const [approval, setApproval] = React.useState<ApprovalRequest | null>(null);

  const handlePlanChange = (next: ProjectPlan) => {
    setPlan(next);
    onPlanChange?.(next);
  };

  const requiredCost = planCostUSD(plan, false);
  const fullCost = planCostUSD(plan, true);
  const savings = plan.retailComparison.priceUSD - requiredCost;
  const savingsPct = plan.retailComparison.priceUSD > 0 ? Math.round((savings / plan.retailComparison.priceUSD) * 100) : 0;
  const stepsDone = progress.completedSteps.filter((s) => plan.steps.some((x) => x.id === s)).length;
  const stepPct = plan.steps.length ? Math.round((stepsDone / plan.steps.length) * 100) : 0;
  const checkedCost = plan.components.filter((c) => progress.checkedItems.includes(c.id)).reduce((s, c) => s + c.unitPriceUSD * c.qty, 0);
  const m = (usd: number) => formatMoney(usd, currency);

  function findOnline(name: string, query?: string) {
    const q = query ?? name;
    setApproval({
      title: "Open a web search for this part?",
      description: "CraftIQ will open a new tab with shopping search results. Nothing is bought or ordered. You decide where and whether to buy.",
      details: [`Search: “${q}”`, "Compare sellers, reviews and delivery times before buying."],
      confirmLabel: "Open search",
      onConfirm: () => window.open(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(q)}`, "_blank", "noopener,noreferrer"),
    });
  }

  async function copyShoppingList() {
    const lines = plan.components.map((c) => `${progress.checkedItems.includes(c.id) ? "[x]" : "[ ]"} ${c.qty} × ${c.name}${c.optional ? " (optional)" : ""} - ${m(c.unitPriceUSD * c.qty)}`);
    const text = `CraftIQ shopping list: ${plan.title}\n\n${lines.join("\n")}\n\nEstimated total: ${m(requiredCost)} (required parts)`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Shopping list copied");
    } catch {
      toast.error("Couldn't access the clipboard.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Header */}
      <header className="glass glow-border overflow-hidden rounded-2xl">
        <div className="grid md:grid-cols-[220px_1fr]">
          <ProjectCover plan={plan} className="h-36 md:h-full" />
          <div className="space-y-5 p-6 sm:p-8">
            {headerSlot}
            <div className="flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={plan.difficulty} />
              {plan.categories.map((c) => <Badge key={c} variant="outline">{c}</Badge>)}
              {plan.source === "ai" && <Badge variant="violet"><Sparkles /> AI-generated</Badge>}
            </div>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{plan.title}</h1>
              <p className="mt-2 text-muted-foreground sm:text-lg">{plan.tagline}</p>
            </div>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat icon={Wallet} label="Estimated cost" value={m(requiredCost)} hint={fullCost > requiredCost ? `${m(fullCost)} with extras` : undefined} accent="text-neon" />
              <Stat icon={PiggyBank} label="You save" value={savings > 0 ? m(savings) : "—"} hint={savings > 0 ? `${savingsPct}% vs. ${m(plan.retailComparison.priceUSD)}` : "Similar to retail"} accent="text-electric" />
              <Stat icon={Clock} label="Time estimate" value={formatHours(plan.timeHours)} hint={`${plan.steps.length} steps`} accent="text-violet" />
              <Stat icon={ShieldAlert} label="Hazards" value={plan.hazards.length ? `${plan.hazards.length} to watch` : "Low"} hint={plan.hazards.slice(0, 2).join(", ") || "Basic care"} accent="text-warning" />
            </dl>
            <PlanActions plan={plan} currency={currency} onPlanChange={handlePlanChange} savedId={savedId} />
          </div>
        </div>
      </header>

      {(plan.mentorNote || plan.changelog?.length) && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {plan.mentorNote && (
            <aside className="flex gap-3 rounded-xl border border-violet/30 bg-violet/10 p-5" aria-label="Mentor note">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-violet-300" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-violet-200">Your mentor says</p>
                <p className="mt-1 text-sm text-muted-foreground">{plan.mentorNote}</p>
              </div>
            </aside>
          )}
          {!!plan.changelog?.length && (
            <aside className="rounded-xl border border-neon/30 bg-neon/5 p-5" aria-label="What changed">
              <p className="flex items-center gap-2 text-sm font-semibold text-neon"><CheckCircle2 className="size-4" aria-hidden /> What I tailored for you</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {plan.changelog.map((c) => <li key={c}>• {c}</li>)}
              </ul>
            </aside>
          )}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        {/* Section nav */}
        <nav aria-label="Plan sections" className="no-print min-w-0 lg:sticky lg:top-24 lg:self-start">
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
            {SECTIONS.map((s) => (
              <li key={s.id} className="shrink-0">
                <a href={`#${s.id}`} className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-sm text-muted-foreground transition hover:border-electric/50 hover:text-foreground lg:rounded-lg lg:border-transparent lg:bg-transparent">
                  <s.icon className="size-4" aria-hidden /> {s.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 hidden rounded-xl border border-border bg-card/60 p-4 lg:block">
            <p className="text-xs text-muted-foreground">Build progress</p>
            <p className="mt-1 font-display text-2xl font-bold">{stepPct}%</p>
            <Progress value={stepPct} className="mt-2" aria-label="Build progress" />
            <p className="mt-2 text-xs text-muted-foreground">{stepsDone} of {plan.steps.length} steps</p>
            {!savedId && <p className="mt-3 text-xs text-muted-foreground">Save the project to keep your progress.</p>}
          </div>
          <div className="mt-4 hidden lg:block">
            <label className="mb-1 block text-xs text-muted-foreground" htmlFor="currency-select">Currency</label>
            <CurrencySelect id="currency-select" value={currency} onChange={setCurrency} />
          </div>
        </nav>

        <div className="min-w-0 space-y-6">
          <Section id="overview" title="Project overview" icon={Info}>
            <p className="text-muted-foreground">{plan.overview}</p>
            <div className="mt-4 rounded-lg border border-border bg-background-2/60 p-4">
              <p className="text-sm font-semibold">How it works</p>
              <p className="mt-1 text-sm text-muted-foreground">{plan.howItWorks}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">Compared with buying</p>
                <p className="mt-1 text-sm font-medium">{plan.retailComparison.product}</p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="font-display text-2xl font-bold text-neon">{m(requiredCost)}</span>
                  <span className="text-sm text-muted-foreground line-through">{m(plan.retailComparison.priceUSD)}</span>
                </div>
                {savings > 0 ? (
                  <p className="mt-1 text-xs text-muted-foreground">Roughly {savingsPct}% cheaper. A DIY version may be less polished or less bright than a commercial product.</p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">This build costs about the same as buying one. You're doing it for the learning and the fun!</p>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4 lg:hidden">
                <span className="text-sm">Show prices in</span>
                <div className="w-36"><CurrencySelect value={currency} onChange={setCurrency} /></div>
              </div>
            </div>
          </Section>

          <Section id="components" title="Required components & alternatives" icon={Zap} description="Tap the bookmark to keep a part on your dashboard.">
            <ul className="space-y-3">
              {plan.components.map((c) => {
                const marked = progress.bookmarkedComponents.includes(c.id);
                return (
                  <li key={c.id} className="rounded-lg border border-border bg-background-2/50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium">{c.qty > 1 && <span className="text-electric">{c.qty}× </span>}{c.name}</h3>
                          {c.optional && <Badge variant="outline">Optional</Badge>}
                          {c.unitPriceUSD === 0 && <Badge variant="neon"><Recycle /> Free / reuse</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{c.purpose}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-semibold">{c.unitPriceUSD === 0 ? "Free" : m(c.unitPriceUSD * c.qty)}</p>
                        <Button variant="ghost" size="icon-sm" onClick={() => toggle("bookmarkedComponents", c.id)} aria-pressed={marked} aria-label={marked ? `Remove bookmark for ${c.name}` : `Bookmark ${c.name}`}>
                          {marked ? <BookmarkCheck className="text-neon" /> : <Bookmark />}
                        </Button>
                      </div>
                    </div>
                    {c.alternatives.length > 0 && (
                      <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                        {c.alternatives.map((a) => (
                          <li key={a.name} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                            <span className={cn("text-xs font-semibold uppercase tracking-wide", a.household ? "text-neon" : "text-electric")}>{a.household ? "Household swap" : "Alternative"}</span>
                            <span className="font-medium">{a.name}</span>
                            {a.priceUSD !== undefined && <span className="text-muted-foreground">({m(a.priceUSD)})</span>}
                            <span className="w-full text-muted-foreground sm:w-auto">{a.note}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </Section>

          <Section id="tools" title="Tools required" icon={Wrench}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {plan.tools.map((t) => (
                <li key={t.name} className="flex gap-3 rounded-lg border border-border p-3">
                  <Wrench className="mt-0.5 size-4 shrink-0 text-electric" aria-hidden />
                  <div>
                    <p className="text-sm font-medium">{t.name} {t.optional && <span className="text-xs text-muted-foreground">(optional)</span>}</p>
                    {t.note && <p className="text-xs text-muted-foreground">{t.note}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            id="shopping"
            title="Shopping checklist"
            icon={ShoppingCart}
            description="Tick parts off as you collect them. CraftIQ never buys anything for you."
            action={<Button variant="outline" size="sm" onClick={copyShoppingList}><ClipboardCopy /> Copy list</Button>}
          >
            <div className="overflow-hidden rounded-lg border border-border">
              <ul className="divide-y divide-border">
                {plan.components.map((c) => {
                  const checked = progress.checkedItems.includes(c.id);
                  const id = `shop-${c.id}`;
                  return (
                    <li key={c.id} className={cn("flex items-center gap-3 px-4 py-3 transition-colors", checked && "bg-neon/5")}>
                      <Checkbox id={id} checked={checked} onCheckedChange={() => toggle("checkedItems", c.id)} />
                      <label htmlFor={id} className={cn("min-w-0 flex-1 cursor-pointer text-sm", checked && "text-muted-foreground line-through")}>
                        {c.qty} × {c.name} {c.optional && <span className="text-xs text-muted-foreground">(optional)</span>}
                      </label>
                      <span className="text-sm font-medium tabular-nums">{c.unitPriceUSD === 0 ? "Free" : m(c.unitPriceUSD * c.qty)}</span>
                      {c.unitPriceUSD > 0 && (
                        <Button variant="ghost" size="icon-sm" onClick={() => findOnline(c.name, c.searchQuery)} aria-label={`Find ${c.name} online`}>
                          <ExternalLink />
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-background-2/60 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Collected {m(checkedCost)} of {m(fullCost)}</span>
                <span className="font-semibold">Required total: <span className="text-neon">{m(requiredCost)}</span></span>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Prices are typical estimates in {CURRENCIES[currency].label}. Check local stores for current prices.</p>
          </Section>

          <Section id="wiring" title="Wiring diagram" icon={Zap} description={plan.wiring.summary}>
            {plan.wiring.connections.length > 0 && <WiringDiagram wiring={plan.wiring} />}
            {plan.wiring.connections.length > 0 && (
              <div className="mt-4 overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <caption className="sr-only">Connection table</caption>
                  <thead className="bg-background-2/70 text-xs text-muted-foreground">
                    <tr><th scope="col" className="px-3 py-2">#</th><th scope="col" className="px-3 py-2">From</th><th scope="col" className="px-3 py-2">To</th><th scope="col" className="px-3 py-2">Wire</th><th scope="col" className="px-3 py-2">Note</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {plan.wiring.connections.map((c, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 font-semibold">{i + 1}</td>
                        <td className="px-3 py-2">{c.from} <span className="font-mono text-xs text-electric">{c.fromPin}</span></td>
                        <td className="px-3 py-2">{c.to} <span className="font-mono text-xs text-electric">{c.toPin}</span></td>
                        <td className="px-3 py-2"><span className="inline-flex items-center gap-1.5 capitalize"><span className="size-2.5 rounded-full" style={{ background: WIRE_HEX[c.wire] }} aria-hidden />{c.wire}</span></td>
                        <td className="px-3 py-2 text-muted-foreground">{c.note ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {plan.wiring.notes.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                {plan.wiring.notes.map((n) => <li key={n} className="flex gap-2"><Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />{n}</li>)}
              </ul>
            )}
          </Section>

          <Section id="steps" title="Step-by-step build tutorial" icon={ListChecks} description={`${stepsDone} of ${plan.steps.length} steps complete`}>
            <Progress value={stepPct} className="mb-5" aria-label={`Build progress ${stepPct}%`} />
            <ol className="space-y-3">
              {plan.steps.map((s, i) => {
                const done = progress.completedSteps.includes(s.id);
                const id = `step-${s.id}`;
                return (
                  <li key={s.id} className={cn("rounded-lg border p-4 transition-colors", done ? "border-neon/40 bg-neon/5" : "border-border bg-background-2/50")}>
                    <div className="flex gap-3">
                      <Checkbox id={id} checked={done} onCheckedChange={() => toggle("completedSteps", s.id)} className="mt-0.5" aria-label={`Mark step ${i + 1} complete`} />
                      <div className="min-w-0 flex-1">
                        <label htmlFor={id} className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-display text-sm font-bold text-electric">Step {i + 1}</span>
                          <span className={cn("font-semibold", done && "text-muted-foreground line-through")}>{s.title}</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" aria-hidden />{s.minutes} min</span>
                        </label>
                        <p className="mt-2 text-sm text-muted-foreground">{s.detail}</p>
                        {s.tip && <p className="mt-2 flex gap-2 rounded-md bg-electric/10 p-2.5 text-sm text-sky-200"><Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden />{s.tip}</p>}
                        {s.warning && <p className="mt-2 flex gap-2 rounded-md bg-warning/10 p-2.5 text-sm text-amber-200"><AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />{s.warning}</p>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Section>

          <Section id="safety" title="Safety warnings" icon={ShieldAlert} description="Following these lowers the risk. It never removes it completely.">
            <ul className="space-y-3">
              {plan.safety.map((s) => <SafetyCard key={s.title} level={s.level} title={s.title} detail={s.detail} safer={s.saferAlternative} />)}
            </ul>
          </Section>

          <Section id="testing" title="Testing & troubleshooting" icon={FlaskConical}>
            <h3 className="mb-2 text-sm font-semibold">Test checklist</h3>
            <ul className="mb-6 space-y-2">
              {plan.testing.map((t) => <li key={t} className="flex gap-2 text-sm text-muted-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-neon" aria-hidden />{t}</li>)}
            </ul>
            <h3 className="mb-2 text-sm font-semibold">If something goes wrong</h3>
            <dl className="grid gap-3 sm:grid-cols-2">
              {plan.troubleshooting.map((t) => (
                <div key={t.problem} className="rounded-lg border border-border p-4">
                  <dt className="text-sm font-medium">{t.problem}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{t.fix}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section id="upgrades" title="Upgrade ideas" icon={Rocket}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {plan.upgrades.map((u) => <li key={u} className="flex gap-2 rounded-lg border border-border p-3 text-sm text-muted-foreground"><Rocket className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />{u}</li>)}
            </ul>
          </Section>
        </div>
      </div>

      <ApprovalDialog request={approval} onClose={() => setApproval(null)} />
    </div>
  );
}

function Stat({ icon: Icon, label, value, hint, accent }: { icon: React.ElementType; label: string; value: string; hint?: string; accent: string }) {
  return (
    <div className="rounded-lg border border-border bg-background-2/60 p-3">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className={cn("size-3.5", accent)} aria-hidden />{label}</dt>
      <dd className="mt-1 font-display text-lg font-bold sm:text-xl">{value}</dd>
      {hint && <dd className="truncate text-xs text-muted-foreground">{hint}</dd>}
    </div>
  );
}

function Section({ id, title, icon: Icon, description, action, children }: { id: string; title: string; icon: React.ElementType; description?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 rounded-xl border border-border bg-card/70 p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={`${id}-title`} className="flex items-center gap-2 text-xl font-bold"><Icon className="size-5 text-electric" aria-hidden />{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

const SAFETY_STYLE: Record<SafetyLevel, { cls: string; icon: React.ElementType; label: string }> = {
  danger: { cls: "border-destructive/50 bg-destructive/10", icon: OctagonAlert, label: "Danger" },
  caution: { cls: "border-warning/40 bg-warning/5", icon: AlertTriangle, label: "Caution" },
  info: { cls: "border-electric/30 bg-electric/5", icon: Info, label: "Good to know" },
};

function SafetyCard({ level, title, detail, safer }: { level: SafetyLevel; title: string; detail: string; safer?: string }) {
  const s = SAFETY_STYLE[level];
  return (
    <li className={cn("rounded-lg border p-4", s.cls)}>
      <div className="flex gap-3">
        <s.icon className={cn("mt-0.5 size-5 shrink-0", level === "danger" ? "text-rose-400" : level === "caution" ? "text-warning" : "text-electric")} aria-hidden />
        <div>
          <p className="font-semibold"><span className="sr-only">{s.label}: </span>{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
          {safer && <p className="mt-2 text-sm"><span className="font-semibold text-neon">Safer alternative: </span><span className="text-muted-foreground">{safer}</span></p>}
        </div>
      </div>
    </li>
  );
}

function CurrencySelect({ value, onChange, id }: { value: CurrencyCode; onChange: (c: CurrencyCode) => void; id?: string }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as CurrencyCode)}>
      <SelectTrigger id={id} aria-label="Display currency"><SelectValue /></SelectTrigger>
      <SelectContent>
        {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => <SelectItem key={c} value={c}>{CURRENCIES[c].symbol} {c}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
