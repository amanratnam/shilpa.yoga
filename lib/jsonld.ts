import { siteConfig } from "@/lib/site";
import { images } from "@/content/images";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": `${siteConfig.url}#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  image: `${siteConfig.url}${images.ogDefault.src}`,
  email: siteConfig.contact.email,
  areaServed: ["Gurgaon", "Delhi NCR", "India", "Worldwide (online)"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Gurgaon",
    addressRegion: "Haryana",
    addressCountry: "IN",
  },
  founder: {
    "@type": "Person",
    name: siteConfig.teacher.name,
    jobTitle: "Registered Yoga Teacher (RYT 200, Yoga Alliance USA)",
  },
  sameAs: [siteConfig.social.instagram],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  publisher: { "@id": `${siteConfig.url}#organization` },
  inLanguage: "en",
};

export const teacherTrainingCourseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "200-Hour Yoga Teacher Training",
  description:
    "A small-cohort 200-hour yoga teacher training grounded in functional anatomy, philosophy and supervised practicum, aligned with Yoga Alliance USA standards.",
  provider: {
    "@type": "Organization",
    name: siteConfig.name,
    sameAs: siteConfig.url,
  },
  url: `${siteConfig.url}/teacher-training`,
};
