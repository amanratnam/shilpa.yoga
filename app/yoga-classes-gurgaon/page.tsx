import type { Metadata } from "next";
import { ServicePage } from "@/components/sections/ServicePage";
import { yogaClassesGurgaon } from "@/content/seo";

export const metadata: Metadata = {
  title: "Yoga Classes in Gurgaon",
  description:
    "Personal and small-group yoga classes in Gurgaon & Delhi NCR. Anatomy-based, injury-aware teaching at home or studio, by a Yoga Alliance USA RYT.",
  alternates: { canonical: "/yoga-classes-gurgaon" },
};

export default function YogaClassesGurgaonPage() {
  return <ServicePage content={yogaClassesGurgaon} />;
}
