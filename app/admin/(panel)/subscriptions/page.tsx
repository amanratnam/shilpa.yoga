import Link from "next/link";
import { ArrowRight, CalendarRange, ChevronRight } from "lucide-react";
import { listClientOptions } from "@/lib/admin/clients";
import {
  listSubscriptions,
  packagesForMode,
  type SubscriptionRecord,
} from "@/lib/admin/subscriptions";
import {
  PAYMENT_METHODS,
  YOGA_MODES,
  modeLabels,
  optionsOf,
  paymentMethodLabels,
} from "@/lib/admin/enums";
import { formatDateRange } from "@/lib/admin/format";
import { getPricingConfig } from "@/lib/pricing/store";
import { formatINR } from "@/lib/pricing/config";
import { DataProblem } from "@/components/admin/DataProblem";
import { SubscriptionFormModal } from "@/components/admin/SubscriptionFormModal";
import { PaymentStatus, SubscriptionStateBadge } from "@/components/admin/badges";
import { EmptyState, FilterChips, PageHeader } from "@/components/admin/PageParts";
import { CELL, META_LABEL } from "@/components/admin/tokens";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * "Active" is anything not yet lapsed — running now or starting soon — and
 * "Churned" is anything that has ended, so the two chips always add up to All.
 */
const FILTERS = {
  all: { label: "All", match: () => true },
  active: { label: "Active", match: (s: SubscriptionRecord) => s.state !== "expired" },
  churned: { label: "Churned", match: (s: SubscriptionRecord) => s.state === "expired" },
} as const;
type Filter = keyof typeof FILTERS;

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const status: Filter = rawStatus && rawStatus in FILTERS ? (rawStatus as Filter) : "all";

  let subscriptions, clients, config;
  try {
    [subscriptions, clients, config] = await Promise.all([
      listSubscriptions(),
      listClientOptions(),
      getPricingConfig(),
    ]);
  } catch (error) {
    return (
      <div>
        <PageHeader title="Subscriptions" />
        <DataProblem error={error} />
      </div>
    );
  }

  const packages = [...YOGA_MODES].flatMap((mode) =>
    packagesForMode(mode, config).map((p) => ({ id: p.id, label: p.label, mode })),
  );
  const modes = optionsOf(YOGA_MODES, modeLabels);
  const methods = optionsOf(PAYMENT_METHODS, paymentMethodLabels);
  const visible = subscriptions.filter(FILTERS[status].match);

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        description="Every package sold, with receipts you can download."
        actions={
          <SubscriptionFormModal
            clients={clients}
            packages={packages}
            modes={modes}
            paymentMethods={methods}
            returnTo="/admin/subscriptions"
          />
        }
      />

      {clients.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<CalendarRange className="h-8 w-8 text-brand-stone/50" strokeWidth={1.5} aria-hidden />}
            title="Add a client first"
          >
            Subscriptions are always recorded against an existing client, so
            start by adding someone to the client repository.{" "}
            <Link
              href="/admin/clients"
              className="font-medium text-brand-green underline underline-offset-4"
            >
              Go to clients
            </Link>
          </EmptyState>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<CalendarRange className="h-8 w-8 text-brand-stone/50" strokeWidth={1.5} aria-hidden />}
            title="No subscriptions yet"
          >
            Record the first package a client signs up for and it will appear
            here, and on their own page as history.
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <FilterChips
              label="Filter subscriptions"
              items={(Object.keys(FILTERS) as Filter[]).map((f) => ({
                label: FILTERS[f].label,
                count: subscriptions.filter(FILTERS[f].match).length,
                href: f === "all" ? "/admin/subscriptions" : `/admin/subscriptions?status=${f}`,
                active: f === status,
              }))}
            />
          </div>

          {visible.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={<CalendarRange className="h-8 w-8 text-brand-stone/50" strokeWidth={1.5} aria-hidden />}
                title={`No ${FILTERS[status].label.toLowerCase()} subscriptions`}
              >
                Nothing in this group right now.
              </EmptyState>
            </div>
          ) : (
            <>
              {/* Phones: one tappable card per subscription */}
              <ul className="mt-5 flex flex-col gap-2 md:hidden">
                {visible.map((sub) => (
                  <li key={sub.id}>
                    <Link
                      href={`/admin/subscriptions/${sub.id}`}
                      className="flex items-center gap-3 rounded-brand border border-brand-ink/10 bg-brand-white p-4 transition-colors active:bg-brand-cream/60"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium text-brand-ink">
                            {sub.clientName ?? "Unknown"}
                          </span>
                          <SubscriptionStateBadge state={sub.state} />
                        </div>
                        <p className="mt-1 truncate text-small text-brand-ink">
                          {sub.packageLabel}
                          {sub.packageAmount !== null ? ` · ${formatINR(sub.packageAmount)}` : ""}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-brand-stone">
                          <span>{formatDateRange(sub.startDate, sub.endDate)}</span>
                          <PaymentStatus paid={sub.paymentDone} />
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-brand-stone" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Tablets and up: the dense table, with inline edit */}
              <div className="mt-5 hidden overflow-hidden rounded-brand border border-brand-ink/10 bg-brand-white md:block">
                <div className="relative overflow-x-auto">
                  <table className="w-full min-w-[56rem] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-brand-ink/10 bg-brand-cream/60">
                        {["Client", "Package", "Period", "Payment", "State", ""].map((h) => (
                          <th key={h} scope="col" className={cn("px-5 py-3", META_LABEL)}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((sub) => (
                        <tr
                          key={sub.id}
                          className="border-b border-brand-ink/10 transition-colors last:border-b-0 hover:bg-brand-cream/40"
                        >
                          <td className={CELL}>
                            <Link
                              href={`/admin/clients/${sub.clientId}`}
                              className="font-medium text-brand-ink underline-offset-4 hover:text-brand-green hover:underline"
                            >
                              {sub.clientName ?? "Unknown"}
                            </Link>
                          </td>
                          <td className={cn(CELL, "text-small text-brand-ink")}>
                            {sub.packageLabel}
                            <div className="mt-0.5 text-small text-brand-stone">
                              {modeLabels[sub.yogaMode]}
                              {sub.packageAmount !== null ? ` · ${formatINR(sub.packageAmount)}` : ""}
                            </div>
                          </td>
                          <td className={cn(CELL, "text-small text-brand-ink")}>
                            {formatDateRange(sub.startDate, sub.endDate)}
                          </td>
                          <td className={CELL}>
                            <PaymentStatus paid={sub.paymentDone} />
                            <div className="mt-0.5 text-small text-brand-stone">
                              {paymentMethodLabels[sub.paymentMethod]}
                            </div>
                          </td>
                          <td className={CELL}>
                            <SubscriptionStateBadge state={sub.state} />
                          </td>
                          <td className={CELL}>
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
                                returnTo={
                                  status === "all"
                                    ? "/admin/subscriptions"
                                    : `/admin/subscriptions?status=${status}`
                                }
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
            </>
          )}
        </>
      )}
    </div>
  );
}
