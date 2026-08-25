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
import { cn } from "@/lib/utils";

// All four portrait — drift rates and offsets alternate for depth.
const gallery = [
  { image: images.aboutPractice, rate: -36, offset: "mt-0" },
  { image: images.differentiation, rate: 28, offset: "mt-10 sm:mt-16" },
  { image: images.aboutCeremony, rate: -20, offset: "mt-4 sm:mt-6" },
  { image: images.aboutStudio, rate: 36, offset: "mt-12 sm:mt-20" },
];

function GalleryItem({
  image,
  rate,
  offset,
  progress,
}: (typeof gallery)[number] & {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const reduce = useReducedMotion();
  const y = useTransform(progress, [0, 1], [rate, -rate]);
  return (
    <motion.div style={reduce ? undefined : { y }} className={cn(offset)}>
      <div className="group relative aspect-[3/4] overflow-hidden rounded-brand">
        <SmartImage
          image={image}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="transition-transform duration-700 ease-brand group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-brand-green/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>
    </motion.div>
  );
}

export function GalleryParallax() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={ref} className="overflow-hidden bg-brand-cream text-brand-ink">
      <div className="container-content py-12 md:py-16">
        <ChapterHeading
          number="03"
          eyebrow="In practice"
          takeaway={
            <>
              Moments from <span className="text-brand-gold">the mat.</span>
            </>
          }
          intro="From quiet mornings by the river to hands-on work in the studio."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 md:mt-16 lg:grid-cols-4">
          {gallery.map((g) => (
            <GalleryItem key={g.image.src} {...g} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
