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
  modes: {
    online: {
      trial: { name: "Trial Class", amount: 199 },
      natal: { name: "Prenatal / Postnatal", amount: 499 },
      corporate: { name: "Corporate Session", amount: 3000 },
      monthly: [
        { sessions: 8, amount: 3000 },
        { sessions: 12, amount: 4000 },
        { sessions: 16, amount: 6000 },
      ],
    },
    personal: {
      trial: { name: "Trial Session", amount: 499 },
      natal: { name: "Prenatal / Postnatal", amount: 999 },
      corporate: { name: "Corporate Session", amount: 4000 },
      monthly: [
        { sessions: 8, amount: 6000 },
        { sessions: 12, amount: 9000 },
        { sessions: 16, amount: 11000 },
      ],
    },
  },
} as const;
