"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface ApprovalRequest {
  title: string;
  description: string;
  details?: string[];
  confirmLabel: string;
  onConfirm: () => void;
}

/**
 * Every real-world or external action (opening a store, sharing outside CraftIQ, sending anything)
 * goes through this dialog. The mentor can prepare things, but only the user can approve them.
 */
export function ApprovalDialog({ request, onClose }: { request: ApprovalRequest | null; onClose: () => void }) {
  return (
    <Dialog open={!!request} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {request && (
          <>
            <DialogHeader>
              <div className="mb-2 grid size-11 place-items-center rounded-xl bg-warning/15 text-warning">
                <ShieldCheck className="size-6" aria-hidden />
              </div>
              <DialogTitle>{request.title}</DialogTitle>
              <DialogDescription>{request.description}</DialogDescription>
            </DialogHeader>
            {request.details && (
              <ul className="space-y-1.5 rounded-lg border border-border bg-background-2/70 p-3 text-sm text-muted-foreground">
                {request.details.map((d) => (
                  <li key={d} className="flex gap-2"><span aria-hidden className="text-neon">•</span>{d}</li>
                ))}
              </ul>
            )}
            <p className="text-xs text-muted-foreground">CraftIQ never buys, orders or sends anything on your behalf without your approval.</p>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => { request.onConfirm(); onClose(); }}>{request.confirmLabel}</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
