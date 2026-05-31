import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for joining online and in-person yoga classes and personal sessions with Shilpa Yoga Space.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="May 2026">
      <p>
        These terms apply when you join a class, book a personal session, or use
        this website. By booking with Shilpa Yoga Space, you agree to them. If
        anything is unclear, please email{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>{" "}
        before booking.
      </p>

      <h2>Who we are</h2>
      <p>
        Shilpa Yoga Space offers live online yoga classes worldwide, and one-to-one
        and pre/post-natal yoga in person across Gurgaon and Delhi NCR, taught by
        Shilpa, a 500-hour Registered Yoga Teacher with Yoga Alliance USA.
      </p>

      <h2>Booking a class or session</h2>
      <ul>
        <li>
          A class or session is confirmed once we have agreed a time and
          acknowledged your booking by email or WhatsApp.
        </li>
        <li>
          Fees are agreed directly with you. This website does not take online
          payments; there is no checkout here.
        </li>
        <li>Online classes are taught live over video. Recordings are not provided.</li>
        <li>Monthly plans run for the period stated when you join.</li>
      </ul>

      <h2>Health, safety and your responsibility</h2>
      <p>
        Yoga involves physical movement and carries some risk. Before you begin,
        you agree to:
      </p>
      <ul>
        <li>
          tell us about any injuries, medical conditions, surgeries, or if you
          are pregnant or recently postpartum;
        </li>
        <li>
          check with your doctor first if you are unsure whether yoga is suitable
          for you;
        </li>
        <li>practise within your own limits and stop if something hurts.</li>
      </ul>
      <p>
        Guidance offered in class is not medical advice and is not a substitute
        for treatment from a qualified healthcare professional. You take part at
        your own risk, and you are responsible for practising safely in your own
        space.
      </p>

      <h2>Attendance, lateness and rescheduling</h2>
      <ul>
        <li>
          Please arrive on time. For online classes, join with a stable
          connection and enough clear space around you.
        </li>
        <li>
          Personal sessions can be rescheduled with reasonable notice; sessions
          cancelled at short notice may be charged.
        </li>
        <li>
          If I ever need to cancel a session, you will be offered a reschedule or
          a refund for that session.
        </li>
      </ul>

      <h2>Conduct</h2>
      <p>
        Please be respectful of me and of fellow students in group classes.
        Recording, sharing, or reselling classes without permission is not
        allowed.
      </p>

      <h2>Payments and refunds</h2>
      <p>
        Prices are listed in Indian Rupees and arranged directly with you. Please
        see our <a href="/refund-policy">Refund Policy</a> for cancellations and
        refunds.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The date at the top shows
        when they were last revised.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>
    </LegalLayout>
  );
}
