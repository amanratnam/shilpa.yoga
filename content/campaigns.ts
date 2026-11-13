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

export type CampaignEffect = "festive" | "snow" | "fireworks" | "tricolour" | "gulal";

/**
 * The festive offer, identical for every campaign: monthly online group
 * plans with bonus classes. Prices are fixed here rather than derived from
 * the pricing configurator, because the offer is a package of its own.
 */
export const OFFER_PLANS = [
  { classes: 8, free: 1, price: 4000 },
  { classes: 12, free: 2, price: 6000 },
  { classes: 16, free: 2, price: 7000 },
] as const;

export type Campaign = {
  slug: string;
  /** Stored against every lead, so responses can be told apart. */
  name: string;
  festival: string;
  /** Short greeting shown above the headline. */
  greeting: string;
  headline: string;
  /** The words in the headline to set in gold. */
  highlight: string;
  intro: string;
  /** Last day the offer can be claimed (inclusive, India time). */
  endsOn: string;
  /** Festive atmosphere: the animation and motif. Colours stay on brand. */
  effect: CampaignEffect;
  /** Colours for the animation's particles. */
  particles: string[];
  /** Social preview text. */
  metaDescription: string;
};

export const campaigns: Campaign[] = [
  {
    // Replaced the Diwali page on 13 Nov 2026; /offer/diwali-yoga redirects
    // here (next.config.ts) and older Diwali leads keep their own label.
    slug: "festive-yoga",
    name: "Festive Season 2026",
    festival: "festive",
    greeting: "Season's greetings",
    headline: "Make this festive season your strongest yet",
    highlight: "strongest yet",
    intro:
      "From the lights of Diwali to the cheer of Christmas, the season is full of feasts, late nights and busy days. Stay steady through all of it with live, small-group online yoga with Shilpa, plus free extra classes.",
    endsOn: "2026-12-26",
    effect: "festive",
    particles: ["#C9A961", "#E9D29A", "#FFE6A8", "#F7F4ED"],
    metaDescription:
      "Festive season offer: free extra classes on live small-group online yoga with Shilpa, until 26 December.",
  },
  {
    slug: "christmas-yoga",
    name: "Christmas 2026",
    festival: "Christmas",
    greeting: "Merry Christmas",
    headline: "Unwrap a calmer, stronger you",
    highlight: "calmer, stronger",
    intro:
      "Give yourself the gift that keeps giving: live, small-group online yoga with Shilpa, with free extra classes this Christmas. Join from anywhere, in any time zone, and end the year feeling good in your body.",
    endsOn: "2026-12-28",
    effect: "snow",
    particles: ["#FFFFFF", "#F6F1E7", "#E7EEF0"],
    metaDescription:
      "Christmas offer: free extra classes on live small-group online yoga with Shilpa. Join from anywhere.",
  },
  {
    slug: "new-year-yoga",
    name: "New Year 2027",
    festival: "New Year",
    greeting: "Happy New Year",
    headline: "New year, stronger you",
    highlight: "stronger you",
    intro:
      "Make 2027 the year your practice sticks. Live, small-group online yoga with Shilpa, with bonus classes and the structure and personal attention that turn a resolution into a routine.",
    endsOn: "2027-01-15",
    effect: "fireworks",
    particles: ["#C9A961", "#E9D29A", "#F7F4ED", "#FFFFFF"],
    metaDescription:
      "New Year offer: free extra classes on live small-group online yoga with Shilpa. Make 2027 the year your practice sticks.",
  },
  {
    slug: "republic-day-yoga",
    name: "Republic Day 2027",
    festival: "Republic Day",
    greeting: "Happy Republic Day",
    headline: "Freedom to move, strength to stand tall",
    highlight: "Freedom to move",
    intro:
      "Celebrate 26 January with live, small-group online yoga with Shilpa, and free extra classes. A practice that builds a strong spine, an open chest and a steady mind, from anywhere in India or the world.",
    endsOn: "2027-01-31",
    effect: "tricolour",
    particles: ["#FF9933", "#FFFFFF", "#138808", "#1F3A93"],
    metaDescription:
      "Republic Day offer: free extra classes on live small-group online yoga with Shilpa.",
  },
  {
    slug: "holi-yoga",
    name: "Holi 2027",
    festival: "Holi",
    greeting: "Happy Holi",
    headline: "Bring the colour back to your mornings",
    highlight: "colour",
    intro:
      "Spring is here. Celebrate Holi with live, small-group online yoga with Shilpa, plus free extra classes: energising flows, joyful breathwork and a lighter, brighter you.",
    endsOn: "2027-03-28",
    effect: "gulal",
    particles: ["#FF3D8B", "#FFC21A", "#21C16B", "#2F80ED", "#8B5CF6", "#FF7A1A"],
    metaDescription:
      "Holi offer: free extra classes on live small-group online yoga with Shilpa.",
  },
];

/**
 * Campaigns that have been retired or renamed, so leads already stored under
 * their slug still read sensibly in the admin.
 */
export const RETIRED_CAMPAIGNS: Record<string, string> = {
  "diwali-yoga": "Diwali 2026",
};

export function getCampaign(slug: string): Campaign | undefined {
  return campaigns.find((c) => c.slug === slug);
}

/** True once the last day of the offer has passed in India. */
export function campaignEnded(c: Campaign, now = new Date()): boolean {
  const todayIST = new Date(now.getTime() + 5.5 * 3600_000).toISOString().slice(0, 10);
  return todayIST > c.endsOn;
}
