// Placeholder marketing copy & figures — confirm all numbers with the client.

export type Stat = { value: string; label: string };

export const homepageStats: Stat[] = [
  { value: "RYT 200", label: "Yoga Alliance USA registered" },
  { value: "8+ yrs", label: "Teaching across studios & online" },
  { value: "600+", label: "Students guided through practice" },
  { value: "Hatha–Vinyasa", label: "Lineage & methodology" },
];

export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Shilpa is the first teacher who explained why a pose was hurting my knee — and changed how I stand in it. My practice finally feels safe.",
    name: "Aarti M.",
    detail: "Online Vinyasa · Berlin",
  },
  {
    quote:
      "The anatomy focus is unlike any class I've taken. I understand my own body now, not just the shapes.",
    name: "Devon R.",
    detail: "Teacher Training graduate",
  },
  {
    quote:
      "Personal sessions rebuilt my confidence after a back injury. Patient, precise, never rushed.",
    name: "Priya S.",
    detail: "Personal Sessions · Gurgaon",
  },
];

export const differentiators: { title: string; body: string }[] = [
  {
    title: "Anatomy first",
    body: "Every sequence is built on how the body actually moves. You learn the why behind each posture, so practice becomes safer and more intelligent — not just a set of shapes to copy.",
  },
  {
    title: "Small by design",
    body: "Classes and cohorts are kept deliberately small so attention stays personal. You are seen, adjusted and met where you are, whether on screen or on the mat beside me.",
  },
  {
    title: "Genuinely Yoga Alliance aligned",
    body: "Training and teaching follow the standards of Yoga Alliance USA in substance, not just on paper — rooted in theory, ethics and a real practicum rather than a quick certificate.",
  },
];

export const philosophy = {
  eyebrow: "The practice",
  heading: "Yoga that respects the body it lives in",
  paragraphs: [
    "I came to teaching the long way — through my own injuries, through anatomy books, through years of asking why a movement helped one body and hurt another. What I found is that yoga works best when it is precise. When the breath leads, when the joints are respected, when intention replaces force.",
    "So that is what I teach. Not a performance of flexibility, but a steady, intelligent practice you can return to for the rest of your life. Whether you join online from another timezone, sit with me one-to-one in Gurgaon, or train to teach, the foundation is the same: move with understanding, and the rest follows.",
  ],
  signature: "— Shilpa",
};
