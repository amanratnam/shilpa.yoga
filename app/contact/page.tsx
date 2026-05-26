import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppIcon, InstagramIcon } from "@/components/ui/icons";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a trial class, ask about personal sessions in Gurgaon, or enquire about teacher training. Get in touch with Shilpa Yoga Space.",
  alternates: { canonical: "/contact" },
};

const details = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: "Message directly",
    href: siteConfig.contact.whatsapp,
  },
  {
    icon: MapPin,
    label: "Based in",
    value: siteConfig.teacher.location,
  },
  {
    icon: InstagramIcon,
    label: "Instagram",
    value: siteConfig.social.instagramHandle,
    href: siteConfig.social.instagram,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's find the right way for you to practice"
        subtitle="Tell me a little about where you are and what you're hoping for. I read and reply to every message myself."
      />

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              {details.map((d) => {
                const Icon = d.icon;
                const content = (
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-brand bg-brand-green/5 text-brand-green">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex flex-col">
                      <Eyebrow as="span">{d.label}</Eyebrow>
                      <span className="mt-1 text-body text-brand-ink">{d.value}</span>
                    </span>
                  </div>
                );
                return d.href ? (
                  <a
                    key={d.label}
                    href={d.href}
                    target={/^https?:/.test(d.href) ? "_blank" : undefined}
                    rel={/^https?:/.test(d.href) ? "noopener noreferrer" : undefined}
                    className="transition-opacity hover:opacity-70"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={d.label}>{content}</div>
                );
              })}
            </div>

            <div className="flex items-start gap-4 rounded-brand border border-brand-green/15 bg-brand-white p-6">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
              <p className="text-small text-brand-stone">
                I usually reply within a day or two. For a faster response about
                class timings, WhatsApp is best.
              </p>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
