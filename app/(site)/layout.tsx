import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";

/**
 * Chrome for the public marketing site. The admin panel lives outside this
 * group so it renders without the site navbar and footer.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
