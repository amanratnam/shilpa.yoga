"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarRange, IndianRupee, LayoutDashboard, Users } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { SessionWatcher } from "@/components/admin/SessionWatcher";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { cn } from "@/lib/utils";

/**
 * One list drives the sidebar and the phone tab bar, so adding a module is a
 * one-line change here rather than a header redesign.
 */
const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clients", Icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", Icon: CalendarRange },
  { href: "/admin/pricing", label: "Pricing", Icon: IndianRupee },
];

/**
 * The admin app frame: a fixed sidebar from `lg` up, and on phones a compact
 * top bar plus a bottom tab bar within thumb reach.
 */
export function AdminShell({
  username,
  expiresAt,
  logoutAction,
  children,
}: {
  username: string;
  /** Session expiry, as a Unix timestamp in seconds. */
  expiresAt: number;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-dvh flex-1 bg-brand-cream">
      {/* ---- Sidebar (desktop) ---- */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-brand-green text-brand-cream lg:flex">
        <div className="px-6 pb-6 pt-7">
          <Logo tone="dark" />
          <p className="mt-3 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-brand-cream/50">
            Studio admin
          </p>
        </div>
        <nav aria-label="Admin sections" className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-brand px-3 py-2.5 text-small font-medium transition-colors duration-200",
                  active
                    ? "bg-brand-cream/[0.12] text-brand-cream"
                    : "text-brand-cream/65 hover:bg-brand-cream/[0.06] hover:text-brand-cream",
                )}
              >
                <Icon
                  className={cn("h-[1.1rem] w-[1.1rem]", active ? "text-brand-gold" : "")}
                  strokeWidth={1.75}
                  aria-hidden
                />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-brand-cream/10 p-4">
          <div className="flex items-center gap-3 px-1">
            <span
              aria-hidden
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gold text-small font-semibold text-brand-ink"
            >
              {initial}
            </span>
            <span className="min-w-0 flex-1 truncate text-small text-brand-cream/80">
              {username}
            </span>
          </div>
          <div className="mt-3 [&_button]:w-full [&_button]:justify-center">
            <SignOutButton action={logoutAction} />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        {/* ---- Top bar (phones and tablets) ---- */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-brand-ink/10 bg-brand-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:hidden">
          <Logo className="[&_img]:h-8" />
          <SignOutButton action={logoutAction} compact />
        </header>

        <SessionWatcher expiresAt={expiresAt * 1000} />

        <main className="flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>

        {/* ---- Bottom tabs (phones and tablets) ---- */}
        <nav
          aria-label="Admin sections"
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-brand-ink/10 bg-brand-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        >
          {NAV.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[0.6875rem] font-medium transition-colors",
                  active ? "text-brand-green" : "text-brand-stone",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-12 place-items-center rounded-full transition-colors",
                    active && "bg-brand-green/10",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.75} aria-hidden />
                </span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
