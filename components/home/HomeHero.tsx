"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  House,
  MonitorPlay,
  Volume2,
  VolumeX,
  Wind,
  X,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { heroVideo } from "@/content/images";
import { siteConfig } from "@/lib/site";
import { formatMoney, type Currency, type Money } from "@/lib/pricing/config";
import { ROUNDS, useBreath, type Guided } from "@/components/home/useBreath";
import { useMediaQuery, useReducedMotion } from "@/lib/useMediaQuery";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
/** Linear map of `v` from [a, b] onto [from, to], clamped. */
const mapRange = (v: number, a: number, b: number, from: number, to: number) =>
  from + (to - from) * clamp01((v - a) / (b - a));

/** Server renders "Namaste"; the visitor's own clock takes over on mount. */
function greetingFor(hour: number) {
  if (hour >= 4 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Can't sleep?";
}

const PATHS = [
  {
    href: "/classes/online-vinyasa",
    title: "Online classes",
    body: "Live, small groups. Join from anywhere.",
    Icon: MonitorPlay,
  },
  {
    href: "/classes/personal-gurgaon",
    title: "Personal sessions",
    body: "One-to-one at your home in Gurgaon.",
    Icon: House,
  },
];

/** The footage's own shape (1280×720). */
const VIDEO_ASPECT = 16 / 9;
/** Slight overscan, so one clip's thin letterbox bars never peek in. */
const OVERSCAN = 1.06;

/** Landscape phones: too short to pin, so the hero sits still like a page. */
const SHORT_SCREEN = "(max-height: 499px)";

type Geometry = {
  /** Portal diameter. */
  d: number;
  /** Diameter of the circle that covers the whole hero from the portal. */
  c: number;
  /** Portal centre, in hero coordinates. */
  cx: number;
  cy: number;
  /** The area the open portal must fill (hero plus mobile toolbar strip). */
  w: number;
  h: number;
  /** Rendered height of the footage box — its size when fully open. */
  vh: number;
};

/**
 * The homepage hero: a breathing portal.
 *
 * Shilpa's class footage sits inside a circle that breathes at a resting
 * rhythm (4s in, 6s out), releasing a ripple on every exhale, while "quiet
 * mind" in the headline expands and settles with it. "Take a breath with me"
 * turns that into a short guided session. Scrolling steps the visitor into
 * the space: the portal opens until the footage fills the screen.
 *
 * Mechanics: the portal is a circle exactly large enough to cover the hero
 * from its centre, scaled down to portal size at rest and up to 1 when open,
 * with the footage inside re-fitted each frame to the part that's on screen.
 * Everything moves by transform, so the opening never re-lays-out.
 */
export function HomeHero({ trialFrom }: { trialFrom: Money }) {
  const prefersReduced = useReducedMotion();
  const short = useMediaQuery(SHORT_SCREEN);
  /** No pin, no opening, no scroll choreography. */
  const still = prefersReduced || short;
  const stillRef = useRef(still);
  useEffect(() => {
    stillRef.current = still;
  }, [still]);

  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [geo, setGeo] = useState<Geometry | null>(null);
  /** Same as `geo`, readable from inside per-frame transforms. */
  const geoRef = useRef<Geometry | null>(null);
  const [inView, setInView] = useState(true);
  const [greeting, setGreeting] = useState("Namaste");
  const [currency, setCurrency] = useState<Currency>("INR");

  const { breath, depth, guided, exhales, start, stop, sound, setSound } = useBreath({
    paused: !inView,
    still: prefersReduced,
  });
  const guidedOn = guided.status !== "idle" && guided.status !== "complete";

  // ---- Geometry ------------------------------------------------------------

  const restScale = useMotionValue(0.3);
  const open = useMotionValue(0);

  const measure = useCallback(() => {
    const frame = frameRef.current;
    const slot = slotRef.current;
    if (!frame || !slot) return;
    const f = frame.getBoundingClientRect();
    const s = slot.getBoundingClientRect();
    const cx = s.left + s.width / 2 - f.left;
    const cy = s.top + s.height / 2 - f.top;
    // Cover the frame, plus the strip a collapsing mobile toolbar uncovers.
    // Measured from where the frame pins (below the navbar), not where it is
    // now, so a resize while scrolled past the hero can't inflate it.
    const pinnedTop = parseFloat(getComputedStyle(frame).top) || 0;
    const h = Math.max(f.height, window.innerHeight - pinnedTop) + 32;
    const w = f.width;
    const r = Math.max(
      Math.hypot(cx, cy),
      Math.hypot(w - cx, cy),
      Math.hypot(cx, h - cy),
      Math.hypot(w - cx, h - cy),
    );
    // A little extra so sub-pixel rounding and late layout shifts never leave
    // a sliver of corner uncovered.
    const c = Math.ceil(r * 2 + 48);
    const d = s.width;
    const vh = Math.max(h, w / VIDEO_ASPECT) * OVERSCAN;
    const next = { c, d, cx, cy, w, h, vh };
    geoRef.current = next;
    restScale.set(d / c);
    setGeo((prev) =>
      prev &&
      Math.abs(prev.c - c) < 2 &&
      Math.abs(prev.d - d) < 1 &&
      Math.abs(prev.cx - cx) < 1 &&
      Math.abs(prev.cy - cy) < 1
        ? prev
        : next,
    );
  }, [restScale]);

  useEffect(() => {
    measure();
    // The portal's position depends on the copy beside or above it, which
    // reflows when web fonts arrive — so watch that column too.
    const ro = new ResizeObserver(measure);
    if (frameRef.current) ro.observe(frameRef.current);
    if (slotRef.current) ro.observe(slotRef.current);
    if (copyRef.current) ro.observe(copyRef.current);
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // The portal opens once we know how big it is.
  const opened = geo !== null;
  useEffect(() => {
    if (!opened) return;
    if (stillRef.current) {
      open.set(1);
      return;
    }
    const controls = animate(open, 1, { duration: 1.8, ease: EASE, delay: 0.15 });
    return () => controls.stop();
  }, [opened, open]);

  // ---- Personal touches ----------------------------------------------------

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- client-only facts */
    setGreeting(greetingFor(new Date().getHours()));
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    // Visitors outside India see the dollar price they'd actually pay.
    if (tz && !/^Asia\/(Kolkata|Calcutta)$/.test(tz)) setCurrency("USD");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Pause the footage and the breathing loop once the hero is off screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // The footage mounts only once the portal is measured and is started from
  // here (no `autoPlay`), so reduced-motion visitors never see it move.
  // `muted` is set as a property too: React doesn't reliably reflect the
  // attribute, and browsers only autoplay muted video.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    // Reduced motion: the poster frame, held still.
    if (inView && !prefersReduced) void v.play().catch(() => {});
    else v.pause();
  }, [inView, opened, prefersReduced]);

  // ---- Scroll: stepping into the space ------------------------------------

  const { scrollYProgress: p } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const expand = useTransform(p, (v) =>
    stillRef.current ? 0 : easeInOutCubic(clamp01((v - 0.06) / 0.64)),
  );
  // Function transforms on purpose: framer hands plain range-mapped scroll
  // opacity to the browser's native ScrollTimeline, which mis-measured this
  // pinned section (opacity ran 1 → 0.3 → 0.8 → 1 across the runway).
  const textOpacity = useTransform(p, (v) => mapRange(v, 0, 0.26, 1, 0));
  const textY = useTransform(p, (v) => mapRange(v, 0, 0.3, 0, -70));
  const decorOut = useTransform(p, (v) => mapRange(v, 0, 0.2, 1, 0));
  const barOpacity = useTransform(p, (v) => mapRange(v, 0, 0.14, 1, 0));
  const textPointer = useTransform(p, (v) => (v > 0.2 ? "none" : "auto"));
  const statementOpacity = useTransform(p, (v) => mapRange(v, 0.62, 0.86, 0, 1));
  const statementY = useTransform(p, (v) => mapRange(v, 0.62, 0.92, 40, 0));
  const statementPointer = useTransform(p, (v) => (v > 0.66 ? "auto" : "none"));

  // Which layer is interactive. The hidden one is made inert, so keyboard
  // and screen-reader users never land on buttons they can't see.
  const [stage, setStage] = useState<"intro" | "between" | "inside">("intro");
  useMotionValueEvent(p, "change", (v) => {
    if (stillRef.current) return;
    setStage(v > 0.66 ? "inside" : v > 0.2 ? "between" : "intro");
    // Scrolling away ends a guided session rather than leaving it running.
    if (v > 0.05 && guidedOn) stop();
  });
  useEffect(() => {
    if (!inView && guidedOn) stop();
  }, [inView, guidedOn, stop]);

  // ---- Breath-driven values ------------------------------------------------

  /** 1 at the top of a breath, (1 - depth) at the bottom. */
  const breathScale = useTransform([breath, depth], ([b, d]: number[]) => 1 - d * (1 - b));
  const portalScale = useTransform(
    [breathScale, expand, restScale, open],
    ([bs, e, r, o]: number[]) => {
      const atRest = r * bs;
      return (atRest + (1 - atRest) * e) * (0.35 + 0.65 * o);
    },
  );
  const portalOpacity = useTransform(open, [0, 0.25], [0, 1]);

  /**
   * Fits the footage, every frame, to just the part of the circle that is on
   * screen: a centre crop inside the portal at rest, an exact cover-fit of the
   * hero when open. Fitting the whole cover-sized circle instead blew a 720p
   * clip up three times over and left the open state soft. The box sits
   * inside the scaled circle, so its offsets and scale are divided back out.
   */
  const footageTransform = useTransform(portalScale, (outer) => {
    const g = geoRef.current;
    if (!g || outer <= 0) return "translate(-50%, -50%)";
    const radius = (outer * g.c) / 2;
    const x0 = Math.max(0, g.cx - radius);
    const x1 = Math.min(g.w, g.cx + radius);
    const y0 = Math.max(0, g.cy - radius);
    const y1 = Math.min(g.h, g.cy + radius);
    const visibleW = Math.max(1, x1 - x0);
    const visibleH = Math.max(1, y1 - y0);
    const height = Math.max(visibleH, visibleW / VIDEO_ASPECT) * OVERSCAN;
    const scale = height / (outer * g.vh);
    const tx = ((x0 + x1) / 2 - g.cx) / outer;
    const ty = ((y0 + y1) / 2 - g.cy) / outer;
    return `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(${scale})`;
  });
  const glowOpacity = useTransform([breath, decorOut, open], ([b, out, o]: number[]) =>
    (0.3 + 0.5 * b) * out * o,
  );
  const decorOpacity = useTransform([decorOut, open], ([out, o]: number[]) => out * o);
  const quietSpacing = useTransform(breath, [0, 1], ["-0.01em", "0.06em"]);
  const dotScale = useTransform(breath, [0, 1], [0.55, 1.15]);

  // Darkens the footage under the closing statement and the guided cues.
  const guidedVeil = useMotionValue(0);
  useEffect(() => {
    const target = guided.status === "idle" ? 0 : 0.5;
    const controls = animate(guidedVeil, target, { duration: 0.9 });
    return () => controls.stop();
  }, [guided.status, guidedVeil]);
  const scrollVeil = useTransform(p, (v) =>
    stillRef.current ? 0 : mapRange(v, 0.45, 0.85, 0, 0.55),
  );
  const veil = useTransform([scrollVeil, guidedVeil], ([a, b]: number[]) => Math.max(a, b));

  // ---- Pointer parallax (devices that can hover) ---------------------------

  const mx = useSpring(0, { stiffness: 60, damping: 18 });
  const my = useSpring(0, { stiffness: 60, damping: 18 });
  const parallaxX = useTransform([mx, expand], ([m, e]: number[]) => m * 14 * (1 - e));
  const parallaxY = useTransform([my, expand], ([m, e]: number[]) => m * 14 * (1 - e));
  const canHover = useRef(false);
  useEffect(() => {
    canHover.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);
  const onPointerMove = (e: React.PointerEvent) => {
    if (!canHover.current || still) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  // Esc ends a guided session.
  useEffect(() => {
    if (!guidedOn) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [guidedOn, stop]);

  const trialPrice = formatMoney(trialFrom, currency);

  return (
    <section
      ref={sectionRef}
      aria-label="Welcome"
      className={cn(
        "relative overflow-clip bg-[#12241A] text-brand-cream on-dark",
        // Pinned runway for stepping into the space. Reduced motion and very
        // short screens (landscape phones) get a plain, unpinned hero.
        "h-[calc(170svh-4rem)] md:h-[calc(170svh-5rem)]",
        "motion-reduce:h-auto [@media(max-height:499px)]:h-auto",
      )}
    >
      <div
        ref={frameRef}
        onPointerMove={onPointerMove}
        className={cn(
          "sticky top-16 flex h-[calc(100svh-4rem)] flex-col md:top-20 md:h-[calc(100svh-5rem)]",
          "motion-reduce:relative motion-reduce:top-0 motion-reduce:h-auto motion-reduce:min-h-[calc(100svh-4rem)]",
          "[@media(max-height:499px)]:relative [@media(max-height:499px)]:top-0 [@media(max-height:499px)]:h-auto",
        )}
      >
        <Backdrop />

        <div className="container-content relative flex flex-1 flex-col justify-center gap-9 pb-5 pt-8 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:py-8">
          {/* ---- Copy and calls to action ---- */}
          <motion.div
            style={still ? undefined : { opacity: textOpacity, y: textY, pointerEvents: textPointer }}
            inert={stage !== "intro"}
            className="relative z-10 order-2 lg:order-1"
          >
            <div
              ref={copyRef}
              className={cn(
                "transition-opacity duration-700 ease-brand",
                guidedOn && "opacity-25",
              )}
            >
              <p className="eyebrow flex animate-fade-rise items-center gap-2 whitespace-nowrap [animation-delay:0.05s]">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-brand-gold"
                />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={greeting}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4 }}
                  >
                    {greeting}
                  </motion.span>
                </AnimatePresence>
                <span aria-hidden className="text-brand-cream/30">
                  ·
                </span>
                <span>
                  <span className="hidden min-[400px]:inline">Live </span>yoga with Shilpa
                </span>
              </p>

              <h1 className="mt-4 whitespace-nowrap text-[min(13vw,max(8svh,2.75rem),5.5rem)] leading-[0.92] tracking-[-0.03em] lg:mt-5 lg:text-[clamp(3.5rem,6.3vw,6rem)]">
                <span className="block overflow-hidden pb-[0.06em]">
                  <span className="block animate-line-rise font-black lowercase [animation-delay:0.12s]">
                    strong body,
                  </span>
                </span>
                <span className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    style={{ letterSpacing: quietSpacing }}
                    className="block animate-line-rise font-extralight lowercase text-brand-gold [animation-delay:0.24s]"
                  >
                    quiet mind
                  </motion.span>
                </span>
              </h1>

              <p className="mt-4 max-w-xl animate-fade-rise text-base text-brand-cream/80 [animation-delay:0.38s] lg:mt-6 lg:text-h4 lg:font-normal">
                {/* Phones get the short version so the booking button stays
                    in the first screen. */}
                <span className="lg:hidden">
                  Book a certified yoga teacher, live online or one-to-one at
                  home in Gurgaon.
                </span>
                <span className="hidden lg:inline">
                  Book a certified yoga teacher who builds every class around
                  your body. Join live online from anywhere, or practise
                  one-to-one at home in Gurgaon.
                </span>
              </p>

              <div className="mt-6 flex animate-fade-rise items-center gap-3 [animation-delay:0.48s] lg:mt-8">
                <Link
                  href="/contact"
                  className={cn(
                    "group inline-flex min-h-14 flex-1 items-center justify-between gap-2 whitespace-nowrap rounded-brand bg-brand-gold py-2 pl-4 pr-2 text-small font-medium uppercase tracking-[0.05em] text-brand-ink transition-colors duration-300 ease-brand hover:bg-brand-cream min-[400px]:gap-3 min-[400px]:pl-5 sm:flex-none sm:pl-6",
                    // After a guided breath, the next step glows.
                    guided.status === "complete" && "ring-4 ring-brand-gold/40 ring-offset-2 ring-offset-brand-green",
                  )}
                >
                  <span>
                    Book a trial<span className="hidden min-[400px]:inline"> class</span>
                  </span>
                  <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-brand bg-brand-ink/10 px-2 py-1.5 normal-case tracking-normal min-[400px]:gap-1.5 min-[400px]:px-2.5">
                    from {trialPrice}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-0.5"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </span>
                </Link>
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp me"
                  className="inline-flex min-h-14 min-w-14 shrink-0 items-center justify-center gap-2.5 rounded-brand border border-brand-cream/30 text-small font-medium uppercase tracking-[0.05em] text-brand-cream transition-colors duration-300 ease-brand hover:border-brand-cream hover:bg-brand-cream hover:text-brand-green sm:px-5"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">WhatsApp me</span>
                </a>
              </div>

              <p className="mt-4 animate-fade-rise text-small text-brand-cream/60 [animation-delay:0.58s] lg:mt-5 [@media(max-height:640px)]:hidden">
                Not sure yet?{" "}
                <Link
                  href="/classes"
                  className="inline-flex items-center gap-1 font-medium text-brand-cream underline decoration-brand-gold/60 underline-offset-4 transition-colors hover:text-brand-gold"
                >
                  Explore classes
                </Link>{" "}
                · I reply within a day
              </p>
            </div>
          </motion.div>

          {/* ---- The portal ---- */}
          <div className="order-1 flex justify-center lg:order-2">
            <div
              ref={slotRef}
              className={cn(
                "relative aspect-square",
                // Sized to leave the copy below it room on any phone, and
                // capped so it never dwarfs a large monitor.
                "w-[clamp(8.5rem,calc(100svh-29rem),min(70vw,24rem))]",
                "lg:w-[min(34vw,calc(100svh-16rem),38rem)]",
              )}
            >
              <motion.div
                style={still ? undefined : { x: parallaxX, y: parallaxY }}
                className="absolute inset-0"
              >
                {/* Contour lines radiating from the portal, like a held breath */}
                <motion.div
                  aria-hidden
                  style={{ opacity: decorOpacity, scale: breathScale }}
                  className="pointer-events-none absolute -inset-[95%]"
                >
                  <Contours />
                </motion.div>

                {/* Warm light behind the portal, brightening on each inhale */}
                <motion.div
                  aria-hidden
                  style={{ opacity: glowOpacity }}
                  className="pointer-events-none absolute -inset-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(201,169,97,0.38),rgba(201,169,97,0.08)_55%,transparent)]"
                />

                {/* The footage: a cover-sized circle, scaled to portal size,
                    with the clip fitted to whatever part of it is on screen */}
                {geo ? (
                  <motion.div
                    aria-hidden
                    style={{
                      width: geo.c,
                      height: geo.c,
                      x: "-50%",
                      y: "-50%",
                      scale: portalScale,
                      opacity: portalOpacity,
                    }}
                    className="pointer-events-none absolute left-1/2 top-1/2 z-[1] overflow-hidden isolate rounded-full bg-brand-green will-change-transform"
                  >
                    <motion.video
                      ref={videoRef}
                      style={{
                        width: geo.vh * VIDEO_ASPECT,
                        height: geo.vh,
                        transform: footageTransform,
                      }}
                      className="absolute left-1/2 top-1/2 max-w-none object-cover"
                      muted
                      loop
                      playsInline
                      preload="auto"
                      poster={heroVideo.poster}
                    >
                      <source src={heroVideo.src} type="video/mp4" />
                    </motion.video>
                    <motion.div
                      style={{ opacity: veil }}
                      className="absolute inset-0 bg-[#0B1710]"
                    />
                  </motion.div>
                ) : null}

                {/* Rings: hairline, exhale ripples, guided progress, ring text */}
                <motion.div
                  aria-hidden
                  style={{ opacity: decorOpacity, scale: breathScale }}
                  className="pointer-events-none absolute inset-0 z-[2]"
                >
                  {[exhales - 1, exhales]
                    .filter((n) => n > 0)
                    .map((n) => (
                      <span
                        key={n}
                        className="absolute inset-0 animate-ripple rounded-full border border-brand-gold/70"
                      />
                    ))}
                  <svg viewBox="0 0 100 100" className="absolute -inset-[3%] h-[106%] w-[106%] -rotate-90 overflow-visible">
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="49"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                      className="text-brand-cream/25"
                      initial={{ pathLength: 0 }}
                      animate={opened ? { pathLength: 1 } : undefined}
                      transition={{ duration: 2.2, ease: EASE, delay: 0.3 }}
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="49"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className={cn(
                        "text-brand-gold transition-opacity duration-500",
                        guided.status === "breathing" ? "opacity-100" : "opacity-0",
                      )}
                      style={{ pathLength: breath }}
                    />
                  </svg>
                  {geo ? <RingText size={geo.d} /> : null}
                </motion.div>
              </motion.div>

              {/* Guided cues, over the darkened footage */}
              <GuidedCue guided={guided} />

              {/* Breathe control, straddling the portal's lower edge. Three
                  layers, because each job writes a property another would
                  clobber: centring (transform), the scroll fade (inline
                  opacity) and the entrance keyframes (both — and a filled CSS
                  animation beats inline styles). */}
              <div className="absolute bottom-0 left-1/2 z-[3] -translate-x-1/2 translate-y-1/2">
                <motion.div
                  style={still ? undefined : { opacity: decorOut, pointerEvents: textPointer }}
                  inert={stage !== "intro"}
                >
                  <div className="flex animate-fade-rise items-center gap-2 [animation-delay:0.85s]">
                    {guidedOn ? (
                      <>
                        <button
                          type="button"
                          onClick={stop}
                          className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-brand-cream/25 bg-brand-green/85 px-4 text-small font-medium text-brand-cream shadow-lg backdrop-blur transition-colors hover:border-brand-cream/60"
                        >
                          <X className="h-4 w-4" strokeWidth={2} aria-hidden />
                          End
                        </button>
                        <button
                          type="button"
                          onClick={() => setSound((s) => !s)}
                          aria-pressed={sound}
                          aria-label={sound ? "Mute the chime" : "Play the chime"}
                          className="grid h-11 w-11 place-items-center rounded-full border border-brand-cream/25 bg-brand-green/85 text-brand-cream shadow-lg backdrop-blur transition-colors hover:border-brand-cream/60"
                        >
                          {sound ? (
                            <Volume2 className="h-4 w-4" strokeWidth={2} aria-hidden />
                          ) : (
                            <VolumeX className="h-4 w-4" strokeWidth={2} aria-hidden />
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={start}
                        className="group inline-flex h-11 items-center gap-2.5 whitespace-nowrap rounded-full border border-brand-gold/50 bg-brand-green/85 pl-3.5 pr-4 text-small font-medium text-brand-cream shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur transition-colors hover:border-brand-gold hover:bg-brand-green"
                      >
                        <span aria-hidden className="relative grid h-4 w-4 place-items-center">
                          <motion.span
                            style={{ scale: dotScale }}
                            className="absolute inset-0 rounded-full bg-brand-gold/30"
                          />
                          <Wind className="relative h-3.5 w-3.5 text-brand-gold" strokeWidth={2.25} />
                        </span>
                        {guided.status === "complete" ? "Breathe again" : "Take a breath with me"}
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Two ways in, and a cue to keep going (desktop) ---- */}
        <motion.div
          style={still ? undefined : { opacity: barOpacity, pointerEvents: textPointer }}
          inert={stage !== "intro"}
          className="relative z-10 hidden lg:block"
        >
          <div className="container-content flex animate-fade-rise items-center gap-2 border-t border-brand-cream/10 py-4 [animation-delay:0.75s]">
            {PATHS.map(({ href, title, body, Icon }) => (
              <Link
                key={href}
                href={href}
                className="group -ml-3 flex max-w-sm flex-1 items-center gap-4 rounded-brand px-3 py-2.5 transition-colors hover:bg-brand-cream/[0.06]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-brand border border-brand-cream/15 text-brand-gold transition-colors group-hover:border-brand-gold/60">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-small font-medium text-brand-cream">{title}</span>
                  <span className="truncate text-small text-brand-cream/60">{body}</span>
                </span>
                <ArrowUpRight
                  className="ml-auto h-4 w-4 shrink-0 text-brand-cream/40 transition-all duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-gold"
                  strokeWidth={2}
                  aria-hidden
                />
              </Link>
            ))}
            {still ? null : (
              <div className="ml-auto flex items-center gap-3 text-eyebrow uppercase tracking-[0.14em] text-brand-cream/50">
                Scroll to step inside
                <span aria-hidden className="relative h-10 w-px overflow-hidden bg-brand-cream/15">
                  <span className="absolute inset-0 animate-cue-drop bg-brand-gold" />
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ---- Inside the space: the closing statement over full footage ---- */}
        {still ? null : (
          <motion.div
            style={{ opacity: statementOpacity, pointerEvents: statementPointer }}
            inert={stage !== "inside"}
            className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
          >
            <motion.div style={{ y: statementY }} className="flex max-w-3xl flex-col items-center gap-5">
              <p className="eyebrow">Shilpa Yoga Space</p>
              <h2 className="text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.03em]">
                <span className="font-black lowercase">this is </span>
                <span className="font-extralight lowercase text-brand-gold">your space.</span>
              </h2>
              <p className="max-w-xl text-balance text-body text-brand-cream/85 md:text-h4 md:font-normal">
                Strength, breath and a steadier mind, one unhurried class at a time.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex min-h-14 items-center gap-2 rounded-brand bg-brand-gold px-7 text-small font-medium uppercase tracking-[0.05em] text-brand-ink transition-colors duration-300 ease-brand hover:bg-brand-cream"
                >
                  Book a trial class
                  <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                </Link>
                <Link
                  href="/classes"
                  className="inline-flex min-h-14 items-center rounded-brand border border-brand-cream/40 px-7 text-small font-medium uppercase tracking-[0.05em] text-brand-cream transition-colors duration-300 ease-brand hover:bg-brand-cream hover:text-brand-green"
                >
                  Explore classes
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/** Deep green ground with a lifted centre and fine film grain. */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_24%,#2B5340_0%,#1F3D2E_42%,#12241A_100%)] lg:bg-[radial-gradient(100%_120%_at_74%_44%,#2B5340_0%,#1F3D2E_38%,#12241A_100%)]" />
      <div
        className="absolute inset-0 z-[5] opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

/** Concentric lines spreading out from the portal. */
function Contours() {
  const rings = [21, 25.5, 30.5, 36, 42, 48.5];
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      {rings.map((r, i) => (
        <circle
          key={r}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#F7F4ED"
          strokeOpacity={0.09 - i * 0.012}
          strokeWidth="1"
          strokeDasharray={i % 2 ? "2 6" : undefined}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/** Slowly turning words around the portal. */
function RingText({ size }: { size: number }) {
  const rawId = useId();
  const id = `ring-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const small = size < 300;
  const gap = small ? 15 : 24;
  const font = small ? 8.5 : 11;
  const r = size / 2 + gap;
  const box = Math.ceil(r * 2 + font * 3);
  const c = box / 2;
  const circumference = 2 * Math.PI * r;
  const phrase = "strong body · quiet mind · move with intention · online & in person · ";
  // Roughly how many times the phrase fits; textLength then spaces it exactly.
  const repeats = Math.max(1, Math.round(circumference / (phrase.length * font * 0.86)));

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: box, height: box }}
    >
      <svg
        width={box}
        height={box}
        viewBox={`0 0 ${box} ${box}`}
        className="animate-[spin_120s_linear_infinite] overflow-visible text-brand-gold/75"
      >
        <defs>
          <path
            id={id}
            d={`M ${c} ${c} m -${r} 0 a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 -${r * 2} 0`}
          />
        </defs>
        <text
          fill="currentColor"
          style={{ fontSize: font, letterSpacing: "0.2em", fontWeight: 500 }}
          className="uppercase"
        >
          <textPath href={`#${id}`} textLength={circumference - 4} lengthAdjust="spacing">
            {phrase.repeat(repeats)}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

/** What the guided session says, centred over the portal. */
function GuidedCue({ guided }: { guided: Guided }) {
  let key = "";
  let content: React.ReactNode = null;

  switch (guided.status) {
    case "settling":
      key = "settle";
      content = (
        <p className="text-small text-brand-cream/90 sm:text-body">
          Sit tall.
          <br />
          Soften your shoulders.
        </p>
      );
      break;
    case "breathing":
      key = `${guided.round}-${guided.phase}`;
      content = (
        <>
          <p className="text-[clamp(1.4rem,4.2vw,2.4rem)] font-extralight lowercase leading-none tracking-tight">
            {guided.phase === "in" ? "breathe in" : "breathe out"}
          </p>
          <p className="mt-3 text-eyebrow uppercase tracking-[0.18em] text-brand-gold">
            {guided.round} of {ROUNDS}
          </p>
        </>
      );
      break;
    case "done":
      key = "done";
      content = (
        <p className="text-[clamp(1.4rem,4.2vw,2.4rem)] font-extralight lowercase leading-none">
          beautiful.
        </p>
      );
      break;
    case "complete":
      key = "complete";
      content = (
        <div className="flex flex-col items-center gap-3">
          <p className="max-w-[14rem] text-small leading-snug text-brand-cream sm:text-body">
            That&apos;s how every class with me begins.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-small font-medium text-brand-gold underline-offset-4 hover:underline"
          >
            Book your trial class
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </Link>
        </div>
      );
      break;
    default:
      break;
  }

  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-[12%] z-[3] flex items-center justify-center text-center"
    >
      <AnimatePresence mode="wait">
        {content ? (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="pointer-events-auto"
          >
            {content}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
