import type { SkillLevel } from "@/lib/types";
import type { CurrencyCode } from "@/lib/utils";

export const SKILL_OPTIONS: { value: SkillLevel; label: string; description: string; emoji: string }[] = [
  { value: "beginner", label: "Total beginner", description: "I've never built electronics before.", emoji: "🌱" },
  { value: "intermediate", label: "Tinkerer", description: "I've built a few kits or Arduino projects.", emoji: "🔧" },
  { value: "advanced", label: "Confident maker", description: "I solder, code and design my own circuits.", emoji: "🚀" },
];

export const TOOL_OPTIONS = [
  { value: "basic", label: "Scissors, tape & glue" },
  { value: "soldering-iron", label: "Soldering iron" },
  { value: "drill", label: "Drill" },
  { value: "hot-glue", label: "Hot glue gun" },
  { value: "multimeter", label: "Multimeter" },
  { value: "3d-printer", label: "3D printer" },
];

export const COUNTRIES: { name: string; currency: CurrencyCode }[] = [
  { name: "United States", currency: "USD" },
  { name: "India", currency: "INR" },
  { name: "United Kingdom", currency: "GBP" },
  { name: "Germany", currency: "EUR" },
  { name: "France", currency: "EUR" },
  { name: "Canada", currency: "CAD" },
  { name: "Australia", currency: "AUD" },
  { name: "Nigeria", currency: "NGN" },
  { name: "Brazil", currency: "BRL" },
  { name: "Other", currency: "USD" },
];
