import type { Metadata } from "next";
import { ServicePage } from "@/components/sections/ServicePage";
import { personalGurgaonContent } from "@/content/classes";

export const metadata: Metadata = {
  title: "Personal Yoga Sessions in Gurgaon",
  description:
    "One-to-one yoga in Gurgaon and Delhi NCR — injury-aware, goal-focused private sessions at home or studio, taught by a Yoga Alliance USA RYT.",
  alternates: { canonical: "/classes/personal-gurgaon" },
};

export default function PersonalGurgaonPage() {
  return <ServicePage content={personalGurgaonContent} />;
}
