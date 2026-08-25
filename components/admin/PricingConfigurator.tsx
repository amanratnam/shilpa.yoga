"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, RotateCcw, Trash2, Upload } from "lucide-react";
import { publishPricingAction, type ActionState } from "@/app/admin/actions";
import { Input } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/admin/FormBits";
import { META_LABEL } from "@/components/admin/tokens";
import {
  PRICING_MODES,
  discountedMonthly,
  formatINR,
  modeConfigLabels,
  type ModePricing,
  type PricingConfig,
  type PricingMode,
} from "@/lib/pricing/config";
import { cn } from "@/lib/utils";

/** Replace one mode's slice of the config, without mutating the original. */
function withMode(
  config: PricingConfig,
  mode: PricingMode,
  next: ModePricing,
): PricingConfig {
  return { ...config, modes: { ...config.modes, [mode]: next } };
}

function FieldLabel({ children, htmlFor }: { children: string; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-1.5 block", META_LABEL)}>
      {children}
    </label>
  );
}

/** A named single-price option: trial, prenatal/postnatal, corporate. */
function SingleOption({
  mode,
  slot,
  hint,
  value,
  onChange,
}: {
  mode: PricingMode;
  slot: "trial" | "natal" | "corporate";
  hint: string;
  value: { name: string; amount: number };
  onChange: (next: { name: string; amount: number }) => void;
}) {
  const nameId = `${mode}-${slot}-name`;
  const amountId = `${mode}-${slot}-amount`;
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
      <div>
        <FieldLabel htmlFor={nameId}>Label shown on the site</FieldLabel>
        <Input
          id={nameId}
          compact
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </div>
      <div>
        <FieldLabel htmlFor={amountId}>{hint}</FieldLabel>
        <Input
          id={amountId}
          compact
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={String(value.amount)}
          onChange={(e) => onChange({ ...value, amount: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}

function ModePanel({
  mode,
  value,
  discountPercent,
  onChange,
}: {
  mode: PricingMode;
  value: ModePricing;
  discountPercent: number;
  onChange: (next: ModePricing) => void;
}) {
  const setTier = (index: number, patch: Partial<{ sessions: number; amount: number }>) =>
    onChange({
      ...value,
      monthly: value.monthly.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    });

  /** Next unused session count, so a fresh row never collides on save. */
  const nextSessions = () => {
    const used = new Set(value.monthly.map((t) => t.sessions));
    let n = (Math.max(0, ...value.monthly.map((t) => t.sessions)) || 0) + 4;
    while (used.has(n)) n += 1;
    return n;
  };

  return (
    <section className="rounded-brand border border-brand-ink/10 bg-brand-white">
      <header className="border-b border-brand-ink/10 bg-brand-cream/60 px-6 py-3">
        <h2 className="text-small font-medium text-brand-ink">{modeConfigLabels[mode]}</h2>
      </header>

      <div className="flex flex-col gap-6 p-6">
        <SingleOption
          mode={mode}
          slot="trial"
          hint="₹ per session"
          value={value.trial}
          onChange={(trial) => onChange({ ...value, trial })}
        />
        <SingleOption
          mode={mode}
          slot="natal"
          hint="₹ per class"
          value={value.natal}
          onChange={(natal) => onChange({ ...value, natal })}
        />
        <SingleOption
          mode={mode}
          slot="corporate"
          hint="₹ per session"
          value={value.corporate}
          onChange={(corporate) => onChange({ ...value, corporate })}
        />

        {/* ---- Monthly tiers: one row per session-count combination ---- */}
        <div>
          <div className="mb-2 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-small font-medium text-brand-ink">Monthly plans</h3>
              <p className="mt-0.5 text-small text-brand-stone">
                One row per sessions-per-month option. Each count may appear once.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="quiet"
              className="shrink-0 whitespace-nowrap"
              onClick={() =>
                onChange({
                  ...value,
                  monthly: [...value.monthly, { sessions: nextSessions(), amount: 0 }],
                })
              }
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              Add a tier
            </Button>
          </div>

          <div className="overflow-hidden rounded-brand border border-brand-ink/10">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-brand-ink/10 bg-brand-cream/40">
                  <th scope="col" className={cn("px-4 py-2", META_LABEL)}>
                    Sessions / month
                  </th>
                  <th scope="col" className={cn("px-4 py-2", META_LABEL)}>
                    ₹ per month
                  </th>
                  <th scope="col" className={cn("px-4 py-2", META_LABEL)}>
                    After {discountPercent}% prepay
                  </th>
                  <th scope="col" className="px-4 py-2">
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {value.monthly.map((tier, i) => (
                  // Index as key: rows are positional here, and a session count
                  // is editable, so it cannot serve as a stable identity.
                  <tr key={i} className="border-b border-brand-ink/10 last:border-b-0">
                    <td className="px-4 py-2.5">
                      <Input
                        compact
                        type="number"
                        min={1}
                        step={1}
                        inputMode="numeric"
                        aria-label={`Sessions per month, row ${i + 1}`}
                        value={String(tier.sessions)}
                        onChange={(e) => setTier(i, { sessions: Number(e.target.value) })}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <Input
                        compact
                        type="number"
                        min={0}
                        step={1}
                        inputMode="numeric"
                        aria-label={`Rupees per month, row ${i + 1}`}
                        value={String(tier.amount)}
                        onChange={(e) => setTier(i, { amount: Number(e.target.value) })}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-small text-brand-stone">
                      {formatINR(discountedMonthly(tier.amount, discountPercent))}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        aria-label={`Remove the ${tier.sessions}-session tier`}
                        disabled={value.monthly.length <= 1}
                        onClick={() =>
                          onChange({
                            ...value,
                            monthly: value.monthly.filter((_, j) => j !== i),
                          })
                        }
                        className="rounded-brand p-1.5 text-brand-stone transition-colors hover:bg-brand-cream hover:text-brand-ink disabled:pointer-events-none disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PricingConfigurator({
  published,
  lastPublished,
}: {
  /** The currently live configuration, read uncached. */
  published: PricingConfig;
  lastPublished?: { at: string; by: string };
}) {
  const [config, setConfig] = useState<PricingConfig>(published);
  const [state, formAction] = useActionState<ActionState, FormData>(publishPricingAction, {});

  const dirty = useMemo(
    () => JSON.stringify(config) !== JSON.stringify(published),
    [config, published],
  );

  // Zod paths ("modes.online.monthly.0.amount") are precise but unreadable;
  // showing the messages alone is what an admin can actually act on.
  const issues = Object.values(state.fieldErrors ?? {});

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      {/* The whole configuration travels as one JSON field — see the action. */}
      <input type="hidden" name="config" value={JSON.stringify(config)} />

      <section className="rounded-brand border border-brand-ink/10 bg-brand-white p-6">
        <h2 className="text-small font-medium text-brand-ink">Multi-month prepayment</h2>
        <p className="mt-0.5 text-small text-brand-stone">
          Shown as a footnote under the monthly plans on both classes pages.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[10rem_10rem]">
          <div>
            <FieldLabel htmlFor="discount-months">Months upfront</FieldLabel>
            <Input
              id="discount-months"
              compact
              type="number"
              min={2}
              step={1}
              inputMode="numeric"
              value={String(config.discount.months)}
              onChange={(e) =>
                setConfig({
                  ...config,
                  discount: { ...config.discount, months: Number(e.target.value) },
                })
              }
            />
          </div>
          <div>
            <FieldLabel htmlFor="discount-percent">Discount %</FieldLabel>
            <Input
              id="discount-percent"
              compact
              type="number"
              min={0}
              max={90}
              step={1}
              inputMode="numeric"
              value={String(config.discount.percent)}
              onChange={(e) =>
                setConfig({
                  ...config,
                  discount: { ...config.discount, percent: Number(e.target.value) },
                })
              }
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        {PRICING_MODES.map((mode) => (
          <ModePanel
            key={mode}
            mode={mode}
            value={config.modes[mode]}
            discountPercent={config.discount.percent}
            onChange={(next) => setConfig(withMode(config, mode, next))}
          />
        ))}
      </div>

      <FormError message={state.error} />

      {issues.length > 0 ? (
        <ul
          role="alert"
          className="flex flex-col gap-1 rounded-brand border border-brand-gold/60 bg-brand-white p-4 text-small text-brand-ink"
        >
          {issues.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : null}

      {/* ---- Publish bar ---- */}
      <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-4 rounded-brand border border-brand-ink/10 bg-brand-cream/95 px-5 py-3 backdrop-blur">
        <p className="text-small text-brand-stone">
          {dirty ? (
            <span className="font-medium text-brand-ink">Unpublished changes.</span>
          ) : lastPublished ? (
            <>
              Live since {lastPublished.at} · published by {lastPublished.by}
            </>
          ) : (
            <>Live prices are the built-in defaults — nothing published yet.</>
          )}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="quiet"
            disabled={!dirty}
            onClick={() => setConfig(published)}
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden />
            Discard changes
          </Button>
          <PublishButton disabled={!dirty} />
        </div>
      </div>
    </form>
  );
}

/**
 * Kept separate so `useFormStatus` sees the enclosing form. Reading it in the
 * parent would return the status of no form at all.
 */
function PublishButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={disabled || pending}>
      <Upload className="h-4 w-4" strokeWidth={2} aria-hidden />
      {pending ? "Publishing…" : "Publish prices"}
    </Button>
  );
}
