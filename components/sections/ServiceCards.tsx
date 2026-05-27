import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardBody } from "@/components/ui/Card";
import { SmartImage } from "@/components/ui/SmartImage";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { Service } from "@/content/services";

export function ServiceCards({
  services,
  eyebrow = "What I offer",
  title = "Three ways to practice",
  intro,
}: {
  services: Service[];
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
}) {
  return (
    <Section tone="light">
      <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
      <div
        className={cn(
          "mt-12 grid gap-6",
          services.length === 2
            ? "mx-auto max-w-4xl md:grid-cols-2"
            : "md:grid-cols-3",
        )}
      >
        {services.map((service, i) => (
          <Reveal key={service.key} delay={i * 0.08} className="h-full">
            <Card className="h-full">
              <div className="relative aspect-[4/3]">
                <SmartImage
                  image={service.image}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <CardBody>
                <Eyebrow>{service.category}</Eyebrow>
                <h3 className="text-h3">{service.title}</h3>
                <p className="text-body text-brand-stone">{service.cardDescription}</p>
                <p className="mt-2 text-small font-medium text-brand-ink">
                  {service.priceLabel}
                </p>
                <div className="mt-4">
                  <ArrowLink href={service.href}>Learn more</ArrowLink>
                </div>
              </CardBody>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
