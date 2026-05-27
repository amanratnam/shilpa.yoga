import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply to classes and personal sessions with Shilpa Yoga Space.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="May 2026">
      <h2>Bookings</h2>
      <p>
        A class or session is confirmed once we have agreed a time and
        acknowledged your booking by email or WhatsApp. Fees are arranged
        directly between us.
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
        <li>Online classes are taught live; recordings are not provided.</li>
        <li>
          Personal sessions may be rescheduled with reasonable notice; late
          cancellations may be charged.
        </li>
        <li>Monthly plans are valid for the stated period.</li>
      </ul>

      <h2>Payments</h2>
      <p>
        Prices are listed in Indian Rupees. Payments are arranged directly with
        you after we connect — there is no online checkout on this website.
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
