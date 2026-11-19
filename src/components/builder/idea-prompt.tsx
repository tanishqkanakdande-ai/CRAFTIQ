"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const EXAMPLE_IDEAS = [
  { label: "DIY Mini Projector", idea: "A DIY mini projector for movie nights using my smartphone" },
  { label: "Smart Home Light", idea: "A smart home light I can control from my phone" },
  { label: "Bluetooth Speaker", idea: "A rechargeable Bluetooth speaker from recycled materials" },
  { label: "Line Following Robot", idea: "A line following robot for a school competition" },
];

interface IdeaPromptProps {
  defaultValue?: string;
  onSubmit?: (idea: string) => void;
  busy?: boolean;
  className?: string;
  autoFocus?: boolean;
  size?: "lg" | "md";
}

export function IdeaPrompt({ defaultValue = "", onSubmit, busy, className, autoFocus, size = "lg" }: IdeaPromptProps) {
  const router = useRouter();
  const [value, setValue] = React.useState(defaultValue);
  const [error, setError] = React.useState<string | null>(null);
  const id = React.useId();

  React.useEffect(() => setValue(defaultValue), [defaultValue]);

  function submit(idea: string) {
    const trimmed = idea.trim();
    if (trimmed.length < 3) {
      setError("Describe what you'd like to make. Even a few words is fine!");
      return;
    }
    setError(null);
    if (onSubmit) onSubmit(trimmed);
    else router.push(`/builder?idea=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={(e) => { e.preventDefault(); submit(value); }}
        className="glow-border glass relative rounded-2xl p-2 shadow-[0_30px_80px_-30px_rgb(59_130_246/0.6)]"
      >
        <label htmlFor={id} className="sr-only">What do you want to make?</label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <textarea
            id={id}
            value={value}
            autoFocus={autoFocus}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(value); }
            }}
            rows={size === "lg" ? 2 : 1}
            maxLength={1000}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            placeholder="What do you want to make? e.g. a plant waterer under $25 for my balcony"
            className={cn(
              "min-h-14 flex-1 resize-none bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground/70 outline-none",
              size === "lg" ? "text-base sm:text-lg" : "text-base"
            )}
          />
          <Button type="submit" size="lg" disabled={busy} className="shrink-0 sm:mb-1 sm:mr-1">
            <Sparkles /> {busy ? "Thinking…" : "Start Building"}
            <ArrowRight className="hidden sm:block" />
          </Button>
        </div>
      </form>
      {error && <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-rose-300">{error}</p>}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2" role="list" aria-label="Example ideas">
        {EXAMPLE_IDEAS.map((ex) => (
          <button
            key={ex.label}
            type="button"
            role="listitem"
            disabled={busy}
            onClick={() => { setValue(ex.idea); submit(ex.idea); }}
            className="rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-sm text-muted-foreground transition-all hover:border-neon/60 hover:text-neon focus-visible:ring-2 focus-visible:ring-electric outline-none disabled:opacity-50 cursor-pointer"
          >
            {ex.label}
          </button>
        ))}
      </div>
    </div>
  );
}
