import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreClient } from "./explore-client";

export const metadata: Metadata = { title: "Explore Projects" };

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreClient />
    </Suspense>
  );
}
