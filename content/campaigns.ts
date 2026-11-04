/**
 * Festival campaigns: one entry per /offer/<slug> landing page.
 *
 * Every campaign is about the same product — live, small-group ONLINE
 * classes — at a festive discount off the live monthly prices. Prices are
 * never written here: the page applies `discountPercent` to whatever the
 * pricing configurator currently publishes, so an offer can never quote a
 * stale base price.
 *
 * Copy convention for the site: no em dashes.
 */

export type CampaignEffect = "diyas" | "snow" | "fireworks" | "tricolour" | "gulal";

export type CampaignTheme = {
  /** Dark or light page; drives text colour and contrast choices. */
  mode: "dark" | "light";
  bg: string;
  /** A second ground colour for alternating bands and cards. */
  surface: string;
  /** Primary festive colour: buttons, highlights. */
  accent: string;
  /** Text on top of `accent`. */
  onAccent: string;
  /** Secondary colour for small details. */
  accent2: string;
  /** Main text colour. */
  ink: string;
  /** Colours the canvas particles draw from. */
  particles: string[];
};

export type Campaign = {
  slug: string;
  /** Stored against every lead, so responses can be told apart. */
  name: string;
  festival: string;
  /** Short greeting shown above the headline. */
  greeting: string;
  headline: string;
  /** The words in the headline to set in the accent colour. */
  highlight: string;
  intro: string;
  discountPercent: number;
  /** Small badge text next to the discount, e.g. "for 26 January". */
  discountNote?: string;
  /** Last day the offer can be claimed (inclusive, India time). */
  endsOn: string;
  /** Why this festival is a good moment to start. */
  reasons: { title: string; body: string }[];
  /** A one-line ritual tying the festival to the practice. */
  ritual: string;
  effect: CampaignEffect;
  theme: CampaignTheme;
  /** Social preview text. */
  metaDescription: string;
};

export const campaigns: Campaign[] = [
  {
    slug: "diwali-yoga",
    name: "Diwali 2026",
    festival: "Diwali",
    greeting: "Shubh Deepavali",
    headline: "Light up your practice this Diwali",
    highlight: "Light up",
    intro:
      "Live, small-group online yoga with Shilpa, at 25% off for the festive season. Balance the sweets, the late nights and the busy days with a practice that leaves you steady and glowing.",
    discountPercent: 25,
    endsOn: "2026-11-16",
    reasons: [
      {
        title: "Balance the festive rush",
        body: "Gentle strength and twists keep digestion and energy steady through the sweets, the travel and the late nights.",
      },
      {
        title: "A calmer mind for the season",
        body: "Breath-led practice settles the nervous system, so the celebrations feel joyful rather than draining.",
      },
      {
        title: "Begin something lasting",
        body: "Diwali is about new beginnings. Start a practice now and carry the light into the months ahead.",
      },
    ],
    ritual: "Light a diya, roll out your mat, and give yourself an hour that is only yours.",
    effect: "diyas",
    theme: {
      mode: "dark",
      bg: "#22091A",
      surface: "#3A1029",
      accent: "#F4A63A",
      onAccent: "#2A0C1E",
      accent2: "#E9C46A",
      ink: "#FFF3E2",
      particles: ["#FFD27A", "#F4A63A", "#FF7A3D", "#FFE9B8"],
    },
    metaDescription:
      "Diwali offer: 25% off live small-group online yoga with Shilpa. Limited festive season seats.",
  },
  {
    slug: "christmas-yoga",
    name: "Christmas 2026",
    festival: "Christmas",
    greeting: "Merry Christmas",
    headline: "Unwrap a calmer, stronger you",
    highlight: "calmer, stronger",
    intro:
      "Give yourself the gift that keeps giving: live, small-group online yoga with Shilpa at 20% off this Christmas. Join from anywhere, in any time zone, and end the year feeling good in your body.",
    discountPercent: 20,
    endsOn: "2026-12-28",
    reasons: [
      {
        title: "Undo the holiday slump",
        body: "Mobility and strength work counter the long dinners, the sofa and the cold mornings.",
      },
      {
        title: "Quiet in the busy season",
        body: "Breathwork and stillness give you a pocket of calm between the shopping, the hosting and the travel.",
      },
      {
        title: "A gift for yourself, or someone you love",
        body: "Enquire for yourself or for a friend or family member. Same live classes, same festive price.",
      },
    ],
    ritual: "Before the festivities begin, ten slow breaths on the mat. Then everything else.",
    effect: "snow",
    theme: {
      mode: "dark",
      bg: "#0E241B",
      surface: "#16362A",
      accent: "#E0BE6E",
      onAccent: "#10261C",
      accent2: "#D9433F",
      ink: "#F6F1E7",
      particles: ["#FFFFFF", "#F6F1E7", "#E7EEF0"],
    },
    metaDescription:
      "Christmas offer: 20% off live small-group online yoga with Shilpa. Join from anywhere.",
  },
  {
    slug: "new-year-yoga",
    name: "New Year 2027",
    festival: "New Year",
    greeting: "Happy New Year",
    headline: "New year, stronger you",
    highlight: "stronger you",
    intro:
      "Make 2027 the year your practice sticks. Live, small-group online yoga with Shilpa at 30% off, with the structure and personal attention that turn a resolution into a routine.",
    discountPercent: 30,
    endsOn: "2027-01-15",
    reasons: [
      {
        title: "A resolution that lasts",
        body: "Live classes at set times build the habit an app never will. You show up, and so does your teacher.",
      },
      {
        title: "Progress you can feel",
        body: "Sequences build week to week, so by February you notice the strength, the flexibility and the calm.",
      },
      {
        title: "Right for where you are",
        body: "Complete beginner or returning after a break, small groups mean you are seen and guided properly.",
      },
    ],
    ritual: "Twelve breaths at midnight was never the plan. Twelve classes a month might be.",
    effect: "fireworks",
    theme: {
      mode: "dark",
      bg: "#0A0F24",
      surface: "#141B3A",
      accent: "#F3C14F",
      onAccent: "#0B1026",
      accent2: "#9FB4FF",
      ink: "#F4F2EC",
      particles: ["#F3C14F", "#FFE7A3", "#9FB4FF", "#FF8FB1", "#FFFFFF"],
    },
    metaDescription:
      "New Year offer: 30% off live small-group online yoga with Shilpa. Make 2027 the year your practice sticks.",
  },
  {
    slug: "republic-day-yoga",
    name: "Republic Day 2027",
    festival: "Republic Day",
    greeting: "Happy Republic Day",
    headline: "Freedom to move, strength to stand tall",
    highlight: "Freedom to move",
    intro:
      "Celebrate 26 January with 26% off live, small-group online yoga with Shilpa. A practice that builds a strong spine, an open chest and a steady mind, from anywhere in India or the world.",
    discountPercent: 26,
    discountNote: "for 26 January",
    endsOn: "2027-01-31",
    reasons: [
      {
        title: "Stand tall, literally",
        body: "Posture-focused sequences undo the desk slump and build a strong, supple spine.",
      },
      {
        title: "A healthier routine, a healthier nation",
        body: "Small daily habits add up. A steady practice is one of the best gifts you can give yourself.",
      },
      {
        title: "Rooted in Indian tradition",
        body: "Classical asana and breathwork, taught with modern anatomy, so the practice is safe and authentic.",
      },
    ],
    ritual: "Stand in Tadasana, feet rooted, crown lifted. That's where strength starts.",
    effect: "tricolour",
    theme: {
      mode: "light",
      bg: "#FFFCF5",
      surface: "#FFF1DE",
      accent: "#E8761E",
      onAccent: "#FFFFFF",
      accent2: "#138808",
      ink: "#14213D",
      particles: ["#FF9933", "#FFFFFF", "#138808", "#1F3A93"],
    },
    metaDescription:
      "Republic Day offer: 26% off live small-group online yoga with Shilpa. Celebrate 26 January with a stronger you.",
  },
  {
    slug: "holi-yoga",
    name: "Holi 2027",
    festival: "Holi",
    greeting: "Happy Holi",
    headline: "Bring the colour back to your mornings",
    highlight: "colour",
    intro:
      "Spring is here. Celebrate Holi with 20% off live, small-group online yoga with Shilpa: energising flows, joyful breathwork and a lighter, brighter you.",
    discountPercent: 20,
    endsOn: "2027-03-28",
    reasons: [
      {
        title: "Shake off winter",
        body: "Energising flows wake up stiff joints and sluggish mornings as the season turns.",
      },
      {
        title: "Joy you can practise",
        body: "Movement with breath lifts the mood. Classes are light, playful and kind to every level.",
      },
      {
        title: "A fresh start for spring",
        body: "New season, new rhythm. Small groups and set times make the habit easy to keep.",
      },
    ],
    ritual: "After the colours wash off, keep the joy. Start the next morning on the mat.",
    effect: "gulal",
    theme: {
      mode: "light",
      bg: "#FFF8F2",
      surface: "#FFEBDD",
      accent: "#E5257A",
      onAccent: "#FFFFFF",
      accent2: "#7C3AED",
      ink: "#2A1238",
      particles: ["#FF3D8B", "#FFC21A", "#21C16B", "#2F80ED", "#8B5CF6", "#FF7A1A"],
    },
    metaDescription:
      "Holi offer: 20% off live small-group online yoga with Shilpa. Energising spring classes from anywhere.",
  },
];

export function getCampaign(slug: string): Campaign | undefined {
  return campaigns.find((c) => c.slug === slug);
}

/** True once the last day of the offer has passed in India. */
export function campaignEnded(c: Campaign, now = new Date()): boolean {
  const todayIST = new Date(now.getTime() + 5.5 * 3600_000).toISOString().slice(0, 10);
  return todayIST > c.endsOn;
}
