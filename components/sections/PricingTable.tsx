import { Section, type Tone } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PlanCard, type Plan } from "@/components/sections/PlanCard";
import { cn } from "@/lib/utils";

export type { Plan, PlanOption } from "@/components/sections/PlanCard";

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
          // items-start: cards take their natural height. Stretching them to match
          // the tallest left the shorter plans with a large gap between their
          // last feature and their button, which read as broken rather than airy.
          "mx-auto mt-10 grid items-start gap-5",
          // Four or more plans sit four-across on desktop, so the full set is
          // comparable at a glance and any fifth card starts a second row.
          plans.length >= 4 && "sm:grid-cols-2 lg:grid-cols-4",
          plans.length === 3 && "lg:grid-cols-3",
          plans.length < 3 && "max-w-3xl sm:grid-cols-2",
        )}
      >
        {plans.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.08}>
            <PlanCard plan={plan} />
          </Reveal>
        ))}
      </div>

      {note ? (
        <p
          className={cn(
            "mx-auto mt-8 max-w-2xl text-center text-small",
            dark ? "text-brand-cream/70" : "text-brand-stone",
          )}
        >
          {note}
        </p>
      ) : null}
    </Section>
  );
}
