"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/** Dialog shell: backdrop, Escape to close, scroll lock, click-outside. */
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
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-brand-ink/50 p-4 sm:p-8"
      onMouseDown={(e) => {
        if (!panelRef.current?.contains(e.target as Node)) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="my-auto w-full max-w-2xl rounded-brand bg-brand-white p-8 shadow-[0_24px_60px_-24px_rgba(26,26,26,0.5)]"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-h3 text-brand-ink">{title}</h2>
            {description ? (
              <p className="mt-1.5 text-small text-brand-stone">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-brand p-1.5 text-brand-stone transition-colors hover:bg-brand-cream hover:text-brand-ink"
          >
            <X className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
