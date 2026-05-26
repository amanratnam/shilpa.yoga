import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply to classes, sessions and teacher training with Shilpa Yoga Space.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="May 2026">
      <h2>Bookings</h2>
      <p>
        A class, session or training place is confirmed once payment (or an
        agreed deposit) is received and we have acknowledged your booking by
        email.
      </p>

      <h2>Health & safety</h2>
      <p>
        Yoga involves physical movement. You agree to practise within your own
        limits and to tell us about any injuries, medical conditions or
        pregnancy before practising. If in doubt, consult your doctor first.
        Participation is at your own risk.
      </p>

      <h2>Classes & rescheduling</h2>
      <ul>
        <li>Online class replays are provided where available.</li>
        <li>
          Personal sessions may be rescheduled with reasonable notice; late
          cancellations may be charged.
        </li>
        <li>Class packs and memberships are valid for the stated period.</li>
      </ul>

      <h2>Teacher training</h2>
      <p>
        Teacher training places are limited and subject to a short application.
        Specific terms — including the schedule, attendance requirements and
        assessment — are shared with each cohort on enrolment.
      </p>

      <h2>Payments</h2>
      <p>
        Prices are listed in Indian Rupees and processed securely via Razorpay.
        Please see our <a href="/refund-policy">Refund Policy</a> for
        cancellations and refunds.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>
    </LegalLayout>
  );
}
