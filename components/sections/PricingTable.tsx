"use client";

import { useState } from "react";
import { Section, type Tone } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PlanCard, type Plan } from "@/components/sections/PlanCard";
import { ShapeGrid } from "@/components/ui/backgrounds/ShapeGrid";
import { CURRENCIES, type Currency } from "@/lib/pricing/config";
import { cn } from "@/lib/utils";

export type { Plan, PlanOption } from "@/components/sections/PlanCard";

const currencyLabels: Record<Currency, string> = {
  INR: "₹ INR",
  USD: "$ USD",
};

/** Segmented control, as a radio group so arrow keys and labels behave. */
function CurrencyToggle({
  value,
  onChange,
  dark,
}: {
  value: Currency;
  onChange: (next: Currency) => void;
  dark: boolean;
}) {
  return (
    <fieldset
      className={cn(
        "mx-auto mt-8 flex w-fit gap-1 rounded-brand border p-1",
        dark ? "border-brand-cream/25 bg-brand-cream/5" : "border-brand-ink/15 bg-brand-white",
      )}
    >
      <legend className="sr-only">Show prices in</legend>
      {CURRENCIES.map((currency) => {
        const active = currency === value;
        return (
          <button
            key={currency}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(currency)}
            // min-h-11 keeps the 44px touch target the compact padding loses.
            className={cn(
              "min-h-11 rounded-brand px-5 text-small font-medium transition-colors duration-300 ease-brand",
              active
                ? dark
                  ? "bg-brand-gold text-brand-ink"
                  : "bg-brand-green text-brand-cream"
                : dark
                  ? "text-brand-cream/80 hover:text-brand-cream"
                  : "text-brand-stone hover:text-brand-ink",
            )}
          >
            {currencyLabels[currency]}
          </button>
        );
      })}
    </fieldset>
  );
}

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
  // Rupees first: the studio is in Gurgaon and most visitors pay in INR.
  const [currency, setCurrency] = useState<Currency>("INR");
  const dark = tone === "dark";

  return (
    <Section tone={tone} id={id} className="relative isolate overflow-hidden">
      {/* Full-bleed texture behind the section, in the brand's gold on green.
          Pointer events stay on so the hover trail lights up in the gaps
          between cards; the cards sit above and capture their own input. */}
      <div aria-hidden className="absolute inset-0 -z-10 opacity-70">
        <ShapeGrid
          direction="right"
          speed={0.17}
          squareSize={61}
          hoverTrailAmount={8}
          // The section already owns its ground; the stock near-black vignette
          // would drag it away from the brand green.
          vignetteColor={null}
          borderColor={dark ? "rgba(201,169,97,0.16)" : "rgba(31,61,46,0.10)"}
          hoverFillColor={dark ? "rgba(201,169,97,0.14)" : "rgba(31,61,46,0.06)"}
        />
      </div>

      <SectionHeading eyebrow={eyebrow} title={title} intro={intro} align="center" />

      <CurrencyToggle value={currency} onChange={setCurrency} dark={dark} />

      <div
        className={cn(
          // items-start: cards take their natural height. Stretching them to match
          // the tallest left the shorter plans with a large gap between their
          // last feature and their button, which read as broken rather than airy.
          "mx-auto mt-8 grid items-start gap-5",
          // Four or more plans sit four-across on desktop, so the full set is
          // comparable at a glance and any fifth card starts a second row.
          plans.length >= 4 && "sm:grid-cols-2 lg:grid-cols-4",
          plans.length === 3 && "lg:grid-cols-3",
          plans.length < 3 && "max-w-3xl sm:grid-cols-2",
        )}
      >
        {plans.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.08}>
            <PlanCard plan={plan} currency={currency} />
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
