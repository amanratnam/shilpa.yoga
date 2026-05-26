import { Check } from "lucide-react";
import { Section, type Tone } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { RazorpayButton } from "@/components/payments/RazorpayButton";
import { cn } from "@/lib/utils";

export type Plan = {
  name: string;
  price: string;
  cadence?: string;
  description?: string;
  features: string[];
  featured?: boolean;
  cta:
    | { type: "link"; label: string; href: string }
    | { type: "pay"; label: string; amountInPaise: number; payLabel: string };
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
  return (
    <Section tone={tone} id={id}>
      <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
      <div
        className={cn(
          "mt-12 grid gap-6",
          plans.length >= 3 ? "lg:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {plans.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.08} className="h-full">
            <Card
              className={cn(
                "h-full p-8",
                plan.featured && "border-brand-gold ring-1 ring-brand-gold",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-h3">{plan.name}</h3>
                {plan.featured ? <Badge>Most popular</Badge> : null}
              </div>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-h2 font-semibold text-brand-green">
                  {plan.price}
                </span>
                {plan.cadence ? (
                  <span className="text-small text-brand-stone">{plan.cadence}</span>
                ) : null}
              </div>

              {plan.description ? (
                <p className="mt-3 text-small text-brand-stone">{plan.description}</p>
              ) : null}

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-body text-brand-ink">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-brand-gold" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {plan.cta.type === "link" ? (
                  <Button href={plan.cta.href} className="w-full">
                    {plan.cta.label}
                  </Button>
                ) : (
                  <RazorpayButton
                    amountInPaise={plan.cta.amountInPaise}
                    label={plan.cta.payLabel}
                    ctaLabel={plan.cta.label}
                  />
                )}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
      {note ? (
        <p
          className={cn(
            "mt-8 text-small",
            tone === "dark" ? "text-brand-cream/70" : "text-brand-stone",
          )}
        >
          {note}
        </p>
      ) : null}
    </Section>
  );
}
