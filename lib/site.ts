export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const siteConfig = {
  name: "Shilpa Yoga Space",
  shortName: "Shilpa Yoga",
  // Stacked editorial hero words (Section 6). Placeholder tagline.
  taglineWords: ["move", "with", "intention"],
  tagline: "Move with intention",
  description:
    "Online and in-person yoga with Shilpa, a 500-hour Registered Yoga Teacher with Yoga Alliance USA. Live classes worldwide and one-to-one sessions in Gurgaon, for strength, calm, and a clearer mind.",
  url: "https://www.shilpa.yoga",
  locale: "en_IN",
  teacher: {
    name: "Shilpa",
    credential: "RYT 500 · Yoga Alliance USA",
    certification: "500-Hour Yoga TTC · Vinyasa Yoga Ashram",
    school: "Vinyasa Yoga Ashram",
    // Placeholder registration number, replace with real Yoga Alliance ID.
    rytNumber: "RYT-500 · #00000000",
    location: "Gurgaon, Delhi NCR, India",
  },
  contact: {
    email: "namaste@shilpa.yoga",
    phone: "+91 80760 47918",
    whatsapp: "https://wa.me/918076047918",
  },
  social: {
    instagram: "https://instagram.com/shilpayogaspace",
    instagramHandle: "@shilpayogaspace",
  },
} as const;

export const mainNav: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Classes",
    href: "/classes",
    children: [
      {
        label: "Online Yoga Classes",
        href: "/classes/online-vinyasa",
        description: "Live, global group classes",
      },
      {
        label: "Personal Sessions",
        href: "/classes/personal-gurgaon",
        description: "One-to-one in Gurgaon & Delhi NCR",
      },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Practice",
    links: [
      { label: "Online Yoga Classes", href: "/classes/online-vinyasa" },
      { label: "Personal Sessions", href: "/classes/personal-gurgaon" },
      { label: "All Classes", href: "/classes" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "About Shilpa", href: "/about" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Instagram", href: "https://instagram.com/shilpayogaspace" },
      { label: "WhatsApp", href: siteConfig.contact.whatsapp },
    ],
  },
];

export const legalNav: { label: string; href: string }[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
];
