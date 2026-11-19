import { NextResponse } from "next/server";
import { z } from "zod";
import { getMentor } from "@/lib/ai/provider";
import { apiError, parseBody } from "@/lib/api";
import type { ProjectPlan } from "@/lib/types";

const improveSchema = z.object({
  request: z.string().trim().min(3, "Tell the mentor what to change.").max(500),
  plan: z.custom<ProjectPlan>((v) => typeof v === "object" && v !== null && "title" in v && "components" in v, "A plan is required."),
});

/** POST /api/ai/improve: revises an existing plan from a natural-language request. */
export async function POST(req: Request) {
  const parsed = await parseBody(req, improveSchema);
  if ("response" in parsed) return parsed.response;
  try {
    const plan = await getMentor().improve(parsed.data.plan, parsed.data.request);
    return NextResponse.json({ plan });
  } catch (err) {
    console.error(err);
    return apiError("The mentor couldn't update this plan. Please try again.", 500);
  }
}
