import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
];

export function AdminHeader({
  username,
  active,
}: {
  username: string;
  active: "clients" | "subscriptions";
}) {
  return (
    <header className="border-b border-brand-ink/10 bg-brand-white">
      <div className="container-content flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-5">
        <div className="flex items-center gap-8">
          <Logo />
          <nav aria-label="Admin sections" className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = tab.href.endsWith(active);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-brand px-4 py-2 text-small font-medium transition-colors duration-300 ease-brand",
                    isActive
                      ? "bg-brand-green text-brand-cream"
                      : "text-brand-stone hover:bg-brand-cream hover:text-brand-ink",
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
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-brand border border-brand-ink/15 px-4 py-2 text-small font-medium text-brand-ink transition-colors duration-300 ease-brand hover:border-brand-green hover:text-brand-green"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
