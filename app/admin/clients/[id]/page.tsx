import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { verifySession } from "@/lib/admin/auth";
import { genderLabels, getClient, modeLabels } from "@/lib/admin/clients";
import { formatINR } from "@/content/pricing";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-eyebrow uppercase tracking-[0.1em] text-brand-stone">{label}</dt>
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

  const today = new Date().toISOString().slice(0, 10);
  const active = client.startDate <= today && client.endDate >= today;

  return (
    <>
      <AdminHeader username={session.username} />

      <div className="container-content flex-1 py-12">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-small font-medium text-brand-stone underline-offset-4 transition-colors hover:text-brand-green hover:underline"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
          All clients
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <h1 className="text-h2 text-brand-ink">{client.fullName}</h1>
          <span
            className={cn(
              "inline-flex rounded-brand border px-3 py-1.5 text-eyebrow uppercase tracking-[0.1em]",
              active ? "border-brand-green/30 text-brand-green" : "border-brand-ink/20 text-brand-stone",
            )}
          >
            {active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="mt-8 max-w-3xl rounded-brand border border-brand-ink/10 bg-brand-white p-8">
          <dl className="grid gap-8 sm:grid-cols-2">
            <Detail label="Age">{client.age} years</Detail>
            <Detail label="Gender">{genderLabels[client.gender]}</Detail>
            <Detail label="Yoga mode">{modeLabels[client.yogaMode]}</Detail>
            <Detail label="Payment">
              <span className={active && !client.paymentDone ? "text-brand-ink" : undefined}>
                {client.paymentDone ? "Done" : "Pending"}
              </span>
            </Detail>

            <div className="sm:col-span-2">
              <div className="h-px w-full bg-brand-ink/10" />
            </div>

            <Detail label="Yoga package">
              {client.packageLabel}
              {client.packageAmount !== null ? (
                <span className="mt-1 block text-small text-brand-stone">
                  {formatINR(client.packageAmount)}
                </span>
              ) : null}
            </Detail>
            <Detail label="Subscription">
              {formatDate(client.startDate)} – {formatDate(client.endDate)}
            </Detail>

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
      </div>
    </>
  );
}
