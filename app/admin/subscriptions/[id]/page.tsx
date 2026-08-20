import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, User } from "lucide-react";
import { verifySession } from "@/lib/admin/auth";
import { getClient } from "@/lib/admin/clients";
import { getSubscription, packagesForMode } from "@/lib/admin/subscriptions";
import {
  PAYMENT_METHODS,
  YOGA_MODES,
  genderLabels,
  modeLabels,
  optionsOf,
  paymentMethodLabels,
} from "@/lib/admin/enums";
import { formatDate } from "@/lib/admin/format";
import { formatINR, yogaPackageById } from "@/content/pricing";
import { receiptNumber } from "@/lib/admin/receipt";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SubscriptionFormModal } from "@/components/admin/SubscriptionFormModal";
import { PaymentBadge, SubscriptionStateBadge } from "@/components/admin/badges";

export const dynamic = "force-dynamic";

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-eyebrow uppercase tracking-[0.1em] text-brand-stone">{label}</dt>
      <dd className="mt-1.5 text-body text-brand-ink">{children}</dd>
    </div>
  );
}

export default async function SubscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await verifySession();
  const { id } = await params;
  const sub = await getSubscription(id);
  if (!sub) notFound();

  const client = await getClient(sub.clientId);
  if (!client) notFound();

  const pkg = yogaPackageById.get(sub.yogaPackage);
  const packages = [...YOGA_MODES].flatMap((mode) =>
    packagesForMode(mode).map((p) => ({ id: p.id, label: p.label, mode })),
  );

  return (
    <>
      <AdminHeader username={session.username} active="subscriptions" expiresAt={session.exp} />

      <div className="container-content flex-1 py-12">
        <Link
          href="/admin/subscriptions"
          className="inline-flex items-center gap-2 text-small font-medium text-brand-stone underline-offset-4 transition-colors hover:text-brand-green hover:underline"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
          All subscriptions
        </Link>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-h2 text-brand-ink">{sub.packageLabel}</h1>
            <SubscriptionStateBadge state={sub.state} />
            <PaymentBadge paid={sub.paymentDone} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* A plain link, so the browser handles the download itself. */}
            <a
              href={`/admin/subscriptions/${sub.id}/receipt`}
              className="inline-flex items-center justify-center gap-2 rounded-brand bg-brand-green px-8 py-4 text-small font-medium uppercase tracking-[0.05em] text-brand-cream transition-colors duration-300 ease-brand hover:bg-brand-ink"
            >
              <Download className="h-4 w-4" strokeWidth={2} aria-hidden />
              Generate receipt
            </a>
            <SubscriptionFormModal
              clients={[]}
              packages={packages}
              modes={optionsOf(YOGA_MODES, modeLabels)}
              paymentMethods={optionsOf(PAYMENT_METHODS, paymentMethodLabels)}
              fixedClientId={sub.clientId}
              returnTo={`/admin/subscriptions/${sub.id}`}
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
        </div>

        <p className="mt-3 text-small text-brand-stone">
          Receipt no. {receiptNumber(sub.id)}
        </p>

        <div className="mt-8 grid max-w-4xl gap-6 lg:grid-cols-2">
          {/* ---- Client ---- */}
          <div className="rounded-brand border border-brand-ink/10 bg-brand-white p-8">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-brand-stone" strokeWidth={2} aria-hidden />
              <h2 className="text-eyebrow uppercase tracking-[0.1em] text-brand-stone">
                Client
              </h2>
            </div>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              <Detail label="Full name">
                <Link
                  href={`/admin/clients/${client.id}`}
                  className="text-brand-green underline-offset-4 hover:underline"
                >
                  {client.fullName}
                </Link>
              </Detail>
              <Detail label="Gender">{genderLabels[client.gender]}</Detail>
              <Detail label="Phone number">
                {client.phone || <span className="text-brand-stone">Not provided</span>}
              </Detail>
              <Detail label="Email">
                {client.email || <span className="text-brand-stone">Not provided</span>}
              </Detail>
            </dl>
          </div>

          {/* ---- Subscription ---- */}
          <div className="rounded-brand border border-brand-ink/10 bg-brand-white p-8">
            <h2 className="text-eyebrow uppercase tracking-[0.1em] text-brand-stone">
              Subscription
            </h2>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              <Detail label="Yoga mode">{modeLabels[sub.yogaMode]}</Detail>
              <Detail label="Package">{sub.packageLabel}</Detail>
              <Detail label="Start date">{formatDate(sub.startDate, "long")}</Detail>
              <Detail label="End date">{formatDate(sub.endDate, "long")}</Detail>
              <Detail label="Total sessions">{pkg ? pkg.sessions : "—"}</Detail>
              <Detail label="Payment mode">{paymentMethodLabels[sub.paymentMethod]}</Detail>
              <Detail label={sub.paymentDone ? "Amount received" : "Amount due"}>
                <span className={sub.paymentDone ? "font-medium text-brand-green" : undefined}>
                  {sub.packageAmount !== null ? formatINR(sub.packageAmount) : "—"}
                </span>
              </Detail>
              <Detail label="Recorded on">{formatDate(sub.createdAt.slice(0, 10), "long")}</Detail>
            </dl>

            {sub.notes ? (
              <>
                <div className="my-6 h-px w-full bg-brand-ink/10" />
                <Detail label="Notes">
                  <span className="whitespace-pre-wrap">{sub.notes}</span>
                </Detail>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
