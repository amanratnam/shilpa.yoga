"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Backstop for anything the pages did not catch themselves. Next.js strips
 * error messages here in production, so this stays deliberately generic — the
 * useful diagnosis is rendered inline by `DataProblem` instead.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid flex-1 place-items-center px-6 py-20">
      <div className="max-w-lg text-center">
        <AlertTriangle
          className="mx-auto h-8 w-8 text-brand-gold"
          strokeWidth={1.5}
          aria-hidden
        />
        <h1 className="mt-5 text-h3 text-brand-ink">This page didn&apos;t load</h1>
        <p className="mt-3 text-body text-brand-stone">
          Something failed while loading the admin panel. This is most often the
          database not being set up yet — run{" "}
          <code className="rounded bg-brand-white px-1.5 py-0.5 text-small">
            supabase/001_schema.sql
          </code>{" "}
          and check that <code className="text-small">SUPABASE_URL</code> and{" "}
          <code className="text-small">SUPABASE_SERVICE_ROLE_KEY</code> are set.
        </p>
        {error.digest ? (
          <p className="mt-4 text-small text-brand-stone">
            Error reference: <span className="font-mono">{error.digest}</span>
          </p>
        ) : null}
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button href="/admin/login" variant="secondary">
            Back to sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
