import type { Metadata } from "next";
import { Logo } from "@/components/layout/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="grid flex-1 place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>
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
