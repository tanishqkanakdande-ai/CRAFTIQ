import type { CurrencyCode } from "@/lib/utils";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export const CATEGORIES = [
  "Robotics",
  "Home Automation",
  "Audio",
  "Lighting",
  "Arduino",
  "Raspberry Pi",
  "Recycled Materials",
  "Low-Cost Alternatives",
] as const;
export type Category = (typeof CATEGORIES)[number];

/** Hazard tags drive the mentor's safety rules: any tag means the plan can never be called "safe". */
export type Hazard = "high-voltage" | "battery" | "heat" | "laser" | "sharp-tools" | "chemicals" | "small-parts";

export interface PartAlternative {
  name: string;
  priceUSD?: number;
  note: string;
  /** Household or recycled substitute */
  household?: boolean;
}

export interface ComponentItem {
  id: string;
  name: string;
  qty: number;
  /** Unit price in USD; converted for display */
  unitPriceUSD: number;
  purpose: string;
  alternatives: PartAlternative[];
  optional?: boolean;
  /** Generic store search keywords. CraftIQ never opens a store without the user approving it. */
  searchQuery?: string;
}

export interface ToolItem {
  name: string;
  optional?: boolean;
  note?: string;
}

export type WireColor = "red" | "black" | "yellow" | "blue" | "green" | "white" | "orange" | "purple";

export interface WiringConnection {
  from: string;
  fromPin: string;
  to: string;
  toPin: string;
  wire: WireColor;
  note?: string;
}

export interface WiringSection {
  summary: string;
  nodes: string[];
  connections: WiringConnection[];
  notes: string[];
}

export interface BuildStep {
  id: string;
  title: string;
  detail: string;
  minutes: number;
  tip?: string;
  warning?: string;
}

export type SafetyLevel = "info" | "caution" | "danger";

export interface SafetyWarning {
  level: SafetyLevel;
  hazard?: Hazard;
  title: string;
  detail: string;
  saferAlternative?: string;
}

export interface TroubleshootItem {
  problem: string;
  fix: string;
}

export interface ProjectPlan {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  emoji: string;
  categories: Category[];
  difficulty: Difficulty;
  overview: string;
  howItWorks: string;
  timeHours: number;
  retailComparison: { product: string; priceUSD: number };
  components: ComponentItem[];
  tools: ToolItem[];
  wiring: WiringSection;
  steps: BuildStep[];
  safety: SafetyWarning[];
  testing: string[];
  troubleshooting: TroubleshootItem[];
  upgrades: string[];
  hazards: Hazard[];
  /** Gradient used for the card cover art */
  cover: [string, string];
  author?: { name: string; handle: string };
  likes?: number;
  builds?: number;
  source: "starter" | "community" | "ai";
  /** Present on AI-generated plans */
  generatedFor?: BuildPreferences;
  idea?: string;
  mentorNote?: string;
  changelog?: string[];
  createdAt?: string;
}

export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type ProjectSize = "pocket" | "desktop" | "room";

export interface BuildPreferences {
  budgetUSD?: number;
  skillLevel?: SkillLevel;
  tools?: string[];
  currency?: CurrencyCode;
  country?: string;
  size?: ProjectSize;
  purpose?: string;
}

export type ClarifyField = keyof Pick<BuildPreferences, "budgetUSD" | "skillLevel" | "tools" | "currency" | "size" | "purpose">;

export interface ClarifyQuestion {
  field: ClarifyField;
  question: string;
  why: string;
  options: { label: string; value: string }[];
  multi?: boolean;
  allowCustom?: boolean;
}

export interface ClarifyResponse {
  inferred: BuildPreferences;
  questions: ClarifyQuestion[];
  /** Short mentor message shown above the questions */
  message: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  provider: "email" | "google";
  skillLevel: SkillLevel;
  interests: Category[];
  tools: string[];
  country: string;
  currency: CurrencyCode;
  onboarded: boolean;
  createdAt: string;
}

export interface ProjectProgress {
  completedSteps: string[];
  checkedItems: string[];
  bookmarkedComponents: string[];
  notes: string;
}

export interface SavedProject {
  id: string;
  plan: ProjectPlan;
  progress: ProjectProgress;
  savedAt: string;
  updatedAt: string;
}
