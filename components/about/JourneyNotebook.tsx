"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useMediaQuery";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChapterHeading } from "@/components/about/ChapterHeading";
import { images, type SiteImage } from "@/content/images";
import { cn } from "@/lib/utils";

type Entry = {
  image: SiteImage;
  date: string;
  heading: string;
  sub: string;
};

const entries: Entry[] = [
  {
    image: images.journey1,
    date: "September 2025",
    heading: "It started as a leap of faith.",
    sub: "200-Hour Yoga Teacher Training",
  },
  {
    image: images.journey2,
    date: "March 2026",
    heading: "Then came the deep work.",
    sub: "300-Hour Advanced Training",
  },
  {
    image: images.journey3,
    date: "April 2026",
    heading: "Now, a certified yoga teacher.",
    sub: "Pre & Post-Natal Yoga",
  },
];

const FLIP_EASE = [0.32, 0, 0.67, 0] as const;
const SETTLE_EASE = [0.22, 1, 0.36, 1] as const;

/** Ruled-paper texture for the notebook pages. */
const paperStyle = {
  backgroundImage:
    "repeating-linear-gradient(transparent, transparent 27px, rgba(26,26,26,0.07) 27px, rgba(26,26,26,0.07) 28px)",
} as const;

export function JourneyNotebook() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const go = useCallback((i: number) => {
    setActive(((i % entries.length) + entries.length) % entries.length);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % entries.length);
      if (e.key === "ArrowLeft")
        setActive((a) => (a - 1 + entries.length) % entries.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Warm the cache so the first flip to each page never shows an empty frame.
  useEffect(() => {
    entries.forEach((e) => {
      const img = new Image();
      img.src = e.image.src;
    });
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null || startY.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;
    // Only a clearly sideways swipe turns the page; a vertical scroll that
    // drifts a little sideways shouldn't.
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(active + (dx < 0 ? 1 : -1));
    }
    startX.current = null;
    startY.current = null;
  };

  const entry = entries[active];

  return (
    <section
      className="relative isolate overflow-hidden bg-[linear-gradient(165deg,#1F3D2E_0%,#0B130D_100%)] text-brand-cream on-dark"
      aria-roledescription="carousel"
      aria-label="Shilpa's teacher training journey, as pages of a training diary"
    >
      <div
        aria-hidden
        className="md:animate-glow-drift pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl"
      />

      <div className="container-content py-12 md:py-16">
        <ChapterHeading
          number="04"
          eyebrow="The journey"
          takeaway={
            <>
              One year in Rishikesh.{" "}
              <span className="text-brand-gold">Three certificates.</span>
            </>
          }
          intro="A training diary — turn the pages."
          tone="dark"
          align="center"
        />

        {/* The notebook */}
        <div className="relative mx-auto mt-14 w-full max-w-lg md:mt-16">
          {/* Spiral binding, above every page */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-4 left-0 right-0 z-30 flex justify-evenly px-8"
          >
            {Array.from({ length: 11 }).map((_, i) => (
              <span
                key={i}
                className="h-8 w-3 rounded-full border-2 border-brand-gold/80 bg-transparent shadow-[inset_0_-2px_3px_rgba(0,0,0,0.45)]"
              />
            ))}
          </div>

          {/* Page stage */}
          <div
            className="relative h-[560px] touch-pan-y sm:h-[580px]"
            style={{ perspective: 1400 }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* The deep shadow lives on a static layer: on the flipping page
                itself the 90px blur was repainted every frame on phones. */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-brand shadow-[0_35px_90px_-20px_rgba(0,0,0,0.8)]"
            />
            <AnimatePresence initial={false}>
              <motion.article
                key={active}
                className="absolute inset-0 flex flex-col overflow-hidden rounded-brand bg-brand-cream text-brand-ink"
                style={{ ...paperStyle, transformOrigin: "top center" }}
                initial={
                  reduce ? { opacity: 0 } : { opacity: 0.85, y: 10, scale: 0.985 }
                }
                animate={
                  reduce
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.5, ease: SETTLE_EASE, delay: 0.18 },
                      }
                }
                exit={
                  reduce
                    ? { opacity: 0 }
                    : {
                        rotateX: 92,
                        opacity: 0,
                        zIndex: 40,
                        transition: { duration: 0.6, ease: FLIP_EASE },
                      }
                }
              >
                {/* Punched holes under the spiral */}
                <div
                  aria-hidden
                  className="flex justify-evenly px-8 pt-2.5"
                >
                  {Array.from({ length: 11 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-2.5 w-2.5 rounded-full bg-[#0E1B14]/85"
                    />
                  ))}
                </div>

                {/* Gold margin line */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 left-7 top-10 w-px bg-brand-gold/30"
                />

                <div className="flex flex-1 flex-col gap-4 px-8 pb-7 pt-4 sm:px-10">
                  <p className="text-eyebrow uppercase tracking-[0.18em] text-brand-gold">
                    {entry.date}
                  </p>

                  {/* Photo taped onto the page */}
                  <div className="relative mx-auto w-full max-w-sm -rotate-1">
                    <span
                      aria-hidden
                      className="absolute -top-2 left-5 z-10 h-4 w-14 -rotate-6 rounded-[1px] border border-brand-gold/25 bg-brand-gold/35"
                    />
                    <span
                      aria-hidden
                      className="absolute -top-2 right-5 z-10 h-4 w-14 rotate-6 rounded-[1px] border border-brand-gold/25 bg-brand-gold/35"
                    />
                    <div className="overflow-hidden rounded-[2px] border-[6px] border-brand-white shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={entry.image.src}
                        alt={entry.image.alt}
                        draggable={false}
                        className="h-52 w-full select-none object-cover sm:h-60"
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex flex-1 flex-col">
                    <h3 className="text-h3 leading-snug">{entry.heading}</h3>
                    <p className="mt-2 text-body italic text-brand-stone">
                      {entry.sub}
                    </p>
                    <p className="mt-auto self-end text-small italic text-brand-stone">
                      — page {active + 1} of {entries.length}
                    </p>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Live caption for assistive tech */}
          <p className="sr-only" aria-live="polite">
            {entry.date}: {entry.heading} {entry.sub}
          </p>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous page"
              className="grid h-11 w-11 place-items-center rounded-full border border-brand-cream/15 bg-brand-cream/[0.05] text-brand-cream backdrop-blur transition-colors hover:border-brand-cream/30 hover:bg-brand-cream/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              {entries.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to page ${i + 1}`}
                  aria-current={i === active || undefined}
                  // The pill is 8px tall; the button around it is a 44px target.
                  className="group grid h-11 min-w-11 place-items-center"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block h-2 rounded-full transition-all duration-300 ease-brand",
                      i === active
                        ? "w-8 bg-brand-gold"
                        : "w-2 bg-brand-cream/20 group-hover:bg-brand-cream/40",
                    )}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next page"
              className="grid h-11 w-11 place-items-center rounded-full border border-brand-cream/15 bg-brand-cream/[0.05] text-brand-cream backdrop-blur transition-colors hover:border-brand-cream/30 hover:bg-brand-cream/10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-7 text-center text-eyebrow uppercase tracking-[0.15em] text-brand-cream/45">
            Vinyasa Yoga Ashram · Rishikesh
          </p>
        </div>
      </div>
    </section>
  );
}
