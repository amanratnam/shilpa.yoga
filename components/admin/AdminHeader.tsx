import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { logoutAction } from "@/app/admin/actions";
import { SessionWatcher } from "@/components/admin/SessionWatcher";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "home", href: "/admin", label: "Overview" },
  { key: "clients", href: "/admin/clients", label: "Clients" },
  { key: "subscriptions", href: "/admin/subscriptions", label: "Subscriptions" },
];

export function AdminHeader({
  username,
  active,
  /** Session expiry, as a Unix timestamp in seconds. */
  expiresAt,
}: {
  username: string;
  active: "home" | "clients" | "subscriptions";
  expiresAt: number;
}) {
  return (
    <>
      <SessionWatcher expiresAt={expiresAt * 1000} />
      <header className="border-b border-brand-ink/10 bg-brand-white">
      <div className="container-content flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-5">
        <div className="flex items-center gap-8">
          <Logo />
          <nav aria-label="Admin sections" className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = tab.key === active;
              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-brand px-3 py-1.5 text-small font-medium transition-colors duration-300 ease-brand",
                    isActive
                      ? "bg-brand-cream text-brand-green"
                      : "text-brand-stone hover:bg-brand-cream/60 hover:text-brand-ink",
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-small text-brand-stone sm:inline">
            Signed in as {username}
          </span>
          <SignOutButton action={logoutAction} />
        </div>
      </div>
      </header>
    </>
  );
}
