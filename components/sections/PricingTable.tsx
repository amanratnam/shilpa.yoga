import { Check } from "lucide-react";
import { Section, type Tone } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export type Plan = {
  name: string;
  price: string;
  cadence?: string;
  description?: string;
  features: string[];
  featured?: boolean;
  cta: { label: string; href: string };
};

export function PricingTable({
  eyebrow = "Pricing",
  title = "Simple, honest pricing",
  intro,
  plans,
  tone = "light",
  note,
  id,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  plans: Plan[];
  tone?: Tone;
  note?: string;
  id?: string;
}) {
  const dark = tone === "dark";
  return (
    <Section tone={tone} id={id}>
      <SectionHeading eyebrow={eyebrow} title={title} intro={intro} align="center" />

      <div
        className={cn(
          "mx-auto mt-14 grid gap-6",
          plans.length >= 3 ? "lg:grid-cols-3" : "max-w-3xl sm:grid-cols-2",
        )}
      >
        {plans.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.08} className="h-full">
            <div
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-brand bg-brand-white p-8 transition-transform duration-300 ease-brand hover:-translate-y-1",
                plan.featured
                  ? "ring-2 ring-brand-gold shadow-[0_20px_50px_-20px_rgba(31,61,46,0.45)]"
                  : "border border-brand-ink/10",
              )}
            >
              {/* Featured ribbon */}
              {plan.featured ? (
                <span className="absolute right-0 top-0 rounded-bl-brand bg-brand-gold px-4 py-1.5 text-eyebrow uppercase tracking-[0.1em] text-brand-ink">
                  Most popular
                </span>
              ) : null}

              <h3 className="text-h4 font-medium text-brand-stone">{plan.name}</h3>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-[2.75rem] font-bold leading-none tracking-tight text-brand-green">
                  {plan.price}
                </span>
                {plan.cadence ? (
                  <span className="text-small text-brand-stone">{plan.cadence}</span>
                ) : null}
              </div>

              {plan.description ? (
                <p className="mt-3 text-small text-brand-stone">{plan.description}</p>
              ) : null}

              <div className="my-6 h-px w-full bg-brand-ink/10" />

              <ul className="flex flex-1 flex-col gap-3.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-body text-brand-ink">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-gold/15">
                      <Check className="h-3 w-3 text-brand-green" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  href={plan.cta.href}
                  variant={plan.featured ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.cta.label}
                </Button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {note ? (
        <p
          className={cn(
            "mx-auto mt-10 max-w-2xl text-center text-small",
            dark ? "text-brand-cream/70" : "text-brand-stone",
          )}
        >
          {note}
        </p>
      ) : null}
    </Section>
  );
}
