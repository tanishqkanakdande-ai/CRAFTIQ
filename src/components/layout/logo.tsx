import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)} fill="none">
      <defs>
        <linearGradient id="ciq-g" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="0.6" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#39ff88" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="9" fill="url(#ciq-g)" opacity="0.18" />
      <rect x="2.75" y="2.75" width="26.5" height="26.5" rx="8.25" stroke="url(#ciq-g)" strokeWidth="1.5" />
      {/* circuit traces */}
      <path d="M8 11h5l2 2M8 21h5l2-2M24 11h-3M24 21h-3" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="11" r="1.6" fill="#38bdf8" />
      <circle cx="8" cy="21" r="1.6" fill="#8b5cf6" />
      <circle cx="24" cy="11" r="1.6" fill="#39ff88" />
      <circle cx="24" cy="21" r="1.6" fill="#38bdf8" />
      {/* spark */}
      <path className="origin-center animate-spark" d="M17.8 7.5 13.6 16.4h3.6l-1.4 8.1 5-10.1h-3.8l1-6.9z" fill="#39ff88" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-electric", className)} aria-label="CraftIQ home">
      <LogoMark />
      <span className="font-display text-xl font-bold tracking-tight">
        Craft<span className="text-gradient">IQ</span>
      </span>
    </Link>
  );
}
