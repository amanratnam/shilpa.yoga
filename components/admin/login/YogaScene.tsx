"use client";

import { useEffect, useRef } from "react";
import { POSES, mulberry32, samplePose } from "@/components/admin/login/poses";

const COUNT = 2400;
const DUST = 260;
/** Seconds a pose is held, then the seconds spent flowing into the next. */
const HOLD = 3.4;
const FLOW = 2.4;

const VERTEX = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aSeed;
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vSeed;
  varying float vLift;

  float easeInOut(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    // Each particle leaves a little earlier or later than its neighbours, so
    // the body dissolves and re-forms rather than sliding as one block.
    float t = clamp((uProgress - aSeed * 0.35) / 0.65, 0.0, 1.0);
    float e = easeInOut(t);
    vec3 pos = mix(aFrom, aTo, e);

    // Mid-flow, drift outward on a gentle spiral, like breath leaving.
    float arc = sin(e * 3.14159);
    float angle = aSeed * 6.2831 + uTime * 0.6;
    pos += vec3(cos(angle), sin(angle) * 0.6, sin(angle * 1.7)) * arc * (0.35 + aSeed * 0.5);

    // A slow shimmer at rest, so a held pose still feels alive.
    pos += vec3(
      sin(uTime * 0.9 + aSeed * 40.0),
      cos(uTime * 0.7 + aSeed * 31.0),
      sin(uTime * 0.5 + aSeed * 17.0)
    ) * 0.012;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed * 0.9) * (1.0 + arc * 0.6) / -mv.z;
    vSeed = aSeed;
    vLift = arc;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uCream;
  uniform vec3 uGold;
  varying float vSeed;
  varying float vLift;

  void main() {
    // Soft round sprite with a bright core.
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, d);
    alpha *= alpha;
    vec3 color = mix(uCream, uGold, clamp(vSeed * 1.2 + vLift * 0.5, 0.0, 1.0));
    gl_FragColor = vec4(color, alpha * (0.75 + vLift * 0.25));
  }
`;

const DUST_VERTEX = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec3 pos = position;
    pos.y = mod(pos.y + uTime * (0.05 + aSeed * 0.08) + 4.0, 8.0) - 4.0;
    pos.x += sin(uTime * 0.3 + aSeed * 20.0) * 0.15;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (3.0 + aSeed * 5.0) * uPixelRatio / -mv.z;
    vAlpha = 0.25 + 0.45 * sin(uTime * 0.8 + aSeed * 50.0) * 0.5 + 0.2;
  }
`;

const DUST_FRAGMENT = /* glsl */ `
  uniform vec3 uGold;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(uGold, smoothstep(0.5, 0.0, d) * vAlpha);
  }
`;

/**
 * A particle figure that flows through a short sequence of poses: three.js,
 * loaded on demand so it never weighs on the rest of the site. Pauses when
 * hidden or off screen; with reduced motion it holds a single pose, still.
 */
export function YogaScene({
  onPose,
  className,
}: {
  /** Called with the index into `POSES` each time a pose settles. */
  onPose?: (index: number) => void;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onPoseRef = useRef(onPose);
  useEffect(() => {
    onPoseRef.current = onPose;
  }, [onPose]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pixelRatio);
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
      camera.position.set(0, 0, 7.2);

      // ---- The figure ----
      const shapes = POSES.map((pose, i) => samplePose(pose, COUNT, 2.9, 101 + i * 7));
      const rand = mulberry32(7);
      const seeds = new Float32Array(COUNT).map(() => rand());
      const geometry = new THREE.BufferGeometry();
      const from = new THREE.BufferAttribute(shapes[0].slice(), 3);
      const to = new THREE.BufferAttribute(shapes[still ? 0 : 1].slice(), 3);
      geometry.setAttribute("position", new THREE.BufferAttribute(shapes[0].slice(), 3));
      geometry.setAttribute("aFrom", from);
      geometry.setAttribute("aTo", to);
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

      const cream = new THREE.Color("#F7F4ED");
      const gold = new THREE.Color("#C9A961");
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: 44 },
          uPixelRatio: { value: pixelRatio },
          uCream: { value: cream },
          uGold: { value: gold },
        },
      });
      const figure = new THREE.Points(geometry, material);
      const group = new THREE.Group();
      group.add(figure);
      // Lifted so the headline along the bottom of the panel stays clear.
      group.position.y = 0.42;
      scene.add(group);

      // ---- Halo: a thin breathing ring behind the figure ----
      const haloMat = new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.22 });
      const halo = new THREE.Mesh(new THREE.RingGeometry(1.95, 1.965, 128), haloMat);
      halo.position.set(0, 0.42, -0.6);
      scene.add(halo);

      // ---- Gold dust drifting upward ----
      const dustRand = mulberry32(42);
      const dustPos = new Float32Array(DUST * 3);
      const dustSeed = new Float32Array(DUST);
      for (let i = 0; i < DUST; i++) {
        dustPos[i * 3] = (dustRand() - 0.5) * 9;
        dustPos[i * 3 + 1] = (dustRand() - 0.5) * 8;
        dustPos[i * 3 + 2] = (dustRand() - 0.5) * 4 - 1;
        dustSeed[i] = dustRand();
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
      dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(dustSeed, 1));
      const dustMat = new THREE.ShaderMaterial({
        vertexShader: DUST_VERTEX,
        fragmentShader: DUST_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: pixelRatio }, uGold: { value: gold } },
      });
      scene.add(new THREE.Points(dustGeo, dustMat));

      // ---- Sizing ----
      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // Keep the whole figure in frame on tall, narrow phones.
        camera.position.z = camera.aspect < 0.9 ? 7.2 / Math.max(camera.aspect, 0.55) * 0.9 : 7.2;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(host);
      resize();

      // ---- Pointer: the figure leans gently toward the cursor ----
      const target = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      // ---- Loop ----
      let current = 0;
      let phaseStart = performance.now();
      let raf = 0;
      let running = false;
      onPoseRef.current?.(0);

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const t = now / 1000;
        material.uniforms.uTime.value = t;
        dustMat.uniforms.uTime.value = t;

        if (!still) {
          const elapsed = (now - phaseStart) / 1000;
          if (elapsed < HOLD) {
            material.uniforms.uProgress.value = 0;
          } else if (elapsed < HOLD + FLOW) {
            material.uniforms.uProgress.value = (elapsed - HOLD) / FLOW;
          } else {
            // Arrived: the target becomes the new start, and the next pose
            // becomes the target.
            current = (current + 1) % POSES.length;
            from.array.set(shapes[current]);
            to.array.set(shapes[(current + 1) % POSES.length]);
            from.needsUpdate = true;
            to.needsUpdate = true;
            material.uniforms.uProgress.value = 0;
            phaseStart = now;
            onPoseRef.current?.(current);
          }

          const breath = Math.sin(t * ((Math.PI * 2) / 10));
          group.scale.setScalar(1 + breath * 0.02);
          halo.scale.setScalar(1 + breath * 0.035);
          haloMat.opacity = 0.16 + (breath + 1) * 0.06;
          group.rotation.y += ((Math.sin(t * 0.25) * 0.35 + target.x * 0.25) - group.rotation.y) * 0.04;
          group.rotation.x += ((target.y * 0.12) - group.rotation.x) * 0.04;
        }

        renderer.render(scene, camera);
        if (still) stop();
      };

      const start = () => {
        if (running) return;
        running = true;
        raf = requestAnimationFrame(frame);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(raf);
      };

      // Only run while on screen and the tab is visible.
      let onScreen = true;
      const sync = () => (onScreen && !document.hidden ? start() : stop());
      const io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      });
      io.observe(host);
      document.addEventListener("visibilitychange", sync);
      sync();

      cleanup = () => {
        stop();
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", sync);
        window.removeEventListener("pointermove", onMove);
        geometry.dispose();
        material.dispose();
        dustGeo.dispose();
        dustMat.dispose();
        halo.geometry.dispose();
        haloMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={hostRef} aria-hidden className={className} />;
}
