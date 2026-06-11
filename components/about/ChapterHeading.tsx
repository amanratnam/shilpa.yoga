"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Chapter marker for the about-page narrative: a giant ghost number drifting
 * on parallax behind an eyebrow + a single bold "takeaway" line. The takeaway
 * is the one sentence a skimmer should catch per section.
 */
export function ChapterHeading({
  number,
  eyebrow,
  takeaway,
  intro,
  tone = "light",
  align = "left",
  className,
}: {
  number: string;
  eyebrow: string;
  takeaway: React.ReactNode;
  intro?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const ghostY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative",
        align === "center" && "flex flex-col items-center text-center",
        className,
      )}
    >
      {/* Ghost chapter number, drifting slower than the page */}
      <motion.span
        aria-hidden
        style={reduce ? undefined : { y: ghostY }}
        className={cn(
          "pointer-events-none absolute -top-16 select-none text-[7rem] font-bold leading-none tracking-tighter sm:-top-24 sm:text-[11rem] md:text-[13rem]",
          tone === "dark" ? "text-brand-cream/[0.05]" : "text-brand-green/[0.05]",
          align === "center" ? "left-1/2 -translate-x-1/2" : "-left-3",
        )}
      >
        {number}
      </motion.span>

      <motion.div
        className={cn(
          "relative flex flex-col gap-4",
          align === "center" && "items-center",
        )}
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0, y: 28 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-60px" },
              transition: { duration: 0.7, ease: EASE },
            })}
      >
        <Eyebrow>
          {number} · {eyebrow}
        </Eyebrow>
        <h2 className="max-w-3xl text-h2">{takeaway}</h2>
        {intro ? (
          <p
            className={cn(
              "max-w-2xl text-body opacity-75",
              align === "center" && "mx-auto",
            )}
          >
            {intro}
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}
