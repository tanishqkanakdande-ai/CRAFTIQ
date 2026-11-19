import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, parseBody } from "@/lib/api";
import { mockUsers } from "@/lib/data/mock-users";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

/**
 * POST /api/auth/signup. Prototype only: users live in server memory and the client keeps
 * the session in localStorage. Replace with NextAuth/Auth.js + the Prisma User model.
 */
export async function POST(req: Request) {
  const parsed = await parseBody(req, signupSchema);
  if ("response" in parsed) return parsed.response;
  const { name, email } = parsed.data;
  if (mockUsers.has(email.toLowerCase())) return apiError("An account with this email already exists. Try logging in.", 409);
  const user = mockUsers.create({ name, email, provider: "email" });
  return NextResponse.json({ user }, { status: 201 });
}
