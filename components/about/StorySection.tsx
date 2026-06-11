"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { SmartImage } from "@/components/ui/SmartImage";
import { ChapterHeading } from "@/components/about/ChapterHeading";
import { images } from "@/content/images";
import { siteConfig } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function StorySection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // The two photos drift apart slightly as you pass through — depth.
  const mainY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const insetY = useTransform(scrollYProgress, [0, 1], [-24, 36]);

  return (
    <section ref={ref} className="overflow-hidden bg-brand-cream text-brand-ink">
      <div className="container-content section-y">
        <ChapterHeading
          number="01"
          eyebrow="The teacher"
          takeaway={
            <>
              Injuries brought me to yoga.{" "}
              <span className="text-brand-gold">Curiosity kept me here.</span>
            </>
          }
        />

        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <motion.div
              style={reduce ? undefined : { y: mainY }}
              className="relative aspect-[4/5] overflow-hidden rounded-brand"
            >
              <SmartImage
                image={images.aboutStudio}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </motion.div>
            <motion.div
              style={reduce ? undefined : { y: insetY }}
              className="absolute -bottom-8 -right-2 w-2/5 overflow-hidden rounded-brand border-4 border-brand-cream shadow-xl sm:-right-4"
            >
              <div className="relative aspect-square">
                <SmartImage image={images.aboutSeated} fill sizes="200px" />
              </div>
            </motion.div>
          </div>

          <motion.div
            className="flex flex-col gap-6"
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 32 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-80px" },
                  transition: { duration: 0.8, ease: EASE, delay: 0.1 },
                })}
          >
            <p className="text-body text-brand-stone">
              I didn&apos;t arrive at yoga looking for a workout. I arrived with
              injuries, questions, and a stubborn need to understand why one
              movement healed and another hurt. Anatomy books sat next to my
              mat for years.
            </p>
            <blockquote className="border-l-2 border-brand-gold pl-5 text-h4 font-normal text-brand-ink">
              Flexibility was never the goal. A body that moves well, for a
              long time, that&apos;s the goal.
            </blockquote>
            <p className="text-body text-brand-stone">
              That curiosity became a way of teaching. I trained intensively,
              earning an advanced 500-hour certification at Vinyasa Yoga Ashram
              and registering with Yoga Alliance USA, and built a practice
              rooted in understanding rather than performance, first for
              myself, then for the students who kept asking for the{" "}
              <em>why</em> behind each pose.
            </p>
            <p className="text-body text-brand-stone">
              Today I teach from {siteConfig.teacher.location}, online to
              students around the world, and one-to-one across Delhi NCR. Same
              intention every time: move with understanding, and the body
              follows.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
