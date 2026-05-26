import { Section, type Tone } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export type CTAAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
};

export function CTASection({
  eyebrow,
  title,
  subtitle,
  actions,
  tone = "dark",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions: CTAAction[];
  tone?: Tone;
}) {
  return (
    <Section tone={tone}>
      <Reveal className="flex flex-col items-center gap-8 text-center">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          intro={subtitle}
          align="center"
        />
        <div className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
          {actions.map((action) => (
            <Button
              key={action.label}
              href={action.href}
              tone={tone}
              variant={action.variant ?? "primary"}
              external={action.external}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
