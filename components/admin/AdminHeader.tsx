import { LogOut } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { logoutAction } from "@/app/admin/actions";

export function AdminHeader({ username }: { username: string }) {
  return (
    <header className="border-b border-brand-ink/10 bg-brand-white">
      <div className="container-content flex items-center justify-between gap-6 py-5">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden text-eyebrow uppercase tracking-[0.1em] text-brand-stone sm:inline">
            Client Admin
          </span>
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
