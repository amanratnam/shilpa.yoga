"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";

function Inner() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-brand border border-brand-ink/15 bg-brand-white px-3.5 py-2 text-small font-medium text-brand-ink transition-colors duration-300 ease-brand hover:border-brand-ink/30 hover:bg-brand-cream disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" strokeWidth={2} aria-hidden />
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}

/**
 * Other tabs are not told from here. Broadcasting on submit raced the request
 * that clears the cookie, so sibling tabs re-rendered while still
 * authenticated and showed "already signed in". The login page announces it
 * instead, once the session is definitively gone.
 */
export function SignOutButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action}>
      <Inner />
    </form>
  );
}
