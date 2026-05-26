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
    "Anatomy-based Vinyasa yoga with a Yoga Alliance USA Registered Yoga Teacher. Online classes worldwide, personal sessions in Gurgaon, and a teacher training certification grounded in anatomy and theory.",
  url: "https://www.shilpa.yoga",
  locale: "en_IN",
  teacher: {
    name: "Shilpa",
    credential: "RYT 200, Yoga Alliance USA",
    // Placeholder registration number — replace with real Yoga Alliance ID.
    rytNumber: "RYT-200 · #00000000",
    location: "Gurgaon, Delhi NCR, India",
  },
  contact: {
    email: "hello@shilpa.yoga",
    // Placeholder numbers — replace at launch.
    phone: "+91 00000 00000",
    whatsapp: "https://wa.me/910000000000",
    whatsappCommunity: "https://chat.whatsapp.com/placeholder",
  },
  social: {
    instagram: "https://instagram.com/shilpa.yoga",
    instagramHandle: "@shilpa.yoga",
  },
} as const;

export const mainNav: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Classes",
    href: "/classes",
    children: [
      {
        label: "Online Vinyasa",
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
  { label: "Teacher Training", href: "/teacher-training" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Practice",
    links: [
      { label: "Online Vinyasa", href: "/classes/online-vinyasa" },
      { label: "Personal Sessions", href: "/classes/personal-gurgaon" },
      { label: "All Classes", href: "/classes" },
    ],
  },
  {
    title: "Train",
    links: [
      { label: "Teacher Training", href: "/teacher-training" },
      { label: "Blog", href: "/blog" },
      { label: "About Shilpa", href: "/about" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Instagram", href: "https://instagram.com/shilpa.yoga" },
      { label: "WhatsApp Community", href: "https://chat.whatsapp.com/placeholder" },
    ],
  },
];

export const legalNav: { label: string; href: string }[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
];
