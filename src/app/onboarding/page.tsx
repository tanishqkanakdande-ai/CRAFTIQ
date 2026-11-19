import type { Metadata } from "next";
import { Suspense } from "react";
import { OnboardingFlow } from "./onboarding-flow";

export const metadata: Metadata = { title: "Welcome" };

export default function OnboardingPage() {
  return <Suspense><OnboardingFlow /></Suspense>;
}
