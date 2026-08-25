import { images, type SiteImage } from "@/content/images";
import {
  formatINR,
  sortedMonthly,
  type PricingConfig,
  type PricingMode,
} from "@/lib/pricing/config";

export type Service = {
  key: "online" | "personal";
  category: string;
  title: string;
  href: string;
  shortDescription: string;
  cardDescription: string;
  image: SiteImage;
};

/** Service card + list summary, e.g. "Trial ₹199 · from ₹3,000 / month". */
export function priceLabel(mode: PricingMode, config: PricingConfig): string {
  const m = config.modes[mode];
  const cheapestMonthly = sortedMonthly(m).reduce(
    (low, tier) => Math.min(low, tier.amount),
    Infinity,
  );
  const from = Number.isFinite(cheapestMonthly)
    ? ` · from ${formatINR(cheapestMonthly)} / month`
    : "";
  return `Trial ${formatINR(m.trial.amount)}${from}`;
}

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
    image: images.servicePersonal,
  },
];

export const serviceByKey = Object.fromEntries(
  services.map((s) => [s.key, s]),
) as Record<Service["key"], Service>;
