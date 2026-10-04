"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useMediaQuery";
import { Coffee, Leaf, Sparkles, Wind } from "lucide-react";
import { BreathRings, MeditatingFigure } from "@/components/art/YogaFigures";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Cycled under the headline, one every couple of seconds. */
const OUTCOMES = ["calmer mind", "stronger back", "steadier breath", "happier you"];

/** Little stickers that bob around the meditating figure on larger screens. */
const STICKERS = [
  { label: "Breathe easy", Icon: Wind, className: "left-0 top-6", delay: 0 },
  { label: "5-min reads", Icon: Coffee, className: "-right-2 top-1/3", delay: 0.6 },
  { label: "Feel-good tips", Icon: Leaf, className: "bottom-10 left-4", delay: 1.2 },
];

/** Gold motes drifting upward; positions are fixed so SSR and client agree. */
const MOTES = [
  { left: "8%", size: 4, delay: "0s", duration: "11s" },
  { left: "22%", size: 3, delay: "3s", duration: "9s" },
  { left: "41%", size: 5, delay: "1.5s", duration: "13s" },
  { left: "58%", size: 3, delay: "5s", duration: "10s" },
  { left: "73%", size: 4, delay: "2.2s", duration: "12s" },
  { left: "90%", size: 3, delay: "6s", duration: "9.5s" },
];

export function BlogHero({
  postCount,
  children,
}: {
  postCount: number;
  /** The search box, rendered under the intro copy. */
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % OUTCOMES.length), 2400);
    return () => clearInterval(id);
  }, [reduce]);

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    <section className="relative isolate overflow-hidden bg-brand-green text-brand-cream on-dark">
      {/* Ambient glow and drifting motes — decoration only. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-24 h-80 w-80 md:animate-glow-drift rounded-full bg-brand-gold/15 blur-3xl" />
        <div
          className="absolute -bottom-32 -left-20 h-72 w-72 md:animate-glow-drift rounded-full bg-brand-cream/10 blur-3xl"
          style={{ animationDelay: "-8s" }}
        />
        {MOTES.map((m) => (
          <span
            key={m.left}
            className="absolute bottom-0 animate-dust-float rounded-full bg-brand-gold"
            style={
              {
                left: m.left,
                width: m.size,
                height: m.size,
                animationDelay: m.delay,
                animationDuration: m.duration,
                "--dust-opacity": 0.55,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="container-content grid items-center gap-10 pb-12 pt-28 md:pb-16 md:pt-32 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <motion.p className="eyebrow inline-flex items-center gap-2" {...rise(0)}>
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            The Journal · fresh from the mat
          </motion.p>

          <motion.h1 className="mt-4 text-h1" {...rise(0.08)}>
            <span className="block">Little reads for a</span>
            {/* Fixed-height line so swapping words never nudges the layout. */}
            <span className="relative block h-[1.1em] overflow-hidden text-brand-gold">
              <span className="sr-only">{OUTCOMES.join(", ")}</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={OUTCOMES[index]}
                  aria-hidden
                  className="absolute left-0 top-0 whitespace-nowrap"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  {OUTCOMES[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p className="mt-5 max-w-xl text-body text-brand-cream/80" {...rise(0.16)}>
            Friendly, bite-sized notes on yoga, breath, fitness and feeling good,
            written between classes. Grab a chai and dive in.
          </motion.p>

          <motion.div className="mt-7 max-w-xl" {...rise(0.24)}>
            {children}
          </motion.div>

          <motion.p
            className="mt-4 text-small text-brand-cream/60"
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { duration: 0.6, delay: 0.4 },
                })}
          >
            {postCount} notes so far · new ones every month
          </motion.p>
        </div>

        {/* The art is a bonus on wide screens; phones get straight to reading. */}
        <motion.div
          aria-hidden
          className="relative mx-auto hidden aspect-square w-full max-w-sm lg:block"
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, scale: 0.92 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.9, ease: EASE, delay: 0.2 },
              })}
        >
          <BreathRings className="absolute inset-0 text-brand-gold/50" />
          <div className="absolute inset-[22%] text-brand-cream/90">
            <MeditatingFigure />
          </div>
          {STICKERS.map(({ label, Icon, className, delay }) => (
            <motion.span
              key={label}
              className={`absolute inline-flex items-center gap-1.5 rounded-brand border border-brand-cream/20 bg-brand-green/80 px-3 py-1.5 text-small text-brand-cream shadow-lg backdrop-blur ${className}`}
              {...(reduce
                ? {}
                : {
                    animate: { y: [0, -8, 0] },
                    transition: { duration: 4, ease: "easeInOut", repeat: Infinity, delay },
                  })}
            >
              <Icon className="h-4 w-4 text-brand-gold" strokeWidth={2} />
              {label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
