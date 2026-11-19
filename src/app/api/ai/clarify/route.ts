import { NextResponse } from "next/server";
import { getMentor } from "@/lib/ai/provider";
import { clarifyRequestSchema } from "@/lib/ai/schema";
import { apiError, parseBody } from "@/lib/api";

/** POST /api/ai/clarify: returns what the mentor inferred and any follow-up questions it still needs. */
export async function POST(req: Request) {
  const parsed = await parseBody(req, clarifyRequestSchema);
  if ("response" in parsed) return parsed.response;
  try {
    const result = await getMentor().clarify(parsed.data.idea, parsed.data.known ?? {});
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return apiError("The mentor couldn't read that idea. Please try again.", 500);
  }
}
