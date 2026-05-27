import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { CTASection } from "@/components/layout/CTASection";
import { Button } from "@/components/ui/Button";
import { serviceByKey } from "@/content/services";

export const metadata: Metadata = {
  title: "Classes",
  description:
    "Practice with Shilpa online from anywhere, or one-to-one in person across Gurgaon and Delhi NCR. Anatomy-based Vinyasa for every level.",
  alternates: { canonical: "/classes" },
};

export default function ClassesPage() {
  const online = serviceByKey.online;
  const personal = serviceByKey.personal;

  return (
    <>
      <PageHero
        eyebrow="Classes"
        title="Two ways to practice with me"
        subtitle="The same intelligent, anatomy-led approach — whether you join live online or work with me one-to-one in person."
      />

      <FeatureSplit
        eyebrow={online.category}
        title={online.title}
        image={online.image}
        imageSide="right"
        tone="light"
      >
        <div className="flex flex-col gap-6">
          <p className="text-body text-brand-stone">
            Live, small-group Vinyasa you can join from any timezone. Sequenced
            around the body, with options for every level and real-time
            adjustments. Beginners are genuinely welcome.
          </p>
          <p className="text-small font-medium text-brand-ink">{online.priceLabel}</p>
          <div>
            <Button href={online.href}>Explore online classes</Button>
          </div>
        </div>
      </FeatureSplit>

      <FeatureSplit
        eyebrow={personal.category}
        title={personal.title}
        image={personal.image}
        imageSide="left"
        tone="dark"
      >
        <div className="flex flex-col gap-6">
          <p className="text-body text-brand-cream/80">
            One-to-one practice shaped entirely around you — your goals, your
            history, any injuries to work around. At home or a quiet studio
            across Gurgaon and Delhi NCR.
          </p>
          <p className="text-small font-medium text-brand-cream">
            {personal.priceLabel}
          </p>
          <div>
            <Button href={personal.href} tone="dark">
              Explore personal sessions
            </Button>
          </div>
        </div>
      </FeatureSplit>

      <CTASection
        tone="light"
        eyebrow="Not sure which fits?"
        title="Start with a single, unhurried class"
        subtitle="Try a class with no commitment. Tell me a little about your body and goals, and I'll point you to the right place to begin."
        actions={[
          { label: "Book a Trial Class", href: "/contact" },
          { label: "Ask a Question", href: "/contact", variant: "secondary" },
        ]}
      />
    </>
  );
}
