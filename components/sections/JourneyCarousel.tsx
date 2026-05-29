"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { images, type SiteImage } from "@/content/images";
import { cn } from "@/lib/utils";

type Slide = {
  image: SiteImage;
  date: string;
  heading: string;
  sub: string;
  portrait?: boolean;
};

const slides: Slide[] = [
  {
    image: images.journey1,
    date: "September 2025",
    heading: "It started as a leap of faith.",
    sub: "200-Hour Yoga Teacher Training",
    portrait: true,
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

function getPos(active: number, i: number) {
  const diff = (i - active + slides.length) % slides.length;
  if (diff === 0) return { x: 0, z: 60, ry: 0, s: 1, o: 1 };
  if (diff === 1) return { x: 68, z: -90, ry: -16, s: 0.78, o: 0.5 };
  if (diff === slides.length - 1)
    return { x: -68, z: -90, ry: 16, s: 0.78, o: 0.5 };
  return { x: 0, z: -250, ry: 0, s: 0.5, o: 0 };
}

export function JourneyCarousel() {
  const [active, setActive] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);

  const go = useCallback((i: number) => {
    setActive(((i % slides.length) + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % slides.length);
      if (e.key === "ArrowLeft")
        setActive((a) => (a - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    dragging.current = true;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
    dragging.current = false;
  };
  const onMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    dragging.current = true;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
    dragging.current = false;
  };

  const current = slides[active];

  return (
    <section
      className="relative isolate overflow-hidden bg-[linear-gradient(165deg,#1F3D2E_0%,#0B130D_100%)] text-brand-cream on-dark"
      aria-roledescription="carousel"
      aria-label="Shilpa's yoga teacher training journey"
    >
      {/* Soft gold accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl"
      />

      <div className="container-content section-y">
        {/* Section heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow>The journey</Eyebrow>
          <h2 className="max-w-2xl text-h2">
            How I got here, in three steps
          </h2>
        </div>

        {/* Caption */}
        <div className="mt-12 flex min-h-[7.5rem] flex-col items-center px-6 text-center">
          <p
            key={`d-${active}`}
            className="text-eyebrow uppercase tracking-[0.18em] text-brand-gold animate-fade-rise"
          >
            {current.date}
          </p>
          <h3
            key={`h-${active}`}
            className="mt-3 text-h2 leading-tight text-brand-cream animate-fade-rise [animation-delay:60ms]"
          >
            {current.heading}
          </h3>
          <p
            key={`s-${active}`}
            className="mt-2 text-body text-brand-cream/65 animate-fade-rise [animation-delay:110ms]"
          >
            {current.sub}
          </p>
        </div>

        {/* 3D Stage */}
        <div
          className="relative mt-6 w-full touch-pan-y"
          style={{ height: "clamp(340px, 58vw, 500px)" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: 1000, perspectiveOrigin: "50% 50%" }}
          >
            {slides.map((s, i) => {
              const p = getPos(active, i);
              const isActive = i === active;
              const cardW = s.portrait
                ? "clamp(220px, 34vw, 310px)"
                : "clamp(300px, 52vw, 440px)";
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Show slide ${i + 1}: ${s.sub}`}
                  aria-current={isActive || undefined}
                  className={cn(
                    "absolute overflow-hidden rounded-brand bg-[#0E1B14] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    isActive ? "cursor-default" : "cursor-pointer",
                  )}
                  style={{
                    width: cardW,
                    transform: `translateX(${p.x}%) translateZ(${p.z}px) rotateY(${p.ry}deg) scale(${p.s})`,
                    zIndex: isActive ? 10 : 2,
                    opacity: p.o,
                    filter: isActive ? "none" : "brightness(0.65) saturate(0.7)",
                    transformStyle: "preserve-3d",
                    boxShadow: isActive
                      ? "0 35px 90px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08), 0 0 60px -10px rgba(201,169,97,0.18)"
                      : "0 20px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                  }}
                >
                  {/* Plain <img>: small assets, sits inside a 3D-transformed parent */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image.src}
                    alt={s.image.alt}
                    draggable={false}
                    className="block h-auto w-full select-none"
                  />
                  {isActive ? (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.10)_0%,transparent_45%)]"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-8 flex items-center justify-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active || undefined}
              className={cn(
                "h-2 rounded-full transition-all duration-300 ease-brand",
                i === active
                  ? "w-8 bg-brand-gold"
                  : "w-2 bg-brand-cream/20 hover:bg-brand-cream/40",
              )}
            />
          ))}
        </div>

        <p className="mt-7 text-center text-eyebrow uppercase tracking-[0.15em] text-brand-cream/45">
          Vinyasa Yoga Ashram · Rishikesh
        </p>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => go(active - 1)}
        aria-label="Previous slide"
        className="group absolute left-3 top-1/2 z-20 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-brand-cream/15 bg-brand-cream/[0.05] text-brand-cream backdrop-blur transition-colors hover:border-brand-cream/30 hover:bg-brand-cream/10 md:left-6"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(active + 1)}
        aria-label="Next slide"
        className="group absolute right-3 top-1/2 z-20 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-brand-cream/15 bg-brand-cream/[0.05] text-brand-cream backdrop-blur transition-colors hover:border-brand-cream/30 hover:bg-brand-cream/10 md:right-6"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </section>
  );
}
