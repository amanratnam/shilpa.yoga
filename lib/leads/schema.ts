import { z } from "zod";

/** Option sets for the campaign form. Values are stored; labels are shown. */
export const EXPERIENCE_LEVELS = [
  { value: "new", label: "New to yoga" },
  { value: "some", label: "Done some yoga" },
  { value: "regular", label: "Practise regularly" },
] as const;

export const PREFERRED_TIMES = [
  { value: "morning", label: "Mornings" },
  { value: "evening", label: "Evenings" },
  { value: "flexible", label: "Flexible" },
] as const;

const valuesOf = <T extends readonly { value: string }[]>(opts: T) =>
  opts.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]];

const optional = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const campaignLeadSchema = z.object({
  campaign: z.string().trim().min(1).max(60),
  fullName: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s()-]{7,20}$/, "Please enter a valid WhatsApp number."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email.").max(200).optional().or(z.literal("")),
  country: optional(60),
  experience: z.enum(valuesOf(EXPERIENCE_LEVELS)).optional().or(z.literal("")),
  preferredTime: z.enum(valuesOf(PREFERRED_TIMES)).optional().or(z.literal("")),
  planInterest: optional(60),
  message: optional(1000),
  utmSource: optional(120),
  utmMedium: optional(120),
  utmCampaign: optional(120),
  referrer: optional(300),
  // Honeypot, must stay empty.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type CampaignLeadInput = z.infer<typeof campaignLeadSchema>;

export const labelOf = (opts: readonly { value: string; label: string }[], v?: string | null) =>
  opts.find((o) => o.value === v)?.label ?? (v || "");
