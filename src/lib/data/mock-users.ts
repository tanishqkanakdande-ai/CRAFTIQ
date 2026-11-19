import type { UserProfile } from "@/lib/types";
import { uid } from "@/lib/utils";

const store = new Map<string, UserProfile>();

/** In-memory user store for the prototype; resets when the server restarts. */
export const mockUsers = {
  has: (email: string) => store.has(email),
  get: (email: string) => store.get(email),
  create(input: Pick<UserProfile, "name" | "email" | "provider"> & { onboarded?: boolean }): UserProfile {
    const user: UserProfile = {
      id: uid("usr"),
      name: input.name,
      email: input.email.toLowerCase(),
      provider: input.provider,
      skillLevel: "beginner",
      interests: [],
      tools: [],
      country: "",
      currency: "USD",
      onboarded: input.onboarded ?? false,
      createdAt: new Date().toISOString(),
    };
    store.set(user.email, user);
    return user;
  },
};
