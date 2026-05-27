import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

/** Shared Resend client, or null when no key is configured (e.g. local dev). */
export const resend = apiKey ? new Resend(apiKey) : null;

export const emailConfig = {
  // Verified sender domain on Resend, e.g. "Shilpa Yoga <namaste@shilpa.yoga>".
  from: process.env.RESEND_FROM ?? "Shilpa Yoga Space <namaste@shilpa.yoga>",
  // Where enquiries are delivered (comma-separated env override supported).
  to: (process.env.CONTACT_TO ?? "namaste@shilpa.yoga,aman.ratnam.singh@gmail.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
