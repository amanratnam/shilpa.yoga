"use client";

import { useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import {
  MountainFigure,
  ForwardFoldFigure,
  DownDogFigure,
  WarriorTwoFigure,
  TreePoseFigure,
  MeditatingFigure,
} from "@/components/art/YogaFigures";
import { cn } from "@/lib/utils";

const poses = [
  { Figure: MountainFigure, label: "Mountain pose" },
  { Figure: ForwardFoldFigure, label: "Forward fold" },
  { Figure: DownDogFigure, label: "Downward dog" },
  { Figure: WarriorTwoFigure, label: "Warrior two" },
  { Figure: TreePoseFigure, label: "Tree pose" },
  { Figure: MeditatingFigure, label: "Seated meditation" },
];

const RING = 2 * Math.PI * 26;

/**
 * A small fixed "practice companion": a gold progress ring with a yoga figure
 * inside that moves through a sun-salutation-like sequence as you scroll the
 * page — mountain at the top, seated meditation by the end.
 */
export function ScrollCompanion() {
  const reduce = useReducedMotion();
  const [pose, setPose] = useState(0);
  const [visible, setVisible] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const dashOffset = useTransform(progress, [0, 1], [RING, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setVisible(v > 0.02 && v < 0.985);
    setPose(Math.min(poses.length - 1, Math.floor(v * poses.length)));
  });

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed bottom-5 right-5 z-40 h-14 w-14 transition-opacity duration-500 sm:bottom-8 sm:right-8 sm:h-[4.5rem] sm:w-[4.5rem]",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Progress ring */}
      <svg viewBox="0 0 60 60" className="absolute inset-0 h-full w-full -rotate-90">
        <circle
          cx="30"
          cy="30"
          r="26"
          fill="rgba(31,61,46,0.55)"
          stroke="rgba(247,244,237,0.18)"
          strokeWidth="2"
        />
        <motion.circle
          cx="30"
          cy="30"
          r="26"
          fill="none"
          stroke="#C9A961"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={RING}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>

      {/* Pose figures crossfading by scroll depth */}
      {poses.map(({ Figure, label }, i) => (
        <div
          key={label}
          className={cn(
            "absolute inset-0 grid place-items-center p-3.5 text-brand-gold transition-opacity duration-500",
            i === pose ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="h-full w-full">
            <Figure />
          </div>
        </div>
      ))}
    </div>
  );
}
