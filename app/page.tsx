import { HomeHero } from "@/components/sections/HomeHero";
import { StatStrip } from "@/components/sections/StatStrip";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { SocialProof } from "@/components/sections/SocialProof";
import { PhilosophyBlock } from "@/components/sections/PhilosophyBlock";
import { CTASection } from "@/components/layout/CTASection";
import { images } from "@/content/images";
import { services } from "@/content/services";
import { homepageStats, testimonials, differentiators } from "@/content/home";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <StatStrip stats={homepageStats} />

      <FeatureSplit
        eyebrow="Why Shilpa Yoga Space"
        title="Not another flow to follow along to"
        image={images.differentiation}
        imageSide="right"
        tone="dark"
        caption="Hands-on alignment during a small group class."
      >
        <div className="flex flex-col divide-y divide-brand-cream/15">
          {differentiators.map((d) => (
            <div key={d.title} className="py-5 first:pt-0 last:pb-0">
              <h3 className="text-h4 text-brand-gold">{d.title}</h3>
              <p className="mt-2 text-body text-brand-cream/80">{d.body}</p>
            </div>
          ))}
        </div>
      </FeatureSplit>

      <ServiceCards
        services={services}
        eyebrow="What I offer"
        title="Three ways to practice"
        intro="However you come to the mat, the foundation is the same — intelligent, anatomy-led yoga taught with real attention."
      />

      <SocialProof testimonials={testimonials} />

      <PhilosophyBlock />

      <CTASection
        eyebrow="Begin where you are"
        title="Start with a single, unhurried class"
        subtitle="Try a trial class, join the community, or explore training to teach. There's no wrong place to begin."
        actions={[
          { label: "Book a Trial Class", href: "/contact" },
          {
            label: "Join the WhatsApp Community",
            href: siteConfig.contact.whatsappCommunity,
            variant: "secondary",
            external: true,
          },
          {
            label: "Explore Teacher Training",
            href: "/teacher-training",
            variant: "secondary",
          },
        ]}
      />
    </>
  );
}
