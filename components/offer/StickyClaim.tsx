"use client";

import { useEffect, useState } from "react";

/**
 * Phone-only bar that keeps the offer one tap away. Hides while the form is
 * on screen, so it never covers the thing it points to.
 */
export function StickyClaim({ label, note }: { label: string; note: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const form = document.getElementById("claim");
    const hero = document.getElementById("offer-hero");
    if (!form || !hero) return;
    let formVisible = false;
    let heroVisible = true;
    const sync = () => setShow(!formVisible && !heroVisible);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === form) formVisible = e.isIntersecting;
        if (e.target === hero) heroVisible = e.isIntersecting;
      }
      sync();
    }, { threshold: 0.15 });
    io.observe(form);
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-brand-ink/10 bg-brand-cream/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 lg:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
    >
      <a
        href="#claim"
        className="flex min-h-12 items-center justify-between gap-3 rounded-brand bg-brand-green pl-5 pr-2 text-brand-cream"
      >
        <span className="text-small font-medium uppercase tracking-[0.05em]">{label}</span>
        <span className="rounded-brand bg-brand-cream/10 px-3 py-1.5 text-xs font-medium text-brand-gold">{note}</span>
      </a>
    </div>
  );
}
