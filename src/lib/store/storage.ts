/** localStorage helpers that never throw (private mode, SSR, quota errors). */
export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    if (value === undefined || value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable; the prototype keeps working in memory */
  }
}

export const KEYS = {
  user: "craftiq:user",
  projects: (userId: string) => `craftiq:projects:${userId}`,
  pendingSave: "craftiq:pending-save",
  lastPlan: "craftiq:last-plan",
};
