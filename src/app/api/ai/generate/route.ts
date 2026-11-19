import { NextResponse } from "next/server";
import { getMentor } from "@/lib/ai/provider";
import { generateRequestSchema } from "@/lib/ai/schema";
import { apiError, parseBody } from "@/lib/api";

/** POST /api/ai/generate: builds a complete project plan from an idea and preferences. */
export async function POST(req: Request) {
  const parsed = await parseBody(req, generateRequestSchema);
  if ("response" in parsed) return parsed.response;
  try {
    const plan = await getMentor().generate(parsed.data.idea, parsed.data.preferences);
    return NextResponse.json({ plan });
  } catch (err) {
    console.error(err);
    return apiError("Something went wrong while generating your plan. Please try again.", 500);
  }
}
