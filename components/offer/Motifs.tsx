import type { Campaign } from "@/content/campaigns";
import { cn } from "@/lib/utils";

/** An eight-point festive star, outlined in gold, turning very slowly. */
function Starburst({ className }: { className?: string }) {
  const points = Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 === 0 ? 92 : 38;
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="-100 -100 200 200" className={cn("animate-[spin_120s_linear_infinite]", className)} aria-hidden>
      <polygon points={points} fill="none" stroke="#C9A961" strokeWidth="1.2" strokeLinejoin="round" />
      <circle r="22" fill="none" stroke="#C9A961" strokeWidth="1" strokeDasharray="2 5" />
      <circle r="58" fill="none" stroke="#C9A961" strokeWidth="0.6" opacity="0.6" />
    </svg>
  );
}

/** A string of fairy lights, bulbs twinkling out of step. */
function StringLights({ colors }: { colors: string[] }) {
  const bulbs = Array.from({ length: 18 }, (_, i) => i);
  return (
    <svg viewBox="0 0 1000 80" preserveAspectRatio="none" className="h-14 w-full sm:h-20" aria-hidden>
      <path d="M0 10 Q 125 60 250 20 T 500 20 T 750 20 T 1000 10" fill="none" stroke="#2F4A3D" strokeWidth="2" />
      {bulbs.map((i) => {
        const x = 30 + i * 55;
        const y = 22 + Math.sin((i / 18) * Math.PI * 4) * 14 + 10;
        return (
          <g key={i}>
            <circle cx={x} cy={y + 8} r="9" fill={colors[i % colors.length]} opacity="0.35" className="animate-[twinkle_2.4s_ease-in-out_infinite]" style={{ animationDelay: `${(i % 6) * 0.35}s` }} />
            <ellipse cx={x} cy={y + 8} rx="4" ry="6" fill={colors[i % colors.length]} className="animate-[twinkle_2.4s_ease-in-out_infinite]" style={{ animationDelay: `${(i % 6) * 0.35}s` }} />
          </g>
        );
      })}
    </svg>
  );
}

/** A 24-spoke wheel, turning slowly, drawn in the current text colour. */
function Chakra({ className }: { className?: string }) {
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg viewBox="-50 -50 100 100" className={cn("animate-[spin_60s_linear_infinite]", className)} aria-hidden>
      <circle r="46" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle r="6" fill="currentColor" />
      {spokes.map((a) => (
        <line key={a} x1="0" y1="0" x2="0" y2="-44" stroke="currentColor" strokeWidth="1.4" transform={`rotate(${a})`} />
      ))}
    </svg>
  );
}

/** Three soft bands of saffron, white and green, gently waving. */
function TricolourWave() {
  return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-16 w-full sm:h-24" aria-hidden>
      <path className="animate-[wave_8s_ease-in-out_infinite]" d="M0 30 Q 300 0 600 30 T 1200 30 V 60 Q 900 90 600 60 T 0 60 Z" fill="#FF9933" opacity="0.9" />
      <path className="animate-[wave_8s_ease-in-out_infinite] [animation-delay:-2s]" d="M0 60 Q 300 30 600 60 T 1200 60 V 90 Q 900 120 600 90 T 0 90 Z" fill="#FFFFFF" />
      <path className="animate-[wave_8s_ease-in-out_infinite] [animation-delay:-4s]" d="M0 90 Q 300 60 600 90 T 1200 90 V 120 H 0 Z" fill="#138808" opacity="0.9" />
    </svg>
  );
}

/** Splashes of gulal, slowly breathing. */
function Splashes({ colors }: { colors: string[] }) {
  const blobs = [
    { x: "8%", y: "12%", s: 180, c: colors[0] },
    { x: "78%", y: "6%", s: 220, c: colors[1] },
    { x: "62%", y: "62%", s: 260, c: colors[3] },
    { x: "-4%", y: "70%", s: 200, c: colors[2] },
    { x: "88%", y: "78%", s: 160, c: colors[4] },
  ];
  return (
    <>
      {blobs.map((b, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute animate-[blob_9s_ease-in-out_infinite] rounded-full opacity-25 blur-2xl"
          style={{ left: b.x, top: b.y, width: b.s, height: b.s, background: b.c, animationDelay: `${-i * 1.7}s` }}
        />
      ))}
    </>
  );
}

/** Decoration layered behind the hero copy, specific to each festival. */
export function HeroMotif({ campaign }: { campaign: Campaign }) {
  switch (campaign.effect) {
    case "festive":
      return (
        <>
          <Starburst className="absolute -right-20 top-24 h-[18rem] w-[18rem] opacity-[0.16] sm:-right-16 sm:h-[30rem] sm:w-[30rem]" />
          {/* Hung just below the header, so the bulbs never sit on the logo. */}
          <div className="absolute inset-x-0 top-[4.25rem] sm:top-20">
            <StringLights colors={["#C9A961", "#F7F4ED", "#E9D29A", "#FFE6A8"]} />
          </div>
        </>
      );
    case "snow":
      return (
        // Hung just below the header, so the bulbs never sit on the logo.
        <div className="absolute inset-x-0 top-[4.25rem] sm:top-20">
          <StringLights colors={["#E0BE6E", "#D9433F", "#FFFFFF", "#7FC8A9"]} />
        </div>
      );
    case "fireworks":
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 bottom-0 select-none text-[9rem] font-black leading-none tracking-tighter text-transparent opacity-30 [-webkit-text-stroke:1.5px_#C9A961] sm:text-[16rem]"
        >
          2027
        </span>
      );
    case "tricolour":
      return (
        <>
          <Chakra className="absolute -right-16 top-6 h-64 w-64 text-brand-cream opacity-[0.1] sm:h-[26rem] sm:w-[26rem]" />
          <div className="absolute inset-x-0 bottom-0 opacity-90">
            <TricolourWave />
          </div>
        </>
      );
    case "gulal":
      return <Splashes colors={campaign.particles} />;
  }
}
