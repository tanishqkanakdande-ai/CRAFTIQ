import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-7xl font-bold text-gradient">404</p>
      <h1 className="mt-4 text-2xl font-bold">This circuit is open</h1>
      <p className="mt-2 text-muted-foreground">We couldn't find that page. Maybe it's still on the workbench.</p>
      <div className="mt-6 flex gap-2">
        <Button asChild><Link href="/builder"><Sparkles /> Start building</Link></Button>
        <Button asChild variant="outline"><Link href="/explore"><Compass /> Explore</Link></Button>
      </div>
    </div>
  );
}
