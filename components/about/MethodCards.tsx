"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChapterHeading } from "@/components/about/ChapterHeading";
import {
  DownDogAnatomyFigure,
  MeditatingFigure,
  AdjustDuoFigure,
  BreathRings,
} from "@/components/art/YogaFigures";

const EASE = [0.22, 1, 0.36, 1] as const;

const principles = [
  {
    title: "The body leads",
    body: "I sequence around how joints, fascia and breath actually behave, so each class meets your body rather than forcing it into a shape.",
    art: "anatomy" as const,
    poseLabel: "Downward dog, joint chain highlighted",
  },
  {
    title: "Breath before depth",
    body: "Steady breath is the measure of a posture, not how far you fold. Depth arrives on its own once the breath stays even.",
    art: "breath" as const,
    poseLabel: "Seated meditation inside breath rings",
  },
  {
    title: "You, specifically",
    body: "Whether in a small group or one-to-one, I teach the person in front of me, your history, your goals, the days you feel strong and the days you don't.",
    art: "adjust" as const,
    poseLabel: "A teacher adjusting a student's warrior pose",
  },
];

function PrincipleArt({ art }: { art: (typeof principles)[number]["art"] }) {
  if (art === "anatomy") {
    return (
      <div className="h-24 w-36 text-brand-gold sm:h-28 sm:w-44">
        <DownDogAnatomyFigure />
      </div>
    );
  }
  if (art === "breath") {
    return (
      <div className="relative h-24 w-24 sm:h-28 sm:w-28">
        <BreathRings className="absolute -inset-4 text-brand-gold/60" />
        <div className="h-full w-full text-brand-gold">
          <MeditatingFigure />
        </div>
      </div>
    );
  }
  return (
    <div className="h-24 w-40 text-brand-gold sm:h-28 sm:w-48">
      <AdjustDuoFigure />
    </div>
  );
}

export function MethodCards() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-brand-green text-brand-cream on-dark">
      <div
        aria-hidden
        className="animate-glow-drift pointer-events-none absolute -right-32 top-1/4 h-[26rem] w-[26rem] rounded-full bg-brand-gold/[0.07] blur-3xl"
      />
      <div className="container-content py-12 md:py-16">
        <ChapterHeading
          number="02"
          eyebrow="How I teach"
          takeaway={
            <>
              Three promises,{" "}
              <span className="text-brand-gold">every single class.</span>
            </>
          }
          tone="dark"
        />

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
          {principles.map((p, i) => (
            <motion.article
              key={p.title}
              className="group flex flex-col gap-5 rounded-brand border border-brand-cream/10 bg-brand-cream/[0.04] p-6 transition-colors duration-500 hover:border-brand-gold/40 sm:p-8"
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, y: 48 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: "-60px" },
                    transition: { duration: 0.7, ease: EASE, delay: i * 0.12 },
                  })}
            >
              <div
                className="flex h-32 items-center justify-center sm:h-36"
                role="img"
                aria-label={p.poseLabel}
              >
                <PrincipleArt art={p.art} />
              </div>
              <span className="text-eyebrow font-medium text-brand-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="-mt-2 text-h3 text-brand-gold">{p.title}</h3>
              <p className="text-body text-brand-cream/80">{p.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
