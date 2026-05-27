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
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
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
            <li key={item.href} className="group relative">
              <Link
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-1 py-2 text-small font-medium uppercase tracking-[0.05em] transition-colors hover:text-brand-gold",
                  isActive(item.href) ? "text-brand-green" : "text-brand-ink",
                )}
              >
                {item.label}
                {item.children ? (
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" aria-hidden />
                ) : null}
              </Link>

              {item.children ? (
                <div className="invisible absolute left-0 top-full w-64 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
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
          className="lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
    </header>

      {/* Mobile panel, outside the backdrop-blur header so it positions against the viewport */}
      {mobileOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-brand-cream md:top-20 lg:hidden">
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
                        className="py-2 text-body text-brand-stone"
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
