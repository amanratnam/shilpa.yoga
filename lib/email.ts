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

export type EnquiryEmailData = {
  name: string;
  email: string;
  phone?: string;
  country: string;
  course: string;
  category?: string;
  notes?: string;
};

/** Branded, inline-styled HTML email for a new enquiry. */
export function enquiryEmailHtml(d: EnquiryEmailData) {
  const e = escapeHtml;
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #ECE7DA;color:#6B6258;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;width:38%;vertical-align:top;">${label}</td>
      <td style="padding:12px 0;border-bottom:1px solid #ECE7DA;color:#1A1A1A;font-size:15px;vertical-align:top;">${value}</td>
    </tr>`;

  const rows = [
    row("Name", e(d.name)),
    row("Email", `<a href="mailto:${e(d.email)}" style="color:#1F3D2E;">${e(d.email)}</a>`),
    d.phone ? row("Phone / WhatsApp", e(d.phone)) : "",
    row("Country", e(d.country)),
    row("Course", e(d.course)),
    d.category ? row("Category", e(d.category)) : "",
  ].join("");

  const notes = d.notes
    ? `<div style="margin-top:8px;">
         <p style="margin:0 0 8px;color:#6B6258;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;">Notes / remarks</p>
         <div style="background:#F7F4ED;border-left:3px solid #C9A961;border-radius:4px;padding:14px 16px;color:#1A1A1A;font-size:15px;line-height:1.6;">${e(d.notes).replace(/\n/g, "<br/>")}</div>
       </div>`
    : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F7F4ED;font-family:'Outfit',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4ED;padding:28px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:8px;overflow:hidden;border:1px solid #ECE7DA;">
          <tr>
            <td style="background:#1F3D2E;padding:26px 28px;">
              <p style="margin:0;color:#C9A961;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;">Shilpa Yoga Space</p>
              <p style="margin:6px 0 0;color:#F7F4ED;font-size:21px;font-weight:600;">New enquiry</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
              ${notes}
              <p style="margin:22px 0 0;color:#6B6258;font-size:13px;line-height:1.6;">
                Reply directly to this email to reach ${e(d.name)}.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#F7F4ED;padding:16px 28px;border-top:1px solid #ECE7DA;">
              <p style="margin:0;color:#6B6258;font-size:12px;">Sent from the contact form at shilpa.yoga</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export function enquiryEmailText(d: EnquiryEmailData) {
  return [
    "New enquiry from shilpa.yoga",
    "",
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    d.phone ? `Phone/WhatsApp: ${d.phone}` : "",
    `Country: ${d.country}`,
    `Course: ${d.course}`,
    d.category ? `Category: ${d.category}` : "",
    d.notes ? `\nNotes:\n${d.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
