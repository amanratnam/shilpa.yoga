import { images } from "@/content/images";
import type { ServicePageContent } from "@/components/sections/ServicePage";
import { onlineVinyasaContent, personalGurgaonContent } from "@/content/classes";

// SEO landing pages, share components with the service pages, own search-intent copy.

export const yogaClassesGurgaon: ServicePageContent = {
  hero: {
    eyebrow: "Yoga classes in Gurgaon",
    title: "Yoga classes in Gurgaon, taught around your body",
    subtitle:
      "Personal and small-group yoga across Gurgaon and Delhi NCR, anatomy-led, injury-aware, and led by a Yoga Alliance USA Registered Yoga Teacher.",
    image: images.personalHero,
    actions: [
      { label: "Book a session", href: "#enquire" },
      { label: "See pricing", href: "#pricing", variant: "secondary" },
    ],
  },
  intro: {
    eyebrow: "Local to Gurgaon",
    title: "A Gurgaon yoga teacher who teaches the why",
    image: images.servicePersonal,
    imageSide: "right",
    caption: "A personal session in Gurgaon.",
    paragraphs: [
      "Looking for yoga classes in Gurgaon that go beyond following along? I teach one-to-one and in small groups across Gurgaon and the wider Delhi NCR, building each practice around your body, your goals and any injuries.",
      "Sessions happen at your home, your society's space, or a quiet studio, whatever suits your week. Mornings, evenings and weekends are available.",
      "Whether you're brand new or returning after a break, you'll learn to practise safely and intelligently, with real attention you won't find in a crowded class.",
    ],
  },
  whoFor: {
    eyebrow: "Who it's for",
    title: "Yoga in Gurgaon for every kind of body",
    items: [
      {
        title: "Busy professionals",
        body: "Flexible timings around Gurgaon work schedules, practise before the day starts or to unwind after it.",
      },
      {
        title: "Recovering from injury",
        body: "Careful, injury-aware sequencing for backs, knees, shoulders and post-surgery rebuilding.",
      },
      {
        title: "Complete beginners",
        body: "Start from the very beginning with foundations taught properly, close to home.",
      },
    ],
  },
  expect: {
    eyebrow: "What to expect",
    title: "How sessions in Gurgaon work",
    items: [
      {
        title: "We meet where you are",
        body: "At home, your society, or a studio across Gurgaon and Delhi NCR, and at a time that fits.",
      },
      {
        title: "A practice built for you",
        body: "Assessment first, then a personalised, progressing plan with a sustainable home practice.",
      },
      {
        title: "Ongoing support",
        body: "WhatsApp check-ins between sessions so your practice keeps moving forward.",
      },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Gurgaon session options",
    intro: "Travel within Gurgaon is included; wider Delhi NCR by arrangement.",
    plans: personalGurgaonContent.pricing.plans,
    note: personalGurgaonContent.pricing.note,
  },
  faqs: [
    {
      question: "Which parts of Gurgaon and Delhi NCR do you cover?",
      answer:
        "All of Gurgaon, and the wider Delhi NCR by arrangement. Share your location when you enquire and I'll confirm.",
    },
    ...personalGurgaonContent.faqs.slice(1),
  ],
  enquiry: {
    title: "Book yoga classes in Gurgaon",
    subtitle:
      "Tell me your location, goals and any injuries. I'll suggest a first session time that works for you.",
    interest: "personal",
  },
};

export const onlineYogaIndia: ServicePageContent = {
  hero: {
    eyebrow: "Online yoga classes · India",
    title: "Online yoga classes for India and beyond",
    subtitle:
      "Live, small-group Vinyasa you can join from anywhere in India, sequenced around the body, taught live by a Yoga Alliance USA RYT.",
    image: images.onlineHero,
    actions: [
      { label: "Book a free trial", href: "#enquire" },
      { label: "See pricing", href: "#pricing", variant: "secondary" },
    ],
  },
  intro: {
    eyebrow: "From your home, anywhere in India",
    title: "Live online yoga, not a recording on loop",
    image: images.serviceOnline,
    imageSide: "left",
    caption: "A live online class in progress.",
    paragraphs: [
      "Searching for online yoga classes in India that actually progress? These are live, small-group sessions over video, so I can see you, adjust you, and offer alternatives in the moment.",
      "Join from Delhi, Mumbai, Bengaluru, a smaller town, or abroad. All you need is a mat, a little space and a screen. Class timings are set to suit Indian and nearby timezones.",
      "Because classes are live and interactive, you get adjustments and attention in real time, never a one-way recording.",
    ],
  },
  whoFor: {
    eyebrow: "Who it's for",
    title: "Online classes built for real schedules",
    items: [
      {
        title: "Anywhere in India",
        body: "No commute, no studio nearby required, practise from home with a teacher who actually sees you.",
      },
      {
        title: "Returning practitioners",
        body: "Classes that progress intelligently, with the attention an app simply can't offer.",
      },
      {
        title: "Beginners welcome",
        body: "Learn the foundations carefully, with the why behind each posture, from your own space.",
      },
    ],
  },
  expect: {
    eyebrow: "What to expect",
    title: "How an online class runs",
    items: onlineVinyasaContent.expect.items,
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Ways to join online",
    intro: "Start with a free trial, then choose what fits. No lock-in.",
    plans: onlineVinyasaContent.pricing.plans,
    note: onlineVinyasaContent.pricing.note,
  },
  faqs: onlineVinyasaContent.faqs,
  enquiry: {
    title: "Book your free online trial class",
    subtitle:
      "Tell me where you are and your experience level. I'll reply with class times that suit your timezone.",
    interest: "online",
  },
};
