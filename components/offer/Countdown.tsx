"use client";

import { useEffect, useState } from "react";

/** Midnight at the end of `endsOn`, India time. */
const deadline = (endsOn: string) => Date.parse(`${endsOn}T23:59:59+05:30`);

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/**
 * Time left on the offer. Renders the end date on the server and starts
 * ticking after mount, so the markup always hydrates cleanly.
 */
export function Countdown({ endsOn, label }: { endsOn: string; label: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(deadline(endsOn) - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsOn]);

  if (left === null || left <= 0) {
    return <span className="text-sm opacity-80">{label}</span>;
  }
  const { d, h, m, s } = parts(left);
  const cells = [
    { v: d, u: "days" },
    { v: h, u: "hrs" },
    { v: m, u: "min" },
    { v: s, u: "sec" },
  ];
  return (
    <div className="flex items-center gap-2" role="timer" aria-label={`Offer ends in ${d} days ${h} hours`}>
      {cells.map((c) => (
        <div
          key={c.u}
          className="flex min-w-[3.25rem] flex-col items-center rounded-brand border border-brand-cream/20 bg-brand-cream/[0.06] px-2 py-1.5 backdrop-blur-sm"
        >
          <span className="text-lg font-semibold tabular-nums leading-tight">{String(c.v).padStart(2, "0")}</span>
          <span className="text-[0.625rem] uppercase tracking-[0.12em] text-brand-cream/60">{c.u}</span>
        </div>
      ))}
    </div>
  );
}
