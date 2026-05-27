import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SmartImage } from "@/components/ui/SmartImage";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { CTASection } from "@/components/layout/CTASection";
import { images } from "@/content/images";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Shilpa",
  description:
    "Shilpa is a Yoga Alliance USA Registered Yoga Teacher in Gurgaon, teaching anatomy-based Vinyasa online worldwide and one-to-one across Delhi NCR.",
  alternates: { canonical: "/about" },
};

const approach = [
  {
    title: "The body leads",
    body: "I sequence around how joints, fascia and breath actually behave, so each class meets your body rather than forcing it into a shape.",
  },
  {
    title: "Breath before depth",
    body: "Steady breath is the measure of a posture, not how far you fold. Depth arrives on its own once the breath stays even.",
  },
  {
    title: "You, specifically",
    body: "Whether in a small group or one-to-one, I teach the person in front of me, your history, your goals, the days you feel strong and the days you don't.",
  },
];

const credentials = [
  "Advanced 500-Hour Yoga TTC, Vinyasa Yoga Ashram",
  "RYT 500, registered with Yoga Alliance USA",
  "Pre- and post-natal yoga trained",
  "Anatomy-led, injury-aware sequencing",
  "Teaching across studios, homes and online",
];

// All four are portrait, a clean, consistent 4-up editorial row.
const gallery = [
  images.aboutPractice,
  images.differentiation,
  images.aboutCeremony,
  images.aboutStudio,
];

export default function AboutPage() {
  return (
    <>
      {/* Editorial hero, asymmetric, portrait + intro */}
      <section className="bg-brand-green text-brand-cream on-dark">
        <div className="container-content grid items-center gap-12 pb-16 pt-32 md:pb-24 md:pt-40 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal className="flex flex-col gap-6">
            <Eyebrow>About</Eyebrow>
            <h1 className="text-display font-bold lowercase leading-[0.95]">
              hi, I&apos;m
              <br />
              shilpa
            </h1>
            <p className="max-w-xl text-h4 font-normal text-brand-cream/85">
              A Registered Yoga Teacher who came to this work through the body, its limits, its patterns, and how precisely it responds when you
              finally listen.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Badge tone="dark">{siteConfig.teacher.credential}</Badge>
              <Badge tone="dark">{siteConfig.teacher.location}</Badge>
              <Badge tone="dark">Online & in person</Badge>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative mx-auto w-full max-w-sm">
            {/* Gold offset accent */}
            <div className="absolute -bottom-4 -right-4 -z-0 h-full w-full rounded-brand border border-brand-gold/60" />
            <div className="relative z-10 aspect-[3/4] overflow-hidden rounded-brand">
              <SmartImage
                image={images.aboutPortrait}
                fill
                priority
                sizes="(min-width: 1024px) 38vw, 90vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Story with overlapping images + pull quote */}
      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-brand">
              <SmartImage
                image={images.aboutStudio}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
            {/* Overlapping secondary image */}
            <div className="absolute -bottom-8 -right-4 hidden w-2/5 overflow-hidden rounded-brand border-4 border-brand-cream shadow-xl sm:block">
              <div className="relative aspect-square">
                <SmartImage image={images.aboutSeated} fill sizes="200px" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="The teacher"
              title="Yoga that took the long way here"
            />
            <p className="text-body text-brand-stone">
              I didn&apos;t arrive at yoga looking for a workout. I arrived with
              injuries, questions, and a stubborn need to understand why one
              movement healed and another hurt. Anatomy books sat next to my mat
              for years.
            </p>
            <blockquote className="border-l-2 border-brand-gold pl-5 text-h4 font-normal text-brand-ink">
              Flexibility was never the goal. A body that moves well, for a long
              time, that&apos;s the goal.
            </blockquote>
            <p className="text-body text-brand-stone">
              That curiosity became a way of teaching. I trained intensively,
              earning an advanced 500-hour certification at Vinyasa Yoga Ashram
              and registering with Yoga Alliance USA, and built a practice rooted
              in understanding rather than performance, first for myself, then
              for the students who kept asking for the <em>why</em> behind each
              pose.
            </p>
            <p className="text-body text-brand-stone">
              Today I teach from {siteConfig.teacher.location}, online to
              students around the world, and one-to-one across Delhi NCR. Same
              intention every time: move with understanding, and the body
              follows.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* How I teach */}
      <Section tone="dark">
        <SectionHeading
          eyebrow="How I teach"
          title="Three things you can expect on the mat"
        />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {approach.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <div className="flex flex-col gap-3 border-t border-brand-cream/20 pt-6">
                <span className="text-eyebrow font-medium text-brand-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-h3 text-brand-gold">{a.title}</h3>
                <p className="text-body text-brand-cream/80">{a.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Editorial gallery */}
      <Section tone="light">
        <SectionHeading
          eyebrow="In practice"
          title="Moments from the mat"
          intro="From quiet mornings by the river to hands-on work in the studio."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {gallery.map((image, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-brand">
                <SmartImage
                  image={image}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="transition-transform duration-500 ease-brand hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Big statement quote */}
      <Section tone="dark">
        <Reveal className="mx-auto max-w-4xl text-center">
          <span aria-hidden className="text-6xl leading-none text-brand-gold">
            &ldquo;
          </span>
          <p className="-mt-6 text-h2 font-normal leading-tight text-brand-cream">
            I want you to leave a class understanding your own body a little
            better than when you arrived. That understanding is the practice.
          </p>
          <p className="mt-8 text-eyebrow uppercase tracking-[0.1em] text-brand-gold">
            Shilpa
          </p>
        </Reveal>
      </Section>

      {/* Credentials */}
      <Section tone="light">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="lg:order-2">
            <SectionHeading
              eyebrow="Training & lineage"
              title="Credentials, kept honest"
            />
            <ul className="mt-8 flex flex-col gap-3">
              {credentials.map((c) => (
                <li
                  key={c}
                  className="flex gap-3 border-b border-brand-ink/10 pb-3 text-body text-brand-stone last:border-0"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-brand">
              <SmartImage
                image={images.aboutCertified}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <CTASection
        eyebrow="Practice with me"
        title="Come find out what intelligent yoga feels like"
        subtitle="Book a free trial class, or tell me what you're working towards."
        actions={[
          { label: "Book a Trial Class", href: "/contact" },
          { label: "See Classes", href: "/classes", variant: "secondary" },
        ]}
      />
    </>
  );
}
