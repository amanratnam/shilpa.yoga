"use client";

import { useEffect, useRef } from "react";
import type { CampaignEffect } from "@/content/campaigns";

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  max: number;
  color: string;
  spin: number;
  angle: number;
  kind: number;
};

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Festival atmosphere drawn on a single 2D canvas: diya embers, snow,
 * fireworks, tricolour confetti or gulal clouds. Particle counts scale with
 * the area, so a phone draws a fraction of what a desktop does. Pauses when
 * off screen or in a background tab; draws nothing for reduced motion.
 */
export function FestiveCanvas({
  effect,
  colors,
  className,
}: {
  effect: CampaignEffect;
  colors: string[];
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const density = () => Math.max(0.35, Math.min(1, (w * h) / (1280 * 800)));
    const ps: P[] = [];

    const spawn = (seed = false): P => {
      switch (effect) {
        case "snow":
          return {
            x: rnd(0, w), y: seed ? rnd(0, h) : -10, vx: rnd(-0.2, 0.2), vy: rnd(0.3, 1.1),
            r: rnd(1, 3.4), life: 0, max: Infinity, color: pick(colors), spin: rnd(0.005, 0.02),
            angle: rnd(0, 6.28), kind: 0,
          };
        case "tricolour":
          return {
            x: rnd(0, w), y: seed ? rnd(-h, h) : rnd(-60, -10), vx: rnd(-0.4, 0.4), vy: rnd(0.8, 1.8),
            r: rnd(4, 8), life: 0, max: Infinity, color: pick(colors), spin: rnd(0.02, 0.08),
            angle: rnd(0, 6.28), kind: Math.random() < 0.25 ? 1 : 0,
          };
        case "gulal":
          return {
            x: rnd(0, w), y: rnd(h * 0.1, h * 0.95), vx: rnd(-0.15, 0.15), vy: rnd(-0.25, -0.05),
            r: rnd(40, 130), life: 0, max: rnd(260, 520), color: pick(colors), spin: 0,
            angle: 0, kind: 1,
          };
        case "festive":
        default: {
          // kind 1: a soft bokeh light drifting up; kind 0: a star glint
          // that twinkles in place and fades.
          const bokeh = Math.random() < 0.28;
          return bokeh
            ? {
                x: rnd(0, w), y: seed ? rnd(0, h) : h + 30, vx: rnd(-0.12, 0.12), vy: rnd(-0.3, -0.1),
                r: rnd(8, 22), life: seed ? rnd(0, 900) : 0, max: rnd(1300, 2100), color: pick(colors),
                spin: rnd(0.004, 0.012), angle: rnd(0, 6.28), kind: 1,
              }
            : {
                x: rnd(0, w), y: rnd(0, h), vx: rnd(-0.05, 0.05), vy: rnd(-0.08, 0.02),
                r: rnd(1.6, 3.6), life: seed ? rnd(0, 200) : 0, max: rnd(200, 420), color: pick(colors),
                spin: rnd(0.003, 0.01), angle: rnd(0, 6.28), kind: 0,
              };
        }
      }
    };

    const target = () => {
      const d = density();
      switch (effect) {
        case "snow": return Math.round(170 * d);
        case "tricolour": return Math.round(90 * d);
        case "gulal": return Math.round(14 * d) + 4;
        case "fireworks": return 0;
        default: return Math.round(95 * d);
      }
    };
    if (effect !== "fireworks") for (let i = 0; i < target(); i++) ps.push(spawn(true));

    // Fireworks: rockets and bursts, plus a few twinkling stars.
    const stars = effect === "fireworks"
      ? Array.from({ length: Math.round(70 * density()) }, () => ({ x: rnd(0, 1), y: rnd(0, 0.7), t: rnd(0, 6.28), r: rnd(0.5, 1.4) }))
      : [];
    let nextRocket = 0;
    const burst = (x: number, y: number) => {
      const color = pick(colors);
      const n = Math.round(rnd(46, 80) * Math.max(0.6, density()));
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rnd(-0.05, 0.05);
        const s = rnd(1.4, 3.6);
        ps.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: rnd(1, 2.2), life: 0, max: rnd(60, 110), color: Math.random() < 0.2 ? "#FFFFFF" : color, spin: 0, angle: 0, kind: 2 });
      }
    };

    let raf = 0;
    let running = false;
    let frame = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      frame++;
      ctx.clearRect(0, 0, w, h);

      if (effect === "fireworks") {
        for (const s of stars) {
          s.t += 0.03;
          ctx.globalAlpha = 0.35 + Math.sin(s.t) * 0.3;
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        if (frame >= nextRocket) {
          ps.push({ x: rnd(w * 0.1, w * 0.9), y: h + 5, vx: rnd(-0.6, 0.6), vy: -rnd(6, 8.5) * Math.sqrt(h / 800), r: 2, life: 0, max: Infinity, color: "#FFE7A3", spin: 0, angle: 0, kind: 3 });
          nextRocket = frame + Math.round(rnd(45, 95));
        }
      } else {
        while (ps.length < target()) ps.push(spawn());
      }

      ctx.globalCompositeOperation = effect === "gulal" ? "source-over" : "lighter";
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life++;
        p.angle += p.spin;
        let alive = true;

        if (effect === "fireworks") {
          if (p.kind === 3) {
            p.x += p.vx; p.y += p.vy; p.vy += 0.09;
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - 1, p.y, 2, 6);
            if (p.vy >= -0.5) { burst(p.x, p.y); alive = false; }
          } else {
            p.x += p.vx; p.y += p.vy; p.vx *= 0.975; p.vy = p.vy * 0.975 + 0.035;
            const k = 1 - p.life / p.max;
            ctx.globalAlpha = Math.max(0, k);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * (0.6 + k * 0.6), 0, Math.PI * 2);
            ctx.fill();
            alive = p.life < p.max;
          }
        } else if (effect === "snow") {
          p.x += p.vx + Math.sin(p.angle) * 0.35; p.y += p.vy;
          ctx.globalAlpha = 0.35 + p.r / 6;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          alive = p.y < h + 10;
        } else if (effect === "tricolour") {
          p.x += p.vx + Math.sin(p.angle) * 0.5; p.y += p.vy;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.scale(1, Math.cos(p.angle * 2));
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = p.color;
          if (p.color.toUpperCase() === "#FFFFFF") { ctx.strokeStyle = "rgba(20,33,61,0.18)"; ctx.lineWidth = 0.8; }
          if (p.kind === 1) {
            ctx.beginPath(); ctx.arc(0, 0, p.r * 0.5, 0, Math.PI * 2); ctx.fill();
          } else {
            ctx.fillRect(-p.r / 2, -p.r, p.r, p.r * 2);
            if (p.color.toUpperCase() === "#FFFFFF") ctx.strokeRect(-p.r / 2, -p.r, p.r, p.r * 2);
          }
          ctx.restore();
          alive = p.y < h + 20;
        } else if (effect === "gulal") {
          p.x += p.vx; p.y += p.vy;
          const t = p.life / p.max;
          const alpha = Math.sin(Math.PI * t) * 0.22;
          const r = p.r * (0.6 + t * 0.7);
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
          g.addColorStop(0, p.color);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.globalAlpha = alpha;
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
          alive = p.life < p.max;
        } else {
          // festive: bokeh lights drift up; star glints twinkle and fade
          p.x += p.vx + Math.sin(p.angle) * (p.kind ? 0.15 : 0.05); p.y += p.vy;
          const t = p.life / p.max;
          const fade = Math.sin(Math.PI * Math.min(1, t));
          if (p.kind === 1) {
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
            g.addColorStop(0, p.color);
            g.addColorStop(0.55, p.color);
            g.addColorStop(1, "rgba(0,0,0,0)");
            ctx.globalAlpha = fade * 0.16;
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            alive = p.life < p.max && p.y > -40;
          } else {
            const tw = 0.55 + Math.sin(p.life * 0.09 + p.angle * 10) * 0.45;
            const a = fade * tw;
            const len = p.r * (2.4 + tw * 1.6);
            ctx.globalAlpha = a * 0.9;
            ctx.fillStyle = p.color;
            // A four-point star: two thin crossed diamonds and a bright core.
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - len); ctx.lineTo(p.x + p.r * 0.35, p.y);
            ctx.lineTo(p.x, p.y + len); ctx.lineTo(p.x - p.r * 0.35, p.y); ctx.closePath();
            ctx.moveTo(p.x - len, p.y); ctx.lineTo(p.x, p.y + p.r * 0.35);
            ctx.lineTo(p.x + len, p.y); ctx.lineTo(p.x, p.y - p.r * 0.35); ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = a;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.45, 0, Math.PI * 2); ctx.fill();
            alive = p.life < p.max;
          }
        }

        if (!alive) ps.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    let onScreen = true;
    const sync = () => (onScreen && !document.hidden ? start() : stop());
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [effect, colors]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
