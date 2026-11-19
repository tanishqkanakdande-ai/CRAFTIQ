import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-electric/30 bg-electric/10 text-electric",
        violet: "border-violet/30 bg-violet/10 text-violet-300",
        neon: "border-neon/30 bg-neon/10 text-neon",
        warning: "border-warning/30 bg-warning/10 text-warning",
        danger: "border-destructive/40 bg-destructive/10 text-rose-300",
        outline: "border-border text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
