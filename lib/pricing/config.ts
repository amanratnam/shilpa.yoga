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

const namedPrice = z.object({
  name: z.string().trim().min(2, "Enter a name for this option").max(60),
  amount,
});

const monthlyTier = z.object({
  sessions: z.coerce
    .number({ error: "Enter a session count" })
    .int("Sessions must be a whole number")
    .min(1, "A tier needs at least one session")
    .max(200, "That session count looks like a typo"),
  amount,
});

const modePricing = z.object({
  trial: namedPrice,
  natal: namedPrice,
  corporate: namedPrice,
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

    const single = (
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
      single("trial", m.trial),
      single("natal", m.natal, ", single class"),
      single("corporate", m.corporate, ", per session"),
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
  // Trial, natal and corporate are all single sessions.
  return /-(trial|natal|corporate)$/.test(id) ? 1 : null;
}
