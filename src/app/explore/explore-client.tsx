"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Search, SearchX, Sparkles, X } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BUDGET_RANGES, TIME_RANGES, filterProjects } from "@/lib/data/filters";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

const DIFFICULTIES = ["all", "Beginner", "Intermediate", "Advanced"] as const;

export function ExploreClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = params.get("q") ?? "";
  const difficulty = params.get("difficulty") ?? "all";
  const category = params.get("category") ?? "all";
  const budget = params.get("budget") ?? "any";
  const time = params.get("time") ?? "any";
  const [search, setSearch] = React.useState(q);

  const setParam = React.useCallback(
    (key: string, value: string, empty = "all") => {
      const next = new URLSearchParams(params.toString());
      if (!value || value === empty) next.delete(key);
      else next.set(key, value);
      router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false });
    },
    [params, pathname, router]
  );

  React.useEffect(() => {
    const t = setTimeout(() => { if (search !== q) setParam("q", search, ""); }, 250);
    return () => clearTimeout(t);
  }, [search, q, setParam]);

  const results = filterProjects({
    q,
    difficulty,
    category,
    maxBudget: budget === "any" ? undefined : Number(budget),
    maxHours: time === "any" ? undefined : Number(time),
  });
  const active = [difficulty !== "all", category !== "all", budget !== "any", time !== "any", !!q].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Explore projects</h1>
          <p className="mt-2 text-muted-foreground">Starter builds and community creations, each with a full plan.</p>
        </div>
        <Button asChild variant="neon"><Link href="/builder"><Sparkles /> Design your own</Link></Button>
      </div>

      <div className="glass sticky top-16 z-30 -mx-4 mb-6 space-y-3 border-y border-border px-4 py-4 sm:mx-0 sm:rounded-xl sm:border">
        <div className="grid gap-3 md:grid-cols-[1fr_repeat(3,180px)]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects" className="h-10 pl-9" aria-label="Search projects" />
          </div>
          <Select value={difficulty} onValueChange={(v) => setParam("difficulty", v)}>
            <SelectTrigger aria-label="Difficulty"><SelectValue /></SelectTrigger>
            <SelectContent>{DIFFICULTIES.map((d) => <SelectItem key={d} value={d}>{d === "all" ? "All levels" : d}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={budget} onValueChange={(v) => setParam("budget", v, "any")}>
            <SelectTrigger aria-label="Budget range"><SelectValue /></SelectTrigger>
            <SelectContent>{BUDGET_RANGES.map((b) => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={time} onValueChange={(v) => setParam("time", v, "any")}>
            <SelectTrigger aria-label="Time required"><SelectValue /></SelectTrigger>
            <SelectContent>{TIME_RANGES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Category">
          {["all", ...CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setParam("category", c)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-electric cursor-pointer",
                category === c ? "border-electric bg-electric/15 text-electric" : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {c === "all" ? "All categories" : c}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground" aria-live="polite">
        <span>{results.length} project{results.length === 1 ? "" : "s"}</span>
        {active > 0 && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); router.replace(pathname, { scroll: false }); }}><X /> Clear filters</Button>
        )}
      </div>

      {results.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((p, i) => <ProjectCard key={p.id} plan={p} className="animate-fade-up" />)}
        </div>
      ) : (
        <EmptyState icon={SearchX} title="No projects match those filters" description="Try widening your budget or time, or let the AI design something new just for you.">
          <Button variant="outline" onClick={() => { setSearch(""); router.replace(pathname, { scroll: false }); }}>Clear filters</Button>
          <Button asChild><Link href={`/builder${q ? `?idea=${encodeURIComponent(q)}` : ""}`}><Sparkles /> Ask the AI</Link></Button>
        </EmptyState>
      )}
    </div>
  );
}
