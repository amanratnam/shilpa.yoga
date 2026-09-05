import "server-only";
import { unstable_cache, revalidatePath, updateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/admin/supabase";
import {
  defaultPricingConfig,
  pricingConfigSchema,
  type PricingConfig,
} from "@/lib/pricing/config";

/**
 * Live pricing, read once per cache entry and shared across every page.
 *
 * This project does not use Cache Components, so the supported tools here are
 * `unstable_cache` + `revalidateTag` rather than the `use cache` directive
 * (which would need the app-wide `cacheComponents` flag). Every consumer reads
 * through one tag, so a publish invalidates the public pricing cards, the
 * enquiry form's dropdown and the admin package list together.
 */
export const PRICING_TAG = "pricing-config";

/** Rows are append-only; the newest one is live. */
type ConfigRow = { config: unknown };

/**
 * The stored row, unparsed. `null` when nothing is published yet, or when the
 * table cannot be read at all.
 *
 * Deliberately raw: the cache outlives deploys, so caching the *parsed* object
 * meant a release that added a field served pre-upgrade objects until the tag
 * happened to be invalidated — missing defaults surfaced as NaN prices on the
 * live site. Caching the row and parsing per read applies the current schema,
 * including its defaults, to whatever is stored.
 */
async function readPublishedRow(): Promise<unknown | null> {
  const { data, error } = await supabaseAdmin()
    .from("pricing_config")
    .select("config")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<ConfigRow>();

  // Never let a pricing read break the public site. A missing table (before
  // the migration is run) or a network blip falls back to the committed
  // defaults rather than throwing into a page.
  if (error || !data) return null;
  return data.config;
}

const readCached = unstable_cache(readPublishedRow, [PRICING_TAG], {
  tags: [PRICING_TAG],
});

function parseOrDefault(raw: unknown | null): PricingConfig {
  if (raw == null) return defaultPricingConfig;
  const parsed = pricingConfigSchema.safeParse(raw);
  return parsed.success ? parsed.data : defaultPricingConfig;
}

/** Live pricing for public pages, the enquiry form and the admin panel. */
export async function getPricingConfig(): Promise<PricingConfig> {
  return parseOrDefault(await readCached());
}

/**
 * Uncached read, for the configurator itself. The editor must always load the
 * true stored row — showing a cached copy would let two publishes race and
 * silently overwrite each other.
 */
export async function getPricingConfigFresh(): Promise<PricingConfig> {
  return parseOrDefault(await readPublishedRow());
}

/** Who published the live configuration, and when. Null before the first publish. */
export async function getLastPublished(): Promise<{ at: string; by: string } | null> {
  const { data, error } = await supabaseAdmin()
    .from("pricing_config")
    .select("created_at, published_by")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ created_at: string; published_by: string }>();

  if (error || !data) return null;
  return { at: data.created_at, by: data.published_by };
}

/** Every route whose output embeds a price. */
const PRICED_PATHS = [
  "/classes/online-vinyasa",
  "/classes/personal-gurgaon",
  "/contact",
  "/admin/pricing",
  "/admin/subscriptions",
];

/**
 * Append a new configuration and make it visible immediately.
 *
 * Must be called from a Server Action: `updateTag` is Server-Action-only, and
 * it is the reason a publish is never followed by a stale price.
 * `revalidateTag(tag, "max")` would mark the entry stale and serve the old
 * value once more while refetching in the background; `updateTag` expires it
 * outright, so the very next request reads the new config.
 *
 * `revalidatePath` on top of that clears the rendered output of the public
 * pages, which are statically prerendered and would otherwise keep serving
 * the HTML built with the old numbers.
 *
 * Insert first, then invalidate: if the write fails nothing is invalidated,
 * and if invalidation fails the row is still safely stored.
 */
export async function publishPricingConfig(
  config: PricingConfig,
  publishedBy: string,
): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("pricing_config")
    .insert({ config, published_by: publishedBy });

  if (error) throw new Error(error.message);

  updateTag(PRICING_TAG);
  for (const path of PRICED_PATHS) revalidatePath(path);
}
