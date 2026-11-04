import { cn } from "@/lib/utils";

/**
 * A "liquid glass" panel: frosted, slightly saturated glass with specular
 * edges, plus real refraction of whatever moves behind it.
 *
 * Layers, bottom to top:
 *  1. Frost — `backdrop-filter: blur + saturate`, supported everywhere.
 *  2. Refraction — `backdrop-filter: url(#offer-liquid)`, an SVG
 *     turbulence-driven displacement. Chromium applies it; other engines
 *     treat the declaration as invalid and simply skip the layer, so the
 *     panel degrades to clean frosted glass rather than breaking.
 *  3. Tint, specular sheen and rim light.
 */
export function LiquidGlass({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[1.75rem] text-brand-cream",
        "shadow-[0_30px_80px_-24px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.14)_inset]",
        className,
      )}
    >
      {/* The displacement filter the refraction layer points at. */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id="offer-liquid" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="46" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div aria-hidden className="absolute inset-0 -z-30 [backdrop-filter:blur(10px)_saturate(165%)] [-webkit-backdrop-filter:blur(10px)_saturate(165%)]" />
      <div aria-hidden className="absolute inset-0 -z-20 [backdrop-filter:url(#offer-liquid)]" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 70% at 15% 0%, rgba(255,255,255,0.22), rgba(255,255,255,0) 55%)," +
            "radial-gradient(90% 60% at 100% 100%, rgba(201,169,97,0.18), rgba(201,169,97,0) 60%)," +
            "linear-gradient(180deg, rgba(31,61,46,0.35), rgba(18,36,26,0.55))",
        }}
      />
      {/* Rim light: brighter along the top edge, as on real glass. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,255,255,0.08), inset 1px 0 0 rgba(255,255,255,0.12), inset -1px 0 0 rgba(255,255,255,0.06)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
