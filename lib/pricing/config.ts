/**
 * The shape of everything Shilpa charges, and the pure helpers that read it.
 *
 * This module is isomorphic: the admin configurator (a Client Component) and
 * the public pages both import it. The *live* values come from the database —
 * see `lib/pricing/store.ts`. What lives here is the schema, the derivation
 * rules, and the built-in defaults used before anything has been published
 * (and as a fallback if the config table cannot be read).
 */

import { z } from "zod";
import { defaultPricing } from "@/content/pricing";

/** The pricing table calls in-person sessions "personal"; admin calls it "offline". */
export const PRICING_MODES = ["online", "personal"] as const;
export type PricingMode = (typeof PRICING_MODES)[number];

export const modeConfigLabels: Record<PricingMode, string> = {
  online: "Online",
  personal: "Offline (in person)",
};

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

/**
 * Amounts are whole rupees. The ceiling is deliberately generous rather than
 * "realistic" — it exists to catch a stray keystroke, not to cap the business.
 */
const amount = z.coerce
  .number({ error: "Enter an amount in rupees" })
  .int("Amounts must be whole rupees")
  .min(0, "An amount cannot be negative")
  .max(10_000_000, "That amount looks like a typo");

/**
 * Dollars, to the cent. Optional throughout: a configuration published before
 * dual-currency pricing existed carries no dollar prices, and it must keep
 * parsing rather than silently falling back to the built-in defaults and
 * wiping out what Shilpa published. `usdOf` fills the gap from `usdRate`.
 */
const usdAmount = z.coerce
  .number({ error: "Enter an amount in dollars" })
  .min(0, "An amount cannot be negative")
  .max(100_000, "That amount looks like a typo")
  // Guards against 29.989999999 arriving from a float round-trip.
  .transform((n) => Math.round(n * 100) / 100);

const namedPrice = z.object({
  name: z.string().trim().min(2, "Enter a name for this option").max(60),
  amount,
  amountUsd: usdAmount.optional(),
});

const monthlyTier = z.object({
  sessions: z.coerce
    .number({ error: "Enter a session count" })
    .int("Sessions must be a whole number")
    .min(1, "A tier needs at least one session")
    .max(200, "That session count looks like a typo"),
  amount,
  amountUsd: usdAmount.optional(),
});

const modePricing = z.object({
  trial: namedPrice,
  natal: namedPrice,
  corporate: namedPrice,
  // Added after launch, so it too must tolerate an older stored config.
  single: namedPrice.optional(),
  monthly: z
    .array(monthlyTier)
    .min(1, "Keep at least one monthly tier")
    .max(20, "That is more monthly tiers than a page can show")
    // Session counts become part of the package id, so duplicates would
    // collapse two tiers onto one id and make the cheaper one unreachable.
    .refine(
      (tiers) => new Set(tiers.map((t) => t.sessions)).size === tiers.length,
      "Two tiers share a session count — each count may appear only once",
    ),
});

export const pricingConfigSchema = z.object({
  discount: z.object({
    months: z.coerce.number().int().min(2, "A multi-month discount needs 2+ months").max(24),
    percent: z.coerce.number().int().min(0).max(90, "That discount looks like a typo"),
  }),
  usdRate: z.coerce
    .number({ error: "Enter rupees per US dollar" })
    .min(1, "Enter rupees per US dollar")
    .max(1000, "That exchange rate looks like a typo")
    .default(88),
  modes: z.object({
    online: modePricing,
    personal: modePricing,
  }),
});

export type PricingConfig = z.infer<typeof pricingConfigSchema>;
export type ModePricing = z.infer<typeof modePricing>;
export type MonthlyTier = z.infer<typeof monthlyTier>;

/**
 * Built-in baseline, derived from `content/pricing.ts` so the committed
 * defaults stay the one place a developer edits.
 */
export const defaultPricingConfig: PricingConfig = pricingConfigSchema.parse(defaultPricing);

/** Sorted, so tiers always render low-to-high regardless of entry order. */
export function sortedMonthly(mode: ModePricing): MonthlyTier[] {
  return [...mode.monthly].sort((a, b) => a.sessions - b.sessions);
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/** `3000` -> `"₹3,000"`, using Indian digit grouping. */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export const CURRENCIES = ["INR", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

/** `29.99` -> `"$29.99"`, `39` -> `"$39"`. Whole dollars lose the ".00". */
export function formatUSD(amount: number): string {
  const whole = Number.isInteger(amount);
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/** One price in both currencies, resolved once and formatted at render. */
export type Money = { inr: number; usd: number };

export function formatMoney(money: Money, currency: Currency): string {
  return currency === "USD" ? formatUSD(money.usd) : formatINR(money.inr);
}

type PricedEntry = { amount: number; amountUsd?: number };

/**
 * The dollar price for an entry: what was set explicitly, or a conversion at
 * the configured rate when it was not. Converted amounts are rounded to whole
 * dollars — a derived ".37" would imply a precision that is not there.
 */
export function usdOf(entry: PricedEntry, config: PricingConfig): number {
  if (entry.amountUsd !== undefined) return entry.amountUsd;
  // Belt and braces: a zero or absent rate would otherwise render "$NaN".
  const rate = config.usdRate > 0 ? config.usdRate : defaultPricing.usdRate;
  return Math.max(1, Math.round(entry.amount / rate));
}

export function moneyOf(entry: PricedEntry, config: PricingConfig): Money {
  return { inr: entry.amount, usd: usdOf(entry, config) };
}

/** Price per month after the multi-month prepayment discount. */
export function discountedMonthly(amount: number, discountPercent: number): number {
  return Math.round(amount * (1 - discountPercent / 100));
}

export function multiMonthNote(config: PricingConfig): string {
  const { months, percent } = config.discount;
  return `Paying for a ${months}-month package? A ${percent}% discount applies.`;
}

// ---------------------------------------------------------------------------
// Derived packages
// ---------------------------------------------------------------------------

/**
 * Flat list of every purchasable package, for the admin subscription form.
 *
 * `id` is stored against subscription rows, so these strings are effectively
 * part of the data schema — the *format* must stay stable even as prices move.
 * A monthly tier the admin removes takes its id out of this list; historical
 * subscriptions survive that because they snapshot their own label and amount
 * at the time of sale (see `lib/admin/subscriptions.ts`).
 */
export type YogaPackage = {
  id: string;
  /** Full label for the admin dropdown: mode, package and price. */
  label: string;
  /** Just the package, for places that already show the mode and price. */
  shortLabel: string;
  /** Number of classes the package covers, for receipts. */
  sessions: number;
  mode: PricingMode;
  amount: number;
};

export function buildPackages(config: PricingConfig): YogaPackage[] {
  return PRICING_MODES.flatMap((mode) => {
    const m = config.modes[mode];
    const modeLabel = modeConfigLabels[mode];

    const oneOff = (
      key: string,
      option: { name: string; amount: number },
      labelSuffix = "",
    ): YogaPackage => ({
      id: `${mode}-${key}`,
      label: `${modeLabel} · ${option.name}${labelSuffix} (${formatINR(option.amount)})`,
      shortLabel: `${option.name}${labelSuffix}`,
      sessions: 1,
      mode,
      amount: option.amount,
    });

    return [
      oneOff("trial", m.trial),
      oneOff("natal", m.natal, ", single class"),
      oneOff("corporate", m.corporate, ", per session"),
      // Absent from configurations published before this option existed.
      ...(m.single ? [oneOff("single", m.single)] : []),
      ...sortedMonthly(m).map((tier) => ({
        id: `${mode}-monthly-${tier.sessions}`,
        label: `${modeLabel} · Monthly, ${tier.sessions} sessions (${formatINR(tier.amount)})`,
        shortLabel: `Monthly, ${tier.sessions} sessions`,
        sessions: tier.sessions,
        mode,
        amount: tier.amount,
      })),
    ];
  });
}

export function packageIndex(config: PricingConfig): Map<string, YogaPackage> {
  return new Map(buildPackages(config).map((p) => [p.id, p]));
}

/**
 * Session count read straight off a stored package id, e.g.
 * `"online-monthly-12"` -> 12. Receipts need this for packages the admin has
 * since retired, where there is no live entry left to look up.
 */
export function sessionsFromPackageId(id: string): number | null {
  const monthly = /-monthly-(\d+)$/.exec(id);
  if (monthly) return Number(monthly[1]);
  // Trial, natal, corporate and single are all one session.
  return /-(trial|natal|corporate|single)$/.test(id) ? 1 : null;
}
