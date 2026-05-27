import { z } from "zod";

export const interestOptions = [
  { value: "online", label: "Online Vinyasa classes" },
  { value: "personal", label: "Personal sessions (Gurgaon)" },
  { value: "other", label: "Something else" },
] as const;

export type Interest = (typeof interestOptions)[number]["value"];

/** Pricing tiers shown as a dependent dropdown, keyed by chosen interest. */
export const planOptions: Record<Interest, { value: string; label: string }[]> = {
  online: [
    { value: "trial", label: "Free trial class" },
    { value: "online-monthly", label: "Monthly unlimited, ₹2,500 / month" },
  ],
  personal: [
    { value: "single", label: "Single session, ₹1,000" },
    { value: "personal-monthly", label: "Monthly, ₹3,000 / month (8 classes)" },
  ],
  other: [],
};

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
