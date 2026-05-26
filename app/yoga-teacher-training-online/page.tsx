import type { Metadata } from "next";
import { ServicePage } from "@/components/sections/ServicePage";
import { teacherTrainingOnline } from "@/content/seo";

export const metadata: Metadata = {
  title: "Online Yoga Teacher Training (200-Hour)",
  description:
    "A small-cohort 200-hour online yoga teacher training grounded in functional anatomy, philosophy and supervised practicum. Aligned with Yoga Alliance USA.",
  alternates: { canonical: "/yoga-teacher-training-online" },
};

export default function YogaTeacherTrainingOnlinePage() {
  return <ServicePage content={teacherTrainingOnline} />;
}
