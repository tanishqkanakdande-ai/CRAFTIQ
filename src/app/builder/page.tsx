import type { Metadata } from "next";
import { Suspense } from "react";
import { BuilderClient } from "./builder-client";

export const metadata: Metadata = { title: "AI Project Builder" };

export default function BuilderPage() {
  return (
    <Suspense>
      <BuilderClient />
    </Suspense>
  );
}
