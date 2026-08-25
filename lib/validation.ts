import { z } from "zod";
import { buildPackages, formatINR, type PricingConfig } from "@/lib/pricing/config";

export const interestOptions = [
  { value: "online", label: "Online Yoga classes" },
  { value: "personal", label: "Personal sessions (Gurgaon)" },
  { value: "other", label: "Something else" },
] as const;

export type Interest = (typeof interestOptions)[number]["value"];

export type PlanOptions = Record<Interest, { value: string; label: string }[]>;

/**
 * Pricing tiers shown as a dependent dropdown, keyed by chosen interest.
 *
 * Built from the live pricing config so the enquiry form can never quote a
 * price the classes pages disagree with. The form is a Client Component, so a
 * server page resolves this and passes it down as a prop.
 */
export function buildPlanOptions(config: PricingConfig): PlanOptions {
  const packages = buildPackages(config);
  const forMode = (mode: "online" | "personal") =>
    packages
      .filter((p) => p.mode === mode)
      .map((p) => ({ value: p.id, label: `${p.shortLabel}, ${formatINR(p.amount)}` }));

  return { online: forMode("online"), personal: forMode("personal"), other: [] };
}

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(80),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().max(30).optional().or(z.literal("")),
  country: z.string().min(1, "Please select your country.").max(60),
  interest: z.enum(["online", "personal", "other"], {
    message: "Please choose a course.",
  }),
  plan: z.string().max(80).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  // Honeypot, must stay empty.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
