"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

const QUOTE =
  "I want you to leave a class understanding your own body a little better than when you arrived. That understanding is the practice.";

const words = QUOTE.split(" ");

function Word({
  word,
  index,
  progress,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
}) {
  // Each word brightens across its own slice of the pinned scroll.
  const start = index / words.length;
  const end = start + 1 / words.length;
  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{" "}
    </motion.span>
  );
}

/**
 * Pinned statement: the section holds the viewport while the quote illuminates
 * word by word. On desktop the height is just over one viewport — enough for
 * the reveal to read as deliberate, without making a single sentence cost the
 * reader two full screens of scrolling. Phones get more runway: 20% of a short
 * viewport is a single flick, which skipped the reveal entirely.
 * `svh` rather than `vh`, so the pinned quote isn't hidden under the iOS
 * toolbar, and rather than `dvh`, so the scroll length can't change mid-scroll.
 */
export function QuoteReveal() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const quoteProgress = useTransform(scrollYProgress, [0.05, 0.7], [0, 1]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const nameOpacity = useTransform(scrollYProgress, [0.74, 0.88], [0, 1]);
  const nameY = useTransform(scrollYProgress, [0.74, 0.88], [16, 0]);

  if (reduce) {
    return (
      <section className="bg-brand-green text-brand-cream on-dark">
        <div className="container-content section-y mx-auto max-w-4xl text-center">
          <span aria-hidden className="text-6xl leading-none text-brand-gold">
            &ldquo;
          </span>
          <p className="-mt-6 text-h2 font-normal leading-tight">{QUOTE}</p>
          <p className="mt-8 text-eyebrow uppercase tracking-[0.1em] text-brand-gold">
            Shilpa
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative h-[160svh] bg-[linear-gradient(170deg,#1F3D2E_0%,#142A1F_100%)] text-brand-cream on-dark md:h-[120vh]"
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        {/* The wrapper owns the centring translate; the drift keyframes
            overwrite `transform` on whatever they animate. A radial gradient
            stands in for blur-3xl, which is costly to animate on phones. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-full w-full animate-glow-drift rounded-full bg-[radial-gradient(closest-side,rgba(201,169,97,0.09),transparent)]" />
        </div>
        <div className="container-content mx-auto max-w-4xl text-center">
          <motion.span
            aria-hidden
            style={{ opacity: markOpacity }}
            className="block text-6xl leading-none text-brand-gold"
          >
            &ldquo;
          </motion.span>
          <p className="text-h2 font-normal leading-tight">
            <span className="sr-only">{QUOTE}</span>
            <span aria-hidden>
              {words.map((w, i) => (
                <Word key={i} word={w} index={i} progress={quoteProgress} />
              ))}
            </span>
          </p>
          <motion.p
            style={{ opacity: nameOpacity, y: nameY }}
            className="mt-8 text-eyebrow uppercase tracking-[0.1em] text-brand-gold"
          >
            Shilpa
          </motion.p>
        </div>
      </div>
    </section>
  );
}
