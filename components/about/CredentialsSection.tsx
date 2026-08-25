"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SmartImage } from "@/components/ui/SmartImage";
import { ChapterHeading } from "@/components/about/ChapterHeading";
import { TreePoseFigure } from "@/components/art/YogaFigures";
import { images } from "@/content/images";

const EASE = [0.22, 1, 0.36, 1] as const;

const credentials = [
  "Advanced 500-Hour Yoga TTC, Vinyasa Yoga Ashram",
  "RYT 500, registered with Yoga Alliance USA",
  "Pre- and post-natal yoga trained",
  "Anatomy-led, injury-aware sequencing",
  "Teaching across studios, homes and online",
];

export function CredentialsSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-brand-cream text-brand-ink">
      {/* A quiet tree pose holding the corner of the section */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-8 right-2 w-40 text-brand-green/[0.07] sm:w-56"
      >
        <TreePoseFigure />
      </div>

      <div className="container-content py-12 md:py-16">
        <ChapterHeading
          number="05"
          eyebrow="Training & lineage"
          takeaway={
            <>
              Certified, registered,{" "}
              <span className="text-brand-gold">and still a student.</span>
            </>
          }
        />

        <div className="mt-12 grid items-center gap-12 md:mt-16 lg:grid-cols-2 lg:gap-16">
          <div className="lg:order-2">
            <ul className="flex flex-col">
              {credentials.map((c, i) => (
                <motion.li
                  key={c}
                  className="flex items-center gap-4 border-b border-brand-ink/10 py-4 text-body text-brand-stone last:border-0"
                  {...(reduce
                    ? {}
                    : {
                        initial: { opacity: 0, x: 32 },
                        whileInView: { opacity: 1, x: 0 },
                        viewport: { once: true, margin: "-40px" },
                        transition: { duration: 0.55, ease: EASE, delay: i * 0.09 },
                      })}
                >
                  {/* Gold seal */}
                  <span
                    aria-hidden
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-brand-gold/50 text-brand-gold"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                  </span>
                  {c}
                </motion.li>
              ))}
            </ul>
          </div>
          <motion.div
            className="lg:order-1"
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 36 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-80px" },
                  transition: { duration: 0.8, ease: EASE },
                })}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-brand">
              <SmartImage
                image={images.aboutCertified}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
