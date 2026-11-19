"use client";

import Link from "next/link";
import { CheckSquare, Clock, ListChecks, MoreVertical, Trash2 } from "lucide-react";
import { DifficultyBadge } from "@/components/common/difficulty-badge";
import { ProjectCover } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { progressPercent } from "@/lib/store/projects";
import type { SavedProject } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export function SavedProjectCard({ project, onDelete }: { project: SavedProject; onDelete: () => void }) {
  const pct = progressPercent(project);
  const items = project.plan.components.length;
  const checked = project.progress.checkedItems.filter((i) => project.plan.components.some((c) => c.id === i)).length;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/80 transition hover:border-electric/50">
      <ProjectCover plan={project.plan} className="h-28" />
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon-sm" aria-label={`Options for ${project.plan.title}`}><MoreVertical /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onDelete} className="text-rose-300"><Trash2 /> Remove project</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <DifficultyBadge difficulty={project.plan.difficulty} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" aria-hidden />{timeAgo(project.updatedAt)}</span>
        </div>
        <h3 className="font-semibold leading-snug">
          <Link href={`/dashboard/projects/${project.id}`} className="outline-none after:absolute after:inset-0 hover:text-electric focus-visible:text-electric">{project.plan.title}</Link>
        </h3>
        <div className="mt-auto space-y-2">
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Build progress</span><span className="font-semibold">{pct}%</span></div>
          <Progress value={pct} aria-label={`${project.plan.title} progress`} />
          <div className="flex gap-4 pt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><ListChecks className="size-3.5 text-electric" aria-hidden />{project.progress.completedSteps.length}/{project.plan.steps.length} steps</span>
            <span className="flex items-center gap-1"><CheckSquare className="size-3.5 text-neon" aria-hidden />{checked}/{items} parts</span>
          </div>
        </div>
      </div>
    </article>
  );
}
