"use client";

import { useRef } from "react";
import { ChevronDown, Search } from "lucide-react";

/**
 * Campaign dropdown and search for the Leads screen, as one GET form so the
 * filtered view lives in the URL (shareable, and what "Export" downloads).
 * Picking a campaign applies straight away; search applies on Enter.
 */
export function LeadsFilters({
  options,
  campaign,
  q,
}: {
  /** `value` "" means all campaigns. */
  options: { value: string; label: string; count: number }[];
  campaign: string;
  q: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action="/admin/leads"
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <label className="relative sm:w-64">
        <span className="sr-only">Campaign</span>
        <select
          name="campaign"
          defaultValue={campaign}
          onChange={() => formRef.current?.requestSubmit()}
          className="h-10 w-full appearance-none rounded-brand border border-brand-ink/15 bg-brand-white pl-3 pr-9 text-base text-brand-ink focus:border-brand-green focus:outline-none sm:text-small"
        >
          {options.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label} ({o.count})
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-stone" aria-hidden />
      </label>
      <label className="relative sm:w-72">
        <span className="sr-only">Search leads</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-stone" aria-hidden />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search name, phone, email"
          className="h-10 w-full rounded-brand border border-brand-ink/15 bg-brand-white pl-9 pr-3 text-base text-brand-ink placeholder:text-brand-stone/70 focus:border-brand-green focus:outline-none sm:text-small"
        />
      </label>
    </form>
  );
}
