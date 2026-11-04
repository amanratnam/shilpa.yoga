import { ArrowRight, History } from "lucide-react";
import type { PricingVersion } from "@/lib/pricing/history";
import { EmptyState } from "@/components/admin/PageParts";
import { META_LABEL } from "@/components/admin/tokens";
import { cn } from "@/lib/utils";

/** Pinned to India time, so the log reads the same wherever it is opened. */
function stamp(iso: string) {
  return (
    new Date(iso).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }) + " IST"
  );
}

/** Versions shown expanded; older ones fold away but stay one tap from view. */
const OPEN_BY_DEFAULT = 5;

/**
 * The audit log: one entry per publish, newest first, each listing exactly
 * which prices moved and from what to what.
 */
export function PricingHistory({ versions }: { versions: PricingVersion[] }) {
  if (versions.length === 0) {
    return (
      <div className="mt-6">
        <EmptyState
          icon={<History className="h-8 w-8 text-brand-stone/50" strokeWidth={1.5} aria-hidden />}
          title="Nothing published yet"
        >
          The site is using the built-in default prices. Every publish from the
          Configure tab will be logged here with who made it and what changed.
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="text-small text-brand-stone">
        {versions.length} published version{versions.length === 1 ? "" : "s"}. Every
        publish is kept permanently, so any past price can be traced to who set it and when.
      </p>

      <ol className="relative mt-5 flex flex-col gap-3 before:absolute before:bottom-4 before:left-[0.9rem] before:top-4 before:w-px before:bg-brand-ink/10 sm:before:left-[1.15rem]">
        {versions.map((v, i) => (
          <li key={v.id} className="relative pl-9 sm:pl-12">
            {/* Timeline marker */}
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-4 grid h-[1.85rem] w-[1.85rem] place-items-center rounded-full border text-[0.625rem] font-semibold tabular-nums sm:h-[2.35rem] sm:w-[2.35rem] sm:text-[0.6875rem]",
                v.live
                  ? "border-brand-green bg-brand-green text-brand-cream"
                  : "border-brand-ink/15 bg-brand-white text-brand-stone",
              )}
            >
              v{v.version}
            </span>

            <details
              open={i < OPEN_BY_DEFAULT}
              className="group rounded-brand border border-brand-ink/10 bg-brand-white"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 sm:px-5 [&::-webkit-details-marker]:hidden">
                <span className="text-small font-semibold text-brand-ink">Version {v.version}</span>
                {v.live ? (
                  <span className="rounded-full bg-brand-green/10 px-2 py-0.5 text-[0.6875rem] font-medium text-brand-green">
                    Live
                  </span>
                ) : null}
                <span className="text-[0.75rem] text-brand-stone">
                  {stamp(v.publishedAt)} · by <span className="font-medium text-brand-ink">{v.publishedBy}</span>
                </span>
                <span className="ml-auto text-[0.75rem] text-brand-stone">
                  {v.changes.length} change{v.changes.length === 1 ? "" : "s"}
                  {v.initial ? " from defaults" : ""}
                  <span aria-hidden className="ml-2 inline-block transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </span>
              </summary>

              <div className="border-t border-brand-ink/10 px-4 py-3 sm:px-5">
                {v.initial ? (
                  <p className="pb-2 text-small text-brand-stone">
                    The first configuration published from the admin panel, compared
                    with the site&apos;s built-in default prices.
                  </p>
                ) : null}
                {v.changes.length === 0 ? (
                  <p className="text-small text-brand-stone">
                    {v.initial ? "Published the defaults unchanged." : "Republished with no price changes."}
                  </p>
                ) : (
                  <>
                    <div className={cn("hidden grid-cols-[1fr_9rem_1.5rem_9rem] gap-3 pb-2 sm:grid", META_LABEL)}>
                      <span>Field</span>
                      <span>Before</span>
                      <span aria-hidden />
                      <span>After</span>
                    </div>
                    <ul className="divide-y divide-brand-ink/10">
                      {v.changes.map((c, j) => (
                        <li
                          key={`${c.field}-${j}`}
                          className="grid grid-cols-[1fr_auto_auto_auto] items-baseline gap-x-2 gap-y-1 py-2 text-small sm:grid-cols-[1fr_9rem_1.5rem_9rem] sm:gap-3"
                        >
                          <span className="col-span-4 text-brand-ink sm:col-span-1">{c.field}</span>
                          <span className="tabular-nums text-brand-stone line-through decoration-brand-stone/40">
                            {c.from}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 self-center text-brand-stone" aria-hidden />
                          <span
                            className={cn(
                              "font-medium tabular-nums",
                              c.kind === "removed" ? "text-brand-stone" : "text-brand-green",
                            )}
                          >
                            {c.to}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
