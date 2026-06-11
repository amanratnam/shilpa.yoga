import { cn } from "@/lib/utils";

/**
 * Shared line-art yoga figure library (Section 5: Animation — calm, never busy).
 * Pure SVG + CSS animations: server-rendered, no JS, and the global
 * prefers-reduced-motion rule in globals.css stills them automatically.
 * All figures inherit `currentColor` so they recolour per surface.
 */

type FigureProps = {
  className?: string;
  /** Stagger entry into the shared breathe/sway loop. */
  delay?: string;
};

function figureSvgProps(viewBox: string, className?: string) {
  return {
    viewBox,
    className: cn("h-full w-full", className),
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
}

/** Seated meditation (sukhasana) — breathing slowly. */
export function MeditatingFigure({ className, delay }: FigureProps) {
  return (
    <div
      className={cn("animate-breathe origin-bottom", className)}
      style={delay ? { animationDelay: delay } : undefined}
    >
      <svg {...figureSvgProps("0 0 200 200")}>
        <circle cx="100" cy="42" r="13" fill="currentColor" stroke="none" />
        <path d="M100 57 L100 112" />
        <path d="M100 70 C82 74 68 92 62 114" />
        <path d="M100 70 C118 74 132 92 138 114" />
        <path d="M52 128 Q100 104 148 128 Q100 152 52 128 Z" />
      </svg>
    </div>
  );
}

/** Tree pose (vrikshasana) — balancing with a gentle sway. */
export function TreePoseFigure({ className, delay }: FigureProps) {
  return (
    <div
      className={cn("animate-sway origin-bottom", className)}
      style={delay ? { animationDelay: delay } : undefined}
    >
      <svg {...figureSvgProps("0 0 200 200")}>
        <circle cx="100" cy="30" r="12" fill="currentColor" stroke="none" />
        <path d="M100 44 L100 122" />
        <path d="M100 60 C76 48 78 18 100 8" />
        <path d="M100 60 C124 48 122 18 100 8" />
        <path d="M100 122 L100 188" />
        <path d="M100 122 L134 136 L106 152" />
      </svg>
    </div>
  );
}

/** Mountain pose, arms raised (urdhva hastasana). */
export function MountainFigure({ className, delay }: FigureProps) {
  return (
    <div
      className={cn("animate-breathe origin-bottom", className)}
      style={delay ? { animationDelay: delay } : undefined}
    >
      <svg {...figureSvgProps("0 0 200 200")}>
        <circle cx="100" cy="34" r="12" fill="currentColor" stroke="none" />
        <path d="M100 48 L100 118" />
        <path d="M100 62 L66 20" />
        <path d="M100 62 L134 20" />
        <path d="M100 118 L82 186" />
        <path d="M100 118 L118 186" />
      </svg>
    </div>
  );
}

/** Standing forward fold (uttanasana). */
export function ForwardFoldFigure({ className, delay }: FigureProps) {
  return (
    <div
      className={cn("animate-breathe origin-bottom", className)}
      style={delay ? { animationDelay: delay } : undefined}
    >
      <svg {...figureSvgProps("0 0 200 200")}>
        <path d="M100 186 L100 102" />
        <path d="M100 102 C96 130 84 148 66 162" />
        <circle cx="60" cy="172" r="10" fill="currentColor" stroke="none" />
        <path d="M96 118 L74 170" />
      </svg>
    </div>
  );
}

/** Downward dog (adho mukha svanasana). */
export function DownDogFigure({ className, delay }: FigureProps) {
  return (
    <div
      className={cn("animate-breathe origin-bottom", className)}
      style={delay ? { animationDelay: delay } : undefined}
    >
      <svg {...figureSvgProps("0 0 240 160")}>
        <path d="M44 138 L124 48" />
        <path d="M128 44 C152 64 180 102 204 138" />
        <circle cx="58" cy="124" r="10" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}

/** Cobra (bhujangasana). */
export function CobraFigure({ className, delay }: FigureProps) {
  return (
    <div
      className={cn("animate-breathe origin-bottom", className)}
      style={delay ? { animationDelay: delay } : undefined}
    >
      <svg {...figureSvgProps("0 0 200 200")}>
        <path d="M28 156 L118 156" />
        <path d="M118 156 C146 152 164 136 168 112" />
        <circle cx="170" cy="98" r="11" fill="currentColor" stroke="none" />
        <path d="M166 124 L138 156" />
      </svg>
    </div>
  );
}

/** Warrior II (virabhadrasana B) — strong T-shape with a deep front lunge. */
export function WarriorTwoFigure({ className, delay }: FigureProps) {
  return (
    <div
      className={cn("animate-breathe origin-bottom", className)}
      style={delay ? { animationDelay: delay } : undefined}
    >
      <svg {...figureSvgProps("0 0 240 200")}>
        <circle cx="120" cy="42" r="12" fill="currentColor" stroke="none" />
        <path d="M120 56 L120 114" />
        <path d="M120 70 L48 70" />
        <path d="M120 70 L192 70" />
        <path d="M120 114 L62 184" />
        <path d="M120 114 L166 132 L166 184" />
      </svg>
    </div>
  );
}

/**
 * Downward dog with pulsing joint markers — the "anatomy first" character.
 * Gold dots breathe at shoulder, hip and knee lines.
 */
export function DownDogAnatomyFigure({ className, delay }: FigureProps) {
  return (
    <div
      className={cn("animate-breathe origin-bottom", className)}
      style={delay ? { animationDelay: delay } : undefined}
    >
      <svg {...figureSvgProps("0 0 240 160")}>
        <path d="M44 138 L124 48" />
        <path d="M128 44 C152 64 180 102 204 138" />
        <circle cx="58" cy="124" r="10" fill="currentColor" stroke="none" />
        {/* Joint markers: wrist–shoulder–hip–knee chain */}
        {[
          [84, 93],
          [126, 46],
          [166, 86],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="7"
            fill="currentColor"
            stroke="none"
            className="animate-joint-pulse"
            style={{ animationDelay: `${i * 0.45}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * Teacher adjusting a student mid-pose — the "you, specifically" duo.
 * Student holds warrior II in full tone; the teacher stands behind in a
 * softer tone, one hand guiding the student's extended arm.
 */
export function AdjustDuoFigure({ className, delay }: FigureProps) {
  return (
    <div
      className={cn("animate-breathe origin-bottom", className)}
      style={delay ? { animationDelay: delay } : undefined}
    >
      <svg {...figureSvgProps("0 0 300 200")} strokeWidth={7}>
        {/* Student in warrior II */}
        <g>
          <circle cx="120" cy="46" r="11" fill="currentColor" stroke="none" />
          <path d="M120 59 L120 114" />
          <path d="M120 72 L56 72" />
          <path d="M120 72 L184 72" />
          <path d="M120 114 L66 184" />
          <path d="M120 114 L162 132 L162 184" />
        </g>
        {/* Teacher behind, guiding the extended arm */}
        <g opacity="0.55">
          <circle cx="232" cy="38" r="10" fill="currentColor" stroke="none" />
          <path d="M232 50 L232 122" />
          <path d="M232 64 L194 74" />
          <path d="M232 78 L206 102" />
          <path d="M232 122 L218 184" />
          <path d="M232 122 L248 184" />
        </g>
      </svg>
    </div>
  );
}

/** Expanding breath rings — a quiet meditation cue rendered behind figures. */
export function BreathRings({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none", className)} aria-hidden>
      <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible">
        {["0s", "2.3s", "4.6s"].map((delay) => (
          <circle
            key={delay}
            cx="200"
            cy="200"
            r="185"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="animate-ring-breathe origin-center opacity-0"
            style={{ animationDelay: delay }}
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * A short sun-salutation sequence: five small figures breathing in turn,
 * left to right, like a class mid-flow.
 */
export function SunSalutationStrip({ className }: { className?: string }) {
  const sequence = [
    { Figure: MountainFigure, label: "Mountain pose", delay: "0s" },
    { Figure: ForwardFoldFigure, label: "Forward fold", delay: "0.55s" },
    { Figure: DownDogFigure, label: "Downward dog", delay: "1.1s" },
    { Figure: CobraFigure, label: "Cobra pose", delay: "1.65s" },
    { Figure: MeditatingFigure, label: "Seated meditation", delay: "2.2s" },
  ];
  return (
    <div
      className={cn("flex items-end justify-center gap-5 sm:gap-10", className)}
      role="img"
      aria-label="A sun salutation sequence: mountain pose, forward fold, downward dog, cobra, seated meditation"
    >
      {sequence.map(({ Figure, label, delay }) => (
        <div key={label} className="h-10 w-10 sm:h-14 sm:w-14" title={label}>
          <Figure delay={delay} />
        </div>
      ))}
    </div>
  );
}
