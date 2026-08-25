import { CheckCircle2 } from "lucide-react";
import { verifySession } from "@/lib/admin/auth";
import { getLastPublished, getPricingConfigFresh } from "@/lib/pricing/store";
import { formatDate } from "@/lib/admin/format";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataProblem } from "@/components/admin/DataProblem";
import { PricingConfigurator } from "@/components/admin/PricingConfigurator";

/** The editor must always show the true stored row, never a cached copy. */
export const dynamic = "force-dynamic";

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string }>;
}) {
  const session = await verifySession();
  const { published: justPublished } = await searchParams;

  let config, lastPublished;
  try {
    [config, lastPublished] = await Promise.all([
      getPricingConfigFresh(),
      getLastPublished(),
    ]);
  } catch (error) {
    return (
      <>
        <AdminHeader username={session.username} active="pricing" expiresAt={session.exp} />
        <div className="container-content flex-1 py-12">
          <h1 className="text-h2 text-brand-ink">Pricing</h1>
          <DataProblem error={error} />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader username={session.username} active="pricing" expiresAt={session.exp} />

      <div className="container-content flex-1 py-12">
        <h1 className="text-h2 text-brand-ink">Pricing</h1>
        <p className="mt-2 max-w-2xl text-body text-brand-stone">
          Every price the site quotes. Publishing updates the classes pages, the
          enquiry form and the subscription packages straight away.
        </p>

        {justPublished ? (
          <p
            role="status"
            className="mt-6 inline-flex items-center gap-2 rounded-brand border border-brand-green/25 bg-brand-green/5 px-3 py-2 text-small font-medium text-brand-green"
          >
            <CheckCircle2 className="h-4 w-4" strokeWidth={2} aria-hidden />
            Prices published and live.
          </p>
        ) : null}

        <PricingConfigurator
          published={config}
          lastPublished={
            lastPublished
              ? {
                  at: formatDate(lastPublished.at.slice(0, 10), "long"),
                  by: lastPublished.by,
                }
              : undefined
          }
        />
      </div>
    </>
  );
}
