/**
 * Central image manifest (Section 8).
 *
 * Every page references imagery through this manifest rather than hardcoding
 * paths. While the client's real photos are pending, each entry sets
 * `ready: false` and renders as an intentional branded placeholder (see
 * components/ui/SmartImage.tsx). When a real photo arrives:
 *   1. drop the file into the right public/images/<section>/ folder,
 *   2. update `src`/`alt`/dimensions here if needed,
 *   3. flip `ready` to true.
 * No page code needs to change.
 */

export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Short label shown inside the branded placeholder until the asset lands. */
  label: string;
  /** Flip to true once the real asset is in place. */
  ready: boolean;
};

const img = (i: SiteImage): SiteImage => i;

export const images = {
  // ---- Hero ----
  homepageHero: img({
    src: "/images/hero/homepage-hero.jpg",
    alt: "Shilpa moving through a Vinyasa flow in a sunlit studio",
    width: 1920,
    height: 1080,
    label: "Hero — Shilpa in Vinyasa flow (looping video or full-bleed image)",
    ready: false,
  }),

  // ---- Homepage sections ----
  differentiation: img({
    src: "/images/shilpa/shilpa-teaching.jpg",
    alt: "Shilpa adjusting a student's alignment during a class",
    width: 1200,
    height: 1500,
    label: "Shilpa teaching — hands-on alignment adjustment",
    ready: false,
  }),
  philosophy: img({
    src: "/images/practice/philosophy-calm.jpg",
    alt: "Quiet studio corner with a mat, props and morning light",
    width: 1600,
    height: 1000,
    label: "Calm practice space — ambient, no identifiable people",
    ready: false,
  }),

  // ---- Service cards ----
  serviceOnline: img({
    src: "/images/practice/online-vinyasa.jpg",
    alt: "A laptop framing a live online Vinyasa class in progress",
    width: 1200,
    height: 900,
    label: "Online Vinyasa — live global class",
    ready: false,
  }),
  servicePersonal: img({
    src: "/images/shilpa/personal-session.jpg",
    alt: "Shilpa guiding a one-to-one personal yoga session",
    width: 1200,
    height: 900,
    label: "Personal session — one-to-one in Gurgaon",
    ready: false,
  }),
  serviceTraining: img({
    src: "/images/training/training-group.jpg",
    alt: "Teacher trainees studying anatomy together on their mats",
    width: 1200,
    height: 900,
    label: "Teacher training — anatomy & theory cohort",
    ready: false,
  }),

  // ---- About ----
  aboutPortrait: img({
    src: "/images/shilpa/portrait.jpg",
    alt: "Portrait of Shilpa, Registered Yoga Teacher",
    width: 1200,
    height: 1500,
    label: "Shilpa — portrait",
    ready: false,
  }),
  aboutPractice: img({
    src: "/images/shilpa/practice-flow.jpg",
    alt: "Shilpa holding a steady standing posture",
    width: 1600,
    height: 1000,
    label: "Shilpa — practice / posture",
    ready: false,
  }),

  // ---- Service & landing page heroes ----
  onlineHero: img({
    src: "/images/practice/online-hero.jpg",
    alt: "Home practice set up for a live online Vinyasa class",
    width: 1920,
    height: 1080,
    label: "Online Vinyasa — page hero",
    ready: false,
  }),
  personalHero: img({
    src: "/images/shilpa/personal-hero.jpg",
    alt: "Shilpa leading a focused private session in Gurgaon",
    width: 1920,
    height: 1080,
    label: "Personal sessions — page hero",
    ready: false,
  }),
  trainingHero: img({
    src: "/images/training/training-hero.jpg",
    alt: "Teacher training cohort in a circle during theory study",
    width: 1920,
    height: 1080,
    label: "Teacher training — page hero",
    ready: false,
  }),
  trainingAnatomy: img({
    src: "/images/training/anatomy-study.jpg",
    alt: "Anatomy reference and notes used during teacher training",
    width: 1200,
    height: 900,
    label: "Teacher training — anatomy study detail",
    ready: false,
  }),

  // ---- Blog ----
  blogDefault: img({
    src: "/images/practice/blog-default.jpg",
    alt: "Folded blanket and props in a calm studio",
    width: 1600,
    height: 900,
    label: "Blog — default cover",
    ready: false,
  }),

  // ---- Open Graph ----
  ogDefault: img({
    src: "/images/og/default.jpg",
    alt: "Shilpa Yoga Space",
    width: 1200,
    height: 630,
    label: "OpenGraph — default share image",
    ready: false,
  }),
} as const;

export type ImageKey = keyof typeof images;
