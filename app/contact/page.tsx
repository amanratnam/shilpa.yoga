import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/icons";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a trial of online yoga, or enquire about one-to-one and pre/post-natal yoga in Gurgaon. Get in touch with Shilpa Yoga Space.",
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
    value: siteConfig.contact.phone,
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
  {
    icon: YouTubeIcon,
    label: "YouTube",
    value: siteConfig.social.youtubeHandle,
    href: siteConfig.social.youtube,
  },
];

const offerings = [
  "Online yoga, ₹199 trial then ₹2,000/mo",
  "Personal sessions in Gurgaon, ₹499 trial",
  "Pre & post-natal yoga",
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact · Replies within 12–24 hours"
        title="Book a class or ask a question"
        subtitle="Tell me your experience, goals and any injuries to work around, and I'll point you to the right class. Live online yoga worldwide, one-to-one and pre/post-natal sessions in Gurgaon."
      />

      <Section tone="light">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* Form first, so it's in the first fold on mobile and desktop */}
          <div className="order-1">
            <ContactForm />
          </div>

          <aside className="order-2 flex flex-col gap-6">
            <div className="flex flex-col gap-5 rounded-brand border border-brand-green/15 bg-brand-white p-6">
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

            <div className="rounded-brand bg-brand-green p-6 text-brand-cream">
              <Eyebrow className="text-brand-gold">What I teach</Eyebrow>
              <ul className="mt-4 flex flex-col gap-3">
                {offerings.map((o) => (
                  <li key={o} className="flex gap-3 text-body text-brand-cream/90">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-start gap-4 text-small text-brand-stone">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
              <p>
                I read every message myself and usually respond within 12–24
                hours. For a faster reply about class timings, WhatsApp is best.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
