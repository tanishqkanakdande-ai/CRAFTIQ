import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: { default: "CraftIQ · Imagine It. Build It. Learn It.", template: "%s · CraftIQ" },
  description: "CraftIQ turns your ideas into affordable DIY electronics projects using AI.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#060a1a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${grotesk.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <a href="#main" className="sr-only z-50 rounded-lg bg-primary px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">Skip to content</a>
        <Providers>
          <SiteHeader />
          <main id="main" className="min-h-[70vh]">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
