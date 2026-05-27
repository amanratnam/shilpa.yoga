"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import {
  contactSchema,
  interestOptions,
  planOptions,
  type ContactInput,
} from "@/lib/validation";
import { FormField, Input, Textarea, Select } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

export function ContactForm({
  defaultInterest = "online",
}: {
  defaultInterest?: ContactInput["interest"];
}) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { interest: defaultInterest, plan: "" },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const interest = watch("interest");
  const plans = planOptions[interest] ?? [];

  const onSubmit = async (data: ContactInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setServerError(body?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-brand border border-brand-green/20 bg-brand-white p-8">
        <CheckCircle2 className="h-8 w-8 text-brand-green" strokeWidth={1.75} />
        <h3 className="text-h3">Thank you — your message is on its way.</h3>
        <p className="text-body text-brand-stone">
          I read every enquiry personally and usually reply within 12–24 hours. If
          it&apos;s urgent, reach me on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label htmlFor="company">Company</label>
        <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name" required error={errors.name?.message}>
          <Input id="name" autoComplete="name" invalid={!!errors.name} {...register("name")} />
        </FormField>
        <FormField label="Email" htmlFor="email" required error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            invalid={!!errors.email}
            {...register("email")}
          />
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Phone / WhatsApp"
          htmlFor="phone"
          hint="Optional"
          error={errors.phone?.message}
        >
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            invalid={!!errors.phone}
            {...register("phone")}
          />
        </FormField>
        <FormField
          label="I'm interested in"
          htmlFor="interest"
          required
          error={errors.interest?.message}
        >
          <Select
            id="interest"
            invalid={!!errors.interest}
            {...register("interest", {
              onChange: () => setValue("plan", ""),
            })}
          >
            {interestOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      {plans.length > 0 ? (
        <FormField label="Which option?" htmlFor="plan" hint="Optional — pick what fits">
          <Select id="plan" {...register("plan")}>
            <option value="">No preference yet</option>
            {plans.map((p) => (
              <option key={p.value} value={p.label}>
                {p.label}
              </option>
            ))}
          </Select>
        </FormField>
      ) : null}

      <FormField
        label="Message"
        htmlFor="message"
        required
        error={errors.message?.message}
      >
        <Textarea
          id="message"
          rows={5}
          placeholder="Tell me a little about your experience, goals, or any injuries to work around."
          invalid={!!errors.message}
          {...register("message")}
        />
      </FormField>

      {serverError ? (
        <p className="text-small font-medium text-brand-ink">{serverError}</p>
      ) : null}

      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
