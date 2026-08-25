import "server-only";
import { z } from "zod";
import { verifySession } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/admin/supabase";
import { dataError } from "@/lib/admin/errors";
import { getPricingConfig } from "@/lib/pricing/store";
import {
  buildPackages,
  packageIndex,
  sessionsFromPackageId,
  type PricingConfig,
  type YogaPackage,
} from "@/lib/pricing/config";
import {
  PAYMENT_METHODS,
  YOGA_MODES,
  modeToPricingMode,
  type PaymentMethod,
  type YogaMode,
} from "@/lib/admin/enums";

/**
 * Built per request against the live pricing config, so a package the admin
 * has retired stops being selectable. `allowPackageId` keeps the package a
 * subscription was *already* sold on valid while editing that row, so
 * retiring a tier never makes an existing record unsaveable.
 */
export function buildSubscriptionSchema(
  packages: Map<string, YogaPackage>,
  allowPackageId?: string,
) {
  const knows = (id: string) => packages.has(id) || (!!allowPackageId && id === allowPackageId);
  const modeOf = (id: string) => packages.get(id)?.mode;

  return z
  .object({
    clientId: z.uuid("Select a client"),
    yogaMode: z.enum(YOGA_MODES, { error: "Select a yoga mode" }),
    // Checked against the live pricing table, so packages can never drift.
    yogaPackage: z.string().refine(knows, "Select a yoga package"),
    startDate: z.iso.date("Select a subscription start date"),
    endDate: z.iso.date("Select a subscription end date"),
    paymentDone: z.boolean(),
    paymentMethod: z.enum(PAYMENT_METHODS, { error: "Select a payment method" }),
    notes: z.string().trim().max(2000).optional().or(z.literal("")),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  })
  // The form filters packages by mode, but Server Actions accept direct POSTs,
  // so the pairing is enforced here too.
  .refine(
    (data) =>
      // A retired package kept for an edit has no live mode to check against.
      data.yogaPackage === allowPackageId ||
      modeOf(data.yogaPackage) === modeToPricingMode(data.yogaMode),
    {
      message: "That package is not available for the selected yoga mode",
      path: ["yogaPackage"],
    },
  );
}

export type SubscriptionInput = z.infer<ReturnType<typeof buildSubscriptionSchema>>;

/** Where a subscription sits relative to today. */
export type SubscriptionState = "upcoming" | "current" | "expired";

export const subscriptionStateLabels: Record<SubscriptionState, string> = {
  upcoming: "Upcoming",
  current: "Current",
  expired: "Expired",
};

export type SubscriptionRecord = SubscriptionInput & {
  id: string;
  createdAt: string;
  /** Package name without the mode or price, e.g. "Monthly, 8 sessions". */
  packageLabel: string;
  packageAmount: number | null;
  /** Classes the package covers, for receipts. */
  packageSessions: number | null;
  state: SubscriptionState;
  /** Joined from `clients`, for the subscriptions list view. */
  clientName?: string;
};

type SubscriptionRow = {
  id: string;
  created_at: string;
  client_id: string;
  yoga_mode: string;
  yoga_package: string;
  start_date: string;
  end_date: string;
  payment_done: boolean;
  payment_method: string;
  notes: string | null;
  package_label: string | null;
  package_amount: number | null;
  clients?: { full_name: string } | null;
};

function stateOf(startDate: string, endDate: string): SubscriptionState {
  // ISO date strings compare correctly as plain strings.
  const today = new Date().toISOString().slice(0, 10);
  if (startDate > today) return "upcoming";
  if (endDate < today) return "expired";
  return "current";
}

/**
 * Rows written before the snapshot columns existed resolve against the live
 * config, exactly as every row used to. Anything sold since carries its own
 * label and amount, so a later price change cannot rewrite it.
 */
function toRecord(row: SubscriptionRow, live: Map<string, YogaPackage>): SubscriptionRecord {
  const pkg = live.get(row.yoga_package);
  return {
    id: row.id,
    createdAt: row.created_at,
    clientId: row.client_id,
    yogaMode: row.yoga_mode as YogaMode,
    yogaPackage: row.yoga_package,
    // Fall back to the stored id so a retired package still renders something.
    packageLabel: row.package_label ?? pkg?.shortLabel ?? row.yoga_package,
    packageAmount: row.package_amount ?? pkg?.amount ?? null,
    packageSessions: pkg?.sessions ?? sessionsFromPackageId(row.yoga_package),
    startDate: row.start_date,
    endDate: row.end_date,
    paymentDone: row.payment_done,
    paymentMethod: row.payment_method as PaymentMethod,
    notes: row.notes ?? "",
    state: stateOf(row.start_date, row.end_date),
    clientName: row.clients?.full_name,
  };
}

function toColumns(input: SubscriptionInput, pkg: YogaPackage | undefined) {
  return {
    client_id: input.clientId,
    yoga_mode: input.yogaMode,
    yoga_package: input.yogaPackage,
    start_date: input.startDate,
    end_date: input.endDate,
    payment_done: input.paymentDone,
    payment_method: input.paymentMethod,
    notes: input.notes || null,
    // Snapshot the price as sold. Left untouched when the package is one the
    // admin has since retired, so an edit cannot erase the original amount.
    ...(pkg ? { package_label: pkg.shortLabel, package_amount: pkg.amount } : {}),
  };
}

/** The live package list, for resolving rows and validating writes. */
async function livePackages(): Promise<Map<string, YogaPackage>> {
  return packageIndex(await getPricingConfig());
}

export async function listSubscriptions(): Promise<SubscriptionRecord[]> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("subscriptions")
    .select("*, clients(full_name)")
    .order("start_date", { ascending: false });

  if (error) throw dataError(error, "Could not load subscriptions");
  const live = await livePackages();
  return (data as SubscriptionRow[]).map((row) => toRecord(row, live));
}

/** A client's full history, newest first — the audit trail on their page. */
export async function listSubscriptionsForClient(
  clientId: string,
): Promise<SubscriptionRecord[]> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("subscriptions")
    .select("*")
    .eq("client_id", clientId)
    .order("start_date", { ascending: false });

  if (error) throw dataError(error, "Could not load subscriptions");
  const live = await livePackages();
  return (data as SubscriptionRow[]).map((row) => toRecord(row, live));
}

export async function getSubscription(id: string): Promise<SubscriptionRecord | null> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("subscriptions")
    .select("*, clients(full_name)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw dataError(error, "Could not load subscription");
  return data ? toRecord(data as SubscriptionRow, await livePackages()) : null;
}

export async function insertSubscription(
  input: SubscriptionInput,
): Promise<SubscriptionRecord> {
  await verifySession();

  const live = await livePackages();
  const { data, error } = await supabaseAdmin()
    .from("subscriptions")
    .insert(toColumns(input, live.get(input.yogaPackage)))
    .select("*")
    .single();

  if (error) throw dataError(error, "Could not save subscription");
  return toRecord(data as SubscriptionRow, live);
}

export async function updateSubscription(
  id: string,
  input: SubscriptionInput,
): Promise<SubscriptionRecord> {
  await verifySession();

  const live = await livePackages();
  const { data, error } = await supabaseAdmin()
    .from("subscriptions")
    .update(toColumns(input, live.get(input.yogaPackage)))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw dataError(error, "Could not update subscription");
  return toRecord(data as SubscriptionRow, live);
}

/** Packages offered for a given mode, for the dependent dropdown in the form. */
export function packagesForMode(mode: YogaMode, config: PricingConfig) {
  const target = modeToPricingMode(mode);
  return buildPackages(config).filter((p) => p.mode === target);
}
