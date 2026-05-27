import Link from "next/link";
import { siteConfig, footerNav, legalNav } from "@/lib/site";
import { Logo } from "@/components/layout/Logo";
import { Badge } from "@/components/ui/Badge";
import { InstagramIcon } from "@/components/ui/icons";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = /^https?:/.test(href);
  const className =
    "text-small text-brand-cream/75 transition-colors hover:text-brand-gold";
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

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-green text-brand-cream on-dark">
      <div className="container-content py-section-sm md:py-section">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Logo tone="dark" />
            <p className="max-w-xs text-small text-brand-cream/75">
              Anatomy-based Vinyasa yoga, live online worldwide, and one-to-one in
              person across Gurgaon and Delhi NCR.
            </p>
            <Badge tone="dark">{siteConfig.teacher.credential}</Badge>
          </div>

          {footerNav.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <p className="text-eyebrow uppercase tracking-[0.1em] text-brand-gold">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-brand-cream/15 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-small text-brand-cream/60">
            © {year} {siteConfig.name}. {siteConfig.teacher.location}.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalNav.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-brand-cream/75 transition-colors hover:text-brand-gold"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
