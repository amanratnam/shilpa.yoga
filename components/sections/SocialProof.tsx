import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import type { Testimonial } from "@/content/home";

function Quote({ t, className }: { t: Testimonial; className?: string }) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col justify-between gap-6 rounded-brand border border-brand-cream/15 bg-brand-cream/[0.04] p-8",
        className,
      )}
    >
      <span aria-hidden className="font-sans text-6xl leading-none text-brand-gold">
        &ldquo;
      </span>
      <blockquote className="-mt-8 text-h4 font-normal leading-snug text-brand-cream">
        {t.quote}
      </blockquote>
      <figcaption className="text-small">
        <span className="font-medium text-brand-gold">{t.name}</span>
        <span className="text-brand-cream/60"> · {t.detail}</span>
      </figcaption>
    </figure>
  );
}

export function SocialProof({ testimonials }: { testimonials: Testimonial[] }) {
  const [first, second, third] = testimonials;
  return (
    <Section tone="dark">
      <SectionHeading
        eyebrow="In their words"
        title="A practice people stay with"
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Quote t={first} className="lg:p-10" />
        </Reveal>

        <Reveal delay={0.08}>
          {/* Instagram tile — links to the live feed until reels are embedded */}
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col justify-between gap-6 rounded-brand border border-brand-cream/15 bg-brand-cream/[0.04] p-8 transition-colors hover:bg-brand-cream/[0.08]"
          >
            <InstagramIcon className="h-8 w-8 text-brand-gold" />
            <div>
              <p className="text-h4 text-brand-cream">See the practice in motion</p>
              <p className="mt-2 text-small text-brand-cream/60">
                Reels & moments from class
              </p>
            </div>
            <span className="text-small font-medium uppercase tracking-[0.05em] text-brand-gold transition-colors group-hover:text-brand-cream">
              {siteConfig.social.instagramHandle}
            </span>
          </a>
        </Reveal>

        {second ? (
          <Reveal delay={0.12}>
            <Quote t={second} />
          </Reveal>
        ) : null}
        {third ? (
          <Reveal delay={0.16} className="lg:col-span-2">
            <Quote t={third} />
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}
