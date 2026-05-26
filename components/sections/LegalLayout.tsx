import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} subtitle={`Last updated ${updated}`} />
      <Section tone="light">
        <article className="prose prose-brand mx-auto">
          <p className="lead">
            This page is a starting template and not legal advice. Please have it
            reviewed by a qualified professional before launch.
          </p>
          {children}
        </article>
      </Section>
    </>
  );
}
