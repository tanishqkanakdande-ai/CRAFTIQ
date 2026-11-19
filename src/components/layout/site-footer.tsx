import Link from "next/link";
import { Logo } from "./logo";

const COLUMNS = [
  { title: "Build", links: [{ href: "/builder", label: "AI Project Builder" }, { href: "/explore", label: "Explore projects" }, { href: "/projects/diy-low-cost-smartphone-projector", label: "Smartphone projector" }] },
  { title: "Account", links: [{ href: "/signup", label: "Sign up" }, { href: "/login", label: "Log in" }, { href: "/dashboard", label: "Dashboard" }] },
  { title: "Learn", links: [{ href: "/#how-it-works", label: "How it works" }, { href: "/#faq", label: "FAQ" }, { href: "/#why", label: "Safety first" }] },
];

export function SiteFooter() {
  return (
    <footer className="no-print mt-24 border-t border-border bg-background-2/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">Imagine it. Build it. Learn it. AI-powered DIY electronics plans for makers of every age.</p>
        </div>
        {COLUMNS.map((c) => (
          <div key={c.title}>
            <h2 className="mb-3 text-sm font-semibold">{c.title}</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.links.map((l) => (
                <li key={l.href}><Link className="hover:text-electric" href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CraftIQ prototype. AI plans are guidance, not a guarantee. Always follow the safety notes and local regulations.
      </div>
    </footer>
  );
}
