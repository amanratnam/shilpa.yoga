import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarCheck, Globe2, HeartPulse, MessageCircle, Sparkles, Users, Video } from "lucide-react";
import { campaigns, campaignEnded, getCampaign, type Campaign } from "@/content/campaigns";
import { cdnAsset, images } from "@/content/images";
import { getPricingConfig } from "@/lib/pricing/store";
import { formatINR, formatUSD, sortedMonthly, usdOf } from "@/lib/pricing/config";
import { FestiveCanvas } from "@/components/offer/FestiveCanvas";
import { HeroMotif } from "@/components/offer/Motifs";
import { OfferForm } from "@/components/offer/OfferForm";
import { Countdown } from "@/components/offer/Countdown";
import { StickyClaim } from "@/components/offer/StickyClaim";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const c = getCampaign((await params).slug);
  if (!c) return {};
  const title = `${c.festival} offer: ${c.discountPercent}% off online yoga`;
  return {
    title,
    description: c.metaDescription,
    alternates: { canonical: `/offer/${c.slug}` },
    openGraph: { title, description: c.metaDescription, images: [images.ogDefault.src] },
  };
}

function endDateLabel(endsOn: string) {
  return new Date(`${endsOn}T12:00:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

/** The campaign's palette as CSS variables, read by every offer component. */
function themeVars(c: Campaign): React.CSSProperties {
  const t = c.theme;
  return {
    "--bg": t.bg,
    "--surface": t.surface,
    "--accent": t.accent,
    "--on-accent": t.onAccent,
    "--accent2": t.accent2,
    "--ink": t.ink,
    "--line": `color-mix(in srgb, ${t.ink} 16%, transparent)`,
    "--field": t.mode === "dark" ? "rgba(255,255,255,0.06)" : "#FFFFFF",
  } as React.CSSProperties;
}

/** Splits the headline so the campaign's highlight words take the accent. */
function Headline({ text, highlight }: { text: string; highlight: string }) {
  const i = text.indexOf(highlight);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] bg-clip-text text-transparent">
        {highlight}
      </span>
      {text.slice(i + highlight.length)}
    </>
  );
}

const INCLUDED = [
  { Icon: Video, title: "Live on Zoom or Google Meet", body: "Taught in real time, never a recording, so you get cues and corrections as you move." },
  { Icon: Users, title: "Small groups", body: "Kept deliberately small so Shilpa can see you, adjust you and learn your body." },
  { Icon: HeartPulse, title: "Anatomy-led and safe", body: "Clear progressions and options for tight shoulders, sensitive knees or old injuries." },
  { Icon: Globe2, title: "Any time zone", body: "Batches suit India, the Gulf, Europe and the US east coast." },
];

const STEPS = [
  { Icon: Sparkles, title: "Claim your offer", body: "Leave your name and WhatsApp number. It takes under a minute." },
  { Icon: MessageCircle, title: "Pick your batch", body: "We message you within a day to match you to a time that suits you." },
  { Icon: CalendarCheck, title: "Start practising", body: "Join your first live class and settle into a steady weekly rhythm." },
];

export default async function OfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCampaign((await params).slug);
  if (!c) notFound();

  const config = await getPricingConfig();
  const ended = campaignEnded(c);
  const off = (amount: number) => Math.round(amount * (1 - c.discountPercent / 100));
  const tiers = sortedMonthly(config.modes.online).map((tier, i, all) => {
    const usd = usdOf(tier, config);
    const price = off(tier.amount);
    return {
      sessions: tier.sessions,
      was: tier.amount,
      now: price,
      usdWas: usd,
      // Whole dollars: a discounted "$31.20" reads as a calculation, not a price.
      usdNow: Math.max(1, Math.round(usd * (1 - c.discountPercent / 100))),
      perClass: Math.round(price / tier.sessions),
      featured: all.length >= 3 ? i === 1 : i === all.length - 1,
    };
  });
  const lowest = tiers.length ? Math.min(...tiers.map((t) => t.now)) : null;
  const dark = c.theme.mode === "dark";
  const endLabel = endDateLabel(c.endsOn);
  const logo = cdnAsset(dark ? "/images/logo/shilpa-logo-light.png" : "/images/logo/shilpa-logo-dark.png");

  return (
    <div
      style={themeVars(c)}
      className="relative flex-1 overflow-x-clip bg-[var(--bg)] text-[var(--ink)] [color-scheme:light]"
    >
      {/* ---- Header: the logo is the only way back to the main site ---- */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" aria-label="Shilpa Yoga Space, home" className="inline-flex">
            <Image src={logo} alt="Shilpa Yoga Space" width={2880} height={1352} priority className="h-9 w-auto sm:h-11" />
          </Link>
          <a
            href="#claim"
            className="inline-flex min-h-10 items-center rounded-full border border-[var(--line)] bg-[var(--field)] px-4 text-[0.8125rem] font-semibold backdrop-blur transition-colors hover:border-[var(--accent)]"
          >
            {c.discountPercent}% off
          </a>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section id="offer-hero" className="relative isolate overflow-hidden">
        <FestiveCanvas effect={c.effect} colors={c.theme.particles} className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
          <HeroMotif campaign={c} />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(80% 60% at 20% 20%, color-mix(in srgb, ${c.theme.accent} ${dark ? 18 : 12}%, transparent), transparent 70%)`,
            }}
          />
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-24 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12 lg:pb-28">
          <div>
            <p className="inline-flex animate-fade-rise items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--field)] px-3 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] backdrop-blur">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {c.greeting} · Online group yoga
            </p>

            <h1 className="mt-5 animate-fade-rise text-[2.6rem] font-bold leading-[1.02] tracking-tight [animation-delay:0.08s] sm:text-6xl lg:text-[4.25rem]">
              <Headline text={c.headline} highlight={c.highlight} />
            </h1>

            <p className="mt-5 max-w-xl animate-fade-rise text-[1.0625rem] leading-relaxed opacity-85 [animation-delay:0.16s] sm:text-lg">
              {c.intro}
            </p>

            <div className="mt-7 flex animate-fade-rise flex-wrap items-center gap-4 [animation-delay:0.24s]">
              {/* The offer as a festive stamp */}
              <div className="relative grid h-24 w-24 shrink-0 rotate-[-8deg] place-items-center rounded-full bg-[var(--accent)] text-[var(--on-accent)] shadow-[0_14px_40px_-12px_var(--accent)] sm:h-28 sm:w-28">
                <span aria-hidden className="absolute inset-1.5 rounded-full border-2 border-dashed border-current opacity-40" />
                <span className="text-center leading-none">
                  <span className="block text-[2rem] font-black sm:text-[2.4rem]">{c.discountPercent}%</span>
                  <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.18em]">off</span>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[0.8125rem] font-medium opacity-80">
                  {ended ? "This offer has ended" : c.discountNote ? `Festive offer ${c.discountNote}` : "Festive offer ends in"}
                </span>
                {ended ? (
                  <span className="text-sm opacity-80">Leave your details to hear about the next one.</span>
                ) : (
                  <Countdown endsOn={c.endsOn} label={`Ends ${endLabel}`} />
                )}
              </div>
            </div>

            {lowest !== null ? (
              <p className="mt-6 animate-fade-rise text-[0.9375rem] opacity-85 [animation-delay:0.32s]">
                Monthly group plans from{" "}
                <span className="font-semibold text-[var(--accent)]">{formatINR(lowest)}</span>{" "}
                <span className="line-through opacity-60">{formatINR(tiers[0].was)}</span>
              </p>
            ) : null}
          </div>

          {/* ---- The form ---- */}
          <div
            id="claim"
            className="relative scroll-mt-6 animate-fade-rise rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] [animation-delay:0.2s] sm:p-7"
          >
            <h2 className="text-xl font-semibold sm:text-2xl">
              {ended ? "Get the next offer first" : `Claim your ${c.festival} offer`}
            </h2>
            <p className="mt-1 text-sm opacity-75">
              {ended
                ? "Leave your details and we'll tell you when the next festive batch opens."
                : `Reserve ${c.discountPercent}% off live online group classes. Valid until ${endLabel}.`}
            </p>
            <div className="mt-5">
              <OfferForm
                campaign={c.slug}
                campaignName={c.festival}
                discountPercent={c.discountPercent}
                plans={[
                  ...tiers.map((t) => ({ value: String(t.sessions), label: `${t.sessions} classes` })),
                  { value: "unsure", label: "Not sure yet" },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Festive prices ---- */}
      <section className="relative bg-[var(--surface)] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Festive prices
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {c.discountPercent}% off every monthly group plan
            </h2>
            <p className="mt-3 max-w-2xl opacity-80">
              Live online group classes only. Pick how often you want to practise; you can change it later.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {tiers.map((t, i) => (
              <Reveal key={t.sessions} delay={i * 0.08}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl border bg-[var(--bg)] p-6 transition-transform duration-300 hover:-translate-y-1",
                    t.featured ? "border-[var(--accent)] shadow-[0_24px_60px_-28px_var(--accent)]" : "border-[var(--line)]",
                  )}
                >
                  {t.featured ? (
                    <span className="absolute -top-3 left-6 rounded-full bg-[var(--accent)] px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--on-accent)]">
                      Most popular
                    </span>
                  ) : null}
                  <p className="text-lg font-semibold">{t.sessions} classes a month</p>
                  <p className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight text-[var(--accent)]">{formatINR(t.now)}</span>
                    <span className="text-base line-through opacity-50">{formatINR(t.was)}</span>
                  </p>
                  <p className="mt-1 text-sm opacity-70">
                    {formatUSD(t.usdNow)} outside India · about {formatINR(t.perClass)} a class
                  </p>
                  <a
                    href="#claim"
                    className={cn(
                      "mt-6 inline-flex min-h-12 items-center justify-center rounded-full px-5 text-[0.9375rem] font-semibold transition-colors",
                      t.featured
                        ? "bg-[var(--accent)] text-[var(--on-accent)]"
                        : "border border-[var(--line)] hover:border-[var(--accent)]",
                    )}
                  >
                    Claim this price
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Why now ---- */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Why this {c.festival}
            </p>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              A good moment to begin
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {c.reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-[var(--line)] bg-[var(--field)] p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)] text-sm font-bold text-[var(--on-accent)]">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{r.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed opacity-80">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Ritual ---- */}
      <section className="px-4 pb-4 sm:px-6">
        <Reveal>
          <blockquote className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] px-6 py-10 text-center text-xl font-semibold leading-snug text-[var(--on-accent)] sm:px-12 sm:py-14 sm:text-3xl">
            “{c.ritual}”
          </blockquote>
        </Reveal>
      </section>

      {/* ---- What you get + how it works ---- */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What you get</h2>
            </Reveal>
            <ul className="mt-6 flex flex-col gap-4">
              {INCLUDED.map(({ Icon, title, body }, i) => (
                <Reveal key={title} delay={i * 0.06}>
                  <li className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--field)] text-[var(--accent)]">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span>
                      <span className="block font-semibold">{title}</span>
                      <span className="mt-0.5 block text-[0.9375rem] opacity-75">{body}</span>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
            </Reveal>
            <ol className="relative mt-6 flex flex-col gap-6 before:absolute before:bottom-6 before:left-[1.35rem] before:top-6 before:w-px before:bg-[var(--line)]">
              {STEPS.map(({ Icon, title, body }, i) => (
                <Reveal key={title} delay={i * 0.08}>
                  <li className="relative flex gap-4">
                    <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[var(--on-accent)]">
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="pt-1">
                      <span className="block font-semibold">{title}</span>
                      <span className="mt-0.5 block text-[0.9375rem] opacity-75">{body}</span>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="bg-[var(--surface)] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Questions</h2>
          </Reveal>
          <div className="mt-6 flex flex-col gap-3">
            {[
              ["I'm a complete beginner. Is that okay?", "Completely. Groups are small precisely so beginners get real attention, and every pose comes with simpler options."],
              ["What do I need?", "A mat, a little floor space and a phone or laptop with a camera, so Shilpa can see and guide you."],
              ["What if I miss a class?", "Classes are live, but on a monthly plan you can simply join another batch that week."],
              ["Does the offer include in-person classes?", "No. This festive offer is for live online group classes only."],
              ["When do I pay?", `Nothing now. After you claim the offer we'll message you on WhatsApp to pick a batch, and the festive price is honoured for offers claimed by ${endLabel}.`],
            ].map(([q, a]) => (
              <details key={q} className="group rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-5 py-4 open:pb-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden className="text-xl leading-none text-[var(--accent)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[0.9375rem] leading-relaxed opacity-80">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Last call ---- */}
      <section className="relative isolate overflow-hidden px-4 py-16 text-center sm:px-6 sm:py-24">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: `radial-gradient(60% 80% at 50% 100%, color-mix(in srgb, ${c.theme.accent} 22%, transparent), transparent)` }} />
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
            {ended ? "The next offer is coming" : `${c.discountPercent}% off ends ${endLabel}`}
          </h2>
          <a
            href="#claim"
            className="mt-8 inline-flex min-h-14 items-center rounded-full bg-[var(--accent)] px-8 text-base font-semibold text-[var(--on-accent)] shadow-[0_14px_40px_-14px_var(--accent)] transition-transform active:scale-[0.98]"
          >
            {ended ? "Leave my details" : `Claim my ${c.discountPercent}% off`}
          </a>
        </Reveal>
        <p className="mt-14 text-[0.75rem] opacity-55">
          © {new Date().getFullYear()} Shilpa Yoga Space · Live online group classes · Offer valid until {endLabel}
        </p>
      </section>

      <StickyClaim label={ended ? "Get the next offer" : `Claim ${c.discountPercent}% off`} note={ended ? "Notify me" : `Until ${endLabel.replace(/ \d{4}$/, "")}`} />
    </div>
  );
}
