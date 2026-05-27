import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Cancellation and refund terms for online classes and personal sessions.",
  alternates: { canonical: "/refund-policy" },
  robots: { index: false, follow: true },
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund Policy" updated="May 2026">
      <h2>Trial classes</h2>
      <p>Trial classes are free, so no refund applies.</p>

      <h2>Online monthly plan</h2>
      <p>
        The monthly online plan can be cancelled at any time; cancellation stops
        the next month and is not pro-rated within a month already begun. Unused,
        unstarted months are fully refundable.
      </p>

      <h2>Personal sessions</h2>
      <ul>
        <li>
          Single sessions cancelled with reasonable notice can be rescheduled at
          no cost.
        </li>
        <li>
          For the monthly plan, any sessions not yet taken in a freshly-started
          month can be refunded on a pro-rata basis within 7 days.
        </li>
      </ul>

      <h2>How to request a refund</h2>
      <p>
        Email{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>{" "}
        with your booking details. As payments are arranged directly, approved
        refunds are returned by the same method, typically within a few business
        days.
      </p>
    </LegalLayout>
  );
}
