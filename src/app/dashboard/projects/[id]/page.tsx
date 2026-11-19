import type { Metadata } from "next";
import { WorkspaceClient } from "./workspace-client";

export const metadata: Metadata = { title: "Project workspace" };

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WorkspaceClient id={id} />;
}
