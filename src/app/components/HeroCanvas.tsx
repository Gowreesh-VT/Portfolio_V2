"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── Constants ────────────────────────────────────────────────────────────────
const PARTICLE_COUNT = 380;
const TRAIL_LENGTH   = 14;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Particle {
  // Seeded base position (0–1 normalised) – used for Act I scatter
  bx: number;
  by: number;
  // Live canvas position
  x: number;
  y: number;
  // Ambient drift velocity (Act I)
  vx: number;
  vy: number;
  // Spiral galaxy parameters (Act III)
  spiralAngle: number;
  spiralRadius: number;
  spiralSpeed: number; // radians / tick
  // Visual
  size: number;
  baseHue: number;    // 185 = cyan, 38 = amber, 268 = lavender
  trail: { x: number; y: number }[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

/** Smooth cubic Hermite interpolation between 0 and 1 over [lo, hi]. */
const ss = (lo: number, hi: number, t: number) => {
  const x = clamp((t - lo) / (hi - lo), 0, 1);
  return x * x * (3 - 2 * x);
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stateRef = useRef({
    scrollT: 0,
    mouseX: 0.5,
    mouseY: 0.5,
    targetMouseX: 0.5,
    targetMouseY: 0.5,
    particles: [] as Particle[],
    time: 0,
  });

  const rafRef = useRef<number>(0);

  // ── Particle factory ──────────────────────────────────────────────────────
  const initParticles = useCallback((w: number, h: number) => {
    const arr: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribute spiral arms evenly
      const angle = (i / PARTICLE_COUNT) * Math.PI * 16 + Math.random() * 0.7;
      const maxR  = Math.min(w, h) * 0.37;
      const r     = Math.sqrt(Math.random()) * maxR; // square-root for uniform density

      // Three colour buckets: cyan | amber | lavender
      const bucket  = i % 3;
      const baseHue = bucket === 0
        ? 182 + (Math.random() - 0.5) * 22 // cyan
        : bucket === 1
        ? 36  + (Math.random() - 0.5) * 18 // amber
        : 266 + (Math.random() - 0.5) * 22;// lavender

      arr.push({
        bx: Math.random(), by: Math.random(),
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        spiralAngle:  angle,
        spiralRadius: r,
        spiralSpeed:  (Math.random() * 0.22 + 0.07) * (Math.random() > 0.5 ? 1 : -1),
        size:    Math.random() * 2.2 + 0.5,
        baseHue,
        trail: [],
      });
    }
    stateRef.current.particles = arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Mouse parallax ───────────────────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      stateRef.current.targetMouseX = e.clientX / window.innerWidth;
      stateRef.current.targetMouseY = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouse);

    // ── ScrollTrigger – read progress, don't animate ─────────────────────────
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: "#hero-section",
      start: "top top",
      end:   "bottom bottom",
      onUpdate: (self) => {
        stateRef.current.scrollT = self.progress;
      },
    });

    // ── Render loop ──────────────────────────────────────────────────────────
    const render = () => {
      rafRef.current = requestAnimationFrame(render);
      const s  = stateRef.current;
      const w  = canvas.width;
      const h  = canvas.height;
      const t  = s.scrollT;
      s.time  += 0.007;

      // Smooth mouse
      s.mouseX += (s.targetMouseX - s.mouseX) * 0.055;
      s.mouseY += (s.targetMouseY - s.mouseY) * 0.055;
      const mx = (s.mouseX - 0.5) * 58;
      const my = (s.mouseY - 0.5) * 58;

      // Clear to transparent – the existing bg-layer handles the dark→cream bg
      ctx.clearRect(0, 0, w, h);

      // ── Act weights (all independent smoothstep ramps) ───────────────────
      // Act I  – Void        (dominant at t=0, fades by 0.20)
      const wI   = 1 - ss(0,    0.20, t);
      // Act II – Emergence   (peaks ~0.23)
      const wII  = ss(0.12, 0.28, t) * (1 - ss(0.34, 0.46, t));
      // Act III – Formation  (peaks ~0.48, spiral galaxy)
      const wIII = ss(0.36, 0.52, t) * (1 - ss(0.56, 0.68, t));
      // Act IV – Nebula Bloom(peaks ~0.72)
      const wIV  = ss(0.58, 0.72, t) * (1 - ss(0.76, 0.86, t));
      // Act V  – Dissolve    (dissolves everything by 0.95)
      const wV   = ss(0.76, 0.95, t);

      // Canvas centre (with mouse parallax)
      const cx = w / 2 + mx * 0.32;
      const cy = h / 2 + my * 0.32;

      // ── Galaxy core glow (Act III) ────────────────────────────────────────
      if (wIII > 0.02) {
        const r    = Math.min(w, h) * 0.24;
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        glow.addColorStop(0,   `rgba(80,215,255,${wIII * 0.36})`);
        glow.addColorStop(0.4, `rgba(40,100,230,${wIII * 0.14})`);
        glow.addColorStop(1,   "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }

      // ── Nebula aurora blobs (Act IV) ──────────────────────────────────────
      if (wIV > 0.02) {
        const blobs = [
          { xr: 0.28, yr: 0.38, r: 0.40, col: "140,50,255"  },
          { xr: 0.72, yr: 0.62, r: 0.34, col: "255,70,170"  },
          { xr: 0.50, yr: 0.26, r: 0.32, col: "0,200,255"   },
        ];
        for (const b of blobs) {
          const bx2 = b.xr * w + mx * 0.42;
          const by2 = b.yr * h + my * 0.42;
          const br  = b.r * Math.min(w, h);
          const g   = ctx.createRadialGradient(bx2, by2, 0, bx2, by2, br);
          g.addColorStop(0, `rgba(${b.col},${wIV * 0.26})`);
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }
      }

      // ── Particles ─────────────────────────────────────────────────────────
      for (const p of s.particles) {

        // Ambient drift (strongest in Act I)
        p.vx += (Math.random() - 0.5) * 0.013;
        p.vy += (Math.random() - 0.5) * 0.013;
        p.vx *= 0.987;
        p.vy *= 0.987;

        // ── Target positions per act ──────────────────────────────────────

        // Act I: scattered across viewport
        const tI_x = p.bx * w + mx * 0.17;
        const tI_y = p.by * h + my * 0.17;

        // Act II: stream in from the near edge toward centre
        const edgeX = p.bx < 0.5 ? w * -0.08 : w * 1.08;
        const edgeY = p.by < 0.5 ? h * -0.08 : h * 1.08;
        const streamFrac = 1 - ss(0.14, 0.42, t);
        const tII_x = cx + (edgeX - cx) * streamFrac;
        const tII_y = cy + (edgeY - cy) * streamFrac;

        // Act III: orbit in an elliptical spiral
        const orbit = s.time * p.spiralSpeed * 0.5 + p.spiralAngle;
        const tIII_x = cx + Math.cos(orbit) * p.spiralRadius        + mx * 0.20;
        const tIII_y = cy + Math.sin(orbit) * p.spiralRadius * 0.52 + my * 0.20;

        // Act IV: blow radially outward from spiral position
        const blowDir = p.spiralAngle + s.time * p.spiralSpeed * 0.28;
        const blowR   = p.spiralRadius * (1 + wIV * 2.4);
        const tIV_x = cx + Math.cos(blowDir) * blowR        + mx * 0.28;
        const tIV_y = cy + Math.sin(blowDir) * blowR * 0.52 + my * 0.28;

        // Blend toward whichever act is dominant
        let tx = tI_x, ty = tI_y;
        if (wII  > 0.01) { tx += (tII_x  - tx) * wII;  ty += (tII_y  - ty) * wII; }
        if (wIII > 0.01) { tx += (tIII_x - tx) * wIII; ty += (tIII_y - ty) * wIII; }
        if (wIV  > 0.01) { tx += (tIV_x  - tx) * wIV;  ty += (tIV_y  - ty) * wIV; }

        // Lerp toward target (faster in later acts for snappier feel)
        const lag = wI > 0.5 ? 0.010 : wIII > 0.3 ? 0.068 : 0.044;
        p.x += (tx - p.x) * lag + p.vx * wI;
        p.y += (ty - p.y) * lag + p.vy * wI;

        // ── Trail (Acts II & III) ─────────────────────────────────────────
        const trailW = Math.max(wII, wIII * 0.7);
        if (trailW > 0.07) {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > TRAIL_LENGTH) p.trail.shift();
        } else {
          p.trail.length = 0;
        }

        // ── Colour ────────────────────────────────────────────────────────
        // Hue shifts per act (cyan↔amber↔lavender↔magenta)
        const hIII = p.baseHue < 200 ? 195 : p.baseHue < 250 ? 48  : 196;
        const hIV  = p.baseHue < 200 ? 272 : p.baseHue < 250 ? 322 : 285;
        const blendHue = p.baseHue
          + (hIII - p.baseHue) * wIII
          + (hIV  - p.baseHue) * wIV;

        const sat   = 15 + 82*wII + 96*wIII + 80*wIV;
        const lum   = 50 + 14*wII + 22*wIII + 12*wIV;
        const alpha = (
          0.18 * wI   +
          0.72 * wII  +
          0.88 * wIII +
          0.62 * wIV
        ) * (1 - wV * 0.98);

        if (alpha < 0.008) continue;

        // ── Draw trail ────────────────────────────────────────────────────
        if (p.trail.length > 1) {
          for (let ti = 1; ti < p.trail.length; ti++) {
            const ta = (ti / p.trail.length) * alpha * 0.30;
            if (ta < 0.004) continue;
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${blendHue},${sat}%,${lum}%,${ta})`;
            ctx.lineWidth   = p.size * (ti / p.trail.length) * 0.65;
            ctx.moveTo(p.trail[ti - 1].x, p.trail[ti - 1].y);
            ctx.lineTo(p.trail[ti].x,     p.trail[ti].y);
            ctx.stroke();
          }
        }

        // ── Draw glow dot ─────────────────────────────────────────────────
        const gr  = p.size * (1.9 + wIII * 3.8 + wIV * 2.2);
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gr);
        grd.addColorStop(0, `hsla(${blendHue},${sat}%,${lum + 10}%,${alpha})`);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, gr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      st.kill();
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
