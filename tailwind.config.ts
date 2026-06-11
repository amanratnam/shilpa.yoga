import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#1F3D2E",
          cream: "#F7F4ED",
          white: "#FFFFFF",
          gold: "#C9A961",
          ink: "#1A1A1A",
          stone: "#6B6258",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Editorial poster display — used for stacked hero headings
        display: [
          "clamp(3.5rem, 8vw, 7rem)",
          { lineHeight: "0.95", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h1: [
          "clamp(2.5rem, 5vw, 4rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h2: [
          "clamp(2rem, 3.5vw, 3rem)",
          { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "600" },
        ],
        h3: ["1.5rem", { lineHeight: "1.2", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.3", fontWeight: "500" }],
        body: ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        eyebrow: [
          "0.75rem",
          { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "500" },
        ],
      },
      maxWidth: {
        content: "1280px",
      },
      spacing: {
        // Section vertical rhythm
        section: "6rem",
        "section-sm": "3rem",
      },
      borderRadius: {
        // Institutional, near-square corners only
        brand: "0.25rem",
      },
      keyframes: {
        "fade-rise": {
          "0%": { opacity: "0", transform: "translateY(1.5rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Slow inhale/exhale for the yoga figures
        breathe: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-5px) scale(1.025)" },
        },
        // Gentle balance sway (tree pose)
        sway: {
          "0%, 100%": { transform: "rotate(-1.75deg)" },
          "50%": { transform: "rotate(1.75deg)" },
        },
        // Expanding breath ring, like a meditation cue
        "ring-breathe": {
          "0%": { transform: "scale(0.7)", opacity: "0" },
          "35%": { opacity: "0.5" },
          "100%": { transform: "scale(1.3)", opacity: "0" },
        },
        // Ambient glow blobs drifting in the backdrop
        "glow-drift": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)", opacity: "0.6" },
          "50%": { transform: "translate3d(2rem, -1.5rem, 0) scale(1.1)", opacity: "1" },
        },
        // Anatomical joint markers glowing along a limb chain
        "joint-pulse": {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
        // Weightless gold dust rising through the hero
        "dust-float": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "12%": { opacity: "var(--dust-opacity, 0.5)" },
          "88%": { opacity: "var(--dust-opacity, 0.5)" },
          "100%": { transform: "translateY(-45vh)", opacity: "0" },
        },
      },
      animation: {
        "fade-rise": "fade-rise 0.6s ease-out both",
        breathe: "breathe 5.5s ease-in-out infinite",
        sway: "sway 7s ease-in-out infinite",
        "ring-breathe": "ring-breathe 7s ease-out infinite",
        "glow-drift": "glow-drift 16s ease-in-out infinite",
        "joint-pulse": "joint-pulse 2.4s ease-in-out infinite",
        "dust-float": "dust-float 9s linear infinite",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      typography: {
        brand: {
          css: {
            "--tw-prose-body": "#6B6258",
            "--tw-prose-headings": "#1A1A1A",
            "--tw-prose-lead": "#6B6258",
            "--tw-prose-links": "#1F3D2E",
            "--tw-prose-bold": "#1A1A1A",
            "--tw-prose-counters": "#C9A961",
            "--tw-prose-bullets": "#C9A961",
            "--tw-prose-hr": "rgba(26,26,26,0.1)",
            "--tw-prose-quotes": "#1A1A1A",
            "--tw-prose-quote-borders": "#C9A961",
            "--tw-prose-captions": "#6B6258",
            "--tw-prose-code": "#1A1A1A",
            "--tw-prose-pre-bg": "#1F3D2E",
            "--tw-prose-pre-code": "#F7F4ED",
            "--tw-prose-th-borders": "rgba(26,26,26,0.2)",
            "--tw-prose-td-borders": "rgba(26,26,26,0.1)",
            maxWidth: "70ch",
            a: {
              textUnderlineOffset: "0.25em",
              fontWeight: "500",
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
