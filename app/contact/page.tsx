import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/icons";
import {
  MeditatingFigure,
  TreePoseFigure,
  BreathRings,
  SunSalutationStrip,
} from "@/components/art/YogaFigures";
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
  "Online yoga, ₹199 trial then ₹4,000/mo",
  "Personal sessions in Gurgaon, ₹499 trial",
  "Pre & post-natal yoga",
];

export default function ContactPage() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-green text-brand-cream on-dark">
      {/* Ambient backdrop: drifting glow + breath rings, like soft studio light */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="animate-glow-drift absolute -right-24 -top-24 h-[24rem] w-[24rem] rounded-full bg-brand-gold/[0.08] blur-3xl md:h-[30rem] md:w-[30rem]" />
        <div className="animate-glow-drift absolute -left-32 top-1/3 h-[22rem] w-[22rem] rounded-full bg-brand-cream/[0.07] blur-3xl [animation-delay:5s]" />
        <div className="animate-glow-drift absolute -bottom-40 right-1/4 h-[26rem] w-[26rem] rounded-full bg-brand-gold/[0.06] blur-3xl [animation-delay:9s]" />
      </div>

      {/* Hero: text with a meditating figure breathing inside expanding rings */}
      <div className="container-content relative pb-10 pt-24 md:pb-14 md:pt-28">
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-40 text-brand-gold/30 sm:w-56 md:right-12 md:w-72 md:text-brand-gold/40"
          aria-hidden
        >
          <BreathRings className="absolute inset-0 scale-125 text-brand-gold/60" />
          <MeditatingFigure className="relative" />
        </div>

        <div className="relative max-w-2xl">
          <p className="eyebrow">Contact · Replies within 12–24 hours</p>
          <h1 className="mt-5 text-h1">Book a class or ask a question</h1>
          <p className="mt-5 max-w-xl text-body text-brand-cream/85">
            Tell me your experience, goals and any injuries to work around, and
            I&apos;ll point you to the right class. Live online yoga worldwide,
            one-to-one and pre/post-natal sessions in Gurgaon.
          </p>
        </div>
      </div>

      {/* Single pane: the form and every detail in one card */}
      <div className="container-content relative pb-12 md:pb-16">
        <div className="grid overflow-hidden rounded-brand shadow-2xl ring-1 ring-brand-gold/25 lg:grid-cols-[1.6fr_1fr]">
          <div className="bg-brand-cream p-6 text-brand-ink sm:p-8 md:p-10">
            <ContactForm />
          </div>

          <aside className="relative isolate flex flex-col gap-6 overflow-hidden border-t border-brand-gold/20 bg-brand-green/95 p-6 sm:p-8 md:p-10 lg:border-l lg:border-t-0">
            {/* Tree pose balancing quietly behind the details */}
            <div
              className="pointer-events-none absolute -bottom-6 -right-4 -z-10 w-36 text-brand-gold/15 sm:w-44"
              aria-hidden
            >
              <TreePoseFigure />
            </div>

            <div className="flex flex-col gap-5">
              {details.map((d) => {
                const Icon = d.icon;
                const content = (
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-brand bg-brand-cream/10 text-brand-gold">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex flex-col">
                      <Eyebrow as="span">{d.label}</Eyebrow>
                      <span className="mt-1 text-body text-brand-cream">
                        {d.value}
                      </span>
                    </span>
                  </div>
                );
                return d.href ? (
                  <a
                    key={d.label}
                    href={d.href}
                    target={/^https?:/.test(d.href) ? "_blank" : undefined}
                    rel={
                      /^https?:/.test(d.href) ? "noopener noreferrer" : undefined
                    }
                    className="transition-opacity hover:opacity-70"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={d.label}>{content}</div>
                );
              })}
            </div>

            <hr className="border-brand-cream/15" />

            <div>
              <Eyebrow>What I teach</Eyebrow>
              <ul className="mt-4 flex flex-col gap-3">
                {offerings.map((o) => (
                  <li
                    key={o}
                    className="flex gap-3 text-body text-brand-cream/90"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex items-start gap-4 text-small text-brand-cream/75">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
              <p>
                I read every message myself and usually respond within 12–24
                hours. For a faster reply about class timings, WhatsApp is best.
              </p>
            </div>
          </aside>
        </div>

        {/* A class mid-flow: sun salutation breathing left to right */}
        <div className="mt-12 flex flex-col items-center gap-4 md:mt-16">
          <SunSalutationStrip className="text-brand-gold/70" />
          <p className="text-small italic text-brand-cream/60">
            Breathe in, breathe out — see you on the mat.
          </p>
        </div>
      </div>
    </section>
  );
}
