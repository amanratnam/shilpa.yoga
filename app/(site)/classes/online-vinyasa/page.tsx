import type { Metadata } from "next";
import { ServicePage } from "@/components/sections/ServicePage";
import { buildOnlineVinyasaContent } from "@/content/classes";
import { getPricingConfig } from "@/lib/pricing/store";
import { buildPlanOptions } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Online Yoga Classes",
  description:
    "Live, small-group online yoga with a Yoga Alliance USA RYT. Vinyasa, Ashtanga and more, taught live, beginners welcome. Book a free introductory class.",
  alternates: { canonical: "/classes/online-vinyasa" },
};

export default async function OnlineVinyasaPage() {
  // Live prices, invalidated the moment the admin publishes a change.
  const config = await getPricingConfig();
  return (
    <ServicePage
      content={buildOnlineVinyasaContent(config)}
      planOptions={buildPlanOptions(config)}
    />
  );
}
