import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/layout/CTASection";
import { images } from "@/content/images";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Shilpa",
  description:
    "Shilpa is a Yoga Alliance USA Registered Yoga Teacher based in Gurgaon, teaching anatomy-based Vinyasa online and in person, and training the next generation of teachers.",
  alternates: { canonical: "/about" },
};

const approach = [
  {
    title: "The body leads",
    body: "I sequence around how joints, fascia and breath actually behave — so each class meets your body rather than forcing it into a shape.",
  },
  {
    title: "Breath before depth",
    body: "Steady breath is the measure of a posture, not how far you fold. Depth arrives on its own once the breath stays even.",
  },
  {
    title: "You, specifically",
    body: "Whether in a small group or one-to-one, I teach the person in front of me — your history, your goals, the days you feel strong and the days you don't.",
  },
];

const credentials = [
  "RYT 200 — Registered with Yoga Alliance USA",
  "Hatha and Vinyasa lineage, with ongoing study",
  "Functional anatomy and injury-aware sequencing",
  "Years of teaching across studios, homes and online",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Hi, I'm Shilpa"
        subtitle="A Registered Yoga Teacher who came to this work through the body — its limits, its patterns, and how precisely it responds when you listen."
      />

      <FeatureSplit
        eyebrow="The teacher"
        title="Yoga that took the long way here"
        image={images.aboutPortrait}
        imageSide="left"
        tone="light"
        caption="Shilpa, Gurgaon."
      >
        <div className="flex flex-col gap-5 text-body text-brand-stone">
          <p>
            I didn&apos;t arrive at yoga looking for a workout. I arrived with
            injuries, questions, and a stubborn need to understand why one
            movement healed and another hurt. Anatomy books sat next to my mat
            for years.
          </p>
          <p>
            That curiosity became a way of teaching. I trained, certified with
            Yoga Alliance USA, and slowly built a practice rooted in
            understanding rather than performance — first for myself, then for
            the students who kept asking for the <em>why</em> behind each pose.
          </p>
          <p>
            Today I teach from {siteConfig.teacher.location} — online to students
            around the world, in person across Delhi NCR, and to aspiring
            teachers who want to learn this work properly.
          </p>
        </div>
      </FeatureSplit>

      <Section tone="dark">
        <SectionHeading
          eyebrow="How I teach"
          title="Three things you can expect on the mat"
        />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {approach.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <div className="flex flex-col gap-3 border-t border-brand-cream/20 pt-6">
                <h3 className="text-h3 text-brand-gold">{a.title}</h3>
                <p className="text-body text-brand-cream/80">{a.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <FeatureSplit
        eyebrow="Training & lineage"
        title="Credentials, kept honest"
        image={images.aboutPractice}
        imageSide="right"
        tone="light"
        aspect="aspect-[4/3]"
      >
        <ul className="flex flex-col gap-3">
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
      </FeatureSplit>

      <CTASection
        eyebrow="Practice with me"
        title="Come find out what intelligent yoga feels like"
        subtitle="Book a trial class, or tell me what you're working towards."
        actions={[
          { label: "Book a Trial Class", href: "/contact" },
          { label: "See Classes", href: "/classes", variant: "secondary" },
        ]}
      />
    </>
  );
}
