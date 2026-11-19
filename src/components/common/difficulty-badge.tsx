import { Badge } from "@/components/ui/badge";
import type { Difficulty } from "@/lib/types";

const MAP = { Beginner: "neon", Intermediate: "default", Advanced: "violet" } as const;

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge variant={MAP[difficulty]}>
      <span aria-hidden className="inline-flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`h-2 w-1 rounded-full ${i <= ["Beginner", "Intermediate", "Advanced"].indexOf(difficulty) ? "bg-current" : "bg-current/25"}`} />
        ))}
      </span>
      {difficulty}
    </Badge>
  );
}
