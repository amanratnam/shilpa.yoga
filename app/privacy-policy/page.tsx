import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Shilpa Yoga Space collects, uses and protects the information of students taking online and in-person yoga classes.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="May 2026">
      <p>
        Your privacy matters. This policy explains what information Shilpa Yoga
        Space collects when you enquire about or attend classes, and how it is
        used. We keep this simple and collect only what we need to teach you well.
      </p>

      <h2>What we collect</h2>
      <p>
        When you use the contact form or message us, you choose what to share.
        Typically this includes:
      </p>
      <ul>
        <li>your name, email, and optionally a phone or WhatsApp number;</li>
        <li>your country, and the class or session you are interested in;</li>
        <li>
          any notes you add, such as your experience, goals, or injuries and
          health conditions relevant to practising safely.
        </li>
      </ul>

      <h2>How we use it</h2>
      <p>We use your information only to:</p>
      <ul>
        <li>reply to your enquiry and arrange classes or sessions;</li>
        <li>teach you safely, including adapting practice around any injuries or pregnancy you tell us about;</li>
        <li>send information you have asked for, such as class timings.</li>
      </ul>
      <p>We do not sell or rent your personal information to anyone.</p>

      <h2>Health information</h2>
      <p>
        If you share details about injuries, medical conditions, or pregnancy, we
        use them solely to keep your practice safe and appropriate. They are kept
        confidential.
      </p>

      <h2>How your enquiry reaches us</h2>
      <p>
        The contact form sends your message to us by email using Resend, our
        email delivery provider. We do not collect payments on this website, so
        no card or banking details are entered or stored here. Any class fees are
        arranged directly with you.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry and student information only as long as needed to teach
        you and to respond to follow-up questions. You can ask us to delete it at
        any time.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct, or delete the information we hold about
        you at any time by writing to{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>

      <h2>Cookies</h2>
      <p>
        This website does not use advertising or tracking cookies. Any cookies
        present are limited to what is needed for the site to function.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>
    </LegalLayout>
  );
}
