import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { LoginVisual } from "@/components/admin/login/LoginVisual";
import { SessionEndedBroadcast } from "@/components/admin/SessionEndedBroadcast";
import { getSession } from "@/lib/admin/auth";
import { logoutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Studio admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Sign-in for the studio admin, at /admin. The panel itself starts at /admin/dashboard. */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; expired?: string; signedout?: string }>;
}) {
  const { next, expired, signedout } = await searchParams;
  // Reachable even when signed in, so there is always a way back to a login
  // form (and a way to switch user) rather than being bounced to the panel.
  const session = await getSession();

  return (
    <div className="grid min-h-dvh flex-1 bg-brand-cream lg:grid-cols-[1.2fr_1fr]">
      <LoginVisual />

      <main className="flex flex-col px-5 pb-8 pt-7 sm:px-10 lg:justify-center lg:px-16 lg:py-12">
        {/* Tells any other admin tabs the session is over. */}
        {session ? null : <SessionEndedBroadcast />}

        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-brand-ink sm:text-h2">
            Welcome back
          </h1>
          <p className="mt-2 text-small text-brand-stone sm:text-body">
            Sign in to run Shilpa Yoga Space: clients, subscriptions, receipts
            and pricing, in one calm place.
          </p>

          {expired ? (
            <div role="status" className="mt-6 rounded-brand border border-brand-gold/60 bg-brand-gold/10 p-4">
              <p className="text-small text-brand-ink">
                Your session ended after an hour. Sign in again to continue.
              </p>
            </div>
          ) : null}

          {signedout && !session ? (
            <div role="status" className="mt-6 rounded-brand border border-brand-ink/15 bg-brand-white p-4">
              <p className="text-small text-brand-ink">You&apos;ve been signed out in another tab.</p>
            </div>
          ) : null}

          {session ? (
            <div className="mt-6 rounded-brand border border-brand-green/25 bg-brand-green/5 p-4">
              <p className="text-small text-brand-ink">
                You&apos;re already signed in as{" "}
                <span className="font-medium">{session.username}</span>.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-brand bg-brand-green px-4 text-small font-medium text-brand-cream transition-colors hover:bg-brand-ink"
                >
                  Go to dashboard
                  <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-small font-medium text-brand-stone underline underline-offset-4 hover:text-brand-ink"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          ) : null}

          <LoginForm next={next} />

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-brand-ink/10 pt-5 text-[0.75rem] text-brand-stone">
            <span className="inline-flex items-center gap-1.5">
              <LockKeyhole className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              Private area · sessions last an hour
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 underline-offset-4 hover:text-brand-ink hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              shilpa.yoga
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
