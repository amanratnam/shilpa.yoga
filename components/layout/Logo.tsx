import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const main = tone === "dark" ? "text-brand-cream" : "text-brand-ink";
  const sub = tone === "dark" ? "text-brand-cream/60" : "text-brand-stone";
  return (
    <Link
      href="/"
      aria-label="Shilpa Yoga Space — home"
      className={cn("group inline-flex items-baseline gap-2 leading-none", className)}
    >
      <span className={cn("text-h4 font-semibold tracking-tight", main)}>Shilpa</span>
      <span
        className={cn(
          "text-eyebrow uppercase tracking-[0.18em] transition-colors group-hover:text-brand-gold",
          sub,
        )}
      >
        Yoga Space
      </span>
    </Link>
  );
}
