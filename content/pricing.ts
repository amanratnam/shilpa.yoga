/**
 * Single source of truth for what Shilpa charges.
 *
 * Both the public pricing cards (`content/classes.ts`) and the admin client
 * form (`/admin` yoga-package dropdown) read from here, so a price or a
 * session count only ever needs changing in one place.
 */

export type YogaMode = "online" | "personal";

/** One selectable rung of the monthly plan. */
export type MonthlyTier = {
  sessions: number;
  /** Amount in rupees, per month. */
  amount: number;
};

export type ModePricing = {
  /** Label used in the admin dropdown and anywhere the mode is named. */
  label: string;
  trial: { name: string; amount: number };
  natal: { name: string; amount: number };
  monthly: MonthlyTier[];
};

/** Discount applied when a client pays for three months upfront. */
export const MULTI_MONTH_DISCOUNT = {
  months: 3,
  percent: 10,
} as const;

export const pricing: Record<YogaMode, ModePricing> = {
  online: {
    label: "Online",
    trial: { name: "Trial Class", amount: 199 },
    natal: { name: "Prenatal / Postnatal", amount: 499 },
    monthly: [
      { sessions: 8, amount: 3000 },
      { sessions: 12, amount: 4000 },
      { sessions: 16, amount: 6000 },
    ],
  },
  personal: {
    label: "Personal (in person)",
    trial: { name: "Trial Session", amount: 499 },
    natal: { name: "Prenatal / Postnatal", amount: 999 },
    monthly: [
      { sessions: 8, amount: 6000 },
      { sessions: 12, amount: 9000 },
      { sessions: 16, amount: 11000 },
    ],
  },
};

/** `3000` -> `"₹3,000"`, using Indian digit grouping. */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/** Price per month after the 3-month prepayment discount. */
export function discountedMonthly(amount: number): number {
  return Math.round(amount * (1 - MULTI_MONTH_DISCOUNT.percent / 100));
}

export const multiMonthNote = `Paying for a ${MULTI_MONTH_DISCOUNT.months}-month package? A ${MULTI_MONTH_DISCOUNT.percent}% discount applies.`;

/**
 * Flat list of every purchasable package, for the admin client form.
 * `id` is what gets stored against a client record, so these strings are
 * effectively part of the data schema — rename with care.
 */
export type YogaPackage = {
  id: string;
  /** Full label for the admin dropdown: mode, package and price. */
  label: string;
  /** Just the package, for places that already show the mode and price. */
  shortLabel: string;
  mode: YogaMode;
  amount: number;
};

export const yogaPackages: YogaPackage[] = (
  Object.entries(pricing) as [YogaMode, ModePricing][]
).flatMap(([mode, config]) => [
  {
    id: `${mode}-trial`,
    label: `${config.label} · ${config.trial.name} (${formatINR(config.trial.amount)})`,
    shortLabel: config.trial.name,
    mode,
    amount: config.trial.amount,
  },
  {
    id: `${mode}-natal`,
    label: `${config.label} · ${config.natal.name}, single class (${formatINR(config.natal.amount)})`,
    shortLabel: `${config.natal.name}, single class`,
    mode,
    amount: config.natal.amount,
  },
  ...config.monthly.map((tier) => ({
    id: `${mode}-monthly-${tier.sessions}`,
    label: `${config.label} · Monthly, ${tier.sessions} sessions (${formatINR(tier.amount)})`,
    shortLabel: `Monthly, ${tier.sessions} sessions`,
    mode,
    amount: tier.amount,
  })),
]);

export const yogaPackageById = new Map(yogaPackages.map((p) => [p.id, p]));
