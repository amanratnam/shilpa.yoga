/**
 * Central image manifest (Section 8).
 *
 * Real, optimized photography lives under public/images/<section>/.
 * Dimensions below are the true (EXIF-baked) pixel dimensions.
 * Raw originals are kept out of git (see public/images/site_images_shilpa).
 */

export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Shown inside the branded placeholder only when `ready` is false. */
  label: string;
  ready: boolean;
};

const img = (i: SiteImage): SiteImage => i;

export const images = {
  // ---- Hero (landscape) ----
  homepageHero: img({
    src: "/images/hero/homepage-hero.jpg",
    alt: "Shilpa in a side-bend on a misty Himalayan riverbank",
    width: 1920,
    height: 1440,
    label: "Hero — Shilpa practising by the river",
    ready: true,
  }),

  // ---- Homepage sections ----
  differentiation: img({
    src: "/images/shilpa/teaching-adjust.jpg",
    alt: "Shilpa hands-on, adjusting a student's standing balance in class",
    width: 1200,
    height: 1800,
    label: "Hands-on alignment adjustment",
    ready: true,
  }),
  philosophy: img({
    src: "/images/practice/river-wide.jpg",
    alt: "A still riverbank wrapped in early-morning mist",
    width: 1800,
    height: 1350,
    label: "Calm riverbank",
    ready: true,
  }),

  // ---- Service cards ----
  serviceOnline: img({
    src: "/images/practice/studio-class.jpg",
    alt: "A live Vinyasa class moving through a standing posture",
    width: 1200,
    height: 1800,
    label: "Online Vinyasa class",
    ready: true,
  }),
  servicePersonal: img({
    src: "/images/shilpa/teaching-updog.jpg",
    alt: "Shilpa guiding a student one-to-one through a backbend",
    width: 1800,
    height: 1200,
    label: "One-to-one personal session",
    ready: true,
  }),

  // ---- About (mostly portrait) ----
  aboutPortrait: img({
    src: "/images/shilpa/portrait.jpg",
    alt: "Shilpa in a deep squat with hands at heart centre",
    width: 1050,
    height: 1400,
    label: "Shilpa — portrait",
    ready: true,
  }),
  aboutPractice: img({
    src: "/images/shilpa/practice-river.jpg",
    alt: "Shilpa standing in a quiet riverside posture",
    width: 1050,
    height: 1400,
    label: "Shilpa — riverside practice",
    ready: true,
  }),
  aboutStudio: img({
    src: "/images/shilpa/studio-fold.jpg",
    alt: "Shilpa folding forward in her studio",
    width: 1050,
    height: 1400,
    label: "Shilpa — studio practice",
    ready: true,
  }),
  aboutCertified: img({
    src: "/images/shilpa/rooftop.jpg",
    alt: "Shilpa with her Yoga Alliance certification, mountains behind",
    width: 1050,
    height: 1400,
    label: "Shilpa — newly certified",
    ready: true,
  }),
  aboutCeremony: img({
    src: "/images/practice/ceremony.jpg",
    alt: "A traditional fire ceremony during practice",
    width: 933,
    height: 1400,
    label: "Fire ceremony",
    ready: true,
  }),
  aboutSeated: img({
    src: "/images/practice/seated-notes.jpg",
    alt: "Shilpa seated, taking notes during a session",
    width: 1800,
    height: 1200,
    label: "Shilpa — seated",
    ready: true,
  }),

  // ---- Service page heroes (full-bleed; orientation handled by cover) ----
  onlineHero: img({
    src: "/images/practice/studio-class.jpg",
    alt: "A live Vinyasa class in motion",
    width: 1200,
    height: 1800,
    label: "Online Vinyasa — hero",
    ready: true,
  }),
  personalHero: img({
    src: "/images/shilpa/teaching-adjust.jpg",
    alt: "Shilpa giving a hands-on adjustment in a private session",
    width: 1200,
    height: 1800,
    label: "Personal sessions — hero",
    ready: true,
  }),

  // ---- Blog covers (landscape, for 16:10 cards) ----
  blogDefault: img({
    src: "/images/shilpa/teaching-updog.jpg",
    alt: "A teaching moment in the studio",
    width: 1800,
    height: 1200,
    label: "Blog — default cover",
    ready: true,
  }),
  blogAnatomy: img({
    src: "/images/practice/seated-notes.jpg",
    alt: "A focused, attentive moment during a session",
    width: 1800,
    height: 1200,
    label: "Blog — anatomy",
    ready: true,
  }),
  blogPractice: img({
    src: "/images/practice/river-wide.jpg",
    alt: "Quiet riverside practice at dawn",
    width: 1800,
    height: 1350,
    label: "Blog — home practice",
    ready: true,
  }),

  // ---- Open Graph ----
  ogDefault: img({
    src: "/images/og/default.jpg",
    alt: "Shilpa Yoga Space",
    width: 1200,
    height: 630,
    label: "OpenGraph — default share image",
    ready: true,
  }),
} as const;

export type ImageKey = keyof typeof images;

/** Resolve a blog cover by manifest key, falling back to the default. */
export function blogCover(key?: string): SiteImage {
  if (key && key in images) return images[key as ImageKey];
  return images.blogDefault;
}
