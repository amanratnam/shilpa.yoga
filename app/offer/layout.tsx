/**
 * Festival landing pages live outside the main site's chrome: no navbar, no
 * footer menu. The only way out is the logo, back to the home page.
 */
export default function OfferLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-1 flex-col">{children}</div>;
}
