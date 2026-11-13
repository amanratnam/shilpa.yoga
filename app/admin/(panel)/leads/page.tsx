import Link from "next/link";
import { Download, ExternalLink, Inbox, Search } from "lucide-react";
import { campaigns } from "@/content/campaigns";
import { listCampaignLeads } from "@/lib/leads/store";
import { LEAD_COLUMNS, campaignLabel, filterLeads, leadRows } from "@/lib/leads/table";
import { DataProblem } from "@/components/admin/DataProblem";
import { EmptyState, PageHeader } from "@/components/admin/PageParts";
import { LeadsFilters } from "@/components/admin/LeadsFilters";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** WhatsApp deep link from whatever format the visitor typed. */
function waLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  // A bare 10-digit number is assumed Indian.
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string; q?: string }>;
}) {
  const { campaign: rawCampaign = "", q = "" } = await searchParams;

  let all;
  try {
    all = await listCampaignLeads();
  } catch (error) {
    return (
      <div>
        <PageHeader title="Leads" description="Enquiries from the festival offer pages." />
        <DataProblem error={error} />
      </div>
    );
  }

  // Every campaign in the config, plus any older slugs still in the data.
  const slugs = [...new Set([...campaigns.map((c) => c.slug), ...all.map((l) => l.campaign)])];
  const campaign = slugs.includes(rawCampaign) ? rawCampaign : "";
  const leads = filterLeads(all, { campaign, q });
  const rows = leadRows(leads);

  const hrefWith = (next: { campaign?: string; q?: string }) => {
    const p = new URLSearchParams();
    const c = next.campaign ?? campaign;
    const query = next.q ?? q;
    if (c) p.set("campaign", c);
    if (query) p.set("q", query);
    const s = p.toString();
    return s ? `?${s}` : "";
  };

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Enquiries from the festival offer pages, newest first."
        actions={
          <a
            href={`/admin/leads/export.xlsx${hrefWith({})}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-brand bg-brand-green px-3.5 text-small font-medium text-brand-cream transition-colors hover:bg-brand-ink"
          >
            <Download className="h-4 w-4" strokeWidth={2} aria-hidden />
            Export to Excel
          </a>
        }
      />

      <div className="mt-6">
        <LeadsFilters
          campaign={campaign}
          q={q}
          options={[
            { value: "", label: "All campaigns", count: all.length },
            ...slugs.map((s) => ({
              value: s,
              label: campaignLabel(s),
              count: all.filter((l) => l.campaign === s).length,
            })),
          ]}
        />
      </div>

      {all.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={<Inbox className="h-8 w-8 text-brand-stone/50" strokeWidth={1.5} aria-hidden />} title="No leads yet">
            Share an offer page, for example{" "}
            <a href="/offer/festive-yoga" target="_blank" className="font-medium text-brand-green underline underline-offset-4">
              /offer/festive-yoga
            </a>
            , and every enquiry will land here.
          </EmptyState>
        </div>
      ) : leads.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={<Search className="h-8 w-8 text-brand-stone/50" strokeWidth={1.5} aria-hidden />} title="No matching leads">
            Try another campaign or search.{" "}
            <Link href="/admin/leads" className="font-medium text-brand-green underline underline-offset-4">
              Clear filters
            </Link>
          </EmptyState>
        </div>
      ) : (
        <>
          <p className="mt-4 text-[0.75rem] text-brand-stone">
            {leads.length} lead{leads.length === 1 ? "" : "s"}
            {campaign ? ` from ${campaignLabel(campaign)}` : ""}
            {q ? ` matching “${q}”` : ""}. Scroll sideways for every column.
          </p>
          {/* Spreadsheet view: gridlines, row numbers, frozen header and name. */}
          <div className="relative mt-2 max-h-[70vh] overflow-auto rounded-brand border border-brand-ink/15 bg-brand-white">
            <table className="min-w-max border-separate border-spacing-0 text-left text-[0.8125rem]">
              <thead>
                <tr>
                  <th className="sticky left-0 top-0 z-30 w-10 border-b border-r border-brand-ink/15 bg-[#EEEAE0] px-2 py-2 text-center font-medium text-brand-stone">
                    #
                  </th>
                  {LEAD_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      style={{ minWidth: `${col.width * 0.5}rem` }}
                      className={cn(
                        "sticky top-0 z-20 whitespace-nowrap border-b border-r border-brand-ink/15 bg-[#EEEAE0] px-3 py-2 font-semibold text-brand-ink",
                        col.key === "name" && "left-10 z-30",
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const lead = leads[i];
                  return (
                    <tr key={lead.id} className="group">
                      <td className="sticky left-0 z-10 border-b border-r border-brand-ink/10 bg-[#F7F5EF] px-2 py-2 text-center tabular-nums text-brand-stone group-hover:bg-brand-cream">
                        {i + 1}
                      </td>
                      {row.map((value, j) => {
                        const key = LEAD_COLUMNS[j].key;
                        return (
                          <td
                            key={key}
                            className={cn(
                              "border-b border-r border-brand-ink/10 px-3 py-2 align-top text-brand-ink group-hover:bg-brand-cream/60",
                              key === "name" && "sticky left-10 z-10 bg-brand-white font-medium",
                              key === "message" ? "max-w-[20rem] whitespace-pre-wrap" : "whitespace-nowrap",
                            )}
                          >
                            {key === "phone" && value ? (
                              <a
                                href={waLink(value)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-brand-green underline-offset-2 hover:underline"
                              >
                                {value}
                                <ExternalLink className="h-3 w-3" aria-hidden />
                              </a>
                            ) : key === "email" && value ? (
                              <a href={`mailto:${value}`} className="text-brand-green underline-offset-2 hover:underline">
                                {value}
                              </a>
                            ) : (
                              value || <span className="text-brand-stone/50">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
