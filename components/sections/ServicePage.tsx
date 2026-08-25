import { PageHero, type PageHeroAction } from "@/components/sections/PageHero";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { FeatureGrid, type Feature } from "@/components/sections/FeatureGrid";
import { PricingTable, type Plan } from "@/components/sections/PricingTable";
import { FAQ } from "@/components/sections/FAQ";
import { EnquirySection } from "@/components/sections/EnquirySection";
import type { AccordionItem } from "@/components/ui/Accordion";
import type { SiteImage } from "@/content/images";
import type { ContactInput, PlanOptions } from "@/lib/validation";

export type ServicePageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image?: SiteImage;
    actions?: PageHeroAction[];
  };
  intro: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    image: SiteImage;
    imageSide?: "left" | "right";
    caption?: string;
  };
  whoFor: { eyebrow: string; title: string; intro?: string; items: Feature[] };
  expect: { eyebrow: string; title: string; intro?: string; items: Feature[] };
  pricing: {
    eyebrow?: string;
    title?: string;
    intro?: string;
    plans: Plan[];
    note?: string;
  };
  faqs: AccordionItem[];
  enquiry: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    interest: ContactInput["interest"];
  };
};

export function ServicePage({
  content,
  planOptions,
}: {
  content: ServicePageContent;
  /** Enquiry dropdown options, resolved from live pricing by the page. */
  planOptions: PlanOptions;
}) {
  return (
    <>
      <PageHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        image={content.hero.image}
        actions={content.hero.actions}
      />

      <FeatureSplit
        eyebrow={content.intro.eyebrow}
        title={content.intro.title}
        image={content.intro.image}
        imageSide={content.intro.imageSide ?? "right"}
        tone="light"
        caption={content.intro.caption}
      >
        <div className="flex flex-col gap-5 text-body text-brand-stone">
          {content.intro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </FeatureSplit>

      <FeatureGrid
        tone="dark"
        eyebrow={content.whoFor.eyebrow}
        title={content.whoFor.title}
        intro={content.whoFor.intro}
        items={content.whoFor.items}
        columns={content.whoFor.items.length === 4 ? 4 : 3}
      />

      <FeatureGrid
        tone="light"
        numbered
        eyebrow={content.expect.eyebrow}
        title={content.expect.title}
        intro={content.expect.intro}
        items={content.expect.items}
        columns={content.expect.items.length === 4 ? 4 : 3}
      />

      <PricingTable
        id="pricing"
        tone="dark"
        eyebrow={content.pricing.eyebrow}
        title={content.pricing.title}
        intro={content.pricing.intro}
        plans={content.pricing.plans}
        note={content.pricing.note}
      />

      <FAQ tone="light" items={content.faqs} />

      <EnquirySection
        planOptions={planOptions}
        eyebrow={content.enquiry.eyebrow}
        title={content.enquiry.title}
        subtitle={content.enquiry.subtitle}
        interest={content.enquiry.interest}
      />
    </>
  );
}
