import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CalendarRange,
  IndianRupee,
  Users,
  Wallet,
} from "lucide-react";
import { verifySession } from "@/lib/admin/auth";
import { listClientOptions, listClients } from "@/lib/admin/clients";
import { listSubscriptions, packagesForMode } from "@/lib/admin/subscriptions";
import { getPricingConfig } from "@/lib/pricing/store";
import { formatINR } from "@/lib/pricing/config";
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
  type ClientStatus,
} from "@/lib/admin/enums";
import { formatDate } from "@/lib/admin/format";
import { DataProblem } from "@/components/admin/DataProblem";
import { ClientFormModal } from "@/components/admin/ClientFormModal";
import { SubscriptionFormModal } from "@/components/admin/SubscriptionFormModal";
import { ClientStatusBadge } from "@/components/admin/badges";
import { PageHeader } from "@/components/admin/PageParts";
import { META_LABEL } from "@/components/admin/tokens";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** How far ahead "renewals due" looks. */
const RENEWAL_WINDOW_DAYS = 14;

const isoDay = (d: Date) => d.toISOString().slice(0, 10);
const monthKey = (iso: string) => iso.slice(0, 7);
const daysBetween = (fromIso: string, toIso: string) =>
  Math.round((Date.parse(toIso) - Date.parse(fromIso)) / 86_400_000);

/** Compact rupees for tiles and chart labels: ₹1.2L, ₹45k, ₹900. */
function shortINR(amount: number): string {
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(amount >= 1_000_000 ? 0 : 1)}L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(amount >= 10_000 ? 0 : 1)}k`;
  return formatINR(amount);
}

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

function Kpi({
  label,
  value,
  note,
  href,
  Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  note: React.ReactNode;
  href: string;
  Icon: typeof Users;
  tone?: "default" | "attention";
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-brand border border-brand-ink/10 bg-brand-white p-4 transition-colors duration-200 hover:border-brand-green/40 sm:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className={META_LABEL}>{label}</span>
        <span
          className={cn(
            "grid h-8 w-8 place-items-center rounded-brand",
            tone === "attention" ? "bg-brand-gold/15 text-brand-stone" : "bg-brand-green/[0.07] text-brand-green",
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
      <span className="mt-3 text-[1.75rem] font-semibold leading-none tracking-tight text-brand-ink tabular-nums sm:text-[2rem]">
        {value}
      </span>
      <span className="mt-2 text-[0.75rem] text-brand-stone sm:text-small">{note}</span>
    </Link>
  );
}

function Panel({
  title,
  href,
  linkLabel = "View all",
  className,
  children,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-brand border border-brand-ink/10 bg-brand-white",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-4 border-b border-brand-ink/10 px-4 py-3 sm:px-5">
        <h2 className="text-small font-semibold text-brand-ink">{title}</h2>
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-brand-green underline-offset-4 hover:underline"
          >
            {linkLabel}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          </Link>
        ) : null}
      </header>
      <div className="flex-1 px-4 py-4 sm:px-5">{children}</div>
    </section>
  );
}

function Quiet({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-small text-brand-stone">{children}</p>;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function DashboardPage() {
  const session = await verifySession();

  let clients, subscriptions, clientOptions, config;
  try {
    [clients, subscriptions, clientOptions, config] = await Promise.all([
      listClients(),
      listSubscriptions(),
      listClientOptions(),
      getPricingConfig(),
    ]);
  } catch (error) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <DataProblem error={error} />
      </div>
    );
  }

  const now = new Date();
  const today = isoDay(now);
  const thisMonth = monthKey(today);
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 15);
  const lastMonth = monthKey(isoDay(lastMonthDate));

  // ---- Clients ----
  const byStatus = Object.fromEntries(
    CLIENT_STATUSES.map((s) => [s, clients.filter((c) => c.status === s).length]),
  ) as Record<ClientStatus, number>;
  const newThisMonth = clients.filter((c) => monthKey(c.createdAt) === thisMonth).length;

  // ---- Subscriptions ----
  const running = subscriptions.filter((s) => s.state === "current");
  const upcoming = subscriptions.filter((s) => s.state === "upcoming");
  const amountOf = (s: (typeof subscriptions)[number]) => s.packageAmount ?? 0;

  // Revenue is booked to the month a package starts.
  const bookedIn = (month: string) =>
    subscriptions.filter((s) => monthKey(s.startDate) === month);
  const revenueThis = bookedIn(thisMonth).reduce((sum, s) => sum + amountOf(s), 0);
  const revenueLast = bookedIn(lastMonth).reduce((sum, s) => sum + amountOf(s), 0);
  const revenueDelta =
    revenueLast > 0 ? Math.round(((revenueThis - revenueLast) / revenueLast) * 100) : null;

  const unpaid = subscriptions
    .filter((s) => !s.paymentDone)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const unpaidTotal = unpaid.reduce((sum, s) => sum + amountOf(s), 0);

  const renewals = running
    .map((s) => ({ ...s, daysLeft: daysBetween(today, s.endDate) }))
    .filter((s) => s.daysLeft <= RENEWAL_WINDOW_DAYS)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  // Six months of booked revenue, split into collected and pending.
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 15);
    const key = monthKey(isoDay(d));
    const subs = bookedIn(key);
    return {
      key,
      label: d.toLocaleDateString("en-IN", { month: "short" }),
      paid: subs.filter((s) => s.paymentDone).reduce((sum, s) => sum + amountOf(s), 0),
      pending: subs.filter((s) => !s.paymentDone).reduce((sum, s) => sum + amountOf(s), 0),
    };
  });
  const peak = Math.max(1, ...months.map((m) => m.paid + m.pending));

  // Where clients come from, most first.
  const sources = REFERRAL_SOURCES.map((r) => ({
    key: r,
    count: clients.filter((c) => c.referralSource === r).length,
  }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topSource = Math.max(1, ...sources.map((s) => s.count));

  const recent = clients.slice(0, 5);

  // Quick-add forms.
  const packages = [...YOGA_MODES].flatMap((mode) =>
    packagesForMode(mode, config).map((p) => ({ id: p.id, label: p.label, mode })),
  );

  const pipelineTone: Record<ClientStatus, string> = {
    active: "bg-brand-green",
    potential: "bg-brand-gold",
    churned: "bg-brand-stone/30",
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`${greetingFor(now.getHours())}, ${session.username}. Here's how the practice is doing.`}
        actions={
          <>
            <ClientFormModal
              genders={optionsOf(GENDERS, genderLabels)}
              statuses={optionsOf(CLIENT_STATUSES, clientStatusLabels)}
              referralSources={optionsOf(REFERRAL_SOURCES, referralSourceLabels)}
              triggerLabel="Client"
            />
            <SubscriptionFormModal
              clients={clientOptions}
              packages={packages}
              modes={optionsOf(YOGA_MODES, modeLabels)}
              paymentMethods={optionsOf(PAYMENT_METHODS, paymentMethodLabels)}
              returnTo="/admin/dashboard"
              triggerLabel="Subscription"
            />
          </>
        }
      />

      {/* ---- Headline numbers ---- */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Kpi
          label="Active clients"
          value={String(byStatus.active)}
          note={
            <>
              {byStatus.potential} potential · {newThisMonth} new this month
            </>
          }
          href="/admin/clients?status=active"
          Icon={Users}
        />
        <Kpi
          label="Running packages"
          value={String(running.length)}
          note={<>{upcoming.length} starting soon</>}
          href="/admin/subscriptions?status=active"
          Icon={CalendarRange}
        />
        <Kpi
          label="Booked this month"
          value={shortINR(revenueThis)}
          note={
            revenueDelta === null ? (
              "From packages starting this month"
            ) : (
              <span className={revenueDelta >= 0 ? "text-brand-green" : "text-brand-ink"}>
                {revenueDelta >= 0 ? "▲" : "▼"} {Math.abs(revenueDelta)}% vs last month
              </span>
            )
          }
          href="/admin/subscriptions"
          Icon={IndianRupee}
        />
        <Kpi
          label="Awaiting payment"
          value={shortINR(unpaidTotal)}
          note={
            <>
              {unpaid.length} package{unpaid.length === 1 ? "" : "s"} unpaid
            </>
          }
          href="/admin/subscriptions"
          Icon={Wallet}
          tone={unpaid.length > 0 ? "attention" : "default"}
        />
      </div>

      <div className="mt-3 grid gap-3 lg:mt-4 lg:grid-cols-3 lg:gap-4">
        {/* ---- Revenue trend ---- */}
        <Panel title="Revenue, last 6 months" href="/admin/subscriptions" className="lg:col-span-2">
          <div className="flex items-center gap-4 text-[0.75rem] text-brand-stone">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-brand-green" aria-hidden /> Collected
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-brand-gold" aria-hidden /> Pending
            </span>
          </div>
          <ol className="mt-4 grid h-44 grid-cols-6 items-end gap-2 sm:gap-4">
            {months.map((m) => {
              const total = m.paid + m.pending;
              return (
                <li key={m.key} className="flex h-full flex-col items-center justify-end gap-1.5">
                  <span className="text-[0.6875rem] font-medium tabular-nums text-brand-ink">
                    {total ? shortINR(total) : ""}
                  </span>
                  <div
                    className="flex w-full max-w-12 flex-col justify-end overflow-hidden rounded-t-[3px] bg-brand-cream"
                    style={{ height: `${Math.max(4, (total / peak) * 100)}%` }}
                    role="img"
                    aria-label={`${m.label}: ${formatINR(m.paid)} collected, ${formatINR(m.pending)} pending`}
                  >
                    <div className="bg-brand-gold" style={{ height: `${total ? (m.pending / total) * 100 : 0}%` }} />
                    <div className="bg-brand-green" style={{ height: `${total ? (m.paid / total) * 100 : 0}%` }} />
                  </div>
                  <span
                    className={cn(
                      "text-[0.6875rem] uppercase tracking-[0.06em]",
                      m.key === thisMonth ? "font-semibold text-brand-ink" : "text-brand-stone",
                    )}
                  >
                    {m.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </Panel>

        {/* ---- Client pipeline ---- */}
        <Panel title="Client pipeline" href="/admin/clients">
          <p className="text-[1.75rem] font-semibold leading-none tabular-nums text-brand-ink">
            {clients.length}
            <span className="ml-1.5 text-small font-normal text-brand-stone">clients</span>
          </p>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-brand-cream">
            {CLIENT_STATUSES.map((s) =>
              byStatus[s] ? (
                <div
                  key={s}
                  className={pipelineTone[s]}
                  style={{ width: `${(byStatus[s] / Math.max(1, clients.length)) * 100}%` }}
                />
              ) : null,
            )}
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {CLIENT_STATUSES.map((s) => (
              <li key={s}>
                <Link
                  href={`/admin/clients?status=${s}`}
                  className="flex items-center justify-between rounded-brand px-2 py-1.5 text-small transition-colors hover:bg-brand-cream/60"
                >
                  <span className="inline-flex items-center gap-2 text-brand-ink">
                    <span className={cn("h-2 w-2 rounded-full", pipelineTone[s])} aria-hidden />
                    {clientStatusLabels[s]}
                  </span>
                  <span className="font-medium tabular-nums text-brand-ink">{byStatus[s]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        {/* ---- Renewals ---- */}
        <Panel title={`Renewals due in ${RENEWAL_WINDOW_DAYS} days`} href="/admin/subscriptions?status=active">
          {renewals.length === 0 ? (
            <Quiet>Nothing ending in the next two weeks.</Quiet>
          ) : (
            <ul className="-my-1 divide-y divide-brand-ink/10">
              {renewals.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/admin/subscriptions/${s.id}`}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-small font-medium text-brand-ink">
                        {s.clientName ?? "Unknown"}
                      </span>
                      <span className="block truncate text-[0.75rem] text-brand-stone">
                        {s.packageLabel}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium",
                        s.daysLeft <= 3 ? "bg-brand-gold/20 text-brand-ink" : "bg-brand-cream text-brand-stone",
                      )}
                    >
                      <CalendarClock className="h-3 w-3" strokeWidth={2} aria-hidden />
                      {s.daysLeft <= 0 ? "Ends today" : `${s.daysLeft}d left`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* ---- Payments ---- */}
        <Panel title="Awaiting payment" href="/admin/subscriptions">
          {unpaid.length === 0 ? (
            <Quiet>Every package is paid up.</Quiet>
          ) : (
            <ul className="-my-1 divide-y divide-brand-ink/10">
              {unpaid.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/admin/subscriptions/${s.id}`}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-small font-medium text-brand-ink">
                        {s.clientName ?? "Unknown"}
                      </span>
                      <span className="block truncate text-[0.75rem] text-brand-stone">
                        Since {formatDate(s.startDate)}
                      </span>
                    </span>
                    <span className="shrink-0 text-small font-medium tabular-nums text-brand-ink">
                      {s.packageAmount !== null ? formatINR(s.packageAmount) : "—"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* ---- Lead sources ---- */}
        <Panel title="Where clients come from">
          {sources.length === 0 ? (
            <Quiet>No clients yet.</Quiet>
          ) : (
            <ul className="flex flex-col gap-3">
              {sources.map((s) => (
                <li key={s.key}>
                  <div className="flex items-center justify-between text-small">
                    <span className="text-brand-ink">{referralSourceLabels[s.key]}</span>
                    <span className="tabular-nums text-brand-stone">{s.count}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-brand-cream">
                    <div
                      className="h-full rounded-full bg-brand-green/70"
                      style={{ width: `${(s.count / topSource) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* ---- Recent clients ---- */}
        <Panel title="Newest clients" href="/admin/clients" className="lg:col-span-3">
          {recent.length === 0 ? (
            <Quiet>No clients yet.</Quiet>
          ) : (
            <ul className="-my-1 grid divide-y divide-brand-ink/10 sm:grid-cols-2 sm:divide-y-0 sm:gap-x-6 lg:grid-cols-5">
              {recent.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/admin/clients/${c.id}`}
                    className="flex items-center gap-3 rounded-brand py-2.5 transition-colors sm:px-2 sm:hover:bg-brand-cream/60"
                  >
                    <span
                      aria-hidden
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-green/[0.08] text-small font-semibold text-brand-green"
                    >
                      {c.fullName.charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-small font-medium text-brand-ink">
                        {c.fullName}
                      </span>
                      <span className="mt-0.5 block">
                        <ClientStatusBadge status={c.status} />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
