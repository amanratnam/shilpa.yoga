import Link from "next/link";
import { ArrowRight, CalendarRange, Users } from "lucide-react";
import { verifySession } from "@/lib/admin/auth";
import { listClients } from "@/lib/admin/clients";
import { listSubscriptions } from "@/lib/admin/subscriptions";
import { CLIENT_STATUSES, clientStatusLabels } from "@/lib/admin/enums";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataProblem } from "@/components/admin/DataProblem";

export const dynamic = "force-dynamic";

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-h2 font-bold text-brand-green">{value}</div>
      <div className="mt-1 text-eyebrow uppercase tracking-[0.1em] text-brand-stone">
        {label}
      </div>
    </div>
  );
}

function SectionCard({
  href,
  title,
  blurb,
  icon: Icon,
  stats,
}: {
  href: string;
  title: string;
  blurb: string;
  icon: typeof Users;
  stats: { label: string; value: number | string }[];
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-brand border border-brand-ink/10 bg-brand-white p-8 transition-transform duration-300 ease-brand hover:-translate-y-1 hover:border-brand-green/30"
    >
      <div className="flex items-start justify-between gap-4">
        <Icon className="h-7 w-7 text-brand-green" strokeWidth={1.5} aria-hidden />
        <ArrowRight
          className="h-5 w-5 text-brand-stone transition-transform duration-300 ease-brand group-hover:translate-x-1 group-hover:text-brand-green"
          strokeWidth={2}
          aria-hidden
        />
      </div>
      <h2 className="mt-5 text-h3 text-brand-ink">{title}</h2>
      <p className="mt-1.5 text-small text-brand-stone">{blurb}</p>
      <div className="mt-8 flex flex-wrap gap-10">
        {stats.map((s) => (
          <Stat key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </Link>
  );
}

export default async function AdminHomePage() {
  const session = await verifySession();

  // Caught here rather than thrown, so the page can explain what to fix.
  // Next.js hides Server Component error messages in production.
  let clients, subscriptions;
  try {
    [clients, subscriptions] = await Promise.all([listClients(), listSubscriptions()]);
  } catch (error) {
    return (
      <>
        <AdminHeader username={session.username} active="home" expiresAt={session.exp} />
        <div className="container-content flex-1 py-12">
          <h1 className="text-h2 text-brand-ink">Overview</h1>
          <DataProblem error={error} />
        </div>
      </>
    );
  }

  const byStatus = Object.fromEntries(
    CLIENT_STATUSES.map((s) => [s, clients.filter((c) => c.status === s).length]),
  );

  return (
    <>
      <AdminHeader username={session.username} active="home" expiresAt={session.exp} />

      <div className="container-content flex-1 py-12">
        <h1 className="text-h2 text-brand-ink">Overview</h1>
        <p className="mt-2 text-body text-brand-stone">
          Welcome back, {session.username}.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <SectionCard
            href="/admin/clients"
            title="Clients"
            blurb="The people you teach, and your newsletter list."
            icon={Users}
            stats={[
              { label: "Total", value: clients.length },
              ...CLIENT_STATUSES.map((s) => ({
                label: clientStatusLabels[s],
                value: byStatus[s] ?? 0,
              })),
            ]}
          />

          <SectionCard
            href="/admin/subscriptions"
            title="Subscriptions"
            blurb="Every package sold, with receipts you can download."
            icon={CalendarRange}
            stats={[
              { label: "Total", value: subscriptions.length },
              {
                label: "Current",
                value: subscriptions.filter((s) => s.state === "current").length,
              },
              {
                label: "Unpaid",
                value: subscriptions.filter((s) => !s.paymentDone).length,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
