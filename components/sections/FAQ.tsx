import { Section, type Tone } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";

export function FAQ({
  eyebrow = "Questions",
  title = "Good things to know",
  items,
  tone = "light",
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  items: AccordionItem[];
  tone?: Tone;
}) {
  return (
    <Section tone={tone}>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <Accordion items={items} tone={tone} />
      </div>
    </Section>
  );
}
