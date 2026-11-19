"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { ArrowLeft, ArrowRight, PartyPopper, UserPlus } from "lucide-react";
import { InterestPicker, LocationPicker, SkillPicker, ToolPicker } from "@/components/auth/profile-fields";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/store/auth";
import type { Category, SkillLevel } from "@/lib/types";
import type { CurrencyCode } from "@/lib/utils";

const STEPS = [
  { title: "How experienced are you?", description: "Your mentor adjusts explanations and techniques to match." },
  { title: "What excites you?", description: "Pick a few areas and we'll recommend projects you'll love." },
  { title: "Which tools do you have?", description: "Plans will avoid tools you don't own. Don't worry if it's just scissors!" },
  { title: "Where are you building?", description: "So prices and savings show in your currency." },
];

export function OnboardingFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, ready, updateProfile } = useAuth();
  const [step, setStep] = React.useState(0);
  const [skill, setSkill] = React.useState<SkillLevel>("beginner");
  const [interests, setInterests] = React.useState<Category[]>([]);
  const [tools, setTools] = React.useState<string[]>(["basic"]);
  const [loc, setLoc] = React.useState<{ country: string; currency: CurrencyCode }>({ country: "", currency: "USD" });
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => headingRef.current?.focus(), [step]);

  if (!ready) return <div className="mx-auto max-w-2xl px-4 py-20"><Skeleton className="h-96" /></div>;
  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState icon={UserPlus} title="Create an account first" description="Onboarding personalises CraftIQ for your account.">
          <Button asChild><Link href="/signup">Sign up free</Link></Button>
        </EmptyState>
      </div>
    );
  }

  function finish() {
    updateProfile({ skillLevel: skill, interests, tools, country: loc.country, currency: loc.currency, onboarded: true });
    router.push(params.get("next") ?? "/builder");
  }

  const last = step === STEPS.length - 1;
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <p className="text-sm text-muted-foreground">Hi {user.name.split(" ")[0]} 👋 Step {step + 1} of {STEPS.length}</p>
      <Progress value={((step + 1) / STEPS.length) * 100} className="mt-3" aria-label="Onboarding progress" />
      <div key={step} className="mt-8 animate-fade-up">
        <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold outline-none">{STEPS[step].title}</h1>
        <p className="mt-2 mb-6 text-muted-foreground">{STEPS[step].description}</p>
        {step === 0 && <SkillPicker value={skill} onChange={setSkill} />}
        {step === 1 && <InterestPicker value={interests} onChange={setInterests} />}
        {step === 2 && <ToolPicker value={tools} onChange={setTools} />}
        {step === 3 && <LocationPicker country={loc.country} currency={loc.currency} onChange={setLoc} />}
      </div>
      <div className="mt-10 flex items-center justify-between gap-3">
        {step > 0 ? <Button variant="ghost" onClick={() => setStep(step - 1)}><ArrowLeft /> Back</Button> : <Button variant="ghost" onClick={finish}>Skip for now</Button>}
        {last ? <Button variant="neon" onClick={finish}><PartyPopper /> Start building</Button> : <Button onClick={() => setStep(step + 1)}>Continue <ArrowRight /></Button>}
      </div>
    </div>
  );
}
