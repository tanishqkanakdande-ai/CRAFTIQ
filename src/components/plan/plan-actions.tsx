"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { BookmarkCheck, Copy, Download, Loader2, Mail, Save, Share2, Wand2 } from "lucide-react";
import { ApprovalDialog, type ApprovalRequest } from "@/components/common/approval-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/store/auth";
import { useProjects } from "@/lib/store/projects";
import { KEYS, writeJSON } from "@/lib/store/storage";
import type { ProjectPlan } from "@/lib/types";
import type { CurrencyCode } from "@/lib/utils";

const IMPROVE_CHIPS = ["Make it cheaper", "Make it easier for a beginner", "Use more recycled parts", "Add phone control", "Make it safer", "Make it brighter", "Make it faster to build"];

interface PlanActionsProps {
  plan: ProjectPlan;
  currency: CurrencyCode;
  onPlanChange: (plan: ProjectPlan) => void;
  /** When set, the plan is already saved and edits update that saved project. */
  savedId?: string;
}

export function PlanActions({ plan, currency, onPlanChange, savedId }: PlanActionsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { save, findByPlan, updatePlan } = useProjects();
  const saved = savedId ? true : !!findByPlan(plan.id);
  const [pdfBusy, setPdfBusy] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [improveOpen, setImproveOpen] = React.useState(false);
  const [request, setRequest] = React.useState("");
  const [improving, setImproving] = React.useState(false);
  const [improveError, setImproveError] = React.useState<string | null>(null);
  const [approval, setApproval] = React.useState<ApprovalRequest | null>(null);

  const shareUrl = React.useMemo(() => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    if (plan.source !== "ai") return `${origin}/projects/${plan.slug}`;
    return `${origin}/builder?idea=${encodeURIComponent(plan.idea ?? plan.title)}`;
  }, [plan]);

  function handleSave() {
    if (!user) {
      writeJSON(KEYS.pendingSave, plan);
      toast.info("Create a free account to save this project. We'll keep it ready for you.");
      router.push("/signup?next=/dashboard");
      return;
    }
    if (saved && savedId) return;
    const sp = save(plan);
    toast.success(saved ? "Project updated" : "Project saved to your dashboard", {
      action: { label: "Open", onClick: () => router.push(`/dashboard/projects/${sp.id}`) },
    });
  }

  async function handlePdf() {
    setPdfBusy(true);
    try {
      const { downloadPlanPdf } = await import("@/lib/pdf");
      await downloadPlanPdf(plan, currency);
      toast.success("Guide downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't create the PDF. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't access the clipboard. Select the link and copy it manually.");
    }
  }

  function requestDeviceShare() {
    setApproval({
      title: "Share this project outside CraftIQ?",
      description: "Your device's share sheet will open so you can choose an app and recipient.",
      details: [`Title: ${plan.title}`, `Link: ${shareUrl}`, "Nothing is sent until you pick an app and send it yourself."],
      confirmLabel: "Open share sheet",
      onConfirm: async () => {
        if (navigator.share) {
          try {
            await navigator.share({ title: plan.title, text: plan.tagline, url: shareUrl });
          } catch {
            /* user cancelled */
          }
        } else {
          await copyLink();
          toast.info("Sharing isn't supported in this browser, so the link was copied instead.");
        }
      },
    });
  }

  function requestEmail() {
    setApproval({
      title: "Open your email app?",
      description: "CraftIQ will draft an email in your own email app. You choose the recipient and decide whether to send it.",
      details: [`Subject: Check out this build: ${plan.title}`],
      confirmLabel: "Draft email",
      onConfirm: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(`Check out this build: ${plan.title}`)}&body=${encodeURIComponent(`${plan.tagline}\n\n${shareUrl}`)}`;
      },
    });
  }

  async function improve(text: string) {
    const req = text.trim();
    if (req.length < 3) {
      setImproveError("Tell the mentor what you'd like to change.");
      return;
    }
    setImproving(true);
    setImproveError(null);
    try {
      const res = await fetch("/api/ai/improve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan, request: req }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? "The mentor couldn't update this plan.");
      onPlanChange(data.plan);
      if (savedId) updatePlan(savedId, data.plan);
      setImproveOpen(false);
      setRequest("");
      toast.success("Plan improved", { description: data.plan.changelog?.[0] });
    } catch (err) {
      setImproveError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setImproving(false);
    }
  }

  return (
    <>
      <div className="no-print flex flex-wrap gap-2" role="toolbar" aria-label="Plan actions">
        {!savedId && (
          <Button onClick={handleSave} variant={saved ? "outline" : "default"}>
            {saved ? <BookmarkCheck className="text-neon" /> : <Save />} {saved ? "Saved" : "Save Project"}
          </Button>
        )}
        <Button variant="outline" onClick={handlePdf} disabled={pdfBusy}>
          {pdfBusy ? <Loader2 className="animate-spin" /> : <Download />} Download Guide as PDF
        </Button>
        <Button variant="outline" onClick={() => setShareOpen(true)}><Share2 /> Share</Button>
        <Button variant="neon" onClick={() => setImproveOpen(true)}><Wand2 /> Ask AI to Improve This Plan</Button>
      </div>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share “{plan.title}”</DialogTitle>
            <DialogDescription>
              {plan.source === "ai" ? "This link opens the builder with your idea, so friends can generate their own version." : "Anyone with this link can view the full build guide."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input readOnly value={shareUrl} aria-label="Share link" onFocus={(e) => e.currentTarget.select()} />
            <Button variant="outline" onClick={copyLink} aria-label="Copy link"><Copy /></Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={requestEmail}><Mail /> Email</Button>
            <Button onClick={requestDeviceShare}><Share2 /> Share via…</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={improveOpen} onOpenChange={(o) => !improving && setImproveOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Wand2 className="size-5 text-neon" /> Ask AI to improve this plan</DialogTitle>
            <DialogDescription>Tell your mentor what to change. It will update parts, steps and safety notes and explain what changed.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2">
            {IMPROVE_CHIPS.map((c) => (
              <button key={c} type="button" disabled={improving} onClick={() => { setRequest(c); improve(c); }} className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-neon/60 hover:text-neon disabled:opacity-50 cursor-pointer">
                {c}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); improve(request); }} className="space-y-3">
            <Textarea value={request} onChange={(e) => setRequest(e.target.value)} placeholder="e.g. I only have $15 and no soldering iron" aria-label="Your request" aria-invalid={!!improveError} maxLength={500} />
            {improveError && <p role="alert" className="text-sm text-rose-300">{improveError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setImproveOpen(false)} disabled={improving}>Cancel</Button>
              <Button type="submit" disabled={improving}>{improving ? <><Loader2 className="animate-spin" /> Improving…</> : <>Improve plan</>}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ApprovalDialog request={approval} onClose={() => setApproval(null)} />
    </>
  );
}
