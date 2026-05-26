import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { PricingTable } from "@/components/sections/PricingTable";
import { FAQ } from "@/components/sections/FAQ";
import { EnquirySection } from "@/components/sections/EnquirySection";
import { JsonLd } from "@/components/JsonLd";
import { teacherTrainingCourseJsonLd } from "@/lib/jsonld";
import { images } from "@/content/images";
import {
  trainingIntro,
  curriculum,
  trainingDifference,
  trainingFormat,
  trainingPlans,
  trainingFaqs,
} from "@/content/training";

export const metadata: Metadata = {
  title: "Yoga Teacher Training (200-Hour)",
  description:
    "A small-cohort 200-hour yoga teacher training grounded in functional anatomy, philosophy and supervised practicum. Aligned with Yoga Alliance USA standards.",
  alternates: { canonical: "/teacher-training" },
};

export default function TeacherTrainingPage() {
  return (
    <>
      <JsonLd data={teacherTrainingCourseJsonLd} />
      <PageHero
        eyebrow="Teacher Training · Yoga Alliance aligned"
        title="Train to teach — with real understanding of the body"
        subtitle="A 200-hour certification for people who want to teach yoga properly: anatomy-led, philosophically grounded, and taught in a genuinely small cohort."
        image={images.trainingHero}
        actions={[
          { label: "Apply now", href: "#enquire" },
          { label: "See tuition", href: "#pricing", variant: "secondary" },
        ]}
      />

      <FeatureSplit
        eyebrow={trainingIntro.eyebrow}
        title={trainingIntro.title}
        image={images.trainingAnatomy}
        imageSide="right"
        tone="light"
        aspect="aspect-[4/3]"
        caption={trainingIntro.caption}
      >
        <div className="flex flex-col gap-5 text-body text-brand-stone">
          {trainingIntro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </FeatureSplit>

      <FeatureGrid
        tone="dark"
        eyebrow="The curriculum"
        title="Four pillars, taught in depth"
        items={curriculum}
        columns={4}
        numbered
      />

      <FeatureGrid
        tone="light"
        eyebrow="Why this one"
        title="What makes this training different"
        items={trainingDifference}
        columns={3}
      />

      <FeatureGrid
        tone="dark"
        eyebrow="The format"
        title="How the training runs"
        items={trainingFormat}
        columns={4}
      />

      <PricingTable
        id="pricing"
        tone="light"
        eyebrow="Tuition"
        title="Invest in teaching well"
        intro="Secure your seat with a deposit, then pay in full or in installments on enrolment."
        plans={trainingPlans}
        note="Prices are placeholders pending confirmation. Deposits are processed securely by Razorpay; your seat is confirmed once your application is reviewed."
      />

      <FAQ tone="dark" items={trainingFaqs} eyebrow="Questions" title="What trainees ask" />

      <EnquirySection
        tone="light"
        eyebrow="Apply"
        title="Apply for the next cohort"
        subtitle="Tell me about your practice and why you want to teach. I review every application personally and will reply with next steps and dates."
        interest="training"
      />
    </>
  );
}
