import Link from "next/link";
import { ArrowRight, CalendarRange } from "lucide-react";
import { verifySession } from "@/lib/admin/auth";
import { listClientOptions } from "@/lib/admin/clients";
import { listSubscriptions, packagesForMode } from "@/lib/admin/subscriptions";
import {
  PAYMENT_METHODS,
  YOGA_MODES,
  modeLabels,
  optionsOf,
  paymentMethodLabels,
} from "@/lib/admin/enums";
import { formatDateRange } from "@/lib/admin/format";
import { formatINR } from "@/content/pricing";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataProblem } from "@/components/admin/DataProblem";
import { SubscriptionFormModal } from "@/components/admin/SubscriptionFormModal";
import { PaymentBadge, SubscriptionStateBadge } from "@/components/admin/badges";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const session = await verifySession();
  let subscriptions, clients;
  try {
    [subscriptions, clients] = await Promise.all([listSubscriptions(), listClientOptions()]);
  } catch (error) {
    return (
      <>
        <AdminHeader username={session.username} active="subscriptions" expiresAt={session.exp} />
        <div className="container-content flex-1 py-12">
          <h1 className="text-h2 text-brand-ink">Subscriptions</h1>
          <DataProblem error={error} />
        </div>
      </>
    );
  }

  const packages = [...YOGA_MODES].flatMap((mode) =>
    packagesForMode(mode).map((p) => ({ id: p.id, label: p.label, mode })),
  );
  const modes = optionsOf(YOGA_MODES, modeLabels);
  const methods = optionsOf(PAYMENT_METHODS, paymentMethodLabels);

  const current = subscriptions.filter((s) => s.state === "current").length;
  const unpaid = subscriptions.filter((s) => !s.paymentDone).length;

  return (
    <>
      <AdminHeader username={session.username} active="subscriptions" expiresAt={session.exp} />

      <div className="container-content flex-1 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="text-h2 text-brand-ink">Subscriptions</h1>
            <p className="mt-2 text-body text-brand-stone">
              {subscriptions.length === 0
                ? "No subscriptions yet."
                : `${subscriptions.length} in total — ${current} current, ${unpaid} awaiting payment.`}
            </p>
          </div>

          <SubscriptionFormModal
            clients={clients}
            packages={packages}
            modes={modes}
            paymentMethods={methods}
            returnTo="/admin/subscriptions"
          />
        </div>

        {clients.length === 0 ? (
          <div className="mt-10 grid place-items-center rounded-brand border border-dashed border-brand-ink/20 bg-brand-white px-6 py-20 text-center">
            <CalendarRange className="h-8 w-8 text-brand-stone/50" strokeWidth={1.5} aria-hidden />
            <h2 className="mt-4 text-h4 text-brand-ink">Add a client first</h2>
            <p className="mt-1.5 max-w-sm text-small text-brand-stone">
              Subscriptions are always recorded against an existing client, so
              start by adding someone to the client repository.
            </p>
            <Link
              href="/admin/clients"
              className="mt-5 text-small font-medium text-brand-green underline underline-offset-4"
            >
              Go to clients
            </Link>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="mt-10 grid place-items-center rounded-brand border border-dashed border-brand-ink/20 bg-brand-white px-6 py-20 text-center">
            <CalendarRange className="h-8 w-8 text-brand-stone/50" strokeWidth={1.5} aria-hidden />
            <h2 className="mt-4 text-h4 text-brand-ink">No subscriptions yet</h2>
            <p className="mt-1.5 max-w-sm text-small text-brand-stone">
              Record the first package a client signs up for and it will appear
              here, and on their own page as history.
            </p>
          </div>
        ) : (
          <div className="mt-10 overflow-hidden rounded-brand border border-brand-ink/10 bg-brand-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[64rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-brand-ink/10 bg-brand-cream/60">
                    {["Client", "Package", "Period", "Payment", "State", ""].map((h) => (
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
                  {subscriptions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-brand-ink/10 transition-colors last:border-b-0 hover:bg-brand-cream/40"
                    >
                      <td className="px-6 py-5">
                        <Link
                          href={`/admin/clients/${sub.clientId}`}
                          className="font-medium text-brand-ink underline-offset-4 hover:text-brand-green hover:underline"
                        >
                          {sub.clientName ?? "Unknown"}
                        </Link>
                      </td>
                      <td className="px-6 py-5 text-small text-brand-ink">
                        {sub.packageLabel}
                        <div className="mt-0.5 text-small text-brand-stone">
                          {modeLabels[sub.yogaMode]}
                          {sub.packageAmount !== null ? ` · ${formatINR(sub.packageAmount)}` : ""}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-small text-brand-ink">
                        {formatDateRange(sub.startDate, sub.endDate)}
                      </td>
                      <td className="px-6 py-5">
                        <PaymentBadge paid={sub.paymentDone} />
                        <div className="mt-1 text-small text-brand-stone">
                          {paymentMethodLabels[sub.paymentMethod]}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <SubscriptionStateBadge state={sub.state} />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            href={`/admin/subscriptions/${sub.id}`}
                            className="inline-flex items-center gap-1.5 text-small font-medium text-brand-green underline-offset-4 hover:underline"
                          >
                            View
                            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                          </Link>
                          <SubscriptionFormModal
                          clients={clients}
                          packages={packages}
                          modes={modes}
                          paymentMethods={methods}
                          returnTo="/admin/subscriptions"
                          defaults={{
                            id: sub.id,
                            clientId: sub.clientId,
                            yogaMode: sub.yogaMode,
                            yogaPackage: sub.yogaPackage,
                            startDate: sub.startDate,
                            endDate: sub.endDate,
                            paymentDone: sub.paymentDone,
                            paymentMethod: sub.paymentMethod,
                            notes: sub.notes ?? "",
                          }}
                          />
                        </div>
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
