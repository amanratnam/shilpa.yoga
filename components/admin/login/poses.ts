/**
 * The poses the sign-in scene flows through. Paths are the same line art as
 * `components/art/YogaFigures.tsx`, so the 3D figure is recognisably the
 * site's own illustration style rather than a stock mannequin.
 */
export type Pose = {
  name: string;
  sanskrit: string;
  /** SVG viewBox width and height the paths are drawn in. */
  w: number;
  h: number;
  head: { cx: number; cy: number; r: number };
  paths: string[];
};

export const POSES: Pose[] = [
  {
    name: "Upward salute",
    sanskrit: "Urdhva Hastasana",
    w: 200,
    h: 200,
    head: { cx: 100, cy: 34, r: 12 },
    paths: [
      "M100 48 L100 118",
      "M100 62 L66 20",
      "M100 62 L134 20",
      "M100 118 L82 186",
      "M100 118 L118 186",
    ],
  },
  {
    name: "Tree",
    sanskrit: "Vrikshasana",
    w: 200,
    h: 200,
    head: { cx: 100, cy: 30, r: 12 },
    paths: [
      "M100 44 L100 122",
      "M100 60 C76 48 78 18 100 8",
      "M100 60 C124 48 122 18 100 8",
      "M100 122 L100 188",
      "M100 122 L134 136 L106 152",
    ],
  },
  {
    name: "Warrior II",
    sanskrit: "Virabhadrasana II",
    w: 240,
    h: 200,
    head: { cx: 120, cy: 42, r: 12 },
    paths: [
      "M120 56 L120 114",
      "M120 70 L48 70",
      "M120 70 L192 70",
      "M120 114 L62 184",
      "M120 114 L166 132 L166 184",
    ],
  },
  {
    name: "Downward dog",
    sanskrit: "Adho Mukha Svanasana",
    w: 240,
    h: 160,
    head: { cx: 58, cy: 124, r: 10 },
    paths: ["M44 138 L124 48", "M128 44 C152 64 180 102 204 138"],
  },
  {
    name: "Cobra",
    sanskrit: "Bhujangasana",
    w: 200,
    h: 200,
    head: { cx: 170, cy: 98, r: 11 },
    paths: ["M28 156 L118 156", "M118 156 C146 152 164 136 168 112", "M166 124 L138 156"],
  },
  {
    name: "Easy seat",
    sanskrit: "Sukhasana",
    w: 200,
    h: 200,
    head: { cx: 100, cy: 42, r: 13 },
    paths: [
      "M100 57 L100 112",
      "M100 70 C82 74 68 92 62 114",
      "M100 70 C118 74 132 92 138 114",
      "M52 128 Q100 104 148 128 Q100 152 52 128 Z",
    ],
  },
];

/** Small seeded PRNG, so every visit (and SSR vs client) samples identically. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Turn a pose into `count` 3D points: most spread along the limbs with a
 * little thickness, the rest filling the head. Centred on the origin and
 * scaled so the pose's longest side spans `size` world units. Needs the DOM
 * (SVG path measurement), so it only runs in the browser.
 */
export function samplePose(pose: Pose, count: number, size: number, seed: number): Float32Array {
  const rand = mulberry32(seed);
  const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${pose.w} ${pose.h}`);
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;visibility:hidden";
  document.body.appendChild(svg);

  const els = pose.paths.map((d) => {
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", d);
    svg.appendChild(p);
    return p;
  });
  const lengths = els.map((p) => p.getTotalLength());
  const total = lengths.reduce((a, b) => a + b, 0);

  const headCount = Math.round(count * 0.13);
  const limbCount = count - headCount;
  const pts: [number, number][] = [];

  // Limbs: evenly by arc length, jittered sideways for a brush-stroke body.
  for (let i = 0; i < limbCount; i++) {
    let at = rand() * total;
    let k = 0;
    while (k < lengths.length - 1 && at > lengths[k]) at -= lengths[k++];
    const pt = els[k].getPointAtLength(Math.min(at, lengths[k]));
    pts.push([pt.x + gauss() * 3.6, pt.y + gauss() * 3.6]);
  }
  // Head: uniform over the disc.
  for (let i = 0; i < headCount; i++) {
    const r = pose.head.r * Math.sqrt(rand());
    const a = rand() * Math.PI * 2;
    pts.push([pose.head.cx + Math.cos(a) * r, pose.head.cy + Math.sin(a) * r]);
  }
  svg.remove();

  // Centre on the bounding box and fit the longest side to `size`.
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y] of pts) {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const scale = size / Math.max(maxX - minX, maxY - minY);

  const out = new Float32Array(count * 3);
  // Shuffle so a particle's job (limb or head) changes between poses — the
  // morph then reads as the body re-forming, not a slideshow.
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }
  pts.forEach(([x, y], i) => {
    out[i * 3] = (x - cx) * scale;
    out[i * 3 + 1] = -(y - cy) * scale; // SVG y points down
    out[i * 3 + 2] = gauss() * 0.16;
  });
  return out;
}
