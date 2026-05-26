import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/components/ui/Section";

export function ArrowLink({
  href,
  children,
  tone = "light",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const color =
    tone === "dark"
      ? "text-brand-gold hover:text-brand-cream"
      : "text-brand-green hover:text-brand-gold";
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-small font-medium uppercase tracking-[0.05em] transition-colors",
        color,
        className,
      )}
    >
      {children}
      <ArrowRight
        className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1"
        strokeWidth={2}
        aria-hidden
      />
    </Link>
  );
}
