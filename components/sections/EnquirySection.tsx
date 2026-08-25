import { Section, type Tone } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import type { ContactInput, PlanOptions } from "@/lib/validation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function EnquirySection({
  eyebrow = "Get in touch",
  title,
  subtitle,
  interest,
  planOptions,
  tone = "dark",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  interest: ContactInput["interest"];
  planOptions: PlanOptions;
  tone?: Tone;
}) {
  const dark = tone === "dark";
  return (
    <Section tone={tone} id="enquire">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <SectionHeading eyebrow={eyebrow} title={title} intro={subtitle} />
          <div
            className={cn("text-body", dark ? "text-brand-cream/80" : "text-brand-stone")}
          >
            Prefer to write directly?{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="body-link">
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
        <div
          className={cn(
            "rounded-brand bg-brand-white p-6 md:p-8",
            !dark && "border border-brand-ink/10",
          )}
        >
          <ContactForm defaultInterest={interest} planOptions={planOptions} />
        </div>
      </div>
    </Section>
  );
}
