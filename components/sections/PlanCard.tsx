"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** One selectable rung of a plan, e.g. "12 sessions a month". */
export type PlanOption = {
  id: string;
  /** Short text on the selector pill, e.g. "12". */
  pill: string;
  /** Formatted price for this option, e.g. "₹4,000". */
  price: string;
  /** Substituted into any `{sessions}` token in the plan's features. */
  sessions: number;
};

export type Plan = {
  name: string;
  /** Static price. Ignored when `options` is set — the selection drives it. */
  price?: string;
  cadence?: string;
  description?: string;
  features: string[];
  featured?: boolean;
  cta: { label: string; href: string };
  /** When present, the card renders a selector and the price follows it. */
  options?: PlanOption[];
  /** Label above the selector, e.g. "Sessions per month". */
  optionsLabel?: string;
  /** Small print rendered at the bottom of this card only. */
  footnote?: string;
};

export function PlanCard({ plan }: { plan: Plan }) {
  const [selectedId, setSelectedId] = useState(plan.options?.[0]?.id);
  const selected = plan.options?.find((o) => o.id === selectedId) ?? plan.options?.[0];

  const price = selected?.price ?? plan.price;
  // Features may reference the chosen tier, e.g. "{sessions} sessions a month".
  const features = plan.features.map((f) =>
    selected ? f.replace(/\{sessions\}/g, String(selected.sessions)) : f,
  );

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-brand bg-brand-white p-8 transition-transform duration-300 ease-brand hover:-translate-y-1",
        plan.featured
          ? "ring-2 ring-brand-gold shadow-[0_20px_50px_-20px_rgba(31,61,46,0.45)]"
          : "border border-brand-ink/10",
      )}
    >
      {plan.featured ? (
        <span className="absolute right-0 top-0 rounded-bl-brand bg-brand-gold px-4 py-1.5 text-eyebrow uppercase tracking-[0.1em] text-brand-ink">
          Most popular
        </span>
      ) : null}

      <h3 className="text-h4 font-medium text-brand-stone">{plan.name}</h3>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-[2.75rem] font-bold leading-none tracking-tight text-brand-green">
          {price}
        </span>
        {plan.cadence ? (
          <span className="text-small text-brand-stone">{plan.cadence}</span>
        ) : null}
      </div>

      {plan.description ? (
        <p className="mt-3 text-small text-brand-stone">{plan.description}</p>
      ) : null}

      {plan.options && plan.options.length > 1 ? (
        <fieldset className="mt-6">
          <legend className="mb-2.5 text-eyebrow uppercase tracking-[0.1em] text-brand-stone">
            {plan.optionsLabel ?? "Sessions per month"}
          </legend>
          <div className="flex gap-2" role="radiogroup">
            {plan.options.map((option) => {
              const active = option.id === selected?.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={`${option.sessions} sessions a month, ${option.price}`}
                  onClick={() => setSelectedId(option.id)}
                  className={cn(
                    "flex-1 rounded-brand border px-3 py-2.5 text-small font-medium transition-colors duration-300 ease-brand",
                    active
                      ? "border-brand-green bg-brand-green text-brand-cream"
                      : "border-brand-ink/15 text-brand-ink hover:border-brand-green/50",
                  )}
                >
                  {option.pill}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div className="my-6 h-px w-full bg-brand-ink/10" />

      <ul className="flex flex-1 flex-col gap-3.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-body text-brand-ink">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-gold/15">
              <Check className="h-3 w-3 text-brand-green" strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      {plan.footnote ? (
        <p className="mt-6 text-small italic text-brand-stone">{plan.footnote}</p>
      ) : null}

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
  );
}
