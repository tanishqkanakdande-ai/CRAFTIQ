import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-violet text-white shadow-[0_8px_30px_-8px_rgb(59_130_246/0.7)] hover:shadow-[0_10px_40px_-6px_rgb(139_92_246/0.8)] hover:brightness-110 active:scale-[0.98]",
        neon: "bg-neon text-[#04120a] shadow-[0_8px_30px_-8px_rgb(57_255_136/0.7)] hover:brightness-110 active:scale-[0.98]",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-border bg-secondary/40 text-foreground hover:bg-accent hover:border-electric/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "text-foreground hover:bg-accent/70",
        link: "text-electric underline-offset-4 hover:underline rounded-none",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
