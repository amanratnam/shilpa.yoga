import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { heroVideo } from "@/content/images";
import { siteConfig } from "@/lib/site";

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-green text-brand-cream on-dark">
      {/* Background video (autoplay, muted, looped) with poster fallback */}
      <div className="absolute inset-0 -z-10">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroVideo.poster}
          aria-hidden
        >
          <source src={heroVideo.src} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-brand-green/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-green via-brand-green/35 to-transparent" />
      </div>

      <div className="container-content flex min-h-[66vh] flex-col justify-end pb-14 pt-28 md:min-h-[70vh] md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-5">
            Online &amp; in-person yoga · 500-Hour RYT, Yoga Alliance USA
          </p>
          <h1 className="text-display font-bold lowercase leading-[0.95] text-brand-cream">
            <span className="block">strong body,</span>
            <span className="block">quiet mind</span>
          </h1>
          <p className="mt-7 max-w-xl text-h4 font-normal text-brand-cream/85">
            Live online and in-person yoga with Shilpa, for office-goers in their
            20s and 30s, expecting mothers, and anyone staying strong through
            midlife, building real flexibility and fitness, and a calmer,
            clearer, less anxious mind.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button href="/contact" tone="dark" variant="primary">
              Book a Trial Class
            </Button>
            <Button href="/classes" tone="dark" variant="secondary">
              Explore Classes
            </Button>
          </div>
        </div>
      </div>

      {/* Credential badge, lower corner */}
      <div className="pointer-events-none absolute bottom-6 right-6 hidden lg:block">
        <Badge tone="dark" className="bg-brand-green/40 backdrop-blur">
          {siteConfig.teacher.certification}
        </Badge>
      </div>
    </section>
  );
}
