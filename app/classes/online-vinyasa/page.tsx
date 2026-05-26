import type { Metadata } from "next";
import { ServicePage } from "@/components/sections/ServicePage";
import { onlineVinyasaContent } from "@/content/classes";

export const metadata: Metadata = {
  title: "Online Vinyasa Classes",
  description:
    "Live, small-group online Vinyasa yoga with a Yoga Alliance USA RYT. Anatomy-led sequencing, replays included, beginners welcome. Book a free trial.",
  alternates: { canonical: "/classes/online-vinyasa" },
};

export default function OnlineVinyasaPage() {
  return <ServicePage content={onlineVinyasaContent} />;
}
