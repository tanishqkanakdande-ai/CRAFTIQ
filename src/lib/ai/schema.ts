import { z } from "zod";
import { CATEGORIES } from "@/lib/types";
import { CURRENCIES } from "@/lib/utils";

const hazard = z.enum(["high-voltage", "battery", "heat", "laser", "sharp-tools", "chemicals", "small-parts"]);
const wire = z.enum(["red", "black", "yellow", "blue", "green", "white", "orange", "purple"]);

export const preferencesSchema = z.object({
  budgetUSD: z.number().positive().max(100000).optional(),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  tools: z.array(z.string().max(40)).max(20).optional(),
  currency: z.enum(Object.keys(CURRENCIES) as [keyof typeof CURRENCIES, ...(keyof typeof CURRENCIES)[]]).optional(),
  country: z.string().max(60).optional(),
  size: z.enum(["pocket", "desktop", "room"]).optional(),
  purpose: z.string().max(200).optional(),
});

export const ideaSchema = z.string().trim().min(3, "Tell me a little more about your idea.").max(1000, "Please keep your idea under 1000 characters.");

export const clarifyRequestSchema = z.object({ idea: ideaSchema, known: preferencesSchema.optional() });
export const generateRequestSchema = z.object({ idea: ideaSchema, preferences: preferencesSchema });

/** Shape the model must return. Server fills ids, slug, cover and metadata. */
export const modelPlanSchema = z.object({
  title: z.string().min(2).max(120),
  tagline: z.string().max(240),
  emoji: z.string().max(8).default("⚡"),
  categories: z.array(z.enum(CATEGORIES)).min(1),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  overview: z.string(),
  howItWorks: z.string(),
  timeHours: z.number().positive(),
  retailComparison: z.object({ product: z.string(), priceUSD: z.number().nonnegative() }),
  components: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        qty: z.number().int().positive(),
        unitPriceUSD: z.number().nonnegative(),
        purpose: z.string(),
        optional: z.boolean().optional(),
        alternatives: z.array(z.object({ name: z.string(), priceUSD: z.number().nonnegative().optional(), note: z.string(), household: z.boolean().optional() })),
      })
    )
    .min(1),
  tools: z.array(z.object({ name: z.string(), optional: z.boolean().optional(), note: z.string().optional() })),
  wiring: z.object({
    summary: z.string(),
    nodes: z.array(z.string()),
    notes: z.array(z.string()),
    connections: z.array(z.object({ from: z.string(), fromPin: z.string(), to: z.string(), toPin: z.string(), wire, note: z.string().optional() })),
  }),
  steps: z
    .array(z.object({ id: z.string(), title: z.string(), detail: z.string(), minutes: z.number().nonnegative(), tip: z.string().optional(), warning: z.string().optional() }))
    .min(1),
  safety: z.array(
    z.object({ level: z.enum(["info", "caution", "danger"]), hazard: hazard.optional(), title: z.string(), detail: z.string(), saferAlternative: z.string().optional() })
  ),
  testing: z.array(z.string()),
  troubleshooting: z.array(z.object({ problem: z.string(), fix: z.string() })),
  upgrades: z.array(z.string()),
  hazards: z.array(hazard),
  mentorNote: z.string().optional(),
});

export type ModelPlan = z.infer<typeof modelPlanSchema>;
