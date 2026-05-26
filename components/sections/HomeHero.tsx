import { SmartImage } from "@/components/ui/SmartImage";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { images } from "@/content/images";
import { siteConfig } from "@/lib/site";

export function HomeHero() {
  const words = siteConfig.taglineWords;
  return (
    <section className="relative isolate overflow-hidden bg-brand-green text-brand-cream on-dark">
      {/* Background photography / branded placeholder */}
      <div className="absolute inset-0 -z-10">
        <SmartImage image={images.homepageHero} fill priority sizes="100vw" subtle />
        {/* ~40% brand-green overlay + bottom gradient for text legibility */}
        <div className="absolute inset-0 bg-brand-green/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-green via-brand-green/30 to-transparent" />
      </div>

      <div className="container-content flex min-h-[88vh] flex-col justify-end pb-16 pt-28 md:pb-24">
        <div className="max-w-4xl">
          <p className="eyebrow mb-6">Anatomy-based Vinyasa yoga</p>
          <h1 className="text-display font-bold lowercase text-brand-cream">
            {words.map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
          </h1>
          <p className="mt-8 max-w-xl text-h4 font-normal text-brand-cream/85">
            Online classes worldwide, personal sessions in Gurgaon, and a teacher
            training grounded in the body — taught by a Yoga Alliance USA
            Registered Yoga Teacher.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="/contact" tone="dark" variant="primary">
              Book a Trial Class
            </Button>
            <Button href="/teacher-training" tone="dark" variant="secondary">
              Explore Teacher Training
            </Button>
          </div>
        </div>
      </div>

      {/* RYT badge, lower corner */}
      <div className="pointer-events-none absolute bottom-6 right-6 hidden md:block">
        <Badge tone="dark" className="bg-brand-green/40 backdrop-blur">
          {siteConfig.teacher.credential}
        </Badge>
      </div>
    </section>
  );
}
