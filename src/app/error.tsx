"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-destructive/15 text-rose-300"><AlertTriangle className="size-7" aria-hidden /></div>
      <h1 className="mt-4 text-2xl font-bold">Something short-circuited</h1>
      <p className="mt-2 text-muted-foreground">An unexpected error occurred. Your saved projects are safe.</p>
      {error.digest && <p className="mt-1 font-mono text-xs text-muted-foreground">Ref: {error.digest}</p>}
      <Button className="mt-6" onClick={reset}><RotateCcw /> Try again</Button>
    </div>
  );
}
