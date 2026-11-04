import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarCheck, Check, MessageCircle, Sparkles } from "lucide-react";
import { OFFER_PLANS, campaigns, campaignEnded, getCampaign } from "@/content/campaigns";
import { images } from "@/content/images";
import { buildOnlineVinyasaContent } from "@/content/classes";
import { getPricingConfig } from "@/lib/pricing/store";
import { formatINR } from "@/lib/pricing/config";
import { Logo } from "@/components/layout/Logo";
import { FestiveCanvas } from "@/components/offer/FestiveCanvas";
import { HeroMotif } from "@/components/offer/Motifs";
import { OfferForm } from "@/components/offer/OfferForm";
import { LiquidGlass } from "@/components/offer/LiquidGlass";
import { Countdown } from "@/components/offer/Countdown";
import { StickyClaim } from "@/components/offer/StickyClaim";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { FAQ } from "@/components/sections/FAQ";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
  const title = `${c.festival} offer: free extra online yoga classes`;
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

/** Splits the headline so the campaign's highlight words are set in gold. */
function Headline({ text, highlight }: { text: string; highlight: string }) {
  const i = text.indexOf(highlight);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="font-extralight text-brand-gold">{highlight}</span>
      {text.slice(i + highlight.length)}
    </>
  );
}

const STEPS = [
  { Icon: Sparkles, title: "Claim your offer", body: "Leave your name and WhatsApp number. It takes under a minute." },
  { Icon: MessageCircle, title: "Pick your batch", body: "We message you within a day to match you to a time that suits you." },
  { Icon: CalendarCheck, title: "Start practising", body: "Join your first live class and settle into a steady weekly rhythm." },
];

export default async function OfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCampaign((await params).slug);
  if (!c) notFound();

  // The online classes page's own copy, so the offer always describes the
  // classes exactly as the main site does.
  const online = buildOnlineVinyasaContent(await getPricingConfig());
  const ended = campaignEnded(c);
  const endLabel = endDateLabel(c.endsOn);

  const plans = OFFER_PLANS.map((p, i) => {
    const total = p.classes + p.free;
    return {
      ...p,
      total,
      perClass: Math.round(p.price / total),
      perPaidClass: Math.round(p.price / p.classes),
      featured: i === 1,
    };
  });
  const lowestPerClass = Math.min(...plans.map((p) => p.perClass));

  return (
    <div className="relative flex-1 overflow-x-clip bg-brand-cream text-brand-ink">
      {/* ---- Header: the logo is the only way back to the main site ---- */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="container-content flex h-16 items-center md:h-20">
          <Logo tone="dark" />
        </div>
      </header>

      {/* ---- Hero: brand green, with the festival in the atmosphere ---- */}
      <section
        id="offer-hero"
        className="relative isolate overflow-hidden bg-[radial-gradient(120%_90%_at_30%_20%,#2B5340_0%,#1F3D2E_45%,#12241A_100%)] text-brand-cream on-dark"
      >
        <FestiveCanvas
          effect={c.effect}
          colors={c.particles}
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
          <HeroMotif campaign={c} />
        </div>

        <div
          className={cn(
            "container-content grid gap-10 pb-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pb-24",
            // The Christmas lights hang below the header; give them room.
            c.effect === "snow" ? "pt-36 md:pt-40" : "pt-24 md:pt-32",
          )}
        >
          <div>
            <p className="eyebrow animate-fade-rise">
              {c.greeting} · Live online group yoga
            </p>
            <h1 className="mt-4 animate-fade-rise text-h1 [animation-delay:0.08s]">
              <Headline text={c.headline} highlight={c.highlight} />
            </h1>
            <p className="mt-5 max-w-xl animate-fade-rise text-body text-brand-cream/80 [animation-delay:0.16s]">
              {c.intro}
            </p>

            <div className="mt-8 flex animate-fade-rise flex-col gap-3 [animation-delay:0.24s]">
              <p className="text-small text-brand-cream/75">
                {ended ? (
                  "This offer has ended. Leave your details to hear about the next one."
                ) : (
                  <>
                    Free extra classes on every monthly plan, from{" "}
                    <span className="font-semibold text-brand-gold">{formatINR(lowestPerClass)} a class</span>.
                    Offer ends in
                  </>
                )}
              </p>
              {ended ? null : <Countdown endsOn={c.endsOn} label={`Ends ${endLabel}`} />}
            </div>
          </div>

          {/* ---- The form, on liquid glass over the festive scene ---- */}
          <div id="claim" className="scroll-mt-6 animate-fade-rise [animation-delay:0.2s]">
            <LiquidGlass className="p-5 sm:p-7">
              <h2 className="text-h4 font-semibold">
                {ended ? "Get the next offer first" : `Claim your ${c.festival} offer`}
              </h2>
              <p className="mt-1 text-small text-brand-cream/70">
                {ended
                  ? "We'll tell you when the next festive batch opens."
                  : `Live online group classes with free extra classes. Valid until ${endLabel}.`}
              </p>
              <div className="mt-5">
                <OfferForm
                  campaign={c.slug}
                  campaignName={c.festival}
                  plans={[
                    ...plans.map((p) => ({ value: String(p.classes), label: `${p.classes} + ${p.free} free` })),
                    { value: "unsure", label: "Not sure yet" },
                  ]}
                />
              </div>
            </LiquidGlass>
          </div>
        </div>
      </section>

      {/* ---- The offer ---- */}
      <Section tone="light">
        <SectionHeading
          eyebrow="The festive offer"
          title="Extra classes, on us"
          intro="Live online group classes only. Every monthly plan comes with free classes added, so each class costs you less."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.classes} delay={i * 0.08} className="h-full">
              <div
                className={cn(
                  "flex h-full flex-col rounded-brand bg-brand-white p-6 transition-transform duration-300 ease-brand hover:-translate-y-1",
                  p.featured
                    ? "ring-2 ring-brand-gold shadow-[0_20px_50px_-20px_rgba(31,61,46,0.45)]"
                    : "border border-brand-ink/10",
                )}
              >
                <h3 className="text-body font-medium">
                  {p.classes} classes <span className="text-brand-green">+ {p.free} free</span>
                </h3>
                <p className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-[2rem] font-bold leading-none tracking-tight text-brand-green">
                    {formatINR(p.price)}
                  </span>
                  <span className="text-small text-brand-stone">/ month</span>
                </p>
                <p className="mt-2 text-small text-brand-stone">
                  <span className="font-medium text-brand-ink">{formatINR(p.perClass)} a class</span>{" "}
                  instead of {formatINR(p.perPaidClass)}
                </p>
                <div className="my-5 h-px w-full bg-brand-ink/10" />
                <ul className="flex flex-col gap-2.5 text-small text-brand-ink">
                  {[
                    `${p.total} live classes through the month`,
                    "Small group, with real, personal attention",
                    "Join another batch if you miss a class",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-gold/15">
                        <Check className="h-2.5 w-2.5 text-brand-green" strokeWidth={3} aria-hidden />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#claim"
                  className={cn(
                    "mt-6 inline-flex min-h-12 items-center justify-center rounded-brand px-5 text-small font-medium uppercase tracking-[0.05em] transition-colors duration-300",
                    p.featured
                      ? "bg-brand-green text-brand-cream hover:bg-brand-ink"
                      : "border border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-cream",
                  )}
                >
                  Claim this plan
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* How claiming works */}
        <ol className="mt-12 grid gap-6 border-t border-brand-ink/10 pt-10 md:grid-cols-3">
          {STEPS.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <li className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-green text-brand-cream">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="mt-0.5 block text-small text-brand-stone">{body}</span>
                </span>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ---- The classes, as the main site describes them ---- */}
      <FeatureSplit
        eyebrow={online.intro.eyebrow}
        title={online.intro.title}
        image={online.intro.image}
        imageSide="right"
        tone="white"
        caption={online.intro.caption}
      >
        <div className="flex flex-col gap-5 text-body text-brand-stone">
          {online.intro.paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </FeatureSplit>

      <FeatureGrid
        tone="dark"
        eyebrow={online.whoFor.eyebrow}
        title={online.whoFor.title}
        items={online.whoFor.items}
        columns={3}
      />

      <FeatureGrid
        tone="light"
        numbered
        eyebrow={online.expect.eyebrow}
        title={online.expect.title}
        items={online.expect.items}
        columns={3}
      />

      <FAQ
        tone="white"
        items={[
          ...online.faqs,
          {
            question: "Does this offer include in-person classes?",
            answer: "No. The festive offer is for live online group classes only.",
          },
          {
            question: "When do I pay?",
            answer: `Nothing now. After you claim the offer we'll message you on WhatsApp to pick a batch. Offers claimed by ${endLabel} get the festive plan.`,
          },
        ]}
      />

      {/* ---- Last call ---- */}
      <section className="bg-brand-green text-brand-cream on-dark">
        <div className="container-content flex flex-col items-center gap-6 py-section-sm text-center md:py-section">
          <p className="eyebrow">{c.greeting}</p>
          <h2 className="max-w-2xl text-h2">
            {ended ? "The next offer is coming" : `Your ${c.festival} offer ends ${endLabel}`}
          </h2>
          <a
            href="#claim"
            className="inline-flex min-h-14 items-center rounded-brand bg-brand-gold px-8 text-small font-medium uppercase tracking-[0.05em] text-brand-ink transition-colors duration-300 hover:bg-brand-cream"
          >
            {ended ? "Leave my details" : "Claim my offer"}
          </a>
          <p className="mt-6 text-[0.75rem] text-brand-cream/50">
            © {new Date().getFullYear()} Shilpa Yoga Space · Live online group classes
          </p>
        </div>
      </section>

      <StickyClaim
        label={ended ? "Get the next offer" : "Claim my offer"}
        note={ended ? "Notify me" : `Until ${endLabel.replace(/ \d{4}$/, "")}`}
      />
    </div>
  );
}
