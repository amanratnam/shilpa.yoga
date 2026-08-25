import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { verifySession } from "@/lib/admin/auth";
import { listClients } from "@/lib/admin/clients";
import {
  CLIENT_STATUSES,
  GENDERS,
  REFERRAL_SOURCES,
  clientStatusLabels,
  genderLabels,
  optionsOf,
  referralSourceLabels,
} from "@/lib/admin/enums";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataProblem } from "@/components/admin/DataProblem";
import { ClientFormModal } from "@/components/admin/ClientFormModal";
import { ClientStatusBadge } from "@/components/admin/badges";
import { CELL, META_LABEL } from "@/components/admin/tokens";
import { cn } from "@/lib/utils";

/** Client records are per-request data; never prerender this page. */
export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const session = await verifySession();

  let clients;
  try {
    clients = await listClients();
  } catch (error) {
    return (
      <>
        <AdminHeader username={session.username} active="clients" expiresAt={session.exp} />
        <div className="container-content flex-1 py-12">
          <h1 className="text-h2 text-brand-ink">Clients</h1>
          <DataProblem error={error} />
        </div>
      </>
    );
  }

  const counts = CLIENT_STATUSES.map(
    (status) =>
      `${clients.filter((c) => c.status === status).length} ${clientStatusLabels[status].toLowerCase()}`,
  ).join(", ");

  return (
    <>
      <AdminHeader username={session.username} active="clients" expiresAt={session.exp} />

      <div className="container-content flex-1 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="text-h2 text-brand-ink">Clients</h1>
            <p className="mt-2 text-body text-brand-stone">
              {clients.length === 0
                ? "No clients yet."
                : `${clients.length} client${clients.length === 1 ? "" : "s"} — ${counts}.`}
            </p>
          </div>

          <ClientFormModal
            genders={optionsOf(GENDERS, genderLabels)}
            statuses={optionsOf(CLIENT_STATUSES, clientStatusLabels)}
            referralSources={optionsOf(REFERRAL_SOURCES, referralSourceLabels)}
          />
        </div>

        {clients.length === 0 ? (
          <div className="mt-10 grid place-items-center rounded-brand border border-dashed border-brand-ink/20 bg-brand-white px-6 py-20 text-center">
            <Users className="h-8 w-8 text-brand-stone/50" strokeWidth={1.5} aria-hidden />
            <h2 className="mt-4 text-h4 text-brand-ink">No clients yet</h2>
            <p className="mt-1.5 max-w-sm text-small text-brand-stone">
              Add the first client you onboard. Subscriptions are then recorded
              against the people in this list.
            </p>
          </div>
        ) : (
          <div className="mt-10 overflow-hidden rounded-brand border border-brand-ink/10 bg-brand-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[56rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-brand-ink/10 bg-brand-cream/60">
                    {["Client", "Email", "Found us via", "Subscriptions", "Status", ""].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className={cn("px-5 py-3", META_LABEL)}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
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
        )}
      </div>
    </>
  );
}
