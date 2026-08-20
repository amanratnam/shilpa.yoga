"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  adminCredentials,
  encodeSession,
  safeEqual,
} from "@/lib/admin/session";
import { verifySession } from "@/lib/admin/auth";
import { clientSchema, insertClient, updateClient } from "@/lib/admin/clients";
import {
  insertSubscription,
  subscriptionSchema,
  updateSubscription,
} from "@/lib/admin/subscriptions";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

/**
 * Read a form field as a string.
 *
 * A `<select>` whose only selected option is the disabled "Select…" placeholder
 * submits nothing at all, so `formData.get()` returns null rather than "".
 * Normalising to "" here keeps the schemas' own messages ("Select a yoga
 * package") instead of leaking raw type errors.
 */
function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

/** Flatten a ZodError into one message per field, for inline form errors. */
function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const username = str(formData, "username");
  const password = str(formData, "password");
  const next = str(formData, "next");

  const ok =
    safeEqual(username, adminCredentials.username) &&
    safeEqual(password, adminCredentials.password);

  if (!ok) {
    // Deliberately vague, so this can't be used to enumerate the username.
    return { error: "Incorrect username or password." };
  }

  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  (await cookies()).set(SESSION_COOKIE, await encodeSession({ username, exp }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  // Only allow same-site relative paths back into the admin panel.
  const destination = next.startsWith("/admin") ? next : "/admin";
  redirect(destination);
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

function clientFromForm(formData: FormData) {
  return clientSchema.safeParse({
    fullName: str(formData, "fullName"),
    age: str(formData, "age"),
    gender: str(formData, "gender"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    referralSource: str(formData, "referralSource"),
    status: str(formData, "status"),
    notes: str(formData, "notes"),
  });
}

export async function saveClientAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Server Actions are reachable by direct POST, so re-check auth here.
  await verifySession();

  const parsed = clientFromForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };

  // A blank id means "create"; anything else is an edit of that client.
  const id = str(formData, "id");

  try {
    if (id) {
      await updateClient(id, parsed.data);
    } else {
      await insertClient(parsed.data);
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not save this client." };
  }

  revalidatePath("/admin/clients");
  if (id) revalidatePath(`/admin/clients/${id}`);
  redirect(id ? `/admin/clients/${id}` : "/admin/clients");
}

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

export async function saveSubscriptionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await verifySession();

  const parsed = subscriptionSchema.safeParse({
    clientId: str(formData, "clientId"),
    yogaMode: str(formData, "yogaMode"),
    yogaPackage: str(formData, "yogaPackage"),
    startDate: str(formData, "startDate"),
    endDate: str(formData, "endDate"),
    paymentDone: formData.get("paymentDone") === "on",
    paymentMethod: str(formData, "paymentMethod"),
    notes: str(formData, "notes"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };

  const id = str(formData, "id");
  // Where to land afterwards: the client's page when added from there.
  const returnTo = str(formData, "returnTo");

  try {
    if (id) {
      await updateSubscription(id, parsed.data);
    } else {
      await insertSubscription(parsed.data);
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not save this subscription.",
    };
  }

  revalidatePath("/admin/subscriptions");
  revalidatePath(`/admin/clients/${parsed.data.clientId}`);
  redirect(returnTo.startsWith("/admin") ? returnTo : "/admin/subscriptions");
}
