import type { Metadata } from "next";
import { CTASection } from "@/components/layout/CTASection";
import { AboutHero } from "@/components/about/AboutHero";
import { ScrollCompanion } from "@/components/about/ScrollCompanion";
import { StorySection } from "@/components/about/StorySection";
import { MethodCards } from "@/components/about/MethodCards";
import { QuoteReveal } from "@/components/about/QuoteReveal";
import { GalleryParallax } from "@/components/about/GalleryParallax";
import { JourneyNotebook } from "@/components/about/JourneyNotebook";
import { CredentialsSection } from "@/components/about/CredentialsSection";

export const metadata: Metadata = {
  title: "About Shilpa",
  description:
    "Shilpa is a Yoga Alliance USA Registered Yoga Teacher in Gurgaon, teaching anatomy-based Vinyasa online worldwide and one-to-one across Delhi NCR.",
  alternates: { canonical: "/about" },
};

/**
 * The about page is a scroll-driven narrative in five chapters, each led by
 * one bold takeaway line (the glimpse layer), with a fixed pose companion
 * tracking progress down the page.
 */
export default function AboutPage() {
  return (
    <>
      <ScrollCompanion />

      {/* Arrival — full-viewport cinematic hero */}
      <AboutHero />

      {/* 01 · The teacher — the story, with drifting photographs */}
      <StorySection />

      {/* 02 · How I teach — three promises, three animated characters */}
      <MethodCards />

      {/* The pinned statement — illuminates word by word as you scroll */}
      <QuoteReveal />

      {/* 03 · In practice — parallax gallery */}
      <GalleryParallax />

      {/* 04 · The journey — a Rishikesh training diary with folding pages */}
      <JourneyNotebook />

      {/* 05 · Training & lineage — credentials, kept honest */}
      <CredentialsSection />

      <CTASection
        eyebrow="Practice with me"
        title="Come find out what intelligent yoga feels like"
        subtitle="Book a trial class, or tell me what you're working towards."
        actions={[
          { label: "Book a Trial Class", href: "/contact" },
          { label: "See Classes", href: "/classes", variant: "secondary" },
        ]}
      />
    </>
  );
}
