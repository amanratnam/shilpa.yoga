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
import { clientSchema, insertClient } from "@/lib/admin/clients";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

/** Flatten a ZodError into one message per field, for inline form errors. */
function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

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

export async function createClientAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Server Actions are reachable by direct POST, so re-check auth here.
  await verifySession();

  const parsed = clientSchema.safeParse({
    fullName: formData.get("fullName"),
    age: formData.get("age"),
    gender: formData.get("gender"),
    yogaMode: formData.get("yogaMode"),
    yogaPackage: formData.get("yogaPackage"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    paymentDone: formData.get("paymentDone") === "on",
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error) };
  }

  try {
    await insertClient(parsed.data);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not save this client.",
    };
  }

  revalidatePath("/admin");
  redirect("/admin");
}
