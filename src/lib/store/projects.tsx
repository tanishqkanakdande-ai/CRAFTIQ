"use client";

import * as React from "react";
import { toast } from "sonner";
import { smartphoneProjector } from "@/lib/data/projects";
import type { ProjectPlan, ProjectProgress, SavedProject } from "@/lib/types";
import { uid } from "@/lib/utils";
import { DEMO_EMAIL, useAuth } from "./auth";
import { KEYS, readJSON, writeJSON } from "./storage";

type ProgressKey = "completedSteps" | "checkedItems" | "bookmarkedComponents";

interface ProjectsContextValue {
  projects: SavedProject[];
  ready: boolean;
  save(plan: ProjectPlan): SavedProject;
  remove(id: string): void;
  get(id: string): SavedProject | undefined;
  findByPlan(planId: string): SavedProject | undefined;
  toggle(id: string, key: ProgressKey, value: string): void;
  setNotes(id: string, notes: string): void;
  updatePlan(id: string, plan: ProjectPlan): void;
}

const ProjectsContext = React.createContext<ProjectsContextValue | null>(null);

const emptyProgress = (): ProjectProgress => ({ completedSteps: [], checkedItems: [], bookmarkedComponents: [], notes: "" });

function demoSeed(): SavedProject[] {
  const now = Date.now();
  return [
    {
      id: "sp_demo_projector",
      plan: smartphoneProjector,
      progress: {
        completedSteps: ["s1", "s2", "s3", "s4"],
        checkedItems: ["c_lens", "c_box", "c_black", "c_tape"],
        bookmarkedComponents: ["c_lens", "c_fan"],
        notes: "Lens focal length measured at 21 cm. Using the long Nike shoebox. Need a better phone clip before movie night on Saturday!",
      },
      savedAt: new Date(now - 3 * 86400000).toISOString(),
      updatedAt: new Date(now - 2 * 3600000).toISOString(),
    },
  ];
}

/** Saved projects live in localStorage per user. Swap for /api/projects + Prisma in production. */
export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const [projects, setProjects] = React.useState<SavedProject[]>([]);
  const [ready, setReady] = React.useState(false);
  const key = user ? KEYS.projects(user.id) : null;

  React.useEffect(() => {
    if (!authReady) return;
    if (!key || !user) {
      setProjects([]);
      setReady(true);
      return;
    }
    let list = readJSON<SavedProject[] | null>(key, null);
    if (list === null) list = user.email === DEMO_EMAIL ? demoSeed() : [];
    const pending = readJSON<ProjectPlan | null>(KEYS.pendingSave, null);
    if (pending && !list.some((p) => p.plan.id === pending.id)) {
      const now = new Date().toISOString();
      list = [{ id: uid("sp"), plan: pending, progress: emptyProgress(), savedAt: now, updatedAt: now }, ...list];
      writeJSON(KEYS.pendingSave, null);
      setTimeout(() => toast.success(`Saved “${pending.title}” to your dashboard`), 300);
    }
    writeJSON(key, list);
    setProjects(list);
    setReady(true);
  }, [authReady, key, user]);

  const commit = React.useCallback(
    (updater: (prev: SavedProject[]) => SavedProject[]) => {
      setProjects((prev) => {
        const next = updater(prev);
        if (key) writeJSON(key, next);
        return next;
      });
    },
    [key]
  );

  const touch = (p: SavedProject, patch: Partial<SavedProject>): SavedProject => ({ ...p, ...patch, updatedAt: new Date().toISOString() });

  const value = React.useMemo<ProjectsContextValue>(
    () => ({
      projects,
      ready,
      save(plan) {
        const existing = projects.find((p) => p.plan.id === plan.id);
        if (existing) {
          commit((prev) => prev.map((p) => (p.id === existing.id ? touch(p, { plan }) : p)));
          return existing;
        }
        const now = new Date().toISOString();
        const sp: SavedProject = { id: uid("sp"), plan, progress: emptyProgress(), savedAt: now, updatedAt: now };
        commit((prev) => [sp, ...prev]);
        return sp;
      },
      remove(id) {
        commit((prev) => prev.filter((p) => p.id !== id));
      },
      get(id) {
        return projects.find((p) => p.id === id);
      },
      findByPlan(planId) {
        return projects.find((p) => p.plan.id === planId);
      },
      toggle(id, k, v) {
        commit((prev) =>
          prev.map((p) => {
            if (p.id !== id) return p;
            const list = p.progress[k];
            const nextList = list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
            return touch(p, { progress: { ...p.progress, [k]: nextList } });
          })
        );
      },
      setNotes(id, notes) {
        commit((prev) => prev.map((p) => (p.id === id ? touch(p, { progress: { ...p.progress, notes } }) : p)));
      },
      updatePlan(id, plan) {
        commit((prev) => prev.map((p) => (p.id === id ? touch(p, { plan }) : p)));
      },
    }),
    [projects, ready, commit]
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  const ctx = React.useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used inside ProjectsProvider");
  return ctx;
}

export function progressPercent(p: SavedProject) {
  const total = p.plan.steps.length;
  return total ? Math.round((p.progress.completedSteps.filter((s) => p.plan.steps.some((x) => x.id === s)).length / total) * 100) : 0;
}
