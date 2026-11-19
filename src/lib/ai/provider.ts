import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { BuildPreferences, ClarifyResponse, ProjectPlan } from "@/lib/types";
import { slugify, uid } from "@/lib/utils";
import * as mock from "./mock-engine";
import { MENTOR_SYSTEM_PROMPT, PLAN_JSON_INSTRUCTIONS } from "./mentor-prompt";
import { enforceSafety } from "./safety";
import { modelPlanSchema } from "./schema";

/**
 * The mentor interface every AI backend implements. The API routes only talk to this,
 * so swapping the simulated mentor for a real model is a one-file change.
 */
export interface Mentor {
  name: string;
  clarify(idea: string, known: BuildPreferences): Promise<ClarifyResponse>;
  generate(idea: string, prefs: BuildPreferences): Promise<ProjectPlan>;
  improve(plan: ProjectPlan, request: string): Promise<ProjectPlan>;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const simulatedMentor: Mentor = {
  name: "simulated",
  async clarify(idea, known) {
    await delay(500);
    return mock.clarify(idea, known);
  },
  async generate(idea, prefs) {
    await delay(1400);
    return mock.generatePlan(idea, prefs);
  },
  async improve(plan, request) {
    await delay(1100);
    return mock.improvePlan(plan, request);
  },
};

const COVERS: [string, string][] = [
  ["#3b82f6", "#8b5cf6"],
  ["#06b6d4", "#39ff88"],
  ["#8b5cf6", "#ec4899"],
  ["#f59e0b", "#8b5cf6"],
];

function parseJSON(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("No JSON object in model response");
  return JSON.parse(text.slice(start, end + 1));
}

/** Claude-backed mentor. Used when ANTHROPIC_API_KEY is set; falls back to the simulation on any failure. */
function claudeMentor(): Mentor {
  const client = new Anthropic();
  const model = process.env.CRAFTIQ_AI_MODEL || "claude-opus-5-5";

  async function ask(prompt: string): Promise<string> {
    const response = await client.beta.messages.create({
      model,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium" },
      system: MENTOR_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });
    if (response.stop_reason === "refusal") throw new Error("Model declined the request");
    return response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  }

  async function toPlan(text: string, prefs: BuildPreferences | undefined, base?: ProjectPlan): Promise<ProjectPlan> {
    const parsed = modelPlanSchema.parse(parseJSON(text));
    const plan: ProjectPlan = {
      ...parsed,
      id: base?.id ?? uid("plan"),
      slug: base?.slug ?? `${slugify(parsed.title)}-${Math.random().toString(36).slice(2, 6)}`,
      cover: base?.cover ?? COVERS[Math.floor(Math.random() * COVERS.length)],
      source: "ai",
      generatedFor: prefs ?? base?.generatedFor,
      idea: base?.idea,
      createdAt: base?.createdAt ?? new Date().toISOString(),
    };
    return enforceSafety(plan);
  }

  return {
    name: `claude:${model}`,
    // Clarifying questions are cheap and deterministic, so they stay rule-based.
    clarify: simulatedMentor.clarify,
    async generate(idea, prefs) {
      try {
        const text = await ask(
          `Create a complete build plan.\nIdea: ${idea}\nPreferences: ${JSON.stringify(prefs)}\n\n${PLAN_JSON_INSTRUCTIONS}`
        );
        return { ...(await toPlan(text, prefs)), idea };
      } catch (err) {
        console.error("[craftiq] Claude generate failed, using simulated mentor:", err);
        return mock.generatePlan(idea, prefs);
      }
    },
    async improve(plan, request) {
      try {
        const { id, slug, cover, createdAt, generatedFor, source, changelog, ...editable } = plan;
        void id; void slug; void cover; void createdAt; void generatedFor; void source; void changelog;
        const text = await ask(
          `Improve this build plan based on the user's request. Keep everything that still applies, and put a one-sentence summary of what changed in mentorNote.\nRequest: ${request}\nCurrent plan: ${JSON.stringify(editable)}\n\n${PLAN_JSON_INSTRUCTIONS}`
        );
        const next = await toPlan(text, undefined, plan);
        return { ...next, changelog: next.mentorNote ? [next.mentorNote] : ["Plan updated."] };
      } catch (err) {
        console.error("[craftiq] Claude improve failed, using simulated mentor:", err);
        return mock.improvePlan(plan, request);
      }
    },
  };
}

let cached: Mentor | undefined;
export function getMentor(): Mentor {
  cached ??= process.env.ANTHROPIC_API_KEY ? claudeMentor() : simulatedMentor;
  return cached;
}
