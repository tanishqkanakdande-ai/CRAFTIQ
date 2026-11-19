import type { ProjectPlan } from "@/lib/types";
import { CURRENCIES, type CurrencyCode, formatHours } from "@/lib/utils";
import { planCostUSD } from "@/lib/data/projects";

/** jsPDF's built-in fonts only cover Latin-1, so normalise symbols before writing. */
function clean(text: string) {
  return text
    .replace(/[→⇒]/g, "->")
    .replace(/[←]/g, "<-")
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/Ω/g, " ohm")
    .replace(/µ/g, "u")
    .replace(/×/g, "x")
    .replace(/[–—−]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, "...")
    .replace(/°/g, " deg")
    .replace(/[^\x00-\xFF]/g, "");
}

function money(usd: number, currency: CurrencyCode) {
  const v = usd * CURRENCIES[currency].rate;
  return `${currency} ${v.toLocaleString("en-US", { maximumFractionDigits: v >= 100 ? 0 : 2, minimumFractionDigits: v >= 100 ? 0 : 2 })}`;
}

export async function downloadPlanPdf(plan: ProjectPlan, currency: CurrencyCode = "USD") {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const M = 16;
  const W = doc.internal.pageSize.getWidth() - M * 2;
  const H = doc.internal.pageSize.getHeight();
  let y = M;

  const ensure = (h: number) => {
    if (y + h > H - M) {
      doc.addPage();
      y = M;
    }
  };
  const text = (t: string, opts: { size?: number; bold?: boolean; color?: [number, number, number]; indent?: number; gap?: number } = {}) => {
    const { size = 10.5, bold = false, color = [30, 34, 60], indent = 0, gap = 1.5 } = opts;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(clean(t), W - indent) as string[];
    const lh = size * 0.42;
    for (const line of lines) {
      ensure(lh);
      doc.text(line, M + indent, y);
      y += lh;
    }
    y += gap;
  };
  const heading = (t: string) => {
    ensure(14);
    y += 3;
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.6);
    doc.line(M, y, M + 12, y);
    y += 5;
    text(t, { size: 14, bold: true, color: [20, 24, 60], gap: 2 });
  };
  const bullet = (t: string, indent = 3) => text(`- ${t}`, { indent });

  // Header band
  doc.setFillColor(6, 10, 26);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(57, 255, 136);
  doc.text("CraftIQ Build Guide", M, 12);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(clean(plan.title).slice(0, 60), M, 22);
  y = 40;

  const cost = planCostUSD(plan, false);
  text(plan.tagline, { size: 11, color: [80, 90, 130], gap: 3 });
  text(
    `Difficulty: ${plan.difficulty}   |   Time: ${formatHours(plan.timeHours)}   |   Est. cost: ${money(cost, currency)}   |   Retail: ${money(plan.retailComparison.priceUSD, currency)} (${plan.retailComparison.product})`,
    { size: 9.5, bold: true, gap: 3 }
  );

  heading("Overview");
  text(plan.overview);
  text(plan.howItWorks);
  if (plan.mentorNote) text(`Mentor note: ${plan.mentorNote}`, { color: [90, 60, 160] });

  heading("Safety warnings");
  for (const s of plan.safety) {
    text(`[${s.level.toUpperCase()}] ${s.title}`, { bold: true, gap: 0.5, color: s.level === "danger" ? [190, 30, 60] : [30, 34, 60] });
    text(s.detail, { indent: 3, gap: 0.5 });
    if (s.saferAlternative) text(`Safer alternative: ${s.saferAlternative}`, { indent: 3 });
  }

  heading("Shopping checklist");
  for (const c of plan.components) {
    text(`[ ] ${c.qty} x ${c.name}${c.optional ? " (optional)" : ""}  -  ${money(c.unitPriceUSD * c.qty, currency)}`, { bold: true, gap: 0.5 });
    text(c.purpose, { indent: 6, gap: 0.5, size: 9.5 });
    for (const a of c.alternatives) text(`Alternative: ${a.name}${a.household ? " (household)" : ""} - ${a.note}`, { indent: 6, size: 9, gap: 0.3, color: [90, 100, 130] });
    y += 1.2;
  }
  text(`Estimated total (required parts): ${money(cost, currency)}`, { bold: true });

  heading("Tools");
  plan.tools.forEach((t) => bullet(`${t.name}${t.optional ? " (optional)" : ""}${t.note ? ` - ${t.note}` : ""}`));

  heading("Wiring");
  text(plan.wiring.summary);
  plan.wiring.connections.forEach((c, i) => bullet(`${i + 1}. ${c.from} [${c.fromPin}] -> ${c.to} [${c.toPin}] (${c.wire} wire)${c.note ? ` - ${c.note}` : ""}`));
  plan.wiring.notes.forEach((n) => bullet(`Note: ${n}`));

  heading("Step-by-step build");
  plan.steps.forEach((s, i) => {
    text(`[ ] Step ${i + 1}: ${s.title} (${s.minutes} min)`, { bold: true, gap: 0.5 });
    text(s.detail, { indent: 6, gap: 0.5 });
    if (s.tip) text(`Tip: ${s.tip}`, { indent: 6, gap: 0.5, color: [20, 130, 80] });
    if (s.warning) text(`Warning: ${s.warning}`, { indent: 6, gap: 0.5, color: [190, 30, 60] });
    y += 1.5;
  });

  heading("Testing");
  plan.testing.forEach((t) => bullet(t));
  heading("Troubleshooting");
  plan.troubleshooting.forEach((t) => {
    text(t.problem, { bold: true, gap: 0.3 });
    text(t.fix, { indent: 3 });
  });
  heading("Upgrade ideas");
  plan.upgrades.forEach((u) => bullet(u));

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 160);
    doc.text(`CraftIQ - ${clean(plan.title)} - page ${i} of ${pages}. Prices are estimates. Follow all safety warnings.`, M, H - 8);
  }

  doc.save(`${plan.slug || "craftiq-plan"}.pdf`);
}
