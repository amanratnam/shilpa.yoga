import Link from "next/link";
import { CheckCircle2, Download, History, SlidersHorizontal } from "lucide-react";
import { getLastPublished, getPricingConfigFresh } from "@/lib/pricing/store";
import { getPricingHistory } from "@/lib/pricing/history";
import { formatDate } from "@/lib/admin/format";
import { DataProblem } from "@/components/admin/DataProblem";
import { PageHeader } from "@/components/admin/PageParts";
import { PricingConfigurator } from "@/components/admin/PricingConfigurator";
import { PricingHistory } from "@/components/admin/PricingHistory";
import { cn } from "@/lib/utils";

/** The editor must always show the true stored row, never a cached copy. */
export const dynamic = "force-dynamic";

const TABS = [
  { key: "configure", label: "Configure", Icon: SlidersHorizontal },
  { key: "history", label: "Activity history", Icon: History },
] as const;
type Tab = (typeof TABS)[number]["key"];

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string; tab?: string }>;
}) {
  const { published: justPublished, tab: rawTab } = await searchParams;
  const tab: Tab = rawTab === "history" ? "history" : "configure";

  const tabs = (
    <div
      role="tablist"
      aria-label="Pricing"
      className="mt-6 flex gap-1 border-b border-brand-ink/10"
    >
      {TABS.map(({ key, label, Icon }) => {
        const active = key === tab;
        return (
          <Link
            key={key}
            role="tab"
            aria-selected={active}
            href={key === "configure" ? "/admin/pricing" : "/admin/pricing?tab=history"}
            scroll={false}
            className={cn(
              "-mb-px inline-flex min-h-11 items-center gap-2 border-b-2 px-3 text-small font-medium transition-colors sm:px-4",
              active
                ? "border-brand-green text-brand-green"
                : "border-transparent text-brand-stone hover:text-brand-ink",
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            {label}
          </Link>
        );
      })}
    </div>
  );

  const header = (
    <PageHeader
      title="Pricing"
      description="Every price the site quotes, published from one place."
      actions={
        tab === "history" ? (
          <a
            href="/admin/pricing/history.csv"
            className="inline-flex min-h-10 items-center gap-2 rounded-brand border border-brand-ink/15 bg-brand-white px-3.5 text-small font-medium text-brand-ink transition-colors hover:border-brand-ink/30 hover:bg-brand-cream"
          >
            <Download className="h-4 w-4" strokeWidth={2} aria-hidden />
            Export CSV
          </a>
        ) : undefined
      }
    />
  );

  if (tab === "history") {
    let history;
    try {
      history = await getPricingHistory();
    } catch (error) {
      return (
        <div>
          {header}
          {tabs}
          <DataProblem error={error} />
        </div>
      );
    }
    return (
      <div>
        {header}
        {tabs}
        <PricingHistory versions={history} />
      </div>
    );
  }

  let config, lastPublished;
  try {
    [config, lastPublished] = await Promise.all([getPricingConfigFresh(), getLastPublished()]);
  } catch (error) {
    return (
      <div>
        {header}
        {tabs}
        <DataProblem error={error} />
      </div>
    );
  }

  return (
    <div>
      {header}
      {tabs}

      <p className="mt-5 max-w-2xl text-small text-brand-stone">
        Publishing updates the classes pages, the enquiry form and the
        subscription packages straight away, and is recorded in Activity history.
      </p>

      {justPublished ? (
        <p
          role="status"
          className="mt-4 inline-flex items-center gap-2 rounded-brand border border-brand-green/25 bg-brand-green/5 px-3 py-2 text-small font-medium text-brand-green"
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
  );
}
