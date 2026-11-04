import { listCampaignLeads } from "@/lib/leads/store";
import { leadRows, LEAD_COLUMNS, filterLeads } from "@/lib/leads/table";
import { buildXlsx } from "@/lib/xlsx";

/**
 * Campaign leads as an Excel workbook. Honours the same ?campaign= and ?q=
 * filters as the Leads screen, so "export" gives you what you're looking at.
 * `listCampaignLeads` checks the session.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const leads = filterLeads(await listCampaignLeads(), {
    campaign: url.searchParams.get("campaign") ?? "",
    q: url.searchParams.get("q") ?? "",
  });

  const file = buildXlsx({
    sheetName: "Leads",
    headers: LEAD_COLUMNS.map((c) => c.label),
    widths: LEAD_COLUMNS.map((c) => c.width),
    rows: leadRows(leads),
  });

  const campaign = url.searchParams.get("campaign");
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(file.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="leads-${campaign || "all"}-${stamp}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
