"use client";

import { useEffect } from "react";
import { SESSION_CHANNEL, TAB_ID } from "@/components/admin/SessionWatcher";

/**
 * Rendered by the login page only when there is no session.
 *
 * Reaching this point means the server has already rendered a signed-out
 * page, so the cookie is definitively gone — which makes it the safe moment
 * to tell any other admin tabs to leave. Announcing at sign-out time instead
 * would race the request that clears the cookie.
 */
export function SessionEndedBroadcast() {
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(SESSION_CHANNEL);
    channel.postMessage({ type: "signed-out", from: TAB_ID });
    channel.close();
  }, []);

  return null;
}
