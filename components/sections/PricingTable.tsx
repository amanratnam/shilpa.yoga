"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "@/lib/useMediaQuery";
import { Section, type Tone } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PlanCard, type Plan } from "@/components/sections/PlanCard";
import { ShapeGrid } from "@/components/ui/backgrounds/ShapeGrid";
import { CURRENCIES, type Currency } from "@/lib/pricing/config";
import { cn } from "@/lib/utils";

export type { Plan, PlanOption } from "@/components/sections/PlanCard";

const currencyLabels: Record<Currency, string> = {
  INR: "₹ INR",
  USD: "$ USD",
};

/** Segmented control, as a radio group so arrow keys and labels behave. */
function CurrencyToggle({
  value,
  onChange,
  dark,
}: {
  value: Currency;
  onChange: (next: Currency) => void;
  dark: boolean;
}) {
  return (
    <fieldset
      className={cn(
        "flex w-fit gap-1 rounded-brand border p-1",
        dark ? "border-brand-cream/25 bg-brand-cream/5" : "border-brand-ink/15 bg-brand-white",
      )}
    >
      <legend className="sr-only">Show prices in</legend>
      {CURRENCIES.map((currency) => {
        const active = currency === value;
        return (
          <button
            key={currency}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(currency)}
            // min-h-11 keeps the 44px touch target the compact padding loses.
            className={cn(
              "min-h-11 rounded-brand px-5 text-small font-medium transition-colors duration-300 ease-brand",
              active
                ? dark
                  ? "bg-brand-gold text-brand-ink"
                  : "bg-brand-green text-brand-cream"
                : dark
                  ? "text-brand-cream/80 hover:text-brand-cream"
                  : "text-brand-stone hover:text-brand-ink",
            )}
          >
            {currencyLabels[currency]}
          </button>
        );
      })}
    </fieldset>
  );
}

function CarouselArrows({
  dark,
  canPrev,
  canNext,
  onPrev,
  onNext,
  position,
}: {
  dark: boolean;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** Short "2 / 5" readout between the arrows; the full one sits under the track. */
  position: string;
}) {
  // Nothing overflows, so the controls would be decoration.
  if (!canPrev && !canNext) return null;

  const base = cn(
    "grid h-11 w-11 place-items-center rounded-brand border transition-colors duration-300 ease-brand",
    "disabled:cursor-not-allowed disabled:opacity-35",
    dark
      ? "border-brand-cream/25 text-brand-cream hover:enabled:bg-brand-cream/10"
      : "border-brand-ink/15 text-brand-ink hover:enabled:bg-brand-cream",
  );

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onPrev} disabled={!canPrev} aria-label="Previous plans" className={base}>
        <ChevronLeft className="h-5 w-5" strokeWidth={2} aria-hidden />
      </button>
      <span
        aria-hidden
        className={cn(
          "min-w-12 text-center text-small tabular-nums",
          dark ? "text-brand-cream/80" : "text-brand-stone",
        )}
      >
        {position}
      </span>
      <button type="button" onClick={onNext} disabled={!canNext} aria-label="Next plans" className={base}>
        <ChevronRight className="h-5 w-5" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}

/**
 * Where the reader is in the track: a "1–4 of 5" count plus one dot per card,
 * with the visible cards lit. Dots double as jump links on every screen size.
 */
function CarouselPagination({
  dark,
  total,
  first,
  visible,
  onSelect,
}: {
  dark: boolean;
  total: number;
  first: number;
  visible: number;
  onSelect: (index: number) => void;
}) {
  const last = Math.min(total, first + visible);
  const label =
    visible > 1 ? `Showing ${first + 1}–${last} of ${total}` : `${first + 1} of ${total}`;

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <div className="flex items-center">
        {Array.from({ length: total }, (_, i) => {
          const active = i >= first && i < last;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Show plan ${i + 1} of ${total}`}
              aria-current={active ? "true" : undefined}
              // The dot is small; the button around it keeps a 32px target.
              className="group grid h-8 w-8 place-items-center"
            >
              <span
                aria-hidden
                className={cn(
                  "block h-2 rounded-full transition-all duration-300 ease-brand",
                  active
                    ? cn("w-5", dark ? "bg-brand-gold" : "bg-brand-green")
                    : cn(
                        "w-2",
                        dark
                          ? "bg-brand-cream/30 group-hover:bg-brand-cream/60"
                          : "bg-brand-ink/20 group-hover:bg-brand-ink/40",
                      ),
                )}
              />
            </button>
          );
        })}
      </div>
      <p
        aria-live="polite"
        className={cn("text-small tabular-nums", dark ? "text-brand-cream/70" : "text-brand-stone")}
      >
        {label}
      </p>
    </div>
  );
}

export function PricingTable({
  eyebrow = "Pricing",
  title = "Choose the option that suits you best",
  intro,
  plans,
  tone = "light",
  note,
  id,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  plans: Plan[];
  tone?: Tone;
  note?: string;
  id?: string;
}) {
  // Rupees first: the studio is in Gurgaon and most visitors pay in INR.
  const [currency, setCurrency] = useState<Currency>("INR");
  const dark = tone === "dark";

  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ prev: false, next: false });
  const [view, setView] = useState({ first: 0, visible: 1 });

  /** Width of one card plus the gap after it — the distance between snaps. */
  const cardStep = (el: HTMLElement) => {
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return card.offsetWidth + gap;
  };

  /** Recomputed from the DOM rather than a page index, so it stays honest
   *  when the reader scrolls or drags the track themselves. */
  const syncArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // A pixel of slack: sub-pixel widths leave scrollLeft just shy of the end.
    const maxScroll = el.scrollWidth - el.clientWidth;
    const atEnd = el.scrollLeft >= maxScroll - 1;
    setCanScroll({ prev: el.scrollLeft > 1, next: !atEnd });

    const step = cardStep(el);
    if (!step) return;
    const total = el.children.length;
    // Cards wholly in view; the peek of the next card on phones doesn't count.
    // The track's padding isn't card space, but the trailing gap is.
    const style = getComputedStyle(el);
    const inner =
      el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const gap = parseFloat(style.columnGap) || 0;
    const visible = Math.max(1, Math.min(total, Math.floor((inner + gap + 2) / step)));
    const first = atEnd
      ? Math.max(0, total - visible)
      : Math.min(total - visible, Math.round(el.scrollLeft / step));
    setView((prev) =>
      prev.first === first && prev.visible === visible ? prev : { first, visible },
    );
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncArrows();
    el.addEventListener("scroll", syncArrows, { passive: true });
    // Card widths are percentage-based, so a resize changes what fits.
    const observer = new ResizeObserver(syncArrows);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", syncArrows);
      observer.disconnect();
    };
  }, [syncArrows, plans.length]);

  const scrollToCard = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * cardStep(el), behavior: reduce ? "auto" : "smooth" });
  };

  /** Advance by whole pages, so the arrows track what is actually visible. */
  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <Section tone={tone} id={id} className="relative isolate overflow-hidden">
      {/* Full-bleed texture behind the section, in the brand's gold on green.
          Inert to the pointer: ShapeGrid tracks the cursor on the window and
          hit-tests its own rect, so the trail follows across the whole band
          without this layer ever needing to intercept input. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <ShapeGrid
          direction="right"
          speed={0.17}
          squareSize={61}
          hoverTrailAmount={8}
          // The section already owns its ground; the stock near-black vignette
          // would drag it away from the brand green.
          vignetteColor={null}
          borderColor={dark ? "rgba(201,169,97,0.16)" : "rgba(31,61,46,0.10)"}
          hoverFillColor={dark ? "rgba(201,169,97,0.14)" : "rgba(31,61,46,0.06)"}
        />
      </div>

      <SectionHeading eyebrow={eyebrow} title={title} intro={intro} align="center" />

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <CurrencyToggle value={currency} onChange={setCurrency} dark={dark} />
        <CarouselArrows
          dark={dark}
          canPrev={canScroll.prev}
          canNext={canScroll.next}
          onPrev={() => scrollByPage(-1)}
          onNext={() => scrollByPage(1)}
          position={
            view.visible > 1
              ? `${view.first + 1}–${Math.min(plans.length, view.first + view.visible)} / ${plans.length}`
              : `${view.first + 1} / ${plans.length}`
          }
        />
      </div>

      {/*
        A scroll-snapping track rather than a grid: four tiers show at a time
        and any further ones are reachable by the arrows, so adding a sixth
        plan needs no layout change. It stays a plain scroll container, so
        trackpads, touch and keyboard all work without the arrows.
        One reveal covers the whole track: a per-card reveal never fired for
        cards parked off to the side, so they faded in mid-swipe on phones.
      */}
      <Reveal>
        <div
          ref={trackRef}
          role="group"
          aria-label="Pricing plans"
          tabIndex={0}
          className={cn(
            // The padding (offset by negative margin) gives the featured ring
            // and the hover lift room inside the clipping scroll container.
            "-mx-2 mt-6 flex snap-x snap-mandatory scroll-px-2 items-start gap-5 overflow-x-auto overscroll-x-contain px-2 pb-4 pt-2",
            // The scrollbar would cut across the card shadows.
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "shrink-0 snap-start",
                // One card on phones, two on tablets, four from lg — the gap is
                // 1.25rem, so four cards share 3.75rem of gutters.
                "basis-[86%] sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-3.75rem)/4)]",
              )}
            >
              <PlanCard plan={plan} currency={currency} />
            </div>
          ))}
        </div>
      </Reveal>

      {canScroll.prev || canScroll.next ? (
        <CarouselPagination
          dark={dark}
          total={plans.length}
          first={view.first}
          visible={view.visible}
          onSelect={scrollToCard}
        />
      ) : null}

      {note ? (
        <p
          className={cn(
            "mx-auto mt-8 max-w-2xl text-center text-small",
            dark ? "text-brand-cream/70" : "text-brand-stone",
          )}
        >
          {note}
        </p>
      ) : null}
    </Section>
  );
}
