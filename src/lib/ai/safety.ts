import type { Hazard, ProjectPlan, SafetyWarning } from "@/lib/types";

/**
 * Safety rules for the CraftIQ mentor. These run on every plan, simulated or model-generated,
 * so the guarantees hold no matter where a plan came from:
 * 1. A plan with any hazard is never described as "safe".
 * 2. Every hazard has at least one warning with a safer alternative.
 * 3. Ideas that are too dangerous for a home build are redirected to a safer version.
 */

const HAZARD_KEYWORDS: Record<Hazard, RegExp> = {
  "high-voltage": /\b(mains|230 ?v|220 ?v|240 ?v|110 ?v|120 ?v|high[- ]voltage|wall socket|ac power|transformer|neon sign|tesla coil|plasma|stun|taser|zvs|flyback)\b/i,
  battery: /\b(lithium|li-?ion|li-?po|18650|lipo|battery|batteries|power bank|rechargeable|cell)\b/i,
  heat: /\b(solder|soldering|hot glue|heater|heating|lens|magnif|sun|fire|flame|3d print|heat|oven|hot)\b/i,
  laser: /\b(laser|lasers|engraver)\b/i,
  "sharp-tools": /\b(cut|cutting|knife|blade|drill|saw|box cutter|cardboard|wood|acrylic)\b/i,
  chemicals: /\b(etch|ferric|acid|resin|epoxy|spray paint|aerosol|solvent|bleach|chemical)\b/i,
  "small-parts": /\b(screw|nut|bolt|bead|small parts|arduino|esp32|sensor|led)\b/i,
};

/** Builds that should never get step-by-step home instructions. */
const REDIRECTS: { pattern: RegExp; reason: string; safer: string; saferIdea: string }[] = [
  {
    pattern: /\b(microwave (oven )?transformer|mot|spot welder|arc welder)\b/i,
    reason: "Microwave oven transformers output lethal voltage and current, and contain a capacitor that can kill even when unplugged.",
    safer: "a low-voltage battery-powered spot welder kit or a 12 V hot-wire foam cutter",
    saferIdea: "Arduino battery tester and power meter",
  },
  {
    pattern: /\b(tesla coil|stun gun|taser|zvs driver|flyback|plasma (ball|globe|speaker)|electric fence)\b/i,
    reason: "High-voltage generators can cause fatal shocks, burns, fires and radio interference, and some are illegal to own.",
    safer: "a solid-state 'singing' mini Tesla coil kit sold for education with a sealed enclosure, or a safe Van de Graaff demo",
    saferIdea: "Arduino musical light show",
  },
  {
    pattern: /\b(laser (cutter|engraver)|burning laser|high[- ]power laser|class (3b|4) laser)\b/i,
    reason: "Class 3B and 4 lasers cause instant, permanent eye damage from direct or reflected beams and can start fires.",
    safer: "a fully enclosed, certified Class 1 laser engraver, or a vinyl cutter for similar projects",
    saferIdea: "Arduino pen plotter",
  },
  {
    pattern: /\b(gun|weapon|explosive|firework|thermite|drone strike|jammer)\b/i,
    reason: "CraftIQ does not create plans for weapons, explosives or signal jammers.",
    safer: "a harmless project such as a foam dart target game or a model rocket from a certified kit",
    saferIdea: "Arduino reaction-time target game",
  },
];

export function detectHazards(text: string): Hazard[] {
  return (Object.keys(HAZARD_KEYWORDS) as Hazard[]).filter((h) => HAZARD_KEYWORDS[h].test(text));
}

export function findRedirect(idea: string) {
  return REDIRECTS.find((r) => r.pattern.test(idea));
}

const DEFAULT_WARNINGS: Record<Hazard, SafetyWarning> = {
  "high-voltage": {
    level: "danger",
    hazard: "high-voltage",
    title: "Mains and high voltage can kill",
    detail: "Do not open, modify or wire anything to household mains (110–240 V). Only use sealed, certified low-voltage adapters.",
    saferAlternative: "Run the project from a certified 5 V or 12 V adapter, or batteries.",
  },
  battery: {
    level: "caution",
    hazard: "battery",
    title: "Batteries can overheat or catch fire",
    detail: "Lithium cells can ignite if shorted, punctured, reversed or charged without protection. Never leave charging batteries unattended.",
    saferAlternative: "Use AA/AAA batteries or a ready-made USB power bank instead of bare lithium cells.",
  },
  heat: {
    level: "caution",
    hazard: "heat",
    title: "Hot tools and surfaces",
    detail: "Soldering irons, hot glue guns and focused light can cause burns or fires. Use stands, a heat-proof mat, and never leave hot tools unattended.",
    saferAlternative: "Use solderless connectors, tape or craft glue where possible.",
  },
  laser: {
    level: "danger",
    hazard: "laser",
    title: "Lasers cause permanent eye damage",
    detail: "Even reflected beams from lasers above Class 2 can blind instantly. Never point a laser at people, animals, vehicles or aircraft.",
    saferAlternative: "Use a Class 1 or Class 2 module (≤1 mW) or an LED instead.",
  },
  "sharp-tools": {
    level: "caution",
    hazard: "sharp-tools",
    title: "Sharp tools",
    detail: "Knives, saws and drills cause the most DIY injuries. Clamp work, cut away from your body, and wear eye protection when drilling.",
    saferAlternative: "Have an adult handle cutting for younger makers, or use pre-cut materials.",
  },
  chemicals: {
    level: "caution",
    hazard: "chemicals",
    title: "Chemicals and fumes",
    detail: "Paints, resins, solvents and etchants can irritate skin and lungs. Work outdoors or in a ventilated space with gloves and a mask.",
    saferAlternative: "Choose water-based paints and glues.",
  },
  "small-parts": {
    level: "info",
    hazard: "small-parts",
    title: "Small parts",
    detail: "Screws, LEDs and modules are choking hazards. Keep them away from young children and pets.",
  },
};

const SAFE_CLAIMS = /\b(completely|totally|100%|perfectly|entirely)\s+safe\b|\bis\s+(very\s+)?safe\b|\bno\s+risk\b|\brisk[- ]free\b|\bharmless\b/gi;

function scrubSafeClaims(text: string) {
  return text.replace(SAFE_CLAIMS, "lower-risk when you follow the safety notes");
}

/** Applies the mentor's safety rules to any plan. */
export function enforceSafety(plan: ProjectPlan, extraText = ""): ProjectPlan {
  // Scan the user's own words plus the physical things the build uses (not the prose, which
  // mentions hazards in negated forms like "no mains electricity needed").
  const textHazards = detectHazards(
    [extraText, plan.tools.map((t) => `${t.name} ${t.note ?? ""}`).join(" "), plan.components.map((c) => c.name).join(" ")].join(" ")
  );
  // Small-parts is too noisy to infer from text alone; keep it only when the plan declared it.
  const hazards = Array.from(new Set([...plan.hazards, ...textHazards.filter((h) => h !== "small-parts")]));

  const safety = plan.safety.map((w) => ({ ...w }));
  for (const h of hazards) {
    if (!safety.some((w) => w.hazard === h)) safety.push(DEFAULT_WARNINGS[h]);
  }
  for (const w of safety) {
    if (w.level !== "info" && !w.saferAlternative) {
      w.saferAlternative = w.hazard ? DEFAULT_WARNINGS[w.hazard].saferAlternative : "Ask an experienced maker to supervise this step.";
    }
  }
  const order = { danger: 0, caution: 1, info: 2 } as const;
  safety.sort((a, b) => order[a.level] - order[b.level]);

  return {
    ...plan,
    hazards,
    overview: scrubSafeClaims(plan.overview),
    howItWorks: scrubSafeClaims(plan.howItWorks),
    mentorNote: plan.mentorNote ? scrubSafeClaims(plan.mentorNote) : plan.mentorNote,
    safety,
  };
}
