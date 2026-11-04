import Link from "next/link";
import { ArrowRight, ChevronRight, Users } from "lucide-react";
import { listClients } from "@/lib/admin/clients";
import {
  CLIENT_STATUSES,
  GENDERS,
  REFERRAL_SOURCES,
  clientStatusLabels,
  genderLabels,
  optionsOf,
  referralSourceLabels,
  type ClientStatus,
} from "@/lib/admin/enums";
import { DataProblem } from "@/components/admin/DataProblem";
import { ClientFormModal } from "@/components/admin/ClientFormModal";
import { ClientStatusBadge } from "@/components/admin/badges";
import { EmptyState, FilterChips, PageHeader } from "@/components/admin/PageParts";
import { CELL, META_LABEL } from "@/components/admin/tokens";
import { cn } from "@/lib/utils";

/** Client records are per-request data; never prerender this page. */
export const dynamic = "force-dynamic";

/** Chip order as Shilpa reads the list: everyone, then by status. */
const FILTERS: ("all" | ClientStatus)[] = ["all", "active", "churned", "potential"];

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const status = (FILTERS as string[]).includes(rawStatus ?? "")
    ? (rawStatus as (typeof FILTERS)[number])
    : "all";

  let clients;
  try {
    clients = await listClients();
  } catch (error) {
    return (
      <div>
        <PageHeader title="Clients" />
        <DataProblem error={error} />
      </div>
    );
  }

  const countOf = (f: (typeof FILTERS)[number]) =>
    f === "all" ? clients.length : clients.filter((c) => c.status === f).length;
  const visible = status === "all" ? clients : clients.filter((c) => c.status === status);

  const addClient = (
    <ClientFormModal
      genders={optionsOf(GENDERS, genderLabels)}
      statuses={optionsOf(CLIENT_STATUSES, clientStatusLabels)}
      referralSources={optionsOf(REFERRAL_SOURCES, referralSourceLabels)}
    />
  );

  return (
    <div>
      <PageHeader
        title="Clients"
        description="The people Shilpa teaches, and the newsletter list."
        actions={addClient}
      />

      {clients.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Users className="h-8 w-8 text-brand-stone/50" strokeWidth={1.5} aria-hidden />}
            title="No clients yet"
          >
            Add the first client you onboard. Subscriptions are then recorded
            against the people in this list.
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <FilterChips
              label="Filter clients by status"
              items={FILTERS.map((f) => ({
                label: f === "all" ? "All" : clientStatusLabels[f],
                count: countOf(f),
                href: f === "all" ? "/admin/clients" : `/admin/clients?status=${f}`,
                active: f === status,
              }))}
            />
          </div>

          {visible.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={<Users className="h-8 w-8 text-brand-stone/50" strokeWidth={1.5} aria-hidden />}
                title={`No ${status === "all" ? "" : clientStatusLabels[status].toLowerCase()} clients`}
              >
                Nobody is in this group right now.
              </EmptyState>
            </div>
          ) : (
            <>
              {/* Phones: one tappable card per client */}
              <ul className="mt-5 flex flex-col gap-2 md:hidden">
                {visible.map((client) => (
                  <li key={client.id}>
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="flex items-center gap-3 rounded-brand border border-brand-ink/10 bg-brand-white p-4 transition-colors active:bg-brand-cream/60"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium text-brand-ink">
                            {client.fullName}
                          </span>
                          <ClientStatusBadge status={client.status} />
                        </div>
                        <p className="mt-1 truncate text-small text-brand-stone">
                          {client.email || client.phone || "No contact details"}
                        </p>
                        <p className="mt-0.5 text-[0.75rem] text-brand-stone">
                          {referralSourceLabels[client.referralSource]} ·{" "}
                          {client.subscriptionCount ?? 0} subscription
                          {client.subscriptionCount === 1 ? "" : "s"}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-brand-stone" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Tablets and up: the dense table */}
              <div className="mt-5 hidden overflow-hidden rounded-brand border border-brand-ink/10 bg-brand-white md:block">
                <div className="relative overflow-x-auto">
                  <table className="w-full min-w-[48rem] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-brand-ink/10 bg-brand-cream/60">
                        {["Client", "Email", "Found us via", "Subscriptions", "Status", ""].map(
                          (h) => (
                            <th key={h} scope="col" className={cn("px-5 py-3", META_LABEL)}>
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((client) => (
                        <tr
                          key={client.id}
                          className="border-b border-brand-ink/10 transition-colors last:border-b-0 hover:bg-brand-cream/40"
                        >
                          <td className={CELL}>
                            <div className="font-medium text-brand-ink">{client.fullName}</div>
                            <div className="mt-0.5 text-small text-brand-stone">
                              {genderLabels[client.gender]} · {client.age} yrs
                            </div>
                          </td>
                          <td className={cn(CELL, "text-small text-brand-ink")}>
                            {client.email || <span className="text-brand-stone">—</span>}
                          </td>
                          <td className={cn(CELL, "text-small text-brand-ink")}>
                            {referralSourceLabels[client.referralSource]}
                          </td>
                          <td className={cn(CELL, "text-small text-brand-ink")}>
                            {client.subscriptionCount ?? 0}
                          </td>
                          <td className={CELL}>
                            <ClientStatusBadge status={client.status} />
                          </td>
                          <td className={cn(CELL, "text-right")}>
                            <Link
                              href={`/admin/clients/${client.id}`}
                              className="inline-flex items-center gap-1.5 text-small font-medium text-brand-green underline-offset-4 hover:underline"
                            >
                              View
                              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
