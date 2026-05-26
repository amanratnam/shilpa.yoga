import { cn } from "@/lib/utils";
import type { Tone } from "@/components/ui/Section";

export function Badge({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const toneClass =
    tone === "dark"
      ? "border-brand-cream/40 text-brand-cream"
      : "border-brand-green/30 text-brand-green";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-brand border px-3 py-1.5 text-eyebrow uppercase tracking-[0.1em]",
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  );
}
