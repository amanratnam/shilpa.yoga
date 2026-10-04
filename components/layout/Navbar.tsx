"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Desktop dropdown opened by tap/click, for touch tablets that can't hover.
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any route change closes the menu — including the logo, back/forward and
  // in-page links, which don't pass through the menu's own onClick handlers.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  useEffect(() => {
    if (!openMenu) return;
    const close = (e: PointerEvent) => {
      if (!(e.target as Element).closest("[data-nav-menu]")) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  useEffect(() => {
    // Lock on <html> only: it propagates to the viewport, whereas setting it
    // on <body> as well turns the body into its own scroll container and the
    // sticky header scrolls away with the page behind the menu.
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    // Keep screen readers and taps inside the open menu.
    const main = document.getElementById("main");
    if (main) main.inert = mobileOpen;
    return () => {
      document.documentElement.style.overflow = "";
      if (main) main.inert = false;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 bg-brand-cream/85 backdrop-blur transition-shadow duration-300",
        scrolled ? "border-b border-brand-ink/10 shadow-[0_1px_0_rgba(26,26,26,0.04)]" : "border-b border-transparent",
      )}
    >
      <nav className="container-content flex h-16 items-center justify-between gap-6 md:h-20">
        <Logo />

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 lg:flex">
          {mainNav.map((item) => (
            <li
              key={item.href}
              className="group relative flex items-center"
              data-nav-menu={item.children ? "" : undefined}
            >
              <Link
                href={item.href}
                className={cn(
                  "inline-flex items-center py-2 text-small font-medium uppercase tracking-[0.05em] transition-colors hover:text-brand-gold",
                  isActive(item.href) ? "text-brand-green" : "text-brand-ink",
                )}
              >
                {item.label}
              </Link>
              {item.children ? (
                // Hover opens the menu on desktops; this button opens it on
                // touch tablets, where hover and tap-focus never fire.
                <button
                  type="button"
                  aria-label={`${item.label} menu`}
                  aria-expanded={openMenu === item.href}
                  onClick={() => setOpenMenu((m) => (m === item.href ? null : item.href))}
                  className="-mr-2 grid h-9 w-7 place-items-center text-brand-ink transition-colors hover:text-brand-gold"
                >
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform group-hover:rotate-180",
                      openMenu === item.href && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
              ) : null}

              {item.children ? (
                <div
                  className={cn(
                    "absolute left-0 top-full w-64 pt-3 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                    openMenu === item.href
                      ? "visible translate-y-0 opacity-100"
                      : "invisible translate-y-1 opacity-0",
                  )}
                >
                  <div className="overflow-hidden rounded-brand border border-brand-ink/10 bg-brand-white shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-5 py-4 transition-colors hover:bg-brand-cream"
                      >
                        <span className="block text-h4 font-medium text-brand-ink">
                          {child.label}
                        </span>
                        {child.description ? (
                          <span className="mt-0.5 block text-small text-brand-stone">
                            {child.description}
                          </span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/contact" className="px-6 py-3">
            Book a Trial
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          // -mr-2.5 keeps the enlarged target optically aligned to the gutter.
          className="-mr-2.5 grid h-11 w-11 place-items-center rounded-brand text-brand-ink lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" aria-hidden />
          ) : (
            <Menu className="h-6 w-6" aria-hidden />
          )}
        </button>
      </nav>
    </header>

      {/* Mobile panel, outside the backdrop-blur header so it positions against the viewport */}
      {mobileOpen ? (
        <div
          id="mobile-nav"
          // z-[45] clears other fixed page furniture (the About scroll ring).
          className="fixed inset-x-0 bottom-0 top-16 z-[45] animate-fade-rise overflow-y-auto overscroll-contain bg-brand-cream [animation-duration:0.3s] md:top-20 lg:hidden"
        >
          <div className="container-content flex flex-col gap-1 py-8">
            {mainNav.map((item) => (
              <div key={item.href} className="border-b border-brand-ink/10 py-2">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-h3 font-medium text-brand-ink"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="flex flex-col gap-1 pb-2 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2.5 text-body text-brand-stone"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <Button
              href="/contact"
              className="mt-6 w-full"
              onClick={() => setMobileOpen(false)}
            >
              Book a Trial
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
