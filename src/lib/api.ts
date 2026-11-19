import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: { message, details } }, { status });
}

/** Parses a JSON body against a schema and returns a typed value or an error response. */
export async function parseBody<T>(req: Request, schema: ZodType<T>): Promise<{ data: T } | { response: NextResponse }> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { response: apiError("Request body must be valid JSON.") };
  }
  try {
    return { data: schema.parse(body) };
  } catch (err) {
    if (err instanceof ZodError) {
      return { response: apiError(err.issues[0]?.message ?? "Invalid request.", 422, err.issues) };
    }
    throw err;
  }
}
