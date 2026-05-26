import { z } from "zod";

export const interestOptions = [
  { value: "online", label: "Online Vinyasa classes" },
  { value: "personal", label: "Personal sessions (Gurgaon)" },
  { value: "training", label: "Teacher training" },
  { value: "other", label: "Something else" },
] as const;

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(80),
  email: z.string().email("Please enter a valid email address."),
  phone: z
    .string()
    .max(20)
    .optional()
    .or(z.literal("")),
  interest: z.enum(["online", "personal", "training", "other"], {
    message: "Please choose what you're interested in.",
  }),
  message: z
    .string()
    .min(10, "A sentence or two helps me reply well.")
    .max(2000),
  // Honeypot — must stay empty.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
