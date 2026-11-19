import { planCostUSD, projects } from "./projects";

export interface ProjectFilters {
  q?: string;
  difficulty?: string;
  category?: string;
  maxBudget?: number;
  maxHours?: number;
}

export const BUDGET_RANGES = [
  { label: "Any budget", value: "any" },
  { label: "Under $20", value: "20" },
  { label: "Under $50", value: "50" },
  { label: "Under $100", value: "100" },
] as const;

export const TIME_RANGES = [
  { label: "Any time", value: "any" },
  { label: "Under 2 hours", value: "2" },
  { label: "Under 4 hours", value: "4" },
  { label: "A weekend", value: "8" },
] as const;

export function filterProjects(f: ProjectFilters) {
  const q = f.q?.trim().toLowerCase();
  return projects.filter((p) => {
    if (f.difficulty && f.difficulty !== "all" && p.difficulty !== f.difficulty) return false;
    if (f.category && f.category !== "all" && !p.categories.includes(f.category as (typeof p.categories)[number])) return false;
    if (f.maxBudget && planCostUSD(p, false) > f.maxBudget) return false;
    if (f.maxHours && p.timeHours > f.maxHours) return false;
    if (q && !`${p.title} ${p.tagline} ${p.categories.join(" ")}`.toLowerCase().includes(q)) return false;
    return true;
  });
}
