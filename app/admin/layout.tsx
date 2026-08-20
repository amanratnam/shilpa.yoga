import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  // Belt and braces alongside the Disallow rule in robots.ts.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-1 flex-col bg-brand-cream">{children}</div>;
}
