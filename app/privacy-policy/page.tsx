import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Shilpa Yoga Space collects, uses and protects your information.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="May 2026">
      <h2>What we collect</h2>
      <p>
        When you contact us or enquire about classes and sessions, we collect the
        information you choose to share, typically your name, email address,
        phone number and the details of your message.
      </p>

      <h2>How we use it</h2>
      <p>We use your information only to:</p>
      <ul>
        <li>respond to your enquiry and arrange classes or sessions;</li>
        <li>send you information you have asked for.</li>
      </ul>
      <p>We do not sell your personal information to anyone.</p>

      <h2>Payments</h2>
      <p>
        We do not collect payments through this website. Class and session fees
        are arranged directly with you, for example over WhatsApp or email, so
        no card or banking details are entered or stored here.
      </p>

      <h2>Email</h2>
      <p>
        Enquiry emails are delivered using Resend. Your message contents are
        transmitted to us to allow us to reply.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct or delete the personal information we
        hold about you at any time by writing to{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>
    </LegalLayout>
  );
}
