import { images } from "@/content/images";
import type { ServicePageContent } from "@/components/sections/ServicePage";

// Copy and pricing confirmed with the client (May 2026).

export const onlineVinyasaContent: ServicePageContent = {
  hero: {
    eyebrow: "Online · Worldwide",
    title: "Live online Vinyasa, wherever you are",
    subtitle:
      "Small, breath-led group classes you join over video from any timezone — sequenced around the body, taught live, never a recording.",
    image: images.onlineHero,
    actions: [
      { label: "Enquire to Book", href: "#enquire" },
      { label: "See pricing", href: "#pricing", variant: "secondary" },
    ],
  },
  intro: {
    eyebrow: "The class",
    title: "A real class, not a video on loop",
    image: images.serviceOnline,
    imageSide: "right",
    caption: "A live online session in progress.",
    paragraphs: [
      "Each class is taught live, in a small group, so I can see you and offer alternatives in the moment. You move with your breath, at your edge — never pushed past it.",
      "Sequences are built intelligently: a clear arc, sensible progressions, and modifications for tight shoulders, sensitive knees, or whatever your body brings that day.",
      "Because classes are live and interactive, you get the adjustments and attention a recording can never give you.",
    ],
  },
  whoFor: {
    eyebrow: "Who it's for",
    title: "Built for real bodies and real schedules",
    items: [
      {
        title: "Returning practitioners",
        body: "You've done yoga before and want classes that actually progress, with attention you can't get from an app.",
      },
      {
        title: "Beginners who want it done right",
        body: "New to yoga and wary of getting hurt? You'll learn foundations carefully, with the why behind each shape.",
      },
      {
        title: "Anyone, anywhere",
        body: "From Delhi to Dubai to Denver — if you have a mat and a screen, you can join. Timings work across common timezones.",
      },
    ],
  },
  expect: {
    eyebrow: "What to expect",
    title: "How a class runs",
    items: [
      {
        title: "Arrive & settle",
        body: "We open with breath and a short check-in so I know what your body needs today.",
      },
      {
        title: "Move with intention",
        body: "A warm, progressive Vinyasa flow with clear cues, options offered throughout, and no rush.",
      },
      {
        title: "Rest & integrate",
        body: "We close with stillness, so you leave steadier and clearer than you arrived.",
      },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Ways to join",
    intro: "Start with a free trial, then choose what fits. No lock-in, cancel anytime.",
    plans: [
      {
        name: "Trial Class",
        price: "Free",
        description: "One class, no commitment — see if we're a fit.",
        features: [
          "A full live class",
          "A modification or two for your body",
          "Honest guidance on where to begin",
        ],
        cta: { label: "Enquire to Book", href: "#enquire" },
      },
      {
        name: "Monthly Unlimited",
        price: "₹2,500",
        cadence: "/ month",
        description: "The steady-practice option.",
        featured: true,
        features: [
          "All live classes in the month",
          "Small group, real attention",
          "Priority on timing requests",
          "Cancel anytime",
        ],
        cta: { label: "Enquire to Book", href: "#enquire" },
      },
    ],
    note: "Classes are live and interactive — no recordings. Payments are arranged after we connect.",
  },
  faqs: [
    {
      question: "What do I need to join?",
      answer:
        "A mat, a little floor space, and a device with a camera so I can see and adjust you. A quiet corner helps, but isn't essential.",
    },
    {
      question: "I'm a complete beginner — is that okay?",
      answer:
        "Completely. Classes are kept small precisely so beginners get real attention. We build foundations before anything advanced.",
    },
    {
      question: "What if I miss a class?",
      answer:
        "Classes are live only — that's where the real adjustments happen. With the monthly plan you can simply join another class that week, so a busy day never sets you back.",
    },
    {
      question: "Which timezones do classes suit?",
      answer:
        "Timings are set to work across India, the Gulf, Europe and the US east coast. Tell me where you are and I'll point you to the best slots.",
    },
  ],
  enquiry: {
    title: "Book your free trial class",
    subtitle:
      "Tell me your experience level and any injuries to work around. I'll reply with the next suitable class times.",
    interest: "online",
  },
};

export const personalGurgaonContent: ServicePageContent = {
  hero: {
    eyebrow: "In person · Gurgaon & Delhi NCR",
    title: "Personal yoga, shaped entirely around you",
    subtitle:
      "One-to-one sessions in your home or a quiet studio across Gurgaon and Delhi NCR — for a specific goal, an injury, or simply a steadier daily practice.",
    image: images.personalHero,
    actions: [
      { label: "Enquire to Book", href: "#enquire" },
      { label: "See pricing", href: "#pricing", variant: "secondary" },
    ],
  },
  intro: {
    eyebrow: "The sessions",
    title: "Undivided attention, in your space",
    image: images.servicePersonal,
    imageSide: "left",
    caption: "A private session in Gurgaon.",
    paragraphs: [
      "Private sessions are the fastest, safest way to progress. Every minute is about your body — your patterns, your history, the postures that will actually help.",
      "I come to you across Gurgaon and the wider Delhi NCR, or we meet at a calm studio space. Mornings, evenings and weekends are available.",
      "Recovering from injury, preparing for something specific, or just want a practice that finally fits your life? We build it together, session by session.",
    ],
  },
  whoFor: {
    eyebrow: "Who it's for",
    title: "When one-to-one makes the difference",
    items: [
      {
        title: "Working with an injury",
        body: "Back, knees, shoulders, post-surgery recovery — we adapt carefully and rebuild with confidence.",
      },
      {
        title: "Specific goals",
        body: "A particular posture, better mobility, prenatal support, or steadiness before a big life event.",
      },
      {
        title: "Privacy & pace",
        body: "You'd simply rather practice without a room of strangers, entirely at your own pace.",
      },
    ],
  },
  expect: {
    eyebrow: "What to expect",
    title: "How we work together",
    items: [
      {
        title: "Assessment",
        body: "We start with your history, movement and goals — so the plan is built on your reality, not a template.",
      },
      {
        title: "A practice that's yours",
        body: "Sessions progress with you, with a short home practice you can actually sustain between visits.",
      },
      {
        title: "Ongoing adjustment",
        body: "As your body changes, the practice changes. Nothing is fixed; everything is responsive.",
      },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Session options",
    intro: "Travel within Gurgaon is included; wider Delhi NCR by arrangement.",
    plans: [
      {
        name: "Single Session",
        price: "₹1,000",
        cadence: "/ session",
        description: "A one-hour private session, whenever you need it.",
        features: [
          "One hour, one-to-one",
          "Built entirely around your body",
          "Book ad-hoc, no commitment",
        ],
        cta: { label: "Enquire to Book", href: "#enquire" },
      },
      {
        name: "Monthly",
        price: "₹3,000",
        cadence: "/ month",
        description: "Twice a week — the way real change happens.",
        featured: true,
        features: [
          "8 sessions a month (2 per week)",
          "A progressing, personalised plan",
          "WhatsApp check-ins between sessions",
          "Priority scheduling",
        ],
        cta: { label: "Enquire to Book", href: "#enquire" },
      },
    ],
    note: "Travel within Gurgaon is included. Payments are arranged after we connect.",
  },
  faqs: [
    {
      question: "Which areas do you cover?",
      answer:
        "All of Gurgaon, and the wider Delhi NCR by arrangement. Tell me your location and I'll confirm travel.",
    },
    {
      question: "Do I need any equipment?",
      answer:
        "Just a little clear floor space. I bring guidance and any props we need; a mat of your own is helpful but not essential to start.",
    },
    {
      question: "Can you work around an injury?",
      answer:
        "Yes — injury-aware sequencing is central to how I teach. We'll go carefully, and coordinate with your physio or doctor where useful.",
    },
    {
      question: "Can sessions be for two people?",
      answer:
        "Semi-private sessions for two (a partner, a friend, family) are available — just ask when you enquire.",
    },
  ],
  enquiry: {
    title: "Enquire about personal sessions",
    subtitle:
      "Share your location, goals and any injuries. I'll suggest a first session time that works for you.",
    interest: "personal",
  },
};
