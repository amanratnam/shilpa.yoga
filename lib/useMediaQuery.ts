"use client";

import { useEffect, useState } from "react";

/**
 * Follows a CSS media query, starting `false` on the server and on the first
 * client render so server HTML and hydration always agree; the real value
 * arrives a moment later.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/**
 * Hydration-safe stand-in for framer-motion's `useReducedMotion`.
 *
 * framer's hook reads the media query during the first client render, so a
 * visitor who prefers reduced motion hydrated a different tree from the one
 * the server sent. React does not patch attributes on a mismatch, which left
 * server-rendered `opacity: 0` reveal styles in place: content stayed
 * invisible. CSS already stills animations for these visitors
 * (`globals.css`), so the brief first render with motion on is harmless.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
