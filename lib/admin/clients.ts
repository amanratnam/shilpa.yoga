import "server-only";
import { z } from "zod";
import { verifySession } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/admin/supabase";
import { yogaPackageById, yogaPackages } from "@/content/pricing";

export const GENDERS = ["female", "male", "other", "prefer_not_to_say"] as const;
export const YOGA_MODES = ["online", "offline"] as const;

export const genderLabels: Record<(typeof GENDERS)[number], string> = {
  female: "Female",
  male: "Male",
  other: "Other",
  prefer_not_to_say: "Prefer not to say",
};

export const modeLabels: Record<(typeof YOGA_MODES)[number], string> = {
  online: "Online",
  offline: "Offline (in person)",
};

/**
 * The pricing table calls in-person sessions "personal"; the admin form calls
 * the same thing "offline".
 */
function modeToPricingMode(mode: (typeof YOGA_MODES)[number]) {
  return mode === "offline" ? "personal" : "online";
}

export const clientSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter the client's full name").max(120),
    age: z.coerce
      .number({ error: "Enter a valid age" })
      .int("Age must be a whole number")
      .min(1, "Enter a valid age")
      .max(120, "Enter a valid age"),
    gender: z.enum(GENDERS, { error: "Select a gender" }),
    yogaMode: z.enum(YOGA_MODES, { error: "Select a yoga mode" }),
    // Validated against the live pricing table, so packages can never drift.
    yogaPackage: z
      .string()
      .refine((id) => yogaPackageById.has(id), "Select a yoga package"),
    startDate: z.iso.date("Select a subscription start date"),
    endDate: z.iso.date("Select a subscription end date"),
    paymentDone: z.boolean(),
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

export type ClientInput = z.infer<typeof clientSchema>;

export type ClientRecord = ClientInput & {
  id: string;
  createdAt: string;
  /** Package name without the mode or price, e.g. "Monthly, 8 sessions". */
  packageLabel: string;
  /** Package amount in rupees at the time of display. */
  packageAmount: number | null;
};

/** Shape of a row in the `clients` table. */
type ClientRow = {
  id: string;
  created_at: string;
  full_name: string;
  age: number;
  gender: string;
  yoga_mode: string;
  yoga_package: string;
  start_date: string;
  end_date: string;
  payment_done: boolean;
  notes: string | null;
};

function toRecord(row: ClientRow): ClientRecord {
  const pkg = yogaPackageById.get(row.yoga_package);
  return {
    id: row.id,
    createdAt: row.created_at,
    fullName: row.full_name,
    age: row.age,
    gender: row.gender as ClientInput["gender"],
    yogaMode: row.yoga_mode as ClientInput["yogaMode"],
    yogaPackage: row.yoga_package,
    // Fall back to the stored id so a renamed package still renders something.
    packageLabel: pkg?.shortLabel ?? row.yoga_package,
    packageAmount: pkg?.amount ?? null,
    startDate: row.start_date,
    endDate: row.end_date,
    paymentDone: row.payment_done,
    notes: row.notes ?? "",
  };
}

export async function listClients(): Promise<ClientRecord[]> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load clients: ${error.message}`);
  return (data as ClientRow[]).map(toRecord);
}

export async function getClient(id: string): Promise<ClientRecord | null> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Could not load client: ${error.message}`);
  return data ? toRecord(data as ClientRow) : null;
}

export async function insertClient(input: ClientInput): Promise<ClientRecord> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("clients")
    .insert({
      full_name: input.fullName,
      age: input.age,
      gender: input.gender,
      yoga_mode: input.yogaMode,
      yoga_package: input.yogaPackage,
      start_date: input.startDate,
      end_date: input.endDate,
      payment_done: input.paymentDone,
      notes: input.notes || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(`Could not save client: ${error.message}`);
  return toRecord(data as ClientRow);
}

/** Packages offered for a given mode, for the dependent dropdown in the form. */
export function packagesForMode(mode: (typeof YOGA_MODES)[number]) {
  return yogaPackages.filter((p) => p.mode === modeToPricingMode(mode));
}
