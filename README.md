# CraftIQ

**Imagine It. Build It. Learn It.** CraftIQ is an AI-powered DIY electronics platform: describe what you want to make and an AI mentor turns it into a complete, beginner-friendly build plan with parts, budget, wiring, tutorial and safety guidance.

This is a working prototype built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4 and shadcn/ui-style components (Radix primitives). It runs fully offline with mock data and a simulated AI mentor, and is ready to switch to a real model.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
# or a production build
npm run build && npm start
```

Requires Node 20+. Try the **demo account** on the login page to see a dashboard with a project already in progress.

## Features

| Area | What's there |
| --- | --- |
| Landing | Hero, idea prompt with example chips, How It Works, Popular Builds, Why CraftIQ, Community Creations, FAQ |
| AI Project Builder (`/builder`) | Natural-language idea, follow-up questions only for missing details (budget, skill, tools, currency, size, purpose), full plan generation |
| Build plan | Overview, difficulty, cost and savings vs. retail, components with alternatives and household swaps, tools, shopping checklist with prices, SVG wiring diagram and connection table, step-by-step tutorial, safety warnings, testing and troubleshooting, upgrade ideas, time estimate, currency switcher |
| Plan actions | Save Project, Download Guide as PDF (jsPDF), Share (copy link, share sheet, email), Ask AI to Improve This Plan |
| Dashboard (`/dashboard`) | Saved projects, current build with progress bar, step and parts completion, bookmarked components, notes, recommendations |
| Workspace (`/dashboard/projects/[id]`) | Mark steps complete, tick off parts, bookmark components, autosaving notes |
| Explore (`/explore`) | Starter and community projects, filters for level, budget, category and time, search; filters live in the URL |
| Auth | Sign up, log in, Google sign-in placeholder, demo account, profile page, 4-step onboarding |

## AI mentor behaviour

All rules live in `src/lib/ai/` and apply to simulated and real model output alike:

- **Asks only when needed**: `parseIdea` infers budget, currency, skill, tools, size and purpose from the prompt, and profile settings are passed as known answers.
- **Affordable parts and substitutes**: over-budget plans drop optional extras and swap in cheaper or household alternatives, and the plan explains what changed.
- **Never claims "safe"**: `enforceSafety` adds a warning plus a safer alternative for every hazard (high voltage, batteries, heat, lasers, sharp tools, chemicals) and rewrites "completely safe"-style claims.
- **Dangerous ideas are redirected**: mains/MOT builds, high-voltage generators, Class 3B/4 lasers, weapons and jammers get an explanation and a safer project instead.
- **Approval before real-world actions**: opening a store search, sharing outside CraftIQ and drafting an email all go through `ApprovalDialog`. Nothing is bought, ordered or sent automatically.

## Connecting a real model

Set `ANTHROPIC_API_KEY` (see `.env.example`). `getMentor()` in `src/lib/ai/provider.ts` then uses Claude (`claude-opus-5-5` by default, override with `CRAFTIQ_AI_MODEL`) for plan generation and improvement. Responses are validated with Zod (`src/lib/ai/schema.ts`) and passed through the same safety rules; on any failure the route falls back to the simulated mentor. Any other model can be added by implementing the `Mentor` interface.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/ai/clarify` | `{ idea, known? }` → inferred preferences + follow-up questions |
| POST | `/api/ai/generate` | `{ idea, preferences }` → `{ plan }` |
| POST | `/api/ai/improve` | `{ plan, request }` → `{ plan }` with a changelog |
| GET | `/api/projects` | Catalogue with `q`, `difficulty`, `category`, `maxBudget`, `maxHours` filters |
| GET | `/api/projects/:slug` | One project |
| POST | `/api/auth/signup`, `/api/auth/login` | Mock auth (in-memory) |
| GET | `/api/health` | Shows which mentor is active |

## Data

- `src/lib/data/projects.ts`: 8 realistic sample projects, led by the **DIY Low-Cost Smartphone Projector**.
- `prisma/schema.prisma`: production schema for users, accounts, projects, categories, components and alternatives, tools, wiring, tutorial steps, safety warnings, saved projects, step progress and bookmarked components. The prototype stores accounts and saved projects in `localStorage` (`src/lib/store/`) so it runs without a database.

## Folder structure

```
src/
  app/                 routes (landing, builder, explore, projects/[slug], dashboard, auth, onboarding, profile, api/*)
  components/
    ui/                shadcn/ui-style primitives (button, card, dialog, tabs, select, …)
    layout/            header, footer, logo
    builder/           idea prompt, clarifying questions, generating state
    plan/              plan view, actions, wiring diagram
    projects/          project cards
    dashboard/         saved project card
    auth/              auth form, profile pickers
    common/            approval dialog, empty state, badges, headings
  lib/
    ai/                mentor interface, simulated engine, safety rules, prompt, Zod schemas
    data/              sample projects, filters, mock users, profile options
    store/             auth + saved projects (localStorage)
    pdf.ts             PDF guide export
prisma/schema.prisma
```

## Prototype limits

- Auth is mocked: any password logs in, and data stays in your browser.
- Prices are typical USD street prices converted with fixed exchange rates.
- The simulated mentor maps ideas to the closest of 8 templates (or a generic Arduino framework) and personalises them; connect a model for fully custom plans.
