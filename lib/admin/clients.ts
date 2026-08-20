import "server-only";
import { z } from "zod";
import { verifySession } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/admin/supabase";
import {
  CLIENT_STATUSES,
  GENDERS,
  REFERRAL_SOURCES,
  type ClientStatus,
  type Gender,
  type ReferralSource,
} from "@/lib/admin/enums";

export const clientSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the client's full name").max(120),
  age: z.coerce
    .number({ error: "Enter a valid age" })
    .int("Age must be a whole number")
    .min(1, "Enter a valid age")
    .max(120, "Enter a valid age"),
  gender: z.enum(GENDERS, { error: "Select a gender" }),
  // Optional, but must be a real address when given. Lowercased so the
  // partial unique index in Postgres is effectively case-insensitive.
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(200)
    .optional()
    .or(z.literal("")),
  referralSource: z.enum(REFERRAL_SOURCES, { error: "Select how they found us" }),
  status: z.enum(CLIENT_STATUSES, { error: "Select a client status" }),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ClientInput = z.infer<typeof clientSchema>;

export type ClientRecord = {
  id: string;
  createdAt: string;
  fullName: string;
  age: number;
  gender: Gender;
  email: string;
  referralSource: ReferralSource;
  status: ClientStatus;
  notes: string;
  /** Present on list views, so the table can show how many packages they hold. */
  subscriptionCount?: number;
};

type ClientRow = {
  id: string;
  created_at: string;
  full_name: string;
  age: number;
  gender: string;
  email: string | null;
  referral_source: string;
  status: string;
  notes: string | null;
  subscriptions?: { count: number }[];
};

function toRecord(row: ClientRow): ClientRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    fullName: row.full_name,
    age: row.age,
    gender: row.gender as Gender,
    email: row.email ?? "",
    referralSource: row.referral_source as ReferralSource,
    status: row.status as ClientStatus,
    notes: row.notes ?? "",
    subscriptionCount: row.subscriptions?.[0]?.count,
  };
}

/** Map an input to its database column names. */
function toColumns(input: ClientInput) {
  return {
    full_name: input.fullName,
    age: input.age,
    gender: input.gender,
    // Store NULL rather than "" so the partial unique index ignores blanks.
    email: input.email ? input.email : null,
    referral_source: input.referralSource,
    status: input.status,
    notes: input.notes || null,
  };
}

/** Postgres unique-violation, i.e. that email already belongs to a client. */
const UNIQUE_VIOLATION = "23505";

export async function listClients(): Promise<ClientRecord[]> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("clients")
    .select("*, subscriptions(count)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load clients: ${error.message}`);
  return (data as ClientRow[]).map(toRecord);
}

/** Minimal list for the "select an existing client" dropdown. */
export async function listClientOptions(): Promise<{ id: string; label: string }[]> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("clients")
    .select("id, full_name, email")
    .order("full_name", { ascending: true });

  if (error) throw new Error(`Could not load clients: ${error.message}`);
  return (data as { id: string; full_name: string; email: string | null }[]).map((row) => ({
    id: row.id,
    label: row.email ? `${row.full_name} (${row.email})` : row.full_name,
  }));
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
    .insert(toColumns(input))
    .select("*")
    .single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      throw new Error("A client with that email address already exists.");
    }
    throw new Error(`Could not save client: ${error.message}`);
  }
  return toRecord(data as ClientRow);
}

export async function updateClient(id: string, input: ClientInput): Promise<ClientRecord> {
  await verifySession();

  const { data, error } = await supabaseAdmin()
    .from("clients")
    .update(toColumns(input))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      throw new Error("A client with that email address already exists.");
    }
    throw new Error(`Could not update client: ${error.message}`);
  }
  return toRecord(data as ClientRow);
}
