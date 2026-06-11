"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/Badge";
import { BreathRings } from "@/components/art/YogaFigures";
import { images } from "@/content/images";
import { siteConfig } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Deterministic gold dust (no Math.random — SSR-safe). */
const dust = [
  { left: "8%", bottom: "5%", size: 3, delay: "0s", opacity: 0.45 },
  { left: "22%", bottom: "12%", size: 2, delay: "1.6s", opacity: 0.3 },
  { left: "35%", bottom: "2%", size: 4, delay: "3.4s", opacity: 0.5 },
  { left: "52%", bottom: "9%", size: 2, delay: "0.8s", opacity: 0.35 },
  { left: "64%", bottom: "4%", size: 3, delay: "4.6s", opacity: 0.45 },
  { left: "76%", bottom: "14%", size: 2, delay: "2.2s", opacity: 0.3 },
  { left: "88%", bottom: "6%", size: 3, delay: "5.8s", opacity: 0.4 },
  { left: "44%", bottom: "16%", size: 2, delay: "7s", opacity: 0.3 },
];

export function AboutHero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Camera pull as the hero scrolls away: text exits faster than the portrait.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const entrance = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-brand-green text-brand-cream on-dark"
    >
      {/* Ambient studio light + rising gold dust */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-glow-drift absolute -left-28 top-16 h-[24rem] w-[24rem] rounded-full bg-brand-gold/[0.09] blur-3xl" />
        <div className="animate-glow-drift absolute -bottom-24 right-0 h-[28rem] w-[28rem] rounded-full bg-brand-cream/[0.06] blur-3xl [animation-delay:6s]" />
        {!reduce &&
          dust.map((d, i) => (
            <span
              key={i}
              className="animate-dust-float absolute rounded-full bg-brand-gold"
              style={{
                left: d.left,
                bottom: d.bottom,
                width: d.size,
                height: d.size,
                animationDelay: d.delay,
                ["--dust-opacity" as string]: String(d.opacity),
                opacity: 0,
              }}
            />
          ))}
      </div>

      <div className="container-content grid flex-1 items-center gap-10 pb-24 pt-28 md:pb-28 md:pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <motion.div
          style={reduce ? undefined : { y: textY, opacity: textOpacity }}
          className="flex flex-col gap-6"
        >
          <motion.p className="eyebrow" {...entrance(0)}>
            About · The teacher behind the practice
          </motion.p>
          <h1 className="text-display font-bold lowercase leading-[0.95]">
            <motion.span className="block" {...entrance(0.08)}>
              hi, I&apos;m
            </motion.span>
            <motion.span className="block text-brand-gold" {...entrance(0.18)}>
              shilpa
            </motion.span>
          </h1>
          <motion.p
            className="max-w-xl text-h4 font-normal text-brand-cream/85"
            {...entrance(0.3)}
          >
            A Registered Yoga Teacher who came to this work through the body,
            its limits, its patterns, and how precisely it responds when you
            finally listen.
          </motion.p>
          <motion.div className="mt-2 flex flex-wrap gap-3" {...entrance(0.42)}>
            <Badge tone="dark">{siteConfig.teacher.credential}</Badge>
            <Badge tone="dark">{siteConfig.teacher.location}</Badge>
            <Badge tone="dark">Online & in person</Badge>
          </motion.div>
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: imageY, scale: imageScale }}
          className="relative mx-auto w-full max-w-xs sm:max-w-sm"
        >
          {/* Breathing aura behind the portrait */}
          <div
            aria-hidden
            className="absolute -inset-10 -z-10 text-brand-gold/50 sm:-inset-14"
          >
            <BreathRings className="h-full w-full" />
          </div>
          <div
            aria-hidden
            className="animate-breathe absolute -inset-3 -z-10 rounded-full bg-brand-gold/15 blur-2xl"
          />
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.94 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 1, ease: EASE, delay: 0.2 },
                })}
          >
            {/* Gold offset frame */}
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-brand border border-brand-gold/60" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-brand">
              <SmartImage
                image={images.aboutPortrait}
                fill
                priority
                sizes="(min-width: 1024px) 38vw, 90vw"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-brand-green/30 to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={reduce ? undefined : { opacity: cueOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1.5 text-brand-cream/60"
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 1.1, duration: 0.8 },
            })}
      >
        <span className="text-eyebrow uppercase tracking-[0.18em]">
          The journey begins
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden />
      </motion.div>
    </section>
  );
}
