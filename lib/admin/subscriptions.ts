import "server-only";
import { z } from "zod";
import { verifySession } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/admin/supabase";
import { dataError } from "@/lib/admin/errors";
import { yogaPackageById, yogaPackages } from "@/content/pricing";
import {
  PAYMENT_METHODS,
  YOGA_MODES,
  modeToPricingMode,
  type PaymentMethod,
  type YogaMode,
} from "@/lib/admin/enums";

export const subscriptionSchema = z
  .object({
    clientId: z.uuid("Select a client"),
    yogaMode: z.enum(YOGA_MODES, { error: "Select a yoga mode" }),
    // Checked against the live pricing table, so packages can never drift.
    yogaPackage: z.string().refine((id) => yogaPackageById.has(id), "Select a yoga package"),
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
    (data) => yogaPackageById.get(data.yogaPackage)?.mode === modeToPricingMode(data.yogaMode),
    {
      message: "That package is not available for the selected yoga mode",
      path: ["yogaPackage"],
    },
  );

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;

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
  clients?: { full_name: string } | null;
};

function stateOf(startDate: string, endDate: string): SubscriptionState {
  // ISO date strings compare correctly as plain strings.
  const today = new Date().toISOString().slice(0, 10);
  if (startDate > today) return "upcoming";
  if (endDate < today) return "expired";
  return "current";
}

function toRecord(row: SubscriptionRow): SubscriptionRecord {
  const pkg = yogaPackageById.get(row.yoga_package);
  return {
    id: row.id,
    createdAt: row.created_at,
    clientId: row.client_id,
    yogaMode: row.yoga_mode as YogaMode,
    yogaPackage: row.yoga_package,
    // Fall back to the stored id so a renamed package still renders something.
    packageLabel: pkg?.shortLabel ?? row.yoga_package,
    packageAmount: pkg?.amount ?? null,
    startDate: row.start_date,
    endDate: row.end_date,
    paymentDone: row.payment_done,
    paymentMethod: row.payment_method as PaymentMethod,
    notes: row.notes ?? "",
    state: stateOf(row.start_date, row.end_date),
    clientName: row.clients?.full_name,
  };
}

function toColumns(input: SubscriptionInput) {
  return {
    client_id: input.clientId,
    yoga_mode: input.yogaMode,
    yoga_package: input.yogaPackage,
    start_date: input.startDate,
    end_date: input.endDate,
    payment_done: input.paymentDone,
    payment_method: input.paymentMethod,
    notes: input.notes || null,
  };
}

export async function listSubscriptions(): Promise<SubscriptionRecord[]> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("subscriptions")
    .select("*, clients(full_name)")
    .order("start_date", { ascending: false });

  if (error) throw dataError(error, "Could not load subscriptions");
  return (data as SubscriptionRow[]).map(toRecord);
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
  return (data as SubscriptionRow[]).map(toRecord);
}

export async function getSubscription(id: string): Promise<SubscriptionRecord | null> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("subscriptions")
    .select("*, clients(full_name)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw dataError(error, "Could not load subscription");
  return data ? toRecord(data as SubscriptionRow) : null;
}

export async function insertSubscription(
  input: SubscriptionInput,
): Promise<SubscriptionRecord> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("subscriptions")
    .insert(toColumns(input))
    .select("*")
    .single();

  if (error) throw dataError(error, "Could not save subscription");
  return toRecord(data as SubscriptionRow);
}

export async function updateSubscription(
  id: string,
  input: SubscriptionInput,
): Promise<SubscriptionRecord> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("subscriptions")
    .update(toColumns(input))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw dataError(error, "Could not update subscription");
  return toRecord(data as SubscriptionRow);
}

/** Packages offered for a given mode, for the dependent dropdown in the form. */
export function packagesForMode(mode: YogaMode) {
  return yogaPackages.filter((p) => p.mode === modeToPricingMode(mode));
}
