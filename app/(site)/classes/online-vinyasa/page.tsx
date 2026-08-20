import type { Metadata } from "next";
import { ServicePage } from "@/components/sections/ServicePage";
import { onlineVinyasaContent } from "@/content/classes";

export const metadata: Metadata = {
  title: "Online Yoga Classes",
  description:
    "Live, small-group online yoga with a Yoga Alliance USA RYT. Vinyasa, Ashtanga and more, taught live, beginners welcome. Book a free introductory class.",
  alternates: { canonical: "/classes/online-vinyasa" },
};

export default function OnlineVinyasaPage() {
  return <ServicePage content={onlineVinyasaContent} />;
}
