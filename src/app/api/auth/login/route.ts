import { NextResponse } from "next/server";
import { z } from "zod";
import { parseBody } from "@/lib/api";
import { mockUsers } from "@/lib/data/mock-users";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
  provider: z.enum(["email", "google"]).default("email"),
});

/** POST /api/auth/login. Prototype: any password works; unknown emails get a fresh demo account. */
export async function POST(req: Request) {
  const parsed = await parseBody(req, loginSchema);
  if ("response" in parsed) return parsed.response;
  const { email, provider } = parsed.data;
  const user =
    mockUsers.get(email.toLowerCase()) ??
    mockUsers.create({ name: email.split("@")[0].replace(/[._-]/g, " "), email, provider, onboarded: true });
  return NextResponse.json({ user });
}
