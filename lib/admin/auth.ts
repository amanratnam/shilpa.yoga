import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, decodeSession, type SessionPayload } from "@/lib/admin/session";

/**
 * Data Access Layer guard. `proxy.ts` does a cheap optimistic cookie check, but
 * this is the real one — every page, Server Action and Route Handler that
 * touches client data must call it, since Server Actions are reachable by
 * direct POST regardless of what the proxy did.
 */
export const verifySession = cache(async (): Promise<SessionPayload> => {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await decodeSession(cookie);

  if (!session) {
    redirect("/admin/login");
  }

  return session;
});

/** Non-redirecting variant, for deciding what to render on the login page. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  return decodeSession(cookie);
}
