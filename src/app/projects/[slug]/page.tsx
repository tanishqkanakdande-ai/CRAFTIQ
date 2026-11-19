import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlanView } from "@/components/plan/plan-view";
import { enforceSafety } from "@/lib/ai/safety";
import { getProjectBySlug, projects } from "@/lib/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  return p ? { title: p.title, description: p.tagline } : { title: "Project not found" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const plan = enforceSafety(project);
  return (
    <PlanView
      plan={plan}
      headerSlot={
        project.author ? (
          <p className="text-xs text-muted-foreground">
            Shared by <span className="text-foreground">{project.author.name}</span> {project.author.handle} · {project.likes?.toLocaleString()} likes · {project.builds?.toLocaleString()} builds
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">CraftIQ starter project · {project.builds?.toLocaleString()} makers have built this</p>
        )
      }
    />
  );
}
