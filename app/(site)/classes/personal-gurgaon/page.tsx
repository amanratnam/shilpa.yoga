import type { Metadata } from "next";
import { ServicePage } from "@/components/sections/ServicePage";
import { buildPersonalGurgaonContent } from "@/content/classes";
import { getPricingConfig } from "@/lib/pricing/store";
import { buildPlanOptions } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Personal Yoga Sessions in Gurgaon",
  description:
    "One-to-one yoga in Gurgaon, injury-aware, goal-focused private sessions in your home, taught by a Yoga Alliance USA RYT.",
  alternates: { canonical: "/classes/personal-gurgaon" },
};

export default async function PersonalGurgaonPage() {
  // Live prices, invalidated the moment the admin publishes a change.
  const config = await getPricingConfig();
  return (
    <ServicePage
      content={buildPersonalGurgaonContent(config)}
      planOptions={buildPlanOptions(config)}
    />
  );
}
