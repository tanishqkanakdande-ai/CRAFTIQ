import { NextResponse } from "next/server";
import { getMentor } from "@/lib/ai/provider";

export function GET() {
  return NextResponse.json({ ok: true, mentor: getMentor().name });
}
