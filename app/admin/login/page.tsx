import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { SessionEndedBroadcast } from "@/components/admin/SessionEndedBroadcast";
import { getSession } from "@/lib/admin/auth";
import { logoutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

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
    <div className="grid flex-1 place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        {/* Tells any other admin tabs the session is over. */}
        {session ? null : <SessionEndedBroadcast />}
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>

        {expired ? (
          <div className="mb-6 rounded-brand border border-brand-gold/60 bg-brand-gold/10 p-5">
            <p className="text-small text-brand-ink">
              Your session ended after an hour. Sign in again to continue.
            </p>
          </div>
        ) : null}

        {signedout && !session ? (
          <div className="mb-6 rounded-brand border border-brand-ink/15 bg-brand-white p-5">
            <p className="text-small text-brand-ink">
              You&apos;ve been signed out in another tab.
            </p>
          </div>
        ) : null}

        {session ? (
          <div className="mb-6 rounded-brand border border-brand-green/25 bg-brand-green/5 p-5">
            <p className="text-small text-brand-ink">
              You&apos;re already signed in as{" "}
              <span className="font-medium">{session.username}</span>.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/admin"
                className="text-small font-medium text-brand-green underline underline-offset-4"
              >
                Continue to admin
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

        <div className="rounded-brand border border-brand-ink/10 bg-brand-white p-8">
          <h1 className="text-h3 text-brand-ink">Sign in</h1>
          <p className="mt-2 text-small text-brand-stone">
            Client management for Shilpa Yoga Space.
          </p>
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
