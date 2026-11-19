import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/data/projects";
import { apiError } from "@/lib/api";

/** GET /api/projects/:slug */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return apiError("Project not found.", 404);
  return NextResponse.json({ project });
}
