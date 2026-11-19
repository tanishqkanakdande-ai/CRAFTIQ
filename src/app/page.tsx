import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpenCheck,
  Cable,
  Compass,
  Heart,
  Lightbulb,
  MessageSquareText,
  Recycle,
  ShieldAlert,
  Sparkles,
  Wrench,
} from "lucide-react";
import { IdeaPrompt } from "@/components/builder/idea-prompt";
import { SectionHeading } from "@/components/common/section-heading";
import { ProjectCard, ProjectCover } from "@/components/projects/project-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { planCostUSD, projects, smartphoneProjector } from "@/lib/data/projects";
import { formatMoney } from "@/lib/utils";

const STEPS = [
  { icon: MessageSquareText, title: "Describe your idea", text: "Type what you want to make in plain words. A projector, a plant waterer, a robot, anything." },
  { icon: Sparkles, title: "AI designs the build", text: "Your mentor asks only what it needs, then plans parts, wiring, budget and every step." },
  { icon: Wrench, title: "Build step by step", text: "Tick off steps and parts as you go. Get troubleshooting help when something doesn't work." },
  { icon: Lightbulb, title: "Learn and level up", text: "Each build teaches real electronics skills, with upgrade ideas for your next project." },
];

const WHY = [
  { icon: BadgeDollarSign, title: "Save money", text: "Recreate pricey gadgets for a fraction of the cost, with an honest savings estimate." },
  { icon: Recycle, title: "Reuse and recycle", text: "Household and recycled substitutes for parts wherever it's safe." },
  { icon: ShieldAlert, title: "Safety first, always", text: "Clear warnings for batteries, heat, lasers and high voltage, with safer alternatives." },
  { icon: BookOpenCheck, title: "Beginner friendly", text: "Plain-language tutorials that explain why, not just what." },
  { icon: Cable, title: "Real wiring guidance", text: "Pin-by-pin wiring diagrams with colour-coded connections." },
  { icon: Compass, title: "You stay in control", text: "The AI prepares lists and plans, but never buys or sends anything without your approval." },
];

const FAQ = [
  { q: "Do I need any electronics experience?", a: "No. Tell CraftIQ you're a beginner and it will choose simpler techniques, explain every step and suggest solderless options where possible." },
  { q: "Is the AI going to buy parts for me?", a: "Never automatically. CraftIQ prepares shopping checklists with estimated prices. Opening a store, sharing or sending anything always asks for your approval first." },
  { q: "How accurate are the prices?", a: "Prices are typical street prices for generic parts and are converted to your currency. They're estimates. Always check current prices locally." },
  { q: "Are the projects safe?", a: "No DIY project is risk-free. CraftIQ flags hazards like batteries, heat, sharp tools, lasers and high voltage, explains how to reduce the risk and offers safer alternatives. It won't provide instructions for builds like mains wiring or high-voltage generators." },
  { q: "Can I really save money by building it myself?", a: "Often, yes, especially for simple products like lamps, speakers and plant waterers. CraftIQ shows the retail comparison and tells you honestly when a DIY version will perform worse." },
  { q: "Is CraftIQ free?", a: "This prototype is free to use. Sign up to save projects, track progress and keep notes." },
];

const COMMUNITY = [
  { name: "Aisha, 14", text: "Built the shoebox projector with my little brother. We watched a film on our bedroom wall the same night!", project: "Smartphone Projector", color: "#3b82f6" },
  { name: "Daniel, 38", text: "Plant waterer has kept my basil alive for two months while I travel. Total cost was less than a takeaway.", project: "Plant Watering", color: "#22c55e" },
  { name: "Mei, 22", text: "First time soldering. The safety tips and troubleshooting section saved my speaker build.", project: "Bluetooth Speaker", color: "#8b5cf6" },
];

export default function HomePage() {
  const popular = projects.slice(0, 4);
  const community = projects.filter((p) => p.source === "community");
  const projectorCost = planCostUSD(smartphoneProjector, false);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" aria-hidden />
        <div className="absolute top-24 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-violet/20 blur-[120px] animate-glow" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24">
          <Badge variant="neon" className="mb-6 animate-fade-up px-3 py-1 text-sm">
            <Sparkles aria-hidden /> Your AI electronics mentor
          </Badge>
          <h1 className="animate-fade-up text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl [animation-delay:80ms]">
            <span className="whitespace-nowrap">Imagine It.</span> <span className="text-gradient whitespace-nowrap">Build It.</span> <span className="whitespace-nowrap">Learn It.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg text-muted-foreground sm:text-xl [animation-delay:160ms]">
            CraftIQ turns your ideas into affordable DIY electronics projects using AI.
          </p>
          <div className="mx-auto mt-10 max-w-3xl animate-fade-up [animation-delay:240ms]">
            <p className="mb-3 font-display text-lg font-semibold">What do you want to make?</p>
            <IdeaPrompt />
          </div>
          <div className="mt-8 flex animate-fade-up flex-wrap justify-center gap-3 [animation-delay:320ms]">
            <Button asChild size="lg"><Link href="/builder"><Sparkles /> Start Building</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/explore">Explore Projects <ArrowRight /></Link></Button>
          </div>
        </div>

        {/* Featured plan preview */}
        <div className="relative mx-auto max-w-5xl px-4 pb-8 sm:px-6">
          <Link href={`/projects/${smartphoneProjector.slug}`} className="glow-border glass group grid overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-electric md:grid-cols-[280px_1fr]">
            <ProjectCover plan={smartphoneProjector} className="h-40 md:h-full" />
            <div className="grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon">Featured build</p>
                <h2 className="mt-1 text-2xl font-bold group-hover:text-electric">{smartphoneProjector.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{smartphoneProjector.tagline}</p>
              </div>
              <dl className="grid grid-cols-3 gap-3 text-center sm:grid-cols-1 sm:text-right">
                <div><dt className="text-xs text-muted-foreground">Build cost</dt><dd className="font-display text-2xl font-bold text-neon">{formatMoney(projectorCost)}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Retail</dt><dd className="font-display text-lg text-muted-foreground line-through">{formatMoney(smartphoneProjector.retailComparison.priceUSD)}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Time</dt><dd className="font-display text-lg">2.5 hrs</dd></div>
              </dl>
            </div>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="How it works" title="From idea to working gadget in four steps" />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-xl border border-border bg-card/70 p-6 transition hover:border-electric/40">
              <span className="absolute top-5 right-5 font-display text-4xl font-bold text-accent" aria-hidden>{i + 1}</span>
              <div className="mb-4 grid size-11 place-items-center rounded-xl bg-gradient-to-br from-electric/25 to-violet/25 text-electric">
                <s.icon className="size-5" aria-hidden />
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Popular builds */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading align="left" className="mb-0" eyebrow="Popular builds" title="Start with a maker favourite" description="Tested starter projects with full parts lists, wiring and tutorials." />
          <Button asChild variant="outline"><Link href="/explore">See all projects <ArrowRight /></Link></Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((p) => <ProjectCard key={p.id} plan={p} />)}
        </div>
      </section>

      {/* Why CraftIQ */}
      <section id="why" className="relative scroll-mt-20 py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Why CraftIQ" title={<>A mentor that makes you <span className="text-gradient">more creative</span></>} description="Built for curious kids, students, hobbyists and anyone who'd rather make than buy." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.title} className="flex gap-4 rounded-xl border border-border bg-card/60 p-6">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-neon/10 text-neon"><w.icon className="size-5" aria-hidden /></div>
                <div>
                  <h3 className="font-semibold">{w.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{w.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community creations */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Community creations" title="Built by makers like you" description="Real projects shared by the CraftIQ community." />
        <div className="grid gap-5 lg:grid-cols-3">
          {COMMUNITY.map((c) => (
            <figure key={c.name} className="rounded-xl border border-border bg-card/70 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full text-sm font-bold text-white" style={{ background: c.color }} aria-hidden>{c.name[0]}</div>
                <div>
                  <figcaption className="font-semibold">{c.name}</figcaption>
                  <p className="text-xs text-muted-foreground">Built: {c.project}</p>
                </div>
                <Heart className="ml-auto size-4 text-rose-400" aria-hidden />
              </div>
              <blockquote className="text-sm text-muted-foreground">“{c.text}”</blockquote>
            </figure>
          ))}
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {community.map((p) => <ProjectCard key={p.id} plan={p} />)}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <Accordion type="single" collapsible className="rounded-xl border border-border bg-card/60 px-5">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`q${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="glow-border relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/25 via-violet/20 to-neon/10 p-10 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Your next creation starts with one sentence.</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Describe it, and CraftIQ will plan the rest.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="neon"><Link href="/builder"><Sparkles /> Start Building</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/signup">Create free account</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
