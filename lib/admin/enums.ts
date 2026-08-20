/**
 * Option sets shared by the admin forms, the Zod schemas and the list views.
 *
 * Values are what gets written to the database, so they are effectively part
 * of the schema (and mirrored in the CHECK constraints in
 * `supabase/001_schema.sql`) — rename with care. Labels are display-only.
 */

export const GENDERS = ["female", "male", "other", "prefer_not_to_say"] as const;
export const CLIENT_STATUSES = ["active", "potential", "churned"] as const;
export const YOGA_MODES = ["online", "offline"] as const;
export const REFERRAL_SOURCES = [
  "instagram",
  "google",
  "youtube",
  "word_of_mouth",
  "whatsapp",
  "existing_client",
  "event",
  "other",
] as const;
export const PAYMENT_METHODS = [
  "upi",
  "bank_transfer",
  "cash",
  "card",
  "razorpay",
  "other",
] as const;

export type Gender = (typeof GENDERS)[number];
export type ClientStatus = (typeof CLIENT_STATUSES)[number];
export type YogaMode = (typeof YOGA_MODES)[number];
export type ReferralSource = (typeof REFERRAL_SOURCES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const genderLabels: Record<Gender, string> = {
  female: "Female",
  male: "Male",
  other: "Other",
  prefer_not_to_say: "Prefer not to say",
};

export const clientStatusLabels: Record<ClientStatus, string> = {
  active: "Active",
  potential: "Potential",
  churned: "Churned",
};

export const modeLabels: Record<YogaMode, string> = {
  online: "Online",
  offline: "Offline (in person)",
};

export const referralSourceLabels: Record<ReferralSource, string> = {
  instagram: "Instagram",
  google: "Google search",
  youtube: "YouTube",
  word_of_mouth: "Word of mouth",
  whatsapp: "WhatsApp",
  existing_client: "Referred by a client",
  event: "Event or workshop",
  other: "Other",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  upi: "UPI",
  bank_transfer: "Bank transfer",
  cash: "Cash",
  card: "Card",
  razorpay: "Razorpay",
  other: "Other",
};

/** `{ value, label }` pairs, ready for a `<select>`. */
export function optionsOf<T extends string>(
  values: readonly T[],
  labels: Record<T, string>,
): { value: T; label: string }[] {
  return values.map((value) => ({ value, label: labels[value] }));
}

/**
 * The pricing table calls in-person sessions "personal"; the admin calls the
 * same thing "offline".
 */
export function modeToPricingMode(mode: YogaMode) {
  return mode === "offline" ? "personal" : "online";
}
