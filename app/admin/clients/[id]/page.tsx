import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, History } from "lucide-react";
import { verifySession } from "@/lib/admin/auth";
import { getClient } from "@/lib/admin/clients";
import { listSubscriptionsForClient, packagesForMode } from "@/lib/admin/subscriptions";
import {
  CLIENT_STATUSES,
  GENDERS,
  PAYMENT_METHODS,
  REFERRAL_SOURCES,
  YOGA_MODES,
  clientStatusLabels,
  genderLabels,
  modeLabels,
  optionsOf,
  paymentMethodLabels,
  referralSourceLabels,
} from "@/lib/admin/enums";
import { formatDate, formatDateRange } from "@/lib/admin/format";
import { formatINR } from "@/content/pricing";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ClientFormModal } from "@/components/admin/ClientFormModal";
import { SubscriptionFormModal } from "@/components/admin/SubscriptionFormModal";
import {
  ClientStatusBadge,
  PaymentStatus,
  SubscriptionStateBadge,
} from "@/components/admin/badges";
import { META_LABEL } from "@/components/admin/tokens";

export const dynamic = "force-dynamic";

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className={META_LABEL}>{label}</dt>
      <dd className="mt-1.5 text-body text-brand-ink">{children}</dd>
    </div>
  );
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await verifySession();
  const { id } = await params;
  const client = await getClient(id);

  if (!client) notFound();

  const subscriptions = await listSubscriptionsForClient(id);

  const packages = [...YOGA_MODES].flatMap((mode) =>
    packagesForMode(mode).map((p) => ({ id: p.id, label: p.label, mode })),
  );
  const modes = optionsOf(YOGA_MODES, modeLabels);
  const methods = optionsOf(PAYMENT_METHODS, paymentMethodLabels);
  const returnTo = `/admin/clients/${id}`;

  return (
    <>
      <AdminHeader username={session.username} active="clients" expiresAt={session.exp} />

      <div className="container-content flex-1 py-12">
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-2 text-small font-medium text-brand-stone underline-offset-4 transition-colors hover:text-brand-green hover:underline"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
          All clients
        </Link>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-h2 text-brand-ink">{client.fullName}</h1>
            <ClientStatusBadge status={client.status} />
          </div>
          <ClientFormModal
            genders={optionsOf(GENDERS, genderLabels)}
            statuses={optionsOf(CLIENT_STATUSES, clientStatusLabels)}
            referralSources={optionsOf(REFERRAL_SOURCES, referralSourceLabels)}
            defaults={{
              id: client.id,
              fullName: client.fullName,
              age: client.age,
              gender: client.gender,
              email: client.email,
              phone: client.phone,
              referralSource: client.referralSource,
              status: client.status,
              notes: client.notes,
            }}
          />
        </div>

        {/* ---- Client details ---- */}
        <div className="mt-8 max-w-3xl rounded-brand border border-brand-ink/10 bg-brand-white p-8">
          <dl className="grid gap-8 sm:grid-cols-2">
            <Detail label="Age">{client.age} years</Detail>
            <Detail label="Gender">{genderLabels[client.gender]}</Detail>
            <Detail label="Email">
              {client.email ? (
                <a
                  href={`mailto:${client.email}`}
                  className="text-brand-green underline-offset-4 hover:underline"
                >
                  {client.email}
                </a>
              ) : (
                <span className="text-brand-stone">Not provided</span>
              )}
            </Detail>
            <Detail label="Phone">
              {client.phone ? (
                <a
                  href={`tel:${client.phone}`}
                  className="text-brand-green underline-offset-4 hover:underline"
                >
                  {client.phone}
                </a>
              ) : (
                <span className="text-brand-stone">Not provided</span>
              )}
            </Detail>
            <Detail label="How they found us">
              {referralSourceLabels[client.referralSource]}
            </Detail>
            <Detail label="Client since">{formatDate(client.createdAt.slice(0, 10), "long")}</Detail>

            {client.notes ? (
              <div className="sm:col-span-2">
                <div className="mb-8 h-px w-full bg-brand-ink/10" />
                <Detail label="Notes">
                  <span className="whitespace-pre-wrap">{client.notes}</span>
                </Detail>
              </div>
            ) : null}
          </dl>
        </div>

        {/* ---- Subscription history (audit trail) ---- */}
        <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-h3 text-brand-ink">Subscription history</h2>
            <p className="mt-1.5 text-small text-brand-stone">
              {subscriptions.length === 0
                ? "No subscriptions recorded yet."
                : `${subscriptions.length} subscription${subscriptions.length === 1 ? "" : "s"}, newest first.`}
            </p>
          </div>
          <SubscriptionFormModal
            clients={[]}
            packages={packages}
            modes={modes}
            paymentMethods={methods}
            fixedClientId={client.id}
            returnTo={returnTo}
          />
        </div>

        {subscriptions.length === 0 ? (
          <div className="mt-6 grid place-items-center rounded-brand border border-dashed border-brand-ink/20 bg-brand-white px-6 py-16 text-center">
            <History className="h-8 w-8 text-brand-stone/50" strokeWidth={1.5} aria-hidden />
            <p className="mt-4 max-w-sm text-small text-brand-stone">
              Every package this client signs up for will be listed here, so you
              keep a full record over time.
            </p>
          </div>
        ) : (
          <ol className="mt-6 flex flex-col gap-4">
            {subscriptions.map((sub) => (
              <li
                key={sub.id}
                className="rounded-brand border border-brand-ink/10 bg-brand-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-h4 text-brand-ink">{sub.packageLabel}</h3>
                      <SubscriptionStateBadge state={sub.state} />
                    </div>
                    <p className="mt-2 text-small text-brand-stone">
                      {modeLabels[sub.yogaMode]} · {formatDateRange(sub.startDate, sub.endDate)}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-small text-brand-stone">
                      <PaymentStatus paid={sub.paymentDone} />
                      {sub.packageAmount !== null ? `· ${formatINR(sub.packageAmount)}` : ""}
                      {`· ${paymentMethodLabels[sub.paymentMethod]}`}
                      {`· added ${formatDate(sub.createdAt.slice(0, 10))}`}
                    </p>
                    {sub.notes ? (
                      <p className="mt-3 whitespace-pre-wrap text-small text-brand-ink">
                        {sub.notes}
                      </p>
                    ) : null}
                  </div>

                  <SubscriptionFormModal
                    clients={[]}
                    packages={packages}
                    modes={modes}
                    paymentMethods={methods}
                    fixedClientId={client.id}
                    returnTo={returnTo}
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
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
