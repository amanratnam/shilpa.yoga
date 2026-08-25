import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage } from "pdf-lib";
import { cdnAsset } from "@/content/images";
import { formatINR } from "@/lib/pricing/config";
import { siteConfig } from "@/lib/site";
import { genderLabels, modeLabels, paymentMethodLabels } from "@/lib/admin/enums";
import type { ClientRecord } from "@/lib/admin/clients";
import type { SubscriptionRecord } from "@/lib/admin/subscriptions";

// Brand palette, mirrored from tailwind.config.ts.
const GREEN = rgb(0x1f / 255, 0x3d / 255, 0x2e / 255);
const CREAM = rgb(0xf7 / 255, 0xf4 / 255, 0xed / 255);
const GOLD = rgb(0xc9 / 255, 0xa9 / 255, 0x61 / 255);
const INK = rgb(0x1a / 255, 0x1a / 255, 0x1a / 255);
const STONE = rgb(0x6b / 255, 0x62 / 255, 0x58 / 255);
const WHITE = rgb(1, 1, 1);
const HAIRLINE = rgb(0.87, 0.86, 0.84);

// A4 portrait, in points.
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 56;
const CONTENT_W = PAGE_W - MARGIN * 2;

/** Fetch the brand logo. Returns null so a receipt still renders if it fails. */
async function loadLogo(pdf: PDFDocument): Promise<PDFImage | null> {
  try {
    // The light (white) variant, since it sits on the dark green header band.
    const res = await fetch(cdnAsset("/images/logo/shilpa-logo-light.png"), {
      // The logo effectively never changes; let the runtime cache it.
      cache: "force-cache",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return await pdf.embedPng(await res.arrayBuffer());
  } catch {
    return null;
  }
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * A short, stable, human-quotable receipt number derived from the
 * subscription id, e.g. "SYS-3F2A9C41".
 */
export function receiptNumber(subscriptionId: string): string {
  return `SYS-${subscriptionId.replace(/-/g, "").slice(-8).toUpperCase()}`;
}

export function receiptFilename(client: ClientRecord, sub: SubscriptionRecord): string {
  const name = client.fullName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return `receipt-${name}-${receiptNumber(sub.id)}.pdf`.toLowerCase();
}

type Fonts = { regular: PDFFont; bold: PDFFont };

export async function buildReceiptPdf(
  client: ClientRecord,
  sub: SubscriptionRecord,
  issuedOn: Date,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();

  // Everything printed comes off the subscription record, which snapshots the
  // price as sold — a later price change must never alter an issued receipt.
  const amount = sub.packageAmount;

  pdf.setTitle(`Receipt ${receiptNumber(sub.id)} — ${client.fullName}`);
  pdf.setAuthor(siteConfig.name);
  pdf.setSubject("Yoga subscription receipt");
  pdf.setCreator(siteConfig.name);
  pdf.setProducer(siteConfig.name);

  const page = pdf.addPage([PAGE_W, PAGE_H]);
  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
  };
  const logo = await loadLogo(pdf);

  // Page ground, so the receipt reads as the site's cream paper.
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: CREAM });

  // ---- Header band -------------------------------------------------------
  const headerH = 132;
  page.drawRectangle({
    x: 0,
    y: PAGE_H - headerH,
    width: PAGE_W,
    height: headerH,
    color: GREEN,
  });
  // Gold rule under the band, echoing the site's accent.
  page.drawRectangle({ x: 0, y: PAGE_H - headerH - 3, width: PAGE_W, height: 3, color: GOLD });

  if (logo) {
    const logoW = 165;
    const logoH = (logo.height / logo.width) * logoW;
    page.drawImage(logo, {
      x: MARGIN,
      // Optically centred within the band.
      y: PAGE_H - headerH + (headerH - logoH) / 2,
      width: logoW,
      height: logoH,
    });
  } else {
    // Typographic fallback, matching the site's wordmark.
    page.drawText("Shilpa", {
      x: MARGIN,
      y: PAGE_H - headerH + 62,
      size: 24,
      font: fonts.bold,
      color: CREAM,
    });
    page.drawText("YOGA SPACE", {
      x: MARGIN,
      y: PAGE_H - headerH + 44,
      size: 9,
      font: fonts.regular,
      color: GOLD,
    });
  }

  // Right-aligned receipt meta inside the band.
  const rightEdge = PAGE_W - MARGIN;
  const drawRight = (
    text: string,
    y: number,
    size: number,
    font: PDFFont,
    color = CREAM,
  ) => {
    page.drawText(text, {
      x: rightEdge - font.widthOfTextAtSize(text, size),
      y,
      size,
      font,
      color,
    });
  };
  drawRight("RECEIPT", PAGE_H - headerH + 82, 20, fonts.bold);
  drawRight(receiptNumber(sub.id), PAGE_H - headerH + 62, 10, fonts.regular, GOLD);
  drawRight(
    `Issued ${issuedOn.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
    PAGE_H - headerH + 46,
    9,
    fonts.regular,
  );

  // ---- Body --------------------------------------------------------------
  let y = PAGE_H - headerH - 3 - 46;

  /** Section heading with a hairline beneath it. */
  const sectionHeading = (label: string) => {
    page.drawText(label.toUpperCase(), {
      x: MARGIN,
      y,
      size: 9,
      font: fonts.bold,
      color: STONE,
    });
    y -= 10;
    page.drawRectangle({ x: MARGIN, y, width: CONTENT_W, height: 0.75, color: HAIRLINE });
    y -= 20;
  };

  /** One label/value pair laid out on a two-column grid. */
  const rowH = 30;
  const colW = CONTENT_W / 2;
  /** Gutter between the two columns, so values never touch. */
  const COL_GUTTER = 14;

  /**
   * Shrink a value to fit its column, then truncate as a last resort. Long
   * emails and names would otherwise run off the edge of the page.
   */
  const fit = (text: string, font: PDFFont, maxWidth: number, startSize: number) => {
    let size = startSize;
    while (size > 7.5 && font.widthOfTextAtSize(text, size) > maxWidth) size -= 0.5;
    if (font.widthOfTextAtSize(text, size) <= maxWidth) return { text, size };

    let clipped = text;
    while (clipped.length > 1 && font.widthOfTextAtSize(`${clipped}...`, size) > maxWidth) {
      clipped = clipped.slice(0, -1);
    }
    return { text: `${clipped}...`, size };
  };

  const pair = (label: string, value: string, col: 0 | 1) => {
    const x = MARGIN + col * colW;
    const maxWidth = colW - COL_GUTTER;
    page.drawText(label.toUpperCase(), { x, y, size: 7.5, font: fonts.regular, color: STONE });
    const shown = fit(value || "—", fonts.bold, maxWidth, 11);
    page.drawText(shown.text, {
      x,
      y: y - 13,
      size: shown.size,
      font: fonts.bold,
      color: INK,
    });
  };
  /** Draw a full row of up to two pairs, then advance. */
  const row = (left: [string, string], right?: [string, string]) => {
    pair(left[0], left[1], 0);
    if (right) pair(right[0], right[1], 1);
    y -= rowH;
  };

  sectionHeading("Billed to");
  row(["Full name", client.fullName], ["Gender", genderLabels[client.gender]]);
  row(["Phone number", client.phone], ["Email", client.email]);

  y -= 12;
  sectionHeading("Subscription");
  row(["Yoga mode", modeLabels[sub.yogaMode]], ["Package", sub.packageLabel]);
  row(
    ["Subscription start", formatDate(sub.startDate)],
    ["Subscription end", formatDate(sub.endDate)],
  );
  row(
    ["Total sessions", sub.packageSessions !== null ? `${sub.packageSessions}` : "—"],
    ["Payment mode", paymentMethodLabels[sub.paymentMethod]],
  );

  // ---- Amount panel ------------------------------------------------------
  y -= 14;
  const panelH = 74;
  const panelY = y - panelH + 22;
  page.drawRectangle({
    x: MARGIN,
    y: panelY,
    width: CONTENT_W,
    height: panelH,
    color: sub.paymentDone ? GREEN : WHITE,
    borderColor: sub.paymentDone ? GREEN : GOLD,
    borderWidth: 1,
  });

  const panelLabel = sub.paymentDone ? "AMOUNT RECEIVED" : "AMOUNT DUE";
  const panelTextColor = sub.paymentDone ? CREAM : STONE;
  page.drawText(panelLabel, {
    x: MARGIN + 20,
    y: panelY + panelH - 28,
    size: 8,
    font: fonts.bold,
    color: sub.paymentDone ? GOLD : STONE,
  });
  page.drawText(
    amount !== null ? formatINR(amount).replace("₹", "Rs. ") : "—",
    {
      x: MARGIN + 20,
      y: panelY + 18,
      size: 24,
      font: fonts.bold,
      // Helvetica has no rupee glyph, so "Rs." is used instead of "₹".
      color: sub.paymentDone ? CREAM : INK,
    },
  );

  const statusText = sub.paymentDone ? "PAID" : "PAYMENT PENDING";
  const statusSize = 11;
  page.drawText(statusText, {
    x: rightEdge - 20 - fonts.bold.widthOfTextAtSize(statusText, statusSize),
    y: panelY + 24,
    size: statusSize,
    font: fonts.bold,
    color: panelTextColor,
  });

  y = panelY - 34;

  // ---- Notes -------------------------------------------------------------
  if (sub.notes) {
    sectionHeading("Notes");
    // Wrap by measured width so long notes never overflow the margin.
    const size = 10;
    const lines: string[] = [];
    let line = "";
    for (const word of sub.notes.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (fonts.regular.widthOfTextAtSize(candidate, size) > CONTENT_W) {
        if (line) lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);

    for (const text of lines.slice(0, 6)) {
      page.drawText(text, { x: MARGIN, y, size, font: fonts.regular, color: INK });
      y -= 15;
    }
  }

  // ---- Footer ------------------------------------------------------------
  const footerY = 62;
  page.drawRectangle({ x: MARGIN, y: footerY + 34, width: CONTENT_W, height: 0.75, color: HAIRLINE });
  page.drawText(siteConfig.name, {
    x: MARGIN,
    y: footerY + 16,
    size: 9,
    font: fonts.bold,
    color: GREEN,
  });
  page.drawText(
    `${siteConfig.contact.email}  ·  ${siteConfig.contact.phone}  ·  ${siteConfig.url.replace("https://", "")}`,
    { x: MARGIN, y: footerY + 2, size: 8, font: fonts.regular, color: STONE },
  );
  const thanks = "Thank you for practising with us.";
  page.drawText(thanks, {
    x: rightEdge - fonts.regular.widthOfTextAtSize(thanks, 8),
    y: footerY + 2,
    size: 8,
    font: fonts.regular,
    color: STONE,
  });

  return pdf.save();
}
