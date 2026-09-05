/**
 * Committed default prices — the baseline the site ships with.
 *
 * These are no longer the live values. Shilpa edits prices in the admin
 * pricing configurator (`/admin/pricing`), which stores a full configuration
 * in the database; see `lib/pricing/store.ts`. What is here is used until
 * something has been published, and as a fallback if that read ever fails.
 *
 * Edit this file to change where a fresh install starts. To change what the
 * live site charges, use the configurator.
 */

/** Shape is validated by `pricingConfigSchema` in `lib/pricing/config.ts`. */
export const defaultPricing = {
  /** Discount applied when a client pays for several months upfront. */
  discount: { months: 3, percent: 10 },
  /**
   * Rupees per US dollar. Only used to fill in a dollar price that has not
   * been set explicitly, so international visitors never see a blank card.
   */
  usdRate: 88,
  modes: {
    online: {
      trial: { name: "Trial Class", amount: 199, amountUsd: 2.99 },
      natal: { name: "Prenatal / Postnatal", amount: 499, amountUsd: 6.99 },
      corporate: { name: "Corporate Session", amount: 3000, amountUsd: 39 },
      single: { name: "Single Session", amount: 1999, amountUsd: 29.99 },
      monthly: [
        { sessions: 8, amount: 3000, amountUsd: 39 },
        { sessions: 12, amount: 4000, amountUsd: 49 },
        { sessions: 16, amount: 6000, amountUsd: 75 },
      ],
    },
    personal: {
      trial: { name: "Trial Session", amount: 499, amountUsd: 6.99 },
      natal: { name: "Prenatal / Postnatal", amount: 999, amountUsd: 13 },
      corporate: { name: "Corporate Session", amount: 4000, amountUsd: 49 },
      single: { name: "Single Session", amount: 1999, amountUsd: 29.99 },
      monthly: [
        { sessions: 8, amount: 6000, amountUsd: 75 },
        { sessions: 12, amount: 9000, amountUsd: 109 },
        { sessions: 16, amount: 11000, amountUsd: 135 },
      ],
    },
  },
} as const;
