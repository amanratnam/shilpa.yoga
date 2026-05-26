import { images, type SiteImage } from "@/content/images";

export type Service = {
  key: "online" | "personal" | "training";
  category: string;
  title: string;
  href: string;
  shortDescription: string;
  cardDescription: string;
  priceLabel: string;
  image: SiteImage;
};

// Pricing is placeholder — confirm and update with the client before launch.
export const services: Service[] = [
  {
    key: "online",
    category: "Online · Worldwide",
    title: "Online Vinyasa",
    href: "/classes/online-vinyasa",
    shortDescription:
      "Live, breath-led Vinyasa you can join from anywhere in the world.",
    cardDescription:
      "Small live groups, sequenced intelligently around the body — not a follow-along video. Replays if you miss the room.",
    priceLabel: "from ₹2,500 / month",
    image: images.serviceOnline,
  },
  {
    key: "personal",
    category: "In person · Gurgaon & Delhi NCR",
    title: "Personal Sessions",
    href: "/classes/personal-gurgaon",
    shortDescription:
      "One-to-one practice shaped entirely around you, in your home or studio.",
    cardDescription:
      "Private, attentive teaching for a specific goal, an injury, or a steadier daily practice. Built around your body and your week.",
    priceLabel: "from ₹1,500 / session",
    image: images.servicePersonal,
  },
  {
    key: "training",
    category: "Certification · Yoga Alliance aligned",
    title: "Teacher Training",
    href: "/teacher-training",
    shortDescription:
      "Learn to teach with real understanding of anatomy, theory and the body.",
    cardDescription:
      "A small-cohort certification grounded in functional anatomy, philosophy and practicum — not a weekend crash course.",
    priceLabel: "from ₹45,000",
    image: images.serviceTraining,
  },
];

export const serviceByKey = Object.fromEntries(
  services.map((s) => [s.key, s]),
) as Record<Service["key"], Service>;
