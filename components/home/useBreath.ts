"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, useMotionValue, type MotionValue } from "framer-motion";
import { chime, primeAudio, tap } from "@/components/home/chime";

/** A calm resting rhythm: a slightly longer exhale settles the nervous system. */
export const INHALE_S = 4;
export const EXHALE_S = 6;
export const ROUNDS = 3;

/** How far the portal shrinks at the bottom of a breath. */
const AMBIENT_DEPTH = 0.06;
const GUIDED_DEPTH = 0.13;

const EASE_BREATH = [0.45, 0, 0.55, 1] as const;

export type Guided =
  | { status: "idle" }
  | { status: "settling" }
  | { status: "breathing"; round: number; phase: "in" | "out" }
  | { status: "done" }
  | { status: "complete" };

/** Resolves when the tween ends — or immediately if the session is aborted. */
function tween(
  value: MotionValue<number>,
  to: number,
  duration: number,
  signal: AbortSignal,
  ease: readonly number[] = EASE_BREATH,
): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve();
    const controls = animate(value, to, {
      duration,
      ease: ease as [number, number, number, number],
      onComplete: () => resolve(),
    });
    signal.addEventListener(
      "abort",
      () => {
        controls.stop();
        resolve();
      },
      { once: true },
    );
  });
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve();
    const id = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        resolve();
      },
      { once: true },
    );
  });
}

/**
 * The hero's pulse. `breath` runs 0 (empty) → 1 (full) and back, forever, at
 * a resting rhythm; `start()` swaps that for a guided session of `ROUNDS`
 * breaths with cues, chimes and haptics, then hands back to the ambient loop.
 * Every visual in the hero reads from these two motion values, so nothing
 * re-renders per frame.
 */
export function useBreath({ paused, still }: { paused: boolean; still: boolean }) {
  const breath = useMotionValue(0.5);
  const depth = useMotionValue(AMBIENT_DEPTH);
  const [guided, setGuided] = useState<Guided>({ status: "idle" });
  /** Increments on every exhale, so each one can release its own ripple. */
  const [exhales, setExhales] = useState(0);
  const [sound, setSound] = useState(true);
  const soundRef = useRef(sound);
  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  const session = useRef<AbortController | null>(null);

  // Reduced motion: the portal holds still at rest.
  useEffect(() => {
    if (still) depth.set(0);
  }, [still, depth]);

  // Ambient loop: runs whenever no guided session owns the breath. Reduced
  // motion keeps the hero still; the guided session still runs its timing.
  const guidedActive =
    guided.status === "settling" || guided.status === "breathing" || guided.status === "done";
  useEffect(() => {
    if (paused || still || guidedActive) return;
    const ctrl = new AbortController();
    const { signal } = ctrl;
    (async () => {
      while (!signal.aborted) {
        await tween(breath, 1, INHALE_S, signal);
        if (signal.aborted) break;
        setExhales((n) => n + 1);
        await tween(breath, 0, EXHALE_S, signal);
      }
    })();
    return () => ctrl.abort();
  }, [paused, still, guidedActive, breath]);

  const stop = useCallback(() => {
    session.current?.abort();
    session.current = null;
    setGuided({ status: "idle" });
    animate(depth, still ? 0 : AMBIENT_DEPTH, { duration: 1.2 });
  }, [depth, still]);

  const start = useCallback(() => {
    session.current?.abort();
    const ctrl = new AbortController();
    session.current = ctrl;
    const { signal } = ctrl;
    primeAudio();

    const ring = (pitch: number, volume?: number) => {
      if (soundRef.current) chime({ pitch, volume });
    };

    (async () => {
      setGuided({ status: "settling" });
      animate(depth, still ? 0 : GUIDED_DEPTH, { duration: 1.6 });
      // Empty out first, so the first cue is a full, honest inhale.
      await tween(breath, 0, 2.2, signal);
      for (let round = 1; round <= ROUNDS && !signal.aborted; round++) {
        setGuided({ status: "breathing", round, phase: "in" });
        ring(round === 1 ? 196 : 220);
        tap();
        await tween(breath, 1, INHALE_S, signal);
        if (signal.aborted) return;
        setGuided({ status: "breathing", round, phase: "out" });
        setExhales((n) => n + 1);
        tap();
        await tween(breath, 0, EXHALE_S, signal);
      }
      if (signal.aborted) return;
      setGuided({ status: "done" });
      ring(262, 0.06);
      tap(18);
      await wait(1800, signal);
      if (signal.aborted) return;
      setGuided({ status: "complete" });
      animate(depth, still ? 0 : AMBIENT_DEPTH, { duration: 1.6 });
      // Leave the closing message up long enough to act on, then let go.
      await wait(9000, signal);
      if (signal.aborted) return;
      session.current = null;
      setGuided({ status: "idle" });
    })();
  }, [breath, depth, still]);

  // A session never outlives the hero.
  useEffect(() => () => session.current?.abort(), []);

  return { breath, depth, guided, exhales, start, stop, sound, setSound };
}
