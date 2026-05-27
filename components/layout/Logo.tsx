import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { cdnAsset } from "@/content/images";

/**
 * Set to true once the brand logo files are saved into public/images/logo/:
 *   - shilpa-logo-dark.png   (black logo, used on light backgrounds)
 *   - shilpa-logo-light.png  (white logo, used on dark backgrounds)
 * Until then the typographic wordmark below is shown so the site never breaks.
 */
const LOGO_READY = true;

// Intrinsic aspect of the supplied logo files.
const LOGO_W = 2880;
const LOGO_H = 1352;

export function Logo({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  if (LOGO_READY) {
    const src = cdnAsset(
      tone === "dark"
        ? "/images/logo/shilpa-logo-light.png"
        : "/images/logo/shilpa-logo-dark.png",
    );
    return (
      <Link
        href="/"
        aria-label="Shilpa Yoga Space, home"
        className={cn("inline-flex items-center", className)}
      >
        <Image
          src={src}
          alt="Shilpa Yoga Space"
          width={LOGO_W}
          height={LOGO_H}
          priority
          className="h-10 w-auto md:h-12"
        />
      </Link>
    );
  }

  const main = tone === "dark" ? "text-brand-cream" : "text-brand-ink";
  const sub = tone === "dark" ? "text-brand-cream/60" : "text-brand-stone";
  return (
    <Link
      href="/"
      aria-label="Shilpa Yoga Space, home"
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
