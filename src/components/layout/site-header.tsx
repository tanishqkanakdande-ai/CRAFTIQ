"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { LayoutDashboard, LogOut, Menu, Sparkles, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/store/auth";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const NAV = [
  { href: "/builder", label: "AI Builder" },
  { href: "/explore", label: "Explore" },
  { href: "/dashboard", label: "Dashboard" },
];

export function initials(name: string) {
  return name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("no-print sticky top-0 z-40 transition-all", scrolled || open ? "glass border-b border-border/80" : "border-b border-transparent")}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-electric",
                  active ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          {!ready ? (
            <div className="h-9 w-24" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-electric cursor-pointer" aria-label="Account menu">
                <Avatar>
                  <AvatarFallback>{initials(user.name)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="font-medium text-foreground">{user.name}</div>
                  <div className="truncate">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push("/dashboard")}><LayoutDashboard /> Dashboard</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/profile")}><User /> Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => { logout(); router.push("/"); }}><LogOut /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><Link href="/login">Log in</Link></Button>
              <Button asChild size="sm" className="hidden sm:inline-flex"><Link href="/signup">Sign up free</Link></Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="animate-fade-up border-t border-border px-4 pb-5 pt-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={cn("block rounded-lg px-3 py-3 text-base font-medium", pathname.startsWith(n.href) ? "bg-accent" : "text-muted-foreground")}>{n.label}</Link>
              </li>
            ))}
          </ul>
          {ready && !user && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button asChild variant="outline"><Link href="/login">Log in</Link></Button>
              <Button asChild><Link href="/signup">Sign up</Link></Button>
            </div>
          )}
          <Button asChild variant="neon" className="mt-3 w-full"><Link href="/builder"><Sparkles /> Start Building</Link></Button>
        </nav>
      )}
    </header>
  );
}
