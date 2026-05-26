import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { images } from "@/content/images";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Anatomy-based Vinyasa Yoga`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "yoga",
    "Vinyasa yoga",
    "online yoga classes",
    "yoga teacher training",
    "yoga Gurgaon",
    "Yoga Alliance RYT",
    "anatomy-based yoga",
  ],
  authors: [{ name: siteConfig.teacher.name }],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Anatomy-based Vinyasa Yoga`,
    description: siteConfig.description,
    images: [
      {
        url: images.ogDefault.src,
        width: images.ogDefault.width,
        height: images.ogDefault.height,
        alt: images.ogDefault.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Anatomy-based Vinyasa Yoga`,
    description: siteConfig.description,
    images: [images.ogDefault.src],
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#1F3D2E",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
