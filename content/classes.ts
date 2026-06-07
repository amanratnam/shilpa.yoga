import { images } from "@/content/images";
import type { ServicePageContent } from "@/components/sections/ServicePage";

// Copy and pricing confirmed with the client (May 2026).

export const onlineVinyasaContent: ServicePageContent = {
  hero: {
    eyebrow: "Online · Worldwide",
    title: "Live online yoga, wherever you are",
    subtitle:
      "Small, breath-led group classes you join over video from any timezone, sequenced around the body, taught live, never a recording.",
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
      "Each class is taught live, in a small group, so I can see you and offer alternatives in the moment. You move with your breath, at your edge, never pushed past it.",
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
        body: "From Delhi to Dubai to Denver, if you have a mat and a screen, you can join. Timings work across common timezones.",
      },
    ],
  },
  expect: {
    eyebrow: "What to expect",
    title: "How a class runs",
    items: [
      {
        title: "Check-in & context",
        body: "We start with a quick check-in on how your body is feeling today, then I'll set the context for the class, whether it's a Vinyasa flow, an Ashtanga sequence, specific asanas, or a mix of all three.",
      },
      {
        title: "Practice together",
        body: "The heart of the class: around 40 to 45 minutes of guided practice, with clear cues, options offered throughout, and no rush.",
      },
      {
        title: "Check-in & questions",
        body: "We close the last five minutes with a short check-in and time for any questions, so you leave clear about what you practised and why.",
      },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Begin your practice",
    intro: "Start with an introductory class to feel how I teach, then settle into a steady monthly rhythm.",
    plans: [
      {
        name: "Trial Class",
        price: "₹199",
        cadence: "/ session",
        description: "Your first class, book a time directly.",
        features: [
          "A full live introductory class",
          "Understanding of yoga and how I teach",
          "Honest guidance on where to begin",
        ],
        cta: {
          label: "Book a Trial Session",
          href: "https://calendly.com/namaste-shilpa/yoga-course-trial",
        },
      },
      {
        name: "Monthly Fees",
        price: "₹2,000",
        cadence: "/ month",
        description: "A consistent practice, woven into your week.",
        featured: true,
        features: [
          "All live classes through the month",
          "Small group, with real, personal attention",
          "A practice that progresses week to week",
          "Timings to suit your schedule",
        ],
        cta: { label: "Enquire to Book", href: "#enquire" },
      },
    ],
    note: "All online classes are conducted live on Zoom or Google Meet and are not recorded. Payments are handled directly after a quick connect, so I can understand your needs and tailor the best offering for you.",
  },
  faqs: [
    {
      question: "What do I need to join?",
      answer:
        "A mat, a little floor space, and a device with a camera so I can see and adjust you. A quiet corner helps, but isn't essential.",
    },
    {
      question: "I'm a complete beginner, is that okay?",
      answer:
        "Completely. Classes are kept small precisely so beginners get real attention. We build foundations before anything advanced.",
    },
    {
      question: "What if I miss a class?",
      answer:
        "Classes are live only, that's where the real adjustments happen. With the monthly plan you can simply join another class that week, so a busy day never sets you back.",
    },
    {
      question: "Which timezones do classes suit?",
      answer:
        "Timings are set to work across India, the Gulf, Europe and the US east coast. Tell me where you are and I'll point you to the best slots.",
    },
  ],
  enquiry: {
    title: "Have a question before you book?",
    subtitle:
      "Trial sessions can be booked directly above. For anything else, tell me your experience level and any injuries to work around, and I'll get back to you.",
    interest: "online",
  },
};

export const personalGurgaonContent: ServicePageContent = {
  hero: {
    eyebrow: "In person · Gurgaon",
    title: "Personal yoga, shaped entirely around you",
    subtitle:
      "One-to-one sessions in your own home across Gurgaon, for a specific goal, an injury, or simply a steadier daily practice.",
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
      "Private sessions are the fastest, safest way to progress. Every minute is about your body, your patterns, your history, the postures that will actually help.",
      "I come to you across Gurgaon, or we meet at a calm studio space. Mornings, evenings and weekends are available.",
      "Recovering from injury, preparing for something specific, or just want a practice that finally fits your life? We build it together, session by session.",
    ],
  },
  whoFor: {
    eyebrow: "Who it's for",
    title: "When one-to-one makes the difference",
    items: [
      {
        title: "Working with an injury",
        body: "Back, knees, shoulders, post-surgery recovery, we adapt carefully and rebuild with confidence.",
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
        body: "We start with your history, movement and goals, so the plan is built on your reality, not a template.",
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
    intro: "Begin with a trial session at home, then settle into a steady monthly rhythm.",
    plans: [
      {
        name: "Trial Session",
        price: "₹499",
        cadence: "/ session",
        description: "A one-to-one trial, in the comfort of your home.",
        features: [
          "A full private session",
          "I travel to your home",
          "Built entirely around your body",
        ],
        cta: { label: "Enquire to Book", href: "#enquire" },
      },
      {
        name: "Monthly",
        price: "₹2,000",
        cadence: "/ month",
        description: "A consistent, personalised practice.",
        featured: true,
        features: [
          "Around 12 to 16 sessions a month",
          "Flexible scheduling around your availability",
          "A progressing, personalised plan",
          "WhatsApp check-ins between sessions",
        ],
        cta: { label: "Enquire to Book", href: "#enquire" },
      },
    ],
    note: "For personal classes, travel is limited to Gurgaon. The final payment schedule is finalised after our first connect, where we decide on the best fitness plan for you.",
  },
  faqs: [
    {
      question: "Which areas do you cover?",
      answer:
        "I travel across Gurgaon for personal sessions. Tell me your location and I'll confirm.",
    },
    {
      question: "Do I need any equipment?",
      answer:
        "Just a little clear floor space. I bring guidance and any props we need; a mat of your own is helpful but not essential to start.",
    },
    {
      question: "Can you work around an injury?",
      answer:
        "Yes, injury-aware sequencing is central to how I teach. We'll go carefully, and coordinate with your physio or doctor where useful.",
    },
    {
      question: "Can sessions be for two people?",
      answer:
        "Semi-private sessions for two (a partner, a friend, family) are available, just ask when you enquire.",
    },
  ],
  enquiry: {
    title: "Enquire about personal sessions",
    subtitle:
      "Share your location, goals and any injuries. I'll suggest a first session time that works for you.",
    interest: "personal",
  },
};
