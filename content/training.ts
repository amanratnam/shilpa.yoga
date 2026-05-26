import type { Feature } from "@/components/sections/FeatureGrid";
import type { Plan } from "@/components/sections/PricingTable";
import type { AccordionItem } from "@/components/ui/Accordion";

// Placeholder copy, dates and pricing — confirm with the client before launch.

export const trainingIntro = {
  eyebrow: "The training",
  title: "Learn to teach yoga properly — body first",
  caption: "Anatomy study during a training module.",
  paragraphs: [
    "This is not a weekend certificate. It's a considered, small-cohort training that takes the body seriously: functional anatomy, real philosophy, and enough supervised teaching that you graduate genuinely ready to lead a room.",
    "It's built for the kind of teacher I wish more students could find — one who understands why a posture helps or harms, who can adapt for the person in front of them, and who teaches from understanding rather than imitation.",
    "Training follows the standards of Yoga Alliance USA in substance, not just on paper. You'll work hard, and you'll leave able to do this well.",
  ],
};

export const curriculum: Feature[] = [
  {
    title: "Functional anatomy",
    body: "Joints, muscles, fascia and the breath — how the body actually moves, where it's vulnerable, and how to keep every student safe.",
  },
  {
    title: "Philosophy & theory",
    body: "Yoga's roots, key texts and ethics — the why beneath the practice, taught with depth and without dogma.",
  },
  {
    title: "Teaching methodology",
    body: "Sequencing, cueing, demonstration, and confident hands-on and hands-off adjustments. The craft of holding a room.",
  },
  {
    title: "Practicum & assessment",
    body: "Supervised teaching hours, honest feedback, and a real assessment — so the certificate means something.",
  },
];

export const trainingDifference: Feature[] = [
  {
    title: "Anatomy at the centre",
    body: "Most trainings bolt anatomy on. Here it's the spine of the whole course — because safe, intelligent teaching depends on it.",
  },
  {
    title: "Small cohort",
    body: "Places are limited so every trainee is mentored closely, gets real teaching time, and is actually known.",
  },
  {
    title: "Genuinely Yoga Alliance aligned",
    body: "Structured to the substance of Yoga Alliance USA standards — hours, content and assessment that hold up.",
  },
];

export const trainingFormat: Feature[] = [
  { title: "200 hours", body: "A complete foundational training, paced to be absorbed rather than rushed." },
  { title: "Small cohort", body: "Roughly a dozen trainees, so mentoring stays personal throughout." },
  { title: "Hybrid format", body: "Live online study combined with in-person intensives in Gurgaon." },
  { title: "Certificate", body: "Awarded on completing the hours, practicum and assessment." },
];

export const trainingPlans: Plan[] = [
  {
    name: "Application + Deposit",
    price: "₹10,000",
    description: "Secures your seat. Adjusted against full tuition.",
    features: ["Reserves your place in the cohort", "Fully adjusted against tuition", "Refundable if you're not selected"],
    cta: {
      type: "pay",
      label: "Pay deposit & apply",
      amountInPaise: 1000000,
      payLabel: "Teacher Training — Application Deposit",
    },
  },
  {
    name: "Full Tuition",
    price: "₹45,000",
    description: "The complete 200-hour training.",
    featured: true,
    features: [
      "All curriculum & contact hours",
      "Course manual & anatomy materials",
      "Supervised practicum & assessment",
      "Certificate on completion",
    ],
    cta: { type: "link", label: "Apply to enrol", href: "#enquire" },
  },
  {
    name: "In installments",
    price: "₹48,000",
    cadence: "/ 3 parts",
    description: "Spread tuition across the training.",
    features: ["Three scheduled payments", "Same complete training", "Arranged on enrolment"],
    cta: { type: "link", label: "Enquire about plans", href: "#enquire" },
  },
];

export const trainingFaqs: AccordionItem[] = [
  {
    question: "Do I need to be an advanced practitioner?",
    answer:
      "No. You need a steady personal practice and genuine commitment — not advanced postures. We'll discuss your readiness when you apply.",
  },
  {
    question: "Will I be certified to teach?",
    answer:
      "Yes. On completing the hours, practicum and assessment you receive a 200-hour certificate, structured to the substance of Yoga Alliance USA standards.",
  },
  {
    question: "What's the time commitment?",
    answer:
      "Plan for regular weekly study plus the in-person intensives, across the length of the course. Exact dates are shared with each cohort.",
  },
  {
    question: "When does the next cohort start?",
    answer:
      "Cohorts are kept small and run a few times a year. Enquire and I'll tell you the next start date and whether places remain.",
  },
  {
    question: "Is the deposit refundable?",
    answer:
      "The deposit is refundable if you aren't offered a place. Once you accept a seat, it's adjusted against your tuition.",
  },
];
