/**
 * A soft singing-bowl chime, synthesised with the Web Audio API so the hero
 * ships no audio files. A bowl's partials sit at inharmonic ratios to the
 * fundamental and each fades at its own rate; a slightly detuned twin of the
 * fundamental adds the slow "shimmer" of a struck bowl.
 */

type Partial = { ratio: number; gain: number; decay: number };

const PARTIALS: Partial[] = [
  { ratio: 1, gain: 1, decay: 5.5 },
  { ratio: 1.004, gain: 0.6, decay: 5 },
  { ratio: 2.76, gain: 0.32, decay: 3.4 },
  { ratio: 5.4, gain: 0.12, decay: 2 },
  { ratio: 8.93, gain: 0.05, decay: 1.2 },
];

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

/**
 * Browsers only allow audio to start inside a user gesture. Call this from
 * the click that begins the breathing session so later chimes can play.
 */
export function primeAudio() {
  const c = context();
  if (c?.state === "suspended") void c.resume();
}

export function chime({ pitch = 196, volume = 0.05 }: { pitch?: number; volume?: number } = {}) {
  const c = context();
  if (!c || c.state !== "running") return;
  const now = c.currentTime;

  const master = c.createGain();
  master.gain.value = volume;
  master.connect(c.destination);

  for (const p of PARTIALS) {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = pitch * p.ratio;

    const env = c.createGain();
    env.gain.setValueAtTime(0, now);
    // A soft mallet: a few milliseconds of attack rather than a click.
    env.gain.linearRampToValueAtTime(p.gain, now + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

    osc.connect(env).connect(master);
    osc.start(now);
    osc.stop(now + p.decay + 0.1);
  }
}

/** A tiny tap on phones that support it; silently ignored elsewhere. */
export function tap(ms = 10) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      // Some browsers throw when vibration is blocked by policy.
    }
  }
}
