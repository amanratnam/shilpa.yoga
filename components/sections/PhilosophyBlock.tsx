import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SmartImage } from "@/components/ui/SmartImage";
import { Reveal } from "@/components/ui/Reveal";
import { images } from "@/content/images";
import { philosophy } from "@/content/home";

export function PhilosophyBlock() {
  return (
    <Section tone="light">
      <Reveal className="relative mb-14 overflow-hidden rounded-brand">
        <div className="relative aspect-[16/7]">
          <SmartImage image={images.philosophy} fill sizes="100vw" />
        </div>
      </Reveal>
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <Eyebrow>{philosophy.eyebrow}</Eyebrow>
        <h2 className="text-h2">{philosophy.heading}</h2>
        <div className="flex flex-col gap-5 text-left">
          {philosophy.paragraphs.map((p, i) => (
            <p key={i} className="text-body text-brand-stone">
              {p}
            </p>
          ))}
        </div>
        <p className="img-caption not-italic mt-2 text-h4 text-brand-green">
          {philosophy.signature}
        </p>
      </Reveal>
    </Section>
  );
}
