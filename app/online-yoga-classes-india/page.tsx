import type { Metadata } from "next";
import { ServicePage } from "@/components/sections/ServicePage";
import { onlineYogaIndia } from "@/content/seo";

export const metadata: Metadata = {
  title: "Online Yoga Classes in India",
  description:
    "Live online Vinyasa yoga classes for India and beyond. Small groups, anatomy-led sequencing, taught live. Free trial, beginners welcome.",
  alternates: { canonical: "/online-yoga-classes-india" },
};

export default function OnlineYogaIndiaPage() {
  return <ServicePage content={onlineYogaIndia} />;
}
