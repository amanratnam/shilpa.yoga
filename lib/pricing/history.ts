import "server-only";
import { verifySession } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/admin/supabase";
import { dataError } from "@/lib/admin/errors";
import { PRICING_MODES, formatINR, formatUSD, modeConfigLabels } from "@/lib/pricing/config";
import { defaultPricing } from "@/content/pricing";

/**
 * Pricing activity history, read straight from `pricing_config`.
 *
 * That table is append-only — every publish is a new row and the newest is
 * live — so it already is the audit log. Nothing extra is written on publish;
 * each version is compared with the one before it to say what changed.
 * Comparisons use the stored JSON exactly as published (not re-parsed with
 * today's schema), so the log reflects what was actually saved.
 */

export type PricingChange = {
  /** What changed, in plain words, e.g. "Online · Trial Class · price (₹)". */
  field: string;
  from: string;
  to: string;
  kind: "changed" | "added" | "removed";
};

export type PricingVersion = {
  id: string;
  /** 1 for the first publish, counting up. */
  version: number;
  publishedAt: string;
  publishedBy: string;
  /** For the first version, what it changed from the built-in defaults. */
  changes: PricingChange[];
  initial: boolean;
  live: boolean;
};

type Row = { id: string; created_at: string; published_by: string; config: unknown };

// ---------------------------------------------------------------------------
// Diffing
// ---------------------------------------------------------------------------

type Json = Record<string, unknown>;
const obj = (v: unknown): Json => (v && typeof v === "object" ? (v as Json) : {});
const num = (v: unknown): number | undefined => (typeof v === "number" ? v : undefined);

const inr = (v: unknown) => (num(v) === undefined ? "—" : formatINR(num(v)!));
/** A blank dollar price means "convert from rupees", so say that. */
const usd = (v: unknown) => (num(v) === undefined ? "auto" : formatUSD(num(v)!));
const text = (v: unknown) => (typeof v === "string" && v ? v : "—");

const OPTION_KEYS = [
  ["trial", "Trial"],
  ["single", "Single session"],
  ["natal", "Prenatal / Postnatal"],
  ["corporate", "Corporate"],
] as const;

function push(out: PricingChange[], field: string, from: string, to: string) {
  if (from !== to) out.push({ field, from, to, kind: "changed" });
}

/** Everything that differs between two published configurations. */
export function diffPricing(prevRaw: unknown, nextRaw: unknown): PricingChange[] {
  const prev = obj(prevRaw);
  const next = obj(nextRaw);
  const out: PricingChange[] = [];

  const pd = obj(prev.discount);
  const nd = obj(next.discount);
  push(
    out,
    "Multi-month discount · applies from",
    pd.months === undefined ? "—" : `${pd.months} months`,
    nd.months === undefined ? "—" : `${nd.months} months`,
  );
  push(
    out,
    "Multi-month discount · percent",
    pd.percent === undefined ? "—" : `${pd.percent}%`,
    nd.percent === undefined ? "—" : `${nd.percent}%`,
  );
  push(
    out,
    "Dollar conversion rate",
    num(prev.usdRate) === undefined ? "—" : `₹${prev.usdRate} per $1`,
    num(next.usdRate) === undefined ? "—" : `₹${next.usdRate} per $1`,
  );

  for (const mode of PRICING_MODES) {
    const modeLabel = modeConfigLabels[mode];
    const pm = obj(obj(prev.modes)[mode]);
    const nm = obj(obj(next.modes)[mode]);

    for (const [key, fallback] of OPTION_KEYS) {
      const po = pm[key];
      const no = nm[key];
      // Name the option by what it is called now (or was, if removed).
      const name = text(obj(no).name) !== "—" ? text(obj(no).name) : text(obj(po).name);
      const label = `${modeLabel} · ${name === "—" ? fallback : name}`;

      if (!po && no) {
        out.push({ field: label, from: "—", to: `Added at ${inr(obj(no).amount)}`, kind: "added" });
        continue;
      }
      if (po && !no) {
        out.push({ field: label, from: inr(obj(po).amount), to: "Removed", kind: "removed" });
        continue;
      }
      push(out, `${label} · name`, text(obj(po).name), text(obj(no).name));
      push(out, `${label} · price (₹)`, inr(obj(po).amount), inr(obj(no).amount));
      push(out, `${label} · price ($)`, usd(obj(po).amountUsd), usd(obj(no).amountUsd));
    }

    // Monthly tiers are identified by their session count.
    const tiers = (v: unknown) =>
      new Map(
        (Array.isArray(v) ? v : []).map((t) => [num(obj(t).sessions) ?? 0, obj(t)] as const),
      );
    const pt = tiers(pm.monthly);
    const nt = tiers(nm.monthly);
    const counts = [...new Set([...pt.keys(), ...nt.keys()])].sort((a, b) => a - b);
    for (const sessions of counts) {
      const label = `${modeLabel} · Monthly, ${sessions} sessions`;
      const a = pt.get(sessions);
      const b = nt.get(sessions);
      if (!a && b) {
        out.push({ field: label, from: "—", to: `Added at ${inr(b.amount)}`, kind: "added" });
      } else if (a && !b) {
        out.push({ field: label, from: inr(a.amount), to: "Removed", kind: "removed" });
      } else if (a && b) {
        push(out, `${label} · price (₹)`, inr(a.amount), inr(b.amount));
        push(out, `${label} · price ($)`, usd(a.amountUsd), usd(b.amountUsd));
      }
    }
  }

  return out;
}

// ---------------------------------------------------------------------------
// Reading
// ---------------------------------------------------------------------------

/** Every published version, newest first, each with its changes. */
export async function getPricingHistory(): Promise<PricingVersion[]> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("pricing_config")
    .select("id, created_at, published_by, config")
    .order("created_at", { ascending: true });

  if (error) throw dataError(error, "Could not load pricing history");
  const rows = (data ?? []) as Row[];

  return rows
    .map((row, i) => ({
      id: row.id,
      version: i + 1,
      publishedAt: row.created_at,
      publishedBy: row.published_by,
      changes: diffPricing(i === 0 ? defaultPricing : rows[i - 1].config, row.config),
      initial: i === 0,
      live: i === rows.length - 1,
    }))
    .reverse();
}
