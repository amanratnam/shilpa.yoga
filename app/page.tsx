import { HomeHero } from "@/components/sections/HomeHero";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { SocialProof } from "@/components/sections/SocialProof";
import { PhilosophyBlock } from "@/components/sections/PhilosophyBlock";
import { CTASection } from "@/components/layout/CTASection";
import { images } from "@/content/images";
import { services } from "@/content/services";
import { testimonials, differentiators } from "@/content/home";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <FeatureSplit
        eyebrow="Why Shilpa Yoga Space"
        title="Not another flow to follow along to"
        image={images.differentiation}
        imageSide="right"
        tone="light"
        caption="Hands-on alignment during a small group class."
      >
        <div className="flex flex-col divide-y divide-brand-ink/10">
          {differentiators.map((d) => (
            <div key={d.title} className="py-5 first:pt-0 last:pb-0">
              <h3 className="text-h4 text-brand-green">{d.title}</h3>
              <p className="mt-2 text-body text-brand-stone">{d.body}</p>
            </div>
          ))}
        </div>
      </FeatureSplit>

      <ServiceCards
        services={services}
        tone="dark"
        eyebrow="What I offer"
        title="Two ways to practice"
        intro="However you come to the mat, the foundation is the same, intelligent, anatomy-led yoga taught with real attention."
      />

      <SocialProof testimonials={testimonials} />

      <PhilosophyBlock />

      <CTASection
        eyebrow="Begin where you are"
        title="Start with a single, unhurried class"
        subtitle="Try a trial class, or message me directly, there's no wrong place to begin."
        actions={[
          { label: "Book a Trial Class", href: "/contact" },
          {
            label: "Message on WhatsApp",
            href: siteConfig.contact.whatsapp,
            variant: "secondary",
            external: true,
          },
        ]}
      />
    </>
  );
}
