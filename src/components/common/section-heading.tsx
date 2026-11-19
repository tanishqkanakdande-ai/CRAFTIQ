import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, description, className, align = "center" }: { eyebrow?: string; title: React.ReactNode; description?: string; className?: string; align?: "center" | "left" }) {
  return (
    <div className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neon">{eyebrow}</p>}
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-muted-foreground sm:text-lg">{description}</p>}
    </div>
  );
}
