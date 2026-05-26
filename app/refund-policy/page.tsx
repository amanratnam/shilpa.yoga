import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Cancellation and refund terms for classes, sessions and teacher training.",
  alternates: { canonical: "/refund-policy" },
  robots: { index: false, follow: true },
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund Policy" updated="May 2026">
      <h2>Trial classes</h2>
      <p>Trial classes are free, so no refund applies.</p>

      <h2>Class packs & memberships</h2>
      <ul>
        <li>
          Unused class packs may be refunded on a pro-rata basis within 7 days
          of purchase, less any classes already attended.
        </li>
        <li>
          Monthly memberships can be cancelled at any time; cancellation stops
          the next renewal and is not pro-rated within a paid month.
        </li>
      </ul>

      <h2>Personal sessions</h2>
      <p>
        Prepaid session blocks are refundable for unused sessions within 14 days
        of purchase. Individual sessions cancelled with reasonable notice can be
        rescheduled.
      </p>

      <h2>Teacher training</h2>
      <ul>
        <li>The application deposit is refundable if you are not offered a place.</li>
        <li>
          Once you accept a seat, the deposit is adjusted against tuition and is
          non-refundable, as places are limited.
        </li>
        <li>
          Tuition refund terms after the cohort begins are shared in the
          enrolment agreement.
        </li>
      </ul>

      <h2>How to request a refund</h2>
      <p>
        Email{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>{" "}
        with your booking details. Approved refunds are returned to your original
        payment method via Razorpay, typically within 5–10 business days.
      </p>
    </LegalLayout>
  );
}
