"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Dialog shell: backdrop, Escape to close, scroll lock, click-outside.
 *
 * Mobile first: on phones it is a bottom sheet that fills most of the screen
 * and scrolls inside itself, so the keyboard never hides the save button
 * (forms pin their actions with `FormActions`). From `sm` up it centres as a
 * card.
 */
export function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-brand-ink/50 sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (!panelRef.current?.contains(e.target as Node)) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[92dvh] w-full animate-fade-rise flex-col overflow-hidden rounded-t-2xl bg-brand-white shadow-[0_24px_60px_-24px_rgba(26,26,26,0.5)] [animation-duration:0.25s] sm:max-h-[88dvh] sm:max-w-xl sm:rounded-brand"
      >
        {/* Grab handle: a cue that this is a sheet on phones */}
        <div aria-hidden className="flex justify-center pt-2.5 sm:hidden">
          <span className="h-1 w-10 rounded-full bg-brand-ink/15" />
        </div>
        <div className="flex items-start justify-between gap-4 border-b border-brand-ink/10 px-5 pb-3.5 pt-3 sm:px-6 sm:pt-5">
          <div className="min-w-0">
            <h2 className="text-h4 font-semibold text-brand-ink">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-small text-brand-stone">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1.5 grid h-10 w-10 shrink-0 place-items-center rounded-brand text-brand-stone transition-colors hover:bg-brand-cream hover:text-brand-ink"
          >
            <X className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-4 sm:px-6 sm:pt-5">
          {children}
        </div>
      </div>
    </div>
  );
}
