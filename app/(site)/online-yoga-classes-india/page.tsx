import type { Metadata } from "next";
import { ServicePage } from "@/components/sections/ServicePage";
import { buildOnlineYogaIndia } from "@/content/seo";
import { getPricingConfig } from "@/lib/pricing/store";
import { buildPlanOptions } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Online Yoga Classes in India",
  description:
    "Live online yoga classes for India and beyond. Small groups, anatomy-led sequencing, taught live. Trial class available, beginners welcome.",
  alternates: { canonical: "/online-yoga-classes-india" },
};

export default async function OnlineYogaIndiaPage() {
  // Live prices, invalidated the moment the admin publishes a change.
  const config = await getPricingConfig();
  return (
    <ServicePage
      content={buildOnlineYogaIndia(config)}
      planOptions={buildPlanOptions(config)}
    />
  );
}
