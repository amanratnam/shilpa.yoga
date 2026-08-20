import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { verifySession } from "@/lib/admin/auth";
import {
  GENDERS,
  YOGA_MODES,
  genderLabels,
  listClients,
  modeLabels,
  packagesForMode,
  type ClientRecord,
} from "@/lib/admin/clients";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AddClientModal } from "@/components/admin/AddClientModal";
import { cn } from "@/lib/utils";

/** Client records are per-request data; never prerender this page. */
export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isActive(client: ClientRecord): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return client.startDate <= today && client.endDate >= today;
}

export default async function AdminHomePage() {
  const session = await verifySession();
  const clients = await listClients();

  const packages = [...YOGA_MODES].flatMap((mode) =>
    packagesForMode(mode).map((p) => ({ id: p.id, label: p.label, mode })),
  );

  const activeCount = clients.filter(isActive).length;

  return (
    <>
      <AdminHeader username={session.username} />

      <div className="container-content flex-1 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="text-h2 text-brand-ink">Clients</h1>
            <p className="mt-2 text-body text-brand-stone">
              {clients.length === 0
                ? "No clients yet."
                : `${clients.length} client${clients.length === 1 ? "" : "s"}, ${activeCount} with an active subscription.`}
            </p>
          </div>

          <AddClientModal
            packages={packages}
            genders={GENDERS.map((g) => ({ value: g, label: genderLabels[g] }))}
            modes={YOGA_MODES.map((m) => ({ value: m, label: modeLabels[m] }))}
          />
        </div>

        {clients.length === 0 ? (
          <div className="mt-10 grid place-items-center rounded-brand border border-dashed border-brand-ink/20 bg-brand-white px-6 py-20 text-center">
            <Users className="h-8 w-8 text-brand-stone/50" strokeWidth={1.5} aria-hidden />
            <h2 className="mt-4 text-h4 text-brand-ink">No clients yet</h2>
            <p className="mt-1.5 max-w-sm text-small text-brand-stone">
              Add the first client you onboard and they&apos;ll appear here with their
              package and subscription dates.
            </p>
          </div>
        ) : (
          <div className="mt-10 overflow-hidden rounded-brand border border-brand-ink/10 bg-brand-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-brand-ink/10 bg-brand-cream/60">
                    {["Client", "Package", "Subscription", "Payment", ""].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-6 py-4 text-eyebrow uppercase tracking-[0.1em] text-brand-stone"
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
                      className="border-b border-brand-ink/10 last:border-b-0 transition-colors hover:bg-brand-cream/40"
                    >
                      <td className="px-6 py-5">
                        <div className="font-medium text-brand-ink">{client.fullName}</div>
                        <div className="mt-0.5 text-small text-brand-stone">
                          {modeLabels[client.yogaMode]} · {client.age} yrs
                        </div>
                      </td>
                      <td className="px-6 py-5 text-small text-brand-ink">
                        {client.packageLabel}
                      </td>
                      <td className="px-6 py-5 text-small text-brand-ink">
                        {formatDate(client.startDate)} – {formatDate(client.endDate)}
                        <div
                          className={cn(
                            "mt-1 text-eyebrow uppercase tracking-[0.1em]",
                            isActive(client) ? "text-brand-green" : "text-brand-stone",
                          )}
                        >
                          {isActive(client) ? "Active" : "Inactive"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            "inline-flex rounded-brand border px-3 py-1.5 text-eyebrow uppercase tracking-[0.1em]",
                            client.paymentDone
                              ? "border-brand-green/30 text-brand-green"
                              : "border-brand-gold/60 text-brand-stone",
                          )}
                        >
                          {client.paymentDone ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
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
