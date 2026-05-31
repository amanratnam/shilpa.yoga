import { SmartImage } from "@/components/ui/SmartImage";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { SiteImage } from "@/content/images";

export type PageHeroAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  actions,
  align = "left",
  size = "compact",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  image?: SiteImage;
  actions?: PageHeroAction[];
  align?: "left" | "center";
  /** "compact" keeps the band short so content surfaces faster. */
  size?: "compact" | "large";
}) {
  const spacing =
    size === "large"
      ? "gap-6 pb-16 pt-32 md:pb-24 md:pt-40"
      : "gap-5 pb-10 pt-24 md:pb-12 md:pt-28";
  return (
    <section className="relative isolate overflow-hidden bg-brand-green text-brand-cream on-dark">
      {image ? (
        <div className="absolute inset-0 -z-10">
          <SmartImage image={image} fill priority sizes="100vw" subtle />
          <div className="absolute inset-0 bg-brand-green/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-green via-brand-green/40 to-transparent" />
        </div>
      ) : null}

      <div
        className={cn(
          "container-content flex flex-col",
          spacing,
          align === "center" && "items-center text-center",
        )}
      >
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className={cn("text-h1 max-w-4xl", align === "center" && "mx-auto")}>
          {title}
        </h1>
        {subtitle ? (
          <p
            className={cn(
              "max-w-2xl font-normal text-brand-cream/85",
              size === "large" ? "text-h4" : "text-body",
              align === "center" && "mx-auto",
            )}
          >
            {subtitle}
          </p>
        ) : null}
        {actions && actions.length > 0 ? (
          <div
            className={cn(
              "mt-4 flex flex-col gap-4 sm:flex-row",
              align === "center" && "justify-center",
            )}
          >
            {actions.map((a) => (
              <Button
                key={a.label}
                href={a.href}
                tone="dark"
                variant={a.variant ?? "primary"}
                external={a.external}
              >
                {a.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
