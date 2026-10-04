"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/components/ui/Section";

export type AccordionItem = { question: string; answer: React.ReactNode };

export function Accordion({
  items,
  tone = "light",
  className,
}: {
  items: AccordionItem[];
  tone?: Tone;
  className?: string;
}) {
  // Several can be open at once: collapsing the answer above the one just
  // tapped used to yank the tapped question up the screen on phones.
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "border-y",
        dark
          ? "divide-y divide-brand-cream/15 border-brand-cream/15"
          : "divide-y divide-brand-ink/10 border-brand-ink/10",
        className,
      )}
    >
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-h4 font-medium">{item.question}</span>
              <Plus
                className={cn(
                  "h-5 w-5 shrink-0 text-brand-gold transition-transform duration-300 ease-brand",
                  isOpen && "rotate-45",
                )}
                strokeWidth={2}
                aria-hidden
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-brand",
                isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div
                  className={cn(
                    "max-w-2xl text-body",
                    dark ? "text-brand-cream/75" : "text-brand-stone",
                  )}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
