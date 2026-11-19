"use client";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn("flex flex-col gap-4", className)} {...props} />;
}
function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("inline-flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-secondary/50 p-1", className)}
      {...props}
    />
  );
}
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-electric/40 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow cursor-pointer [&_svg]:size-4",
        className
      )}
      {...props}
    />
  );
}
function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("outline-none animate-fade-up", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
