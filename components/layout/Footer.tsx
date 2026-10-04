import Link from "next/link";
import { siteConfig, footerNav, legalNav } from "@/lib/site";
import { Logo } from "@/components/layout/Logo";
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/ui/icons";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = /^https?:/.test(href);
  const className =
    "inline-block py-1 text-small text-brand-cream/75 transition-colors hover:text-brand-gold";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

const socials = [
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "YouTube", href: siteConfig.social.youtube, Icon: YouTubeIcon },
  { label: "WhatsApp", href: siteConfig.contact.whatsapp, Icon: WhatsAppIcon },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-green text-brand-cream on-dark">
      <div className="container-content py-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_2fr] lg:gap-12">
          <div className="flex flex-col gap-4">
            <Logo tone="dark" />
            <p className="max-w-xs text-small text-brand-cream/75">
              Anatomy-based yoga with a certified teacher, live online worldwide
              and one-to-one across Gurgaon and Delhi NCR.
            </p>
            <div className="-ml-2 flex items-center">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  // 40px hit area around a 20px glyph.
                  className="grid h-10 w-10 place-items-center text-brand-cream/75 transition-colors hover:text-brand-gold"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Two columns on phones keeps the labels on one line; three once
              there is room. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
            {footerNav.map((col) => (
              <div key={col.title} className="flex flex-col gap-2">
                <p className="text-eyebrow uppercase tracking-[0.1em] text-brand-gold">
                  {col.title}
                </p>
                <ul className="flex flex-col">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-brand-cream/15 pt-5 md:flex-row md:items-center md:justify-between">
          <p className="text-small text-brand-cream/60">
            © {year} {siteConfig.name}. {siteConfig.teacher.location}.
          </p>
          <div className="flex flex-wrap items-center gap-x-5">
            {legalNav.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
