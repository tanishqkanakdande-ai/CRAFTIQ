"use client";

import { Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES, SKILL_OPTIONS, TOOL_OPTIONS } from "@/lib/data/profile-options";
import { CATEGORIES, type Category, type SkillLevel } from "@/lib/types";
import { CURRENCIES, cn, type CurrencyCode } from "@/lib/utils";

const chip = (on: boolean) =>
  cn(
    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-electric cursor-pointer",
    on ? "border-neon bg-neon/15 text-neon" : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
  );

export function SkillPicker({ value, onChange }: { value: SkillLevel; onChange: (v: SkillLevel) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Skill level">
      {SKILL_OPTIONS.map((s) => (
        <button
          key={s.value}
          type="button"
          role="radio"
          aria-checked={value === s.value}
          onClick={() => onChange(s.value)}
          className={cn("rounded-xl border p-4 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-electric cursor-pointer", value === s.value ? "border-neon bg-neon/10" : "border-border bg-card/60 hover:border-electric/50")}
        >
          <span className="text-2xl" aria-hidden>{s.emoji}</span>
          <p className="mt-2 font-semibold">{s.label}</p>
          <p className="text-xs text-muted-foreground">{s.description}</p>
        </button>
      ))}
    </div>
  );
}

export function InterestPicker({ value, onChange }: { value: Category[]; onChange: (v: Category[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Interests">
      {CATEGORIES.map((c) => {
        const on = value.includes(c);
        return (
          <button key={c} type="button" aria-pressed={on} className={chip(on)} onClick={() => onChange(on ? value.filter((x) => x !== c) : [...value, c])}>
            {on && <Check className="size-3.5" aria-hidden />} {c}
          </button>
        );
      })}
    </div>
  );
}

export function ToolPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Tools you own">
      {TOOL_OPTIONS.map((t) => {
        const on = value.includes(t.value);
        return (
          <button key={t.value} type="button" aria-pressed={on} className={chip(on)} onClick={() => onChange(on ? value.filter((x) => x !== t.value) : [...value, t.value])}>
            {on && <Check className="size-3.5" aria-hidden />} {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function LocationPicker({ country, currency, onChange }: { country: string; currency: CurrencyCode; onChange: (v: { country: string; currency: CurrencyCode }) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <label htmlFor="country" className="text-sm font-medium">Country</label>
        <Select value={country || undefined} onValueChange={(v) => onChange({ country: v, currency: COUNTRIES.find((c) => c.name === v)?.currency ?? currency })}>
          <SelectTrigger id="country"><SelectValue placeholder="Choose your country" /></SelectTrigger>
          <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="currency" className="text-sm font-medium">Currency</label>
        <Select value={currency} onValueChange={(v) => onChange({ country, currency: v as CurrencyCode })}>
          <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
          <SelectContent>{(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => <SelectItem key={c} value={c}>{CURRENCIES[c].symbol} {c} · {CURRENCIES[c].label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
}
