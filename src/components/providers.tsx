"use client";

import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/store/auth";
import { ProjectsProvider } from "@/lib/store/projects";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster theme="dark" position="bottom-right" richColors closeButton toastOptions={{ style: { background: "#0d1433", border: "1px solid #1f2a5a" } }} />
        </TooltipProvider>
      </ProjectsProvider>
    </AuthProvider>
  );
}
