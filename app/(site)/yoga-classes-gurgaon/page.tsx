import type { Metadata } from "next";
import { ServicePage } from "@/components/sections/ServicePage";
import { buildYogaClassesGurgaon } from "@/content/seo";
import { getPricingConfig } from "@/lib/pricing/store";
import { buildPlanOptions } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Yoga Classes in Gurgaon",
  description:
    "Personal and small-group yoga classes in Gurgaon & Delhi NCR. Anatomy-based, injury-aware teaching at home or studio, by a Yoga Alliance USA RYT.",
  alternates: { canonical: "/yoga-classes-gurgaon" },
};

export default async function YogaClassesGurgaonPage() {
  // Live prices, invalidated the moment the admin publishes a change.
  const config = await getPricingConfig();
  return (
    <ServicePage
      content={buildYogaClassesGurgaon(config)}
      planOptions={buildPlanOptions(config)}
    />
  );
}
