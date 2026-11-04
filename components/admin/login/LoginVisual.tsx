"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { YogaScene } from "@/components/admin/login/YogaScene";
import { POSES } from "@/components/admin/login/poses";

/** The sign-in page's living half: the flowing figure and its captions. */
export function LoginVisual() {
  const [pose, setPose] = useState(0);
  const current = POSES[pose];

  return (
    <section className="relative isolate h-[42svh] min-h-[19rem] overflow-hidden bg-[radial-gradient(120%_90%_at_50%_45%,#2B5340_0%,#1F3D2E_45%,#122219_100%)] text-brand-cream lg:sticky lg:top-0 lg:h-dvh">
      <YogaScene onPose={setPose} className="absolute inset-0 -z-10" />

      <div className="flex h-full flex-col justify-between p-5 sm:p-8 lg:p-12">
        <div className="flex items-center justify-between gap-4">
          <Logo tone="dark" className="[&_img]:h-9 lg:[&_img]:h-11" />
          <span className="rounded-full border border-brand-cream/20 px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-brand-cream/70">
            Studio admin
          </span>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="max-w-md">
            <p className="hidden text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-brand-gold sm:block">
              Behind every class
            </p>
            <p className="mt-2 text-[1.6rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.25rem] lg:text-[2.75rem]">
              The practice
              <span className="font-extralight text-brand-gold"> behind the practice.</span>
            </p>
            <p className="mt-3 hidden max-w-sm text-small text-brand-cream/70 sm:block">
              Shilpa holds the room. This is where the rest of it lives: every
              client, every package and every price that keeps her teaching.
            </p>
          </div>

          {/* What the figure is doing right now */}
          <div className="hidden shrink-0 text-right sm:block" aria-live="off">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.sanskrit}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-small font-medium text-brand-cream">{current.sanskrit}</p>
                <p className="text-[0.75rem] text-brand-cream/55">{current.name}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
