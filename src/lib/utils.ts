import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CURRENCIES = {
  USD: { symbol: "$", rate: 1, locale: "en-US", label: "US Dollar" },
  EUR: { symbol: "€", rate: 0.92, locale: "de-DE", label: "Euro" },
  GBP: { symbol: "£", rate: 0.79, locale: "en-GB", label: "British Pound" },
  INR: { symbol: "₹", rate: 83, locale: "en-IN", label: "Indian Rupee" },
  CAD: { symbol: "C$", rate: 1.36, locale: "en-CA", label: "Canadian Dollar" },
  AUD: { symbol: "A$", rate: 1.52, locale: "en-AU", label: "Australian Dollar" },
  NGN: { symbol: "₦", rate: 1550, locale: "en-NG", label: "Nigerian Naira" },
  BRL: { symbol: "R$", rate: 5.4, locale: "pt-BR", label: "Brazilian Real" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

/** All catalogue prices are stored in USD and converted for display. */
export function convertFromUSD(usd: number, currency: CurrencyCode) {
  return usd * CURRENCIES[currency].rate;
}

export function formatMoney(usd: number, currency: CurrencyCode = "USD") {
  const { locale, rate } = CURRENCIES[currency];
  const value = usd * rate;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function formatHours(hours: number) {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours <= 8) return `${hours % 1 === 0 ? hours : hours.toFixed(1)} hr${hours === 1 ? "" : "s"}`;
  const days = Math.round(hours / 4);
  return `${days} weekend session${days === 1 ? "" : "s"}`;
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}
