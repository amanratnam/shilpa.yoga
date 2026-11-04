"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { EXPERIENCE_LEVELS, PREFERRED_TIMES } from "@/lib/leads/schema";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type Choice = { value: string; label: string };

/** A row of tappable pills behaving as one radio group. */
function Chips({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: readonly Choice[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-[0.8125rem] font-medium text-brand-cream/85">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <label
              key={o.value}
              className={cn(
                "inline-flex min-h-10 cursor-pointer items-center rounded-brand border px-3.5 text-[0.8125rem] font-medium transition-colors duration-200",
                active
                  ? "border-brand-gold bg-brand-gold text-brand-ink"
                  : "border-white/20 bg-white/[0.06] text-brand-cream hover:border-brand-gold/70",
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={active}
                onChange={() => onChange(active ? "" : o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Inputs read as glass within glass: translucent, with a gold focus. */
const field =
  "w-full rounded-brand border border-white/20 bg-white/[0.08] px-3.5 py-3 text-base text-brand-cream placeholder:text-brand-cream/40 transition-colors focus:border-brand-gold focus:bg-white/[0.12] focus:outline-none focus:ring-1 focus:ring-brand-gold";

/**
 * The short enquiry form on every offer page. Sends the campaign slug, plus
 * any utm_* tags and the referrer, so each lead can be traced to its source.
 */
export function OfferForm({
  campaign,
  campaignName,
  plans,
}: {
  campaign: string;
  campaignName: string;
  /** Plan pills, e.g. "8 classes / month". */
  plans: Choice[];
}) {
  const [plan, setPlan] = useState("");
  const [experience, setExperience] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams(window.location.search);
    const body = {
      campaign,
      fullName: String(fd.get("fullName") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      country: String(fd.get("country") ?? ""),
      planInterest: plans.find((p) => p.value === plan)?.label ?? "",
      experience,
      preferredTime: time,
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""),
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
      referrer: document.referrer.slice(0, 300),
    };
    if (body.fullName.trim().length < 2) return setError("Please enter your name.");
    if (!/^[+]?[\d\s()-]{7,20}$/.test(body.phone.trim()))
      return setError("Please enter a valid WhatsApp number.");

    setStatus("sending");
    try {
      const res = await fetch("/api/campaign-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setFirstName(body.fullName.trim().split(/\s+/)[0]);
      setStatus("done");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("idle");
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "done" ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-8 text-center"
        >
          <CheckCircle2 className="h-12 w-12 text-brand-gold" strokeWidth={1.5} aria-hidden />
          <h3 className="text-2xl font-semibold">You&apos;re in, {firstName}!</h3>
          <p className="max-w-xs text-[0.9375rem] opacity-80">
            Your {campaignName} offer is reserved. We&apos;ll WhatsApp
            you within a day to find the right batch for you.
          </p>
          <a
            href={siteConfig.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex min-h-12 items-center gap-2 rounded-brand border border-white/25 px-5 text-sm font-medium transition-colors hover:border-brand-gold"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Can&apos;t wait? Message us now
          </a>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-4"
          initial={false}
        >
          {/* Honeypot */}
          <div className="hidden" aria-hidden>
            <label htmlFor="offer-company">Company</label>
            <input id="offer-company" name="company" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-medium text-brand-cream/85">
                Your name <span className="text-brand-gold">*</span>
              </span>
              <input name="fullName" autoComplete="name" required className={field} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-medium text-brand-cream/85">
                WhatsApp number <span className="text-brand-gold">*</span>
              </span>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98xxx xxxxx"
                required
                className={field}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-medium text-brand-cream/85">Email</span>
              <input name="email" type="email" inputMode="email" autoComplete="email" className={field} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-medium text-brand-cream/85">City or country</span>
              <input name="country" autoComplete="country-name" placeholder="e.g. Gurgaon, Dubai" className={field} />
            </label>
          </div>

          <Chips name="plan" legend="Classes per month" options={plans} value={plan} onChange={setPlan} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Chips
              name="experience"
              legend="Your experience"
              options={EXPERIENCE_LEVELS}
              value={experience}
              onChange={setExperience}
            />
            <Chips
              name="time"
              legend="Best time for you"
              options={PREFERRED_TIMES}
              value={time}
              onChange={setTime}
            />
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.8125rem] font-medium text-brand-cream/85">Anything Shilpa should know?</span>
            <textarea
              name="message"
              rows={2}
              placeholder="Injuries, goals, or questions"
              className={cn(field, "resize-none")}
            />
          </label>

          {error ? (
            <p role="alert" className="text-sm font-medium text-brand-gold">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "sending"}
            className="group relative mt-1 inline-flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-brand bg-brand-gold px-6 text-small font-medium uppercase tracking-[0.05em] text-brand-ink transition-colors duration-300 hover:bg-brand-cream active:scale-[0.99] disabled:opacity-70"
          >
            {/* A slow sheen across the button */}
            <span
              aria-hidden
              className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 animate-[sheen_3.2s_ease-in-out_infinite]"
            />
            {status === "sending" ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            ) : null}
            {status === "sending" ? "Reserving…" : "Claim my offer"}
          </button>
          <p className="text-center text-[0.75rem] text-brand-cream/60">
            No payment now. We&apos;ll message you on WhatsApp to pick your batch.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
