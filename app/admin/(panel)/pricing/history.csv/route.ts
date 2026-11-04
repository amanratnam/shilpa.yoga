import { getPricingHistory } from "@/lib/pricing/history";

/** RFC 4180 quoting: wrap every cell, double any quotes inside it. */
const cell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

/**
 * The pricing activity log as a spreadsheet, one row per changed field, for
 * keeping alongside the books. `getPricingHistory` checks the session.
 */
export async function GET() {
  const history = await getPricingHistory();

  const lines = [
    ["Version", "Published at (UTC)", "Published by", "Field", "Before", "After"].map(cell).join(","),
  ];
  for (const v of history) {
    const rows =
      v.changes.length === 0
        ? [{ field: v.initial ? "First publish, defaults unchanged" : "Republished with no changes", from: "", to: "" }]
        : v.changes.map((c) => (v.initial ? { ...c, field: `${c.field} (vs defaults)` } : c));
    for (const c of rows) {
      lines.push(
        [v.version, v.publishedAt, v.publishedBy, c.field, c.from, c.to].map(cell).join(","),
      );
    }
  }

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pricing-history-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
