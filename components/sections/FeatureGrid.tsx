import { Section, type Tone } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export type Feature = { title: string; body: string };

export function FeatureGrid({
  eyebrow,
  title,
  intro,
  items,
  tone = "light",
  columns = 3,
  numbered = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  items: Feature[];
  tone?: Tone;
  columns?: 2 | 3 | 4;
  numbered?: boolean;
}) {
  const titleColor = tone === "dark" ? "text-brand-gold" : "text-brand-ink";
  const bodyColor = tone === "dark" ? "text-brand-cream/80" : "text-brand-stone";
  const border = tone === "dark" ? "border-brand-cream/20" : "border-brand-ink/15";
  const cols =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-3";

  return (
    <Section tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
      <div className={cn("mt-12 grid gap-8", cols)}>
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <div className={cn("flex flex-col gap-3 border-t pt-6", border)}>
              {numbered ? (
                <span className="text-eyebrow font-medium text-brand-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : null}
              <h3 className={cn("text-h3", titleColor)}>{item.title}</h3>
              <p className={cn("text-body", bodyColor)}>{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
