import { NextResponse } from "next/server";
import { filterProjects } from "@/lib/data/filters";

/**
 * GET /api/projects?difficulty=Beginner&category=Audio&maxBudget=50&maxHours=3&q=robot
 * Serves the starter and community catalogue. Backed by mock data; see prisma/schema.prisma.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const results = filterProjects({
    q: searchParams.get("q") ?? undefined,
    difficulty: searchParams.get("difficulty") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    maxBudget: searchParams.has("maxBudget") ? Number(searchParams.get("maxBudget")) : undefined,
    maxHours: searchParams.has("maxHours") ? Number(searchParams.get("maxHours")) : undefined,
  });
  return NextResponse.json({ projects: results, total: results.length });
}
