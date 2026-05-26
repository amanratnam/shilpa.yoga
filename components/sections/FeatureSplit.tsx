import { Section, type Tone } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { SiteImage } from "@/content/images";

export function FeatureSplit({
  eyebrow,
  title,
  image,
  imageSide = "right",
  tone = "dark",
  caption,
  aspect = "aspect-[4/5]",
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  image: SiteImage;
  imageSide?: "left" | "right";
  tone?: Tone;
  caption?: string;
  aspect?: string;
  children?: React.ReactNode;
}) {
  return (
    <Section tone={tone}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className={cn(imageSide === "left" && "lg:order-2")}>
          <SectionHeading eyebrow={eyebrow} title={title} />
          {children ? <div className="mt-8">{children}</div> : null}
        </Reveal>
        <Reveal
          delay={0.1}
          className={cn("flex flex-col gap-3", imageSide === "left" && "lg:order-1")}
        >
          <div className={cn("relative overflow-hidden rounded-brand", aspect)}>
            <SmartImage image={image} fill sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          {caption ? <p className="img-caption">{caption}</p> : null}
        </Reveal>
      </div>
    </Section>
  );
}
