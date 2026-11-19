import { projects, planCostUSD } from "@/lib/data/projects";
import type {
  BuildPreferences,
  ClarifyQuestion,
  ClarifyResponse,
  ComponentItem,
  ProjectPlan,
  SkillLevel,
} from "@/lib/types";
import { CURRENCIES, type CurrencyCode, slugify, uid } from "@/lib/utils";
import { enforceSafety, findRedirect } from "./safety";

/**
 * Simulated AI mentor. It parses the idea with simple heuristics, picks the closest
 * starter project as a template and personalises it. Swap for a model via provider.ts.
 */

const TEMPLATE_KEYWORDS: { slug: string; pattern: RegExp }[] = [
  { slug: "diy-low-cost-smartphone-projector", pattern: /project(or|ion)|cinema|movie|home theat|beamer/i },
  { slug: "recycled-bluetooth-speaker", pattern: /speaker|bluetooth audio|boombox|sound ?system|amp(lifier)?\b|music box/i },
  { slug: "smart-plant-watering-system", pattern: /plant|water(ing)?|garden|soil|irrigat|greenhouse/i },
  { slug: "line-following-robot", pattern: /robot|rover|car\b|line follow|obstacle|vehicle|bot\b/i },
  { slug: "wifi-smart-home-light", pattern: /smart (home )?light|lamp|wi-?fi light|rgb|mood light|alexa|home assistant|smart bulb/i },
  { slug: "recycled-jar-firefly-lantern", pattern: /lantern|fairy|night ?light|decorat|led (jar|decor)|christmas|diwali|festive|glow/i },
  { slug: "raspberry-pi-retro-console", pattern: /retro|arcade|game console|emulat|raspberry|gaming/i },
  { slug: "cardboard-robotic-arm", pattern: /arm\b|gripper|servo|claw|robotic hand/i },
];

const CURRENCY_HINTS: { pattern: RegExp; code: CurrencyCode }[] = [
  { pattern: /₹|\brs\.?\s?\d|\binr\b|rupee/i, code: "INR" },
  { pattern: /€|\beur\b|euro/i, code: "EUR" },
  { pattern: /£|\bgbp\b|pound|quid/i, code: "GBP" },
  { pattern: /c\$|\bcad\b/i, code: "CAD" },
  { pattern: /a\$|\baud\b/i, code: "AUD" },
  { pattern: /₦|\bngn\b|naira/i, code: "NGN" },
  { pattern: /r\$|\bbrl\b|reais|real\b/i, code: "BRL" },
  { pattern: /\$|\busd\b|dollar|bucks/i, code: "USD" },
];

export function parseIdea(idea: string): BuildPreferences {
  const prefs: BuildPreferences = {};
  const text = idea.toLowerCase();

  const currency = CURRENCY_HINTS.find((c) => c.pattern.test(idea))?.code;
  if (currency) prefs.currency = currency;

  const money =
    idea.match(/(?:[$€£₹₦]|rs\.?|c\$|a\$|r\$)\s?(\d[\d,]*(?:\.\d+)?)/i) ??
    idea.match(/(\d[\d,]*(?:\.\d+)?)\s?(?:dollars|bucks|usd|eur|euros|gbp|pounds|inr|rupees|naira|reais)/i) ??
    idea.match(/(?:under|below|less than|budget(?: of)?|max(?:imum)?)\s+(\d[\d,]*)/i);
  if (money) {
    const amount = Number(money[1].replace(/,/g, ""));
    if (amount > 0) prefs.budgetUSD = Math.round((amount / CURRENCIES[prefs.currency ?? "USD"].rate) * 100) / 100;
  }

  if (/\b(beginner|newbie|first (time|project)|never (built|made|soldered)|kid|child|easy|simple)\b/.test(text)) prefs.skillLevel = "beginner";
  else if (/\b(intermediate|some experience|done a few)\b/.test(text)) prefs.skillLevel = "intermediate";
  else if (/\b(advanced|expert|experienced|engineer)\b/.test(text)) prefs.skillLevel = "advanced";

  const tools: string[] = [];
  if (/no solder|without solder|can'?t solder|don'?t have a solder/.test(text)) tools.push("no-soldering");
  else if (/soldering iron|i can solder|have a solder/.test(text)) tools.push("soldering-iron");
  if (/3d print/.test(text)) tools.push("3d-printer");
  if (/basic tools|only scissors|no tools/.test(text)) tools.push("basic");
  if (tools.length) prefs.tools = tools;

  if (/\b(pocket|portable|tiny|small|mini|compact)\b/.test(text)) prefs.size = "pocket";
  else if (/\b(desk|desktop|table)\b/.test(text)) prefs.size = "desktop";
  else if (/\b(room|large|big|outdoor|wall)\b/.test(text)) prefs.size = "room";

  const purpose = idea.match(/\bfor (?:my |a |the |our )?([^.,!?]{3,60})/i);
  if (purpose && !/\$|\d/.test(purpose[1])) prefs.purpose = purpose[1].trim();

  return prefs;
}

export function matchTemplate(idea: string) {
  const hit = TEMPLATE_KEYWORDS.find((t) => t.pattern.test(idea));
  return hit ? projects.find((p) => p.slug === hit.slug) : undefined;
}

export function clarify(idea: string, known: BuildPreferences = {}): ClarifyResponse {
  const inferred = { ...known, ...stripUndefined(parseIdea(idea)) };
  const template = matchTemplate(idea);
  const vague = !template && idea.trim().split(/\s+/).length < 6;
  const questions: ClarifyQuestion[] = [];

  if (inferred.budgetUSD === undefined) {
    const cur = inferred.currency ?? "USD";
    const fmt = (usd: number) => `${CURRENCIES[cur].symbol}${Math.round(usd * CURRENCIES[cur].rate).toLocaleString()}`;
    questions.push({
      field: "budgetUSD",
      question: "What's your budget for parts?",
      why: "I'll choose parts and substitutes that fit it.",
      options: [
        { label: `Under ${fmt(20)}`, value: "20" },
        { label: `Around ${fmt(50)}`, value: "50" },
        { label: `Up to ${fmt(100)}`, value: "100" },
        { label: "Flexible", value: "250" },
      ],
    });
  }
  if (!inferred.skillLevel) {
    questions.push({
      field: "skillLevel",
      question: "How much electronics experience do you have?",
      why: "This changes how much I explain and which techniques I suggest.",
      options: [
        { label: "Total beginner", value: "beginner" },
        { label: "Built a few things", value: "intermediate" },
        { label: "Confident maker", value: "advanced" },
      ],
    });
  }
  if (!inferred.tools?.length) {
    questions.push({
      field: "tools",
      question: "Which tools do you already have?",
      why: "I'll avoid steps that need tools you don't own.",
      multi: true,
      options: [
        { label: "Scissors & tape", value: "basic" },
        { label: "Soldering iron", value: "soldering-iron" },
        { label: "Drill", value: "drill" },
        { label: "Hot glue gun", value: "hot-glue" },
        { label: "Multimeter", value: "multimeter" },
        { label: "3D printer", value: "3d-printer" },
      ],
    });
  }
  if (!inferred.currency) {
    questions.push({
      field: "currency",
      question: "Which currency should I price things in?",
      why: "Prices and savings will be shown in your currency.",
      options: (Object.keys(CURRENCIES) as CurrencyCode[]).slice(0, 6).map((c) => ({ label: `${CURRENCIES[c].symbol} ${c}`, value: c })),
    });
  }
  const sizeMatters = template && ["diy-low-cost-smartphone-projector", "recycled-bluetooth-speaker", "wifi-smart-home-light"].includes(template.slug);
  if (sizeMatters && !inferred.size) {
    questions.push({
      field: "size",
      question: "What size are you imagining?",
      why: "Size affects the enclosure, the parts and the result.",
      options: [
        { label: "Pocket / portable", value: "pocket" },
        { label: "Desktop", value: "desktop" },
        { label: "Room-filling", value: "room" },
      ],
    });
  }
  if (vague && !inferred.purpose) {
    questions.push({
      field: "purpose",
      question: "What will you mainly use it for?",
      why: "Your idea is open-ended, so the purpose helps me pick the right design.",
      allowCustom: true,
      options: [
        { label: "Learning electronics", value: "learning electronics" },
        { label: "A gift", value: "a gift" },
        { label: "Around the house", value: "around the house" },
        { label: "School project", value: "a school project" },
      ],
    });
  }

  const message = questions.length
    ? template
      ? `Love it! This sounds like a ${template.title.toLowerCase()} build. A few quick questions so I can tailor the plan:`
      : "Great idea! A couple of quick questions so I can design this properly:"
    : "I have everything I need. Generating your build plan…";

  return { inferred, questions, message };
}

function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

function clonePlan(plan: ProjectPlan): ProjectPlan {
  return JSON.parse(JSON.stringify(plan)) as ProjectPlan;
}

function cheapestSwap(c: ComponentItem): { item: ComponentItem; note?: string } {
  const options = c.alternatives
    .map((a) => ({ a, price: a.household ? 0 : a.priceUSD }))
    .filter((o): o is { a: (typeof c.alternatives)[number]; price: number } => o.price !== undefined && o.price < c.unitPriceUSD);
  if (!options.length) return { item: c };
  options.sort((x, y) => x.price - y.price);
  const best = options[0];
  const previous = c.name;
  const item: ComponentItem = {
    ...c,
    name: best.a.name,
    unitPriceUSD: best.price,
    searchQuery: undefined,
    purpose: `${c.purpose} (${best.a.note})`,
    alternatives: [{ name: previous, priceUSD: c.unitPriceUSD, note: "Original recommendation; better quality if your budget allows." }, ...c.alternatives.filter((a) => a !== best.a)],
  };
  return { item, note: `Swapped “${previous}” for “${best.a.name}” to save money.` };
}

export function fitBudget(plan: ProjectPlan, budgetUSD: number): { plan: ProjectPlan; changes: string[] } {
  const changes: string[] = [];
  let next = clonePlan(plan);
  if (planCostUSD(next) <= budgetUSD) return { plan: next, changes };

  // 1) drop optional parts, 2) swap the most expensive parts for cheaper alternatives.
  const optional = next.components.filter((c) => c.optional && c.unitPriceUSD > 0);
  if (optional.length) {
    next.components = next.components.filter((c) => !(c.optional && c.unitPriceUSD > 0));
    changes.push(`Removed optional extras (${optional.map((c) => c.name).join(", ")}) to fit your budget. They're listed under upgrades.`);
    next.upgrades = [...optional.map((c) => `Add ${c.name}: ${c.purpose}`), ...next.upgrades];
  }
  const byPrice = [...next.components].sort((a, b) => b.unitPriceUSD * b.qty - a.unitPriceUSD * a.qty);
  for (const c of byPrice) {
    if (planCostUSD(next) <= budgetUSD) break;
    const { item, note } = cheapestSwap(c);
    if (note) {
      next.components = next.components.map((x) => (x.id === c.id ? item : x));
      changes.push(note);
    }
  }
  if (planCostUSD(next) > budgetUSD) {
    changes.push("Even with substitutes this build is slightly above your budget. Check the household alternatives for each part, or buy parts over time.");
  }
  next = { ...next };
  return { plan: next, changes };
}

const SKILL_NOTES: Record<SkillLevel, string> = {
  beginner:
    "Take your time and read each step fully before starting it. I've flagged tricky steps with tips, and every part has a beginner-friendly alternative.",
  intermediate: "You should be comfortable with this build. The upgrade ideas at the end are a good stretch goal.",
  advanced: "This will be quick for you. Consider the upgrades section, or tune the design for performance.",
};

function personalise(base: ProjectPlan, idea: string, prefs: BuildPreferences): ProjectPlan {
  let plan = clonePlan(base);
  const changelog: string[] = [];

  if (prefs.budgetUSD) {
    const fitted = fitBudget(plan, prefs.budgetUSD);
    plan = fitted.plan;
    changelog.push(...fitted.changes);
  }

  const noSolder = prefs.tools?.includes("no-soldering") || (prefs.tools?.length && !prefs.tools.includes("soldering-iron"));
  if (noSolder && plan.tools.some((t) => /solder/i.test(t.name) && !t.optional)) {
    plan.tools = plan.tools.map((t) =>
      /solder/i.test(t.name) ? { ...t, optional: true, note: "You said you don't have one. Use screw-terminal modules, lever connectors or clip-on connectors instead." } : t
    );
    plan.components.push({
      id: "c_solderless",
      name: "Solderless connector kit (lever connectors + screw terminals)",
      qty: 1,
      unitPriceUSD: 5,
      purpose: "Replaces soldered joints so you can build without a soldering iron.",
      alternatives: [{ name: "Twist and tape with heat-shrink", note: "Works for low-current wires; less reliable long term." }],
    });
    changelog.push("Made the build solderless because you don't have a soldering iron.");
  }

  if (prefs.skillLevel === "beginner" && plan.difficulty !== "Beginner") {
    plan.steps[0] = { ...plan.steps[0], tip: `${plan.steps[0].tip ? plan.steps[0].tip + " " : ""}New to this? Watch a 5-minute video on the basic technique before you start; it makes the rest much easier.` };
    changelog.push("Added extra beginner guidance to the first step.");
  }

  if (prefs.size === "pocket" && /projector/i.test(plan.title)) {
    plan.overview += " For a pocket size, use a smaller (75 mm) lens and a tissue-box body; the image will be smaller and best at 1 m.";
  } else if (prefs.size === "room" && /projector/i.test(plan.title)) {
    plan.overview += " For a room-filling picture, use an A4 Fresnel lens in a longer box and project from 2.5–3 m in total darkness.";
  }

  const tailored = idea.length > 0 ? idea.trim().replace(/\s+/g, " ") : plan.title;
  plan.mentorNote = [
    `I based this on your idea: “${tailored.slice(0, 140)}${tailored.length > 140 ? "…" : ""}”.`,
    prefs.purpose ? `Since it's for ${prefs.purpose}, I focused on reliability and a clean finish.` : "",
    prefs.skillLevel ? SKILL_NOTES[prefs.skillLevel] : "",
    "I can prepare shopping lists, but I'll never buy anything or contact anyone for you without your approval.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    ...plan,
    id: uid("plan"),
    slug: `${base.slug}-${Math.random().toString(36).slice(2, 6)}`,
    source: "ai",
    generatedFor: prefs,
    changelog,
    createdAt: new Date().toISOString(),
  };
}

function genericPlan(idea: string, prefs: BuildPreferences, redirect?: ReturnType<typeof findRedirect>): ProjectPlan {
  const rawTitle = redirect
    ? redirect.saferIdea
    : idea
        .replace(/^(i want to|i'd like to|how (do|can) i|help me|can you help me)\s+(make|build|create)\s+/i, "")
        .replace(/^(a|an|the|my)\s+/i, "")
        .split(/[.,!?]| for | under | that | which | with | using /i)[0];
  const title = rawTitle
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || "Custom Arduino Gadget";
  const base: ProjectPlan = {
    id: uid("plan"),
    slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    tagline: `A custom Arduino-based build for “${title.toLowerCase()}”.`,
    emoji: "⚡",
    categories: ["Arduino"],
    difficulty: prefs.skillLevel === "advanced" ? "Advanced" : prefs.skillLevel === "intermediate" ? "Intermediate" : "Beginner",
    overview: `A prototype of “${title}” built around an Arduino, a breadboard and low-voltage modules. You'll start with a working breadboard prototype, then move it into an enclosure made from recycled materials. This plan is a starting framework; use “Ask AI to improve this plan” to refine it for your exact goal.`,
    howItWorks:
      "Sensors or buttons feed information into the Arduino. Your code decides what to do and drives outputs such as LEDs, a buzzer, a display or a small motor. Everything runs on safe 5 V USB power.",
    timeHours: 3,
    retailComparison: { product: `Commercial ${title.toLowerCase()}`, priceUSD: 40 },
    hazards: ["small-parts"],
    cover: ["#3b82f6", "#39ff88"],
    source: "ai",
    components: [
      { id: "c_uno", name: "Arduino Uno (compatible) + USB cable", qty: 1, unitPriceUSD: 10, purpose: "The programmable brain.", alternatives: [{ name: "Arduino Nano", priceUSD: 6, note: "Smaller and cheaper." }] },
      { id: "c_bb", name: "Breadboard + jumper wire kit", qty: 1, unitPriceUSD: 4, purpose: "Build circuits without soldering.", alternatives: [] },
      { id: "c_sensor", name: "Sensor module suited to your idea (e.g. PIR, light, temperature, ultrasonic)", qty: 1, unitPriceUSD: 3, purpose: "Senses the world.", alternatives: [{ name: "Push button", priceUSD: 0.2, note: "Simplest input to start with." }] },
      { id: "c_out", name: "Output: LEDs, buzzer, or 0.96\" OLED display", qty: 1, unitPriceUSD: 4, purpose: "Shows or does something.", alternatives: [{ name: "Single LED + 220 Ω resistor", priceUSD: 0.3, note: "Great first output." }] },
      { id: "c_psu", name: "5 V USB power supply", qty: 1, unitPriceUSD: 0, purpose: "Power.", alternatives: [{ name: "Old phone charger", note: "Any 5 V 1 A+ charger.", household: true }] },
      { id: "c_case", name: "Enclosure from a recycled box or container", qty: 1, unitPriceUSD: 0, purpose: "Houses the project.", alternatives: [{ name: "Cardboard box", note: "Easy to cut.", household: true }] },
    ],
    tools: [{ name: "Computer with Arduino IDE" }, { name: "Scissors or craft knife" }, { name: "Tape or hot glue" }],
    wiring: {
      summary: "Sensor signal to a digital or analog input, output device on a digital pin, everything sharing 5 V and GND.",
      nodes: ["Arduino Uno", "Sensor module", "Output device", "5V USB supply"],
      connections: [
        { from: "5V USB supply", fromPin: "USB", to: "Arduino Uno", toPin: "USB port", wire: "red" },
        { from: "Sensor module", fromPin: "VCC / GND", to: "Arduino Uno", toPin: "5V / GND", wire: "red" },
        { from: "Sensor module", fromPin: "OUT", to: "Arduino Uno", toPin: "D2 or A0", wire: "yellow" },
        { from: "Arduino Uno", fromPin: "D9", to: "Output device", toPin: "IN / + (via resistor for LEDs)", wire: "green" },
        { from: "Output device", fromPin: "GND", to: "Arduino Uno", toPin: "GND", wire: "black" },
      ],
      notes: ["Always add a 220 Ω resistor in series with LEDs.", "Disconnect USB before rewiring."],
    },
    steps: [
      { id: "s1", title: "Define what success looks like", detail: "Write one sentence: “When ___ happens, my project should ___.” This keeps the build focused.", minutes: 10 },
      { id: "s2", title: "Blink test", detail: "Upload the Blink example to confirm your Arduino and computer are working.", minutes: 15 },
      { id: "s3", title: "Wire and test the input", detail: "Connect the sensor and print its readings to the serial monitor.", minutes: 30 },
      { id: "s4", title: "Wire and test the output", detail: "Connect the LED, buzzer or display and make it respond to a simple command.", minutes: 30 },
      { id: "s5", title: "Write the logic", detail: "Combine both: if the sensor reading passes your threshold, trigger the output.", minutes: 45 },
      { id: "s6", title: "Build the enclosure", detail: "Cut openings in a recycled box for the sensor, output and USB cable.", minutes: 40, warning: "Cut away from your body with a sharp blade on a cutting mat." },
      { id: "s7", title: "Test, refine, share", detail: "Use it for a day, note what to improve, and ask the AI mentor for the next version.", minutes: 20 },
    ],
    safety: [],
    testing: ["Serial monitor shows sensible sensor values.", "Output responds every time the trigger happens.", "Project works on USB power without the computer."],
    troubleshooting: [
      { problem: "Upload fails", fix: "Select the right board and port in the Arduino IDE; try another USB cable (some are charge-only)." },
      { problem: "Sensor reads nothing", fix: "Check VCC, GND and signal pin wiring against the diagram." },
    ],
    upgrades: ["Add Wi-Fi with an ESP32 for phone notifications.", "Design a 3D-printed or laser-cut case.", "Add a rechargeable USB power bank for portability."],
  };

  if (redirect) {
    base.mentorNote = `I can't give build instructions for that idea. ${redirect.reason} A safer route is ${redirect.safer}. I've put together a low-voltage project in the same spirit instead.`;
    base.safety.push({
      level: "danger",
      hazard: "high-voltage",
      title: "Why the original idea was changed",
      detail: redirect.reason,
      saferAlternative: `Try ${redirect.safer}.`,
    });
  }
  return base;
}

export function generatePlan(idea: string, prefs: BuildPreferences): ProjectPlan {
  const redirect = findRedirect(idea);
  const template = redirect ? undefined : matchTemplate(idea);
  const plan = template ? personalise(template, idea, prefs) : genericPlan(idea, prefs, redirect);
  if (!template && !redirect) {
    plan.mentorNote = `I didn't find a close match in our project library, so I built a flexible Arduino framework for “${plan.title}”. Use “Ask AI to improve this plan” to tell me more and I'll refine the parts list. I'll never buy anything or contact anyone for you without your approval.`;
    plan.generatedFor = prefs;
    if (prefs.budgetUSD) {
      const fitted = fitBudget(plan, prefs.budgetUSD);
      return enforceSafety({ ...fitted.plan, changelog: fitted.changes, idea }, idea);
    }
  }
  if (redirect) plan.generatedFor = prefs;
  plan.idea = idea;
  return enforceSafety(plan, idea);
}

const IMPROVEMENTS: { pattern: RegExp; apply: (plan: ProjectPlan) => string | null }[] = [
  {
    pattern: /cheap|budget|cost|afford|less money|save/i,
    apply: (plan) => {
      const before = planCostUSD(plan);
      const { plan: next, changes } = fitBudget(plan, Math.max(1, before * 0.6));
      Object.assign(plan, next);
      return changes.length ? changes.join(" ") : "This plan is already close to the cheapest practical version.";
    },
  },
  {
    pattern: /easi|simple|beginner|kid|child|no solder/i,
    apply: (plan) => {
      plan.tools = plan.tools.map((t) => (/solder|drill/i.test(t.name) ? { ...t, optional: true, note: "Optional: use solderless connectors or pre-cut parts instead." } : t));
      plan.steps = plan.steps.map((s) => ({ ...s, tip: s.tip ?? "Take a photo before and after each step, so you can compare if something goes wrong." }));
      return "Made soldering and drilling optional and added a beginner tip to every step.";
    },
  },
  {
    pattern: /bright|bigger image|clear|sharp/i,
    apply: (plan) => {
      if (!/projector/i.test(plan.title)) return null;
      plan.components = plan.components.map((c) =>
        c.id === "c_lens" ? { ...c, name: "A4 Fresnel lens (full page, 3×)", unitPriceUSD: 5, searchQuery: "A4 Fresnel lens magnifier sheet", purpose: "A much larger lens collects more light for a brighter, larger image." } : c
      );
      plan.steps.splice(4, 0, {
        id: "s_hood",
        title: "Add a lens hood",
        detail: "Roll black card into a 6 cm tube around the lens to block room light from washing out the image.",
        minutes: 10,
      });
      return "Upgraded to an A4 Fresnel lens and added a lens hood for a brighter, higher-contrast picture.";
    },
  },
  {
    pattern: /safe|safer|danger|risk/i,
    apply: (plan) => {
      plan.safety.push({
        level: "info",
        title: "Build with a buddy",
        detail: "Have someone nearby for steps with tools or batteries, keep a first-aid kit and a fire blanket or extinguisher in reach, and unplug power before changing wiring.",
      });
      return "Added extra safety guidance. Note: the hazards listed still apply. Following the warnings lowers risk; it doesn't remove it.";
    },
  },
  {
    pattern: /wi-?fi|app|phone|smart|remote|bluetooth|iot/i,
    apply: (plan) => {
      plan.components.push({
        id: "c_esp32_upgrade",
        name: "ESP32 dev board",
        qty: 1,
        unitPriceUSD: 6,
        purpose: "Adds Wi-Fi and Bluetooth so you can control or monitor the project from your phone.",
        alternatives: [{ name: "ESP8266 (Wemos D1 mini)", priceUSD: 3, note: "Wi-Fi only, cheaper." }],
        optional: true,
      });
      plan.upgrades.unshift("Use the ESP32 with the free Blynk or Home Assistant apps for phone control.");
      return "Added an ESP32 so you can connect the project to your phone.";
    },
  },
  {
    pattern: /recycl|upcycl|household|reuse|eco|sustain/i,
    apply: (plan) => {
      let swapped = 0;
      plan.components = plan.components.map((c) => {
        const household = c.alternatives.find((a) => a.household);
        if (!household || c.unitPriceUSD === 0) return c;
        swapped++;
        return { ...c, name: household.name, unitPriceUSD: 0, searchQuery: undefined, purpose: `${c.purpose} (${household.note})`, alternatives: [{ name: c.name, priceUSD: c.unitPriceUSD, note: "New part, if you can't find one to reuse." }, ...c.alternatives.filter((a) => a !== household)] };
      });
      return swapped ? `Swapped ${swapped} part${swapped > 1 ? "s" : ""} for household or recycled alternatives.` : "This plan already uses every practical recycled substitute.";
    },
  },
  {
    pattern: /fast|quick|time|hour/i,
    apply: (plan) => {
      const optional = plan.steps.filter((s) => /decorat|finish|record|schedule/i.test(s.title));
      plan.steps = plan.steps.filter((s) => !optional.includes(s));
      plan.timeHours = Math.max(0.5, Math.round((plan.timeHours - optional.length * 0.4) * 10) / 10);
      return optional.length ? `Moved ${optional.length} finishing step(s) to “upgrades” to save time.` : "Every step in this plan is essential, so I kept them all.";
    },
  },
];

export function improvePlan(plan: ProjectPlan, request: string): ProjectPlan {
  const next = clonePlan(plan);
  const notes: string[] = [];
  for (const imp of IMPROVEMENTS) {
    if (imp.pattern.test(request)) {
      const note = imp.apply(next);
      if (note) notes.push(note);
    }
  }
  if (!notes.length) {
    next.upgrades.unshift(`Your idea: ${request.trim()}`);
    notes.push(
      "I added your suggestion to the upgrade ideas. With the simulated mentor I can make specific changes for: cheaper, easier, brighter, safer, phone control, recycled parts or faster builds."
    );
  }
  next.changelog = notes;
  next.mentorNote = `Updated: ${notes[0]}`;
  next.source = "ai";
  return enforceSafety(next, request);
}
