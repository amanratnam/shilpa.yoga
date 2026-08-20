import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The theme renames every font size (text-body, text-small, text-h3…).
 * tailwind-merge can't tell those from text colours, so without this it
 * treated `text-small` and `text-brand-ink` as the same class group and
 * dropped the font size — silently rendering buttons and labels at the
 * inherited size. Registering the scale keeps size and colour independent.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "h1", "h2", "h3", "h4", "body", "small", "eyebrow"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
