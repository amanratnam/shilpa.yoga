import { images, type SiteImage } from "@/content/images";

export type Service = {
  key: "online" | "personal";
  category: string;
  title: string;
  href: string;
  shortDescription: string;
  cardDescription: string;
  priceLabel: string;
  image: SiteImage;
};

// Pricing is placeholder, confirm and update with the client before launch.
export const services: Service[] = [
  {
    key: "online",
    category: "Online · Worldwide",
    title: "Online Yoga Classes",
    href: "/classes/online-vinyasa",
    shortDescription:
      "Live, breath-led yoga you can join from anywhere in the world.",
    cardDescription:
      "Small live groups, sequenced intelligently around the body, not a follow-along video. Real attention, every class.",
    priceLabel: "Free trial · ₹2,000 / month",
    image: images.serviceOnline,
  },
  {
    key: "personal",
    category: "In person · Gurgaon",
    title: "Personal Sessions",
    href: "/classes/personal-gurgaon",
    shortDescription:
      "One-to-one practice shaped entirely around you, in your own home.",
    cardDescription:
      "Private, attentive teaching for a specific goal, an injury, or a steadier daily practice. Built around your body and your week.",
    priceLabel: "Trial ₹499 · ₹2,000 / month",
    image: images.servicePersonal,
  },
];

export const serviceByKey = Object.fromEntries(
  services.map((s) => [s.key, s]),
) as Record<Service["key"], Service>;
