"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

/** Cross-tab signal, so signing out in one tab clears the others. */
export const SESSION_CHANNEL = "shilpa-admin-session";

/**
 * Identifies this tab within the channel.
 *
 * BroadcastChannel delivers to every other channel object with the same name,
 * including sibling objects in the same document. Without this, the tab doing
 * the signing out would react to its own message and navigate away, racing —
 * and potentially aborting — the POST that actually clears the cookie.
 */
export const TAB_ID = Math.random().toString(36).slice(2);

export type SessionMessage = { type: "signed-out"; from: string };

const WARN_BEFORE_MS = 5 * 60 * 1000;

function goToLogin(reason: "expired" | "signed-out") {
  // A full navigation, so no stale server-rendered data is left on screen.
  window.location.href = `/admin/login?${reason === "expired" ? "expired=1" : "signedout=1"}`;
}

/**
 * Enforces the session's one-hour lifetime in the browser.
 *
 * The cookie itself expires server-side, so security never depends on this —
 * it exists so an open tab does not sit on a dead session and fail on the next
 * click. It also covers the case of a tab left in the background: the deadline
 * is re-checked whenever the tab is shown again.
 */
export function SessionWatcher({ expiresAt }: { expiresAt: number }) {
  const [remaining, setRemaining] = useState<number>(() => expiresAt - Date.now());

  useEffect(() => {
    const check = () => {
      const left = expiresAt - Date.now();
      setRemaining(left);
      if (left <= 0) goToLogin("expired");
    };

    // A timer alone is unreliable: background tabs throttle it, and a laptop
    // that sleeps skips it entirely. Poll, and re-check on every wake-up.
    const interval = window.setInterval(check, 15_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);

    // Sign out in one tab -> every other tab follows immediately.
    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel(SESSION_CHANNEL);
      channel.onmessage = (event: MessageEvent<SessionMessage>) => {
        if (event.data?.type === "signed-out" && event.data.from !== TAB_ID) {
          goToLogin("signed-out");
        }
      };
    }

    check();
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
      channel?.close();
    };
  }, [expiresAt]);

  if (remaining > WARN_BEFORE_MS || remaining <= 0) return null;

  const minutes = Math.floor(remaining / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);

  return (
    <div
      role="status"
      className="border-b border-brand-gold/60 bg-brand-gold/15"
    >
      <div className="container-content flex flex-wrap items-center gap-2 py-2.5 text-small text-brand-ink">
        <AlertTriangle className="h-4 w-4 shrink-0 text-brand-stone" strokeWidth={2} aria-hidden />
        <span>
          Your session ends in {minutes}:{String(seconds).padStart(2, "0")}. Save any
          open work — you&apos;ll need to sign in again.
        </span>
      </div>
    </div>
  );
}
