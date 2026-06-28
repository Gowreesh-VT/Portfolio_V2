"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ──────────────────────────────────────────────────────────────────────────────
// SVG Icons
// ──────────────────────────────────────────────────────────────────────────────

const ReactIcon = () => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" width="100%" height="100%" fill="none">
    <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
    <g stroke="#61dafb" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const NextjsIcon = () => (
  <svg viewBox="0 0 180 180" width="100%" height="100%">
    <mask id="nxt-mask">
      <circle cx="90" cy="90" r="90" fill="white" />
    </mask>
    <circle cx="90" cy="90" r="90" fill="black" stroke="white" strokeWidth="6" />
    <g mask="url(#nxt-mask)">
      <path d="M149.508 157.52L69.142 54H54v72h14.4V72.252l66.906 87.03c4.782-4.945 9.006-10.457 12.6-16.32-.42-1.782-1.02-3.66-1.8-5.442z" fill="white" />
      <rect x="115" y="54" width="14" height="72" fill="white" />
    </g>
  </svg>
);

const TypeScriptIcon = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <rect width="100%" height="100%" fill="#3178c6" rx="8" />
    <text x="50" y="65" fill="white" fontFamily="sans-serif" fontWeight="bold" fontSize="40" textAnchor="middle">TS</text>
  </svg>
);

const TailwindIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="#38bdf8" />
  </svg>
);

const NodejsIcon = () => (
  <svg viewBox="0 0 256 292" width="100%" height="100%" fill="#339933">
    <path d="M128 0L24 60v120l104 60 104-60V60L128 0zm-12 37.3v147.4L44 141.5V72.5l72-35.2zm24 0l72 35.2v69l-72 43.2V37.3z" />
  </svg>
);

const PrismaIcon = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
    <path d="M50 10 L85 75 L15 75 Z" stroke="#10b981" strokeWidth="6" fill="none" />
    <path d="M50 10 L50 75" stroke="#10b981" strokeWidth="4" />
    <path d="M15 75 L50 45 L85 75" stroke="#10b981" strokeWidth="4" />
  </svg>
);

const PostgreSqlIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#336791" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
  </svg>
);

const AwsIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.47 0-.89.09-1.3.26A7 7 0 1 0 3 13.5A3.5 3.5 0 0 0 6.5 17h11" />
    <text x="12" y="14" fill="#FF9900" fontFamily="sans-serif" fontWeight="bold" fontSize="5" textAnchor="middle">AWS</text>
  </svg>
);

const DockerIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#2496ED">
    <path d="M13.962 6.075h-2.43V8.5h2.43V6.075zM11.22 6.075H8.788v2.425H11.22V6.075zM8.47 6.075H6.04v2.425H8.47V6.075zM11.22 3.364H8.788v2.425H11.22V3.364zM13.962 8.788h-2.43v2.425h2.43V8.788zM11.22 8.788H8.788v2.425H11.22V8.788zM8.47 8.788H6.04v2.425H8.47V8.788zM16.704 8.788h-2.43v2.425h2.43V8.788zM23.766 11.27c-.078-.052-.774-.51-2.18-.51-.318 0-.616.03-.89.09-.138-.61-.594-1.12-1.285-1.425l-.234-.1-.137.218c-.378.608-.737 1.29-.983 2.012H1.365a.434.434 0 00-.43.468c.036 1.488.583 4.225 2.825 5.513 1.344.773 2.923.86 4.697.26 1.405-.478 2.603-1.464 3.738-2.3v.014c.822-.614 1.637-1.23 2.656-1.57.822-.276 1.635-.332 2.417-.17l.228.048.066-.23c.125-.444.306-.995.535-1.48.55-.173 1.096-.134 1.575.105l.233.116.096-.232a4.49 4.49 0 00.344-1.242z" />
  </svg>
);

const VercelIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%">
    <path d="M24 22.525H0L12 1.475L24 22.525Z" fill="white" />
  </svg>
);

const GithubActionsIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#2088FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="3" width="6" height="6" rx="1" />
    <rect x="9" y="15" width="6" height="6" rx="1" />
    <path d="M9 6h6" />
    <path d="M6 9v3a3 3 0 0 0 3 3" />
    <path d="M18 9v3a3 3 0 0 1-3 3" />
  </svg>
);

// ──────────────────────────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────────────────────────

const sections = [
  {
    label: "Frontend",
    headline: "React · Next.js · TypeScript",
    description: "Pixel-perfect interfaces, blazing fast delivery.",
    image: "/images/frontend.png",
    accentColor: "#61dafb",
    shadowColor: "rgba(97,218,251,0.55)",
    iconsLabel: "FRONTEND STACK",
    icons: [
      { name: "React", svg: <ReactIcon /> },
      { name: "Next.js", svg: <NextjsIcon /> },
      { name: "TypeScript", svg: <TypeScriptIcon /> },
      { name: "Tailwind CSS", svg: <TailwindIcon /> },
    ],
  },
  {
    label: "Backend",
    headline: "Node.js · Prisma · PostgreSQL",
    description: "Scalable APIs with type-safe database access.",
    image: "/images/backend.png",
    accentColor: "#4ade80",
    shadowColor: "rgba(74,222,128,0.55)",
    iconsLabel: "BACKEND STACK",
    icons: [
      { name: "Node.js", svg: <NodejsIcon /> },
      { name: "Prisma", svg: <PrismaIcon /> },
      { name: "PostgreSQL", svg: <PostgreSqlIcon /> },
    ],
  },
  {
    label: "Cloud & Infra",
    headline: "AWS · Docker · Vercel",
    description: "Production-grade infrastructure that scales.",
    image: "/images/cloud.png",
    accentColor: "#FF9900",
    shadowColor: "rgba(255,153,0,0.55)",
    iconsLabel: "CLOUD & INFRA",
    icons: [
      { name: "AWS", svg: <AwsIcon /> },
      { name: "Docker", svg: <DockerIcon /> },
      { name: "Vercel", svg: <VercelIcon /> },
      { name: "GitHub Actions", svg: <GithubActionsIcon /> },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────

export default function TechStackSection() {
  const outerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      if (!outerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // ── Set initial states ──────────────────────────────────────────────
        // Images: section 0 visible, others hidden above
        gsap.set("#ts-img-0", { opacity: 1, scale: 1 });
        gsap.set(["#ts-img-1", "#ts-img-2"], { opacity: 0, scale: 1.06 });

        // Bottom info panels: section 0 visible at y=0, others hidden below
        gsap.set("#ts-panel-0", { opacity: 1, y: 0, pointerEvents: "auto" });
        gsap.set(["#ts-panel-1", "#ts-panel-2"], { opacity: 0, y: 80, pointerEvents: "none" });

        // Left labels
        gsap.set("#ts-lbl-0", { opacity: 1, color: "#fff" });
        gsap.set(["#ts-lbl-1", "#ts-lbl-2"], { opacity: 0.28, color: "#555" });

        // Left dots
        gsap.set("#ts-dot-0", { scale: 1.6, opacity: 1 });
        gsap.set(["#ts-dot-1", "#ts-dot-2"], { scale: 1, opacity: 0.3 });

        // Accent lines inside each panel
        gsap.set("#ts-line-0", { scaleX: 1, opacity: 1 });
        gsap.set(["#ts-line-1", "#ts-line-2"], { scaleX: 0, opacity: 0 });

        // ── GSAP timeline ───────────────────────────────────────────────────
        // Section height = 300vh, timeline has 2 units
        // Scroll 0–100vh  → t=0–0.667 (hold section 0)
        // Scroll 100–200vh → t=0.667–1.333 (transition 0→1, hold 1)
        // Scroll 200–300vh → t=1.333–2.0  (transition 1→2, hold 2)
        //
        // Transitions happen in the middle 40% of each 100vh window:
        //  transition 0→1 centred at t=1.0 (range 0.75–1.25)
        //  transition 1→2 centred at t=1.67 (range 1.42–1.92)

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: outerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        // ── Transition 0 → 1 ────────────────────────────────────────────────
        // outgoing
        tl.to("#ts-img-0",   { opacity: 0, scale: 0.96, duration: 0.3 }, 0.75);
        tl.to("#ts-panel-0", { opacity: 0, y: -60, pointerEvents: "none", duration: 0.28 }, 0.75);
        tl.to("#ts-line-0",  { scaleX: 0, opacity: 0, duration: 0.2 }, 0.75);
        tl.to("#ts-lbl-0",   { opacity: 0.28, color: "#555", duration: 0.25 }, 0.75);
        tl.to("#ts-dot-0",   { scale: 1, opacity: 0.3, duration: 0.25 }, 0.75);
        // incoming
        tl.to("#ts-img-1",   { opacity: 1, scale: 1, duration: 0.35 }, 0.95);
        tl.to("#ts-panel-1", { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.35 }, 0.95);
        tl.to("#ts-line-1",  { scaleX: 1, opacity: 1, duration: 0.25 }, 0.95);
        tl.to("#ts-lbl-1",   { opacity: 1, color: "#fff", duration: 0.25 }, 0.95);
        tl.to("#ts-dot-1",   { scale: 1.6, opacity: 1, duration: 0.25 }, 0.95);

        // ── Transition 1 → 2 ────────────────────────────────────────────────
        // outgoing
        tl.to("#ts-img-1",   { opacity: 0, scale: 0.96, duration: 0.3 }, 1.42);
        tl.to("#ts-panel-1", { opacity: 0, y: -60, pointerEvents: "none", duration: 0.28 }, 1.42);
        tl.to("#ts-line-1",  { scaleX: 0, opacity: 0, duration: 0.2 }, 1.42);
        tl.to("#ts-lbl-1",   { opacity: 0.28, color: "#555", duration: 0.25 }, 1.42);
        tl.to("#ts-dot-1",   { scale: 1, opacity: 0.3, duration: 0.25 }, 1.42);
        // incoming
        tl.to("#ts-img-2",   { opacity: 1, scale: 1, duration: 0.35 }, 1.62);
        tl.to("#ts-panel-2", { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.35 }, 1.62);
        tl.to("#ts-line-2",  { scaleX: 1, opacity: 1, duration: 0.25 }, 1.62);
        tl.to("#ts-lbl-2",   { opacity: 1, color: "#fff", duration: 0.25 }, 1.62);
        tl.to("#ts-dot-2",   { scale: 1.6, opacity: 1, duration: 0.25 }, 1.62);

        return () => { tl.kill(); };
      });

      mm.add("(max-width: 767px)", () => {
        const blocks = gsap.utils.toArray<HTMLElement>(".mob-tech-block");
        blocks.forEach((block) => {
          gsap.fromTo(
            block,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
              scrollTrigger: { trigger: block, start: "top 85%", toggleActions: "play none none reverse" },
            }
          );
        });
      });

      return () => { mm.revert(); };
    },
    { scope: outerRef }
  );

  return (
    <section
      ref={outerRef}
      id="tech-stack"
      className="w-full bg-[#0a0a0a] text-white select-none"
      style={{ height: "300vh" }}
    >
      {/* ════════════════════════════════════════
          DESKTOP sticky panel
      ════════════════════════════════════════ */}
      <div
        ref={stickyRef}
        className="hidden md:block sticky top-0 w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* ── Top label ───────────────────────────────────────────────── */}
        <div className="absolute top-0 left-0 right-0 z-30 flex flex-col items-center pt-9 pointer-events-none">
          <p className="text-[0.7rem] font-bold tracking-[0.3em] text-[#444] uppercase mb-2">
            Technologies
          </p>
          <h2 className="text-[2.8rem] lg:text-[3.2rem] font-[800] text-white tracking-tight leading-none">
            My Tech Stack
          </h2>
        </div>

        {/* ── Left: section labels ─────────────────────────────────────── */}
        <div className="absolute left-8 lg:left-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-6">
          {sections.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                id={`ts-dot-${i}`}
                style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: s.accentColor, flexShrink: 0 }}
              />
              <span
                id={`ts-lbl-${i}`}
                style={{ fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.04em", color: i === 0 ? "#fff" : "#555" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Full-viewport image stack ────────────────────────────────── */}
        {/* Images sit behind everything, edge-to-edge, with top/bottom padding for header + panel */}
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ paddingTop: 110, paddingBottom: 160 }}>
          {sections.map((s, i) => (
            <img
              key={i}
              id={`ts-img-${i}`}
              src={s.image}
              alt={s.label}
              loading="eager"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                mixBlendMode: "screen",
                filter: "drop-shadow(0 40px 120px rgba(0,0,0,0.98))",
                opacity: i === 0 ? 1 : 0,
                pointerEvents: "none",
              }}
            />
          ))}
        </div>

        {/* Subtle vignette so image edges blend into the dark bg */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 50%, #0a0a0a 100%)",
          }}
        />

        {/* ── Bottom info panels ──────────────────────────────────────── */}
        {/* Each panel absolutely stacked at the bottom; only the active one is visible */}
        <div className="absolute bottom-0 left-0 right-0 z-30" style={{ padding: "0 2.5rem 2rem" }}>
          {sections.map((s, i) => (
            <div
              key={i}
              id={`ts-panel-${i}`}
              style={{
                position: "absolute",
                bottom: "2rem",
                left: "2.5rem",
                right: "2.5rem",
                opacity: i === 0 ? 1 : 0,
                transform: i === 0 ? "translateY(0)" : "translateY(80px)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "rgba(8,8,8,0.88)",
                  backdropFilter: "blur(30px)",
                  WebkitBackdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.75)",
                }}
              >
                {/* Glowing accent top-bar */}
                <div
                  id={`ts-line-${i}`}
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: 2,
                    transformOrigin: "left center",
                    background: `linear-gradient(90deg, ${s.accentColor} 0%, transparent 65%)`,
                    boxShadow: `0 0 20px ${s.shadowColor}`,
                    opacity: i === 0 ? 1 : 0,
                    transform: i === 0 ? "scaleX(1)" : "scaleX(0)",
                  }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "18px 28px" }}>
                  {/* Text side */}
                  <div style={{ flexShrink: 0, minWidth: 210 }}>
                    <div style={{ fontSize: "0.58rem", letterSpacing: "0.22em", fontWeight: 700, color: s.accentColor, textTransform: "uppercase", marginBottom: 6 }}>
                      {s.iconsLabel}
                    </div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                      {s.headline}
                    </div>
                    <div style={{ fontSize: "0.73rem", color: "#666", marginTop: 4, fontWeight: 500 }}>
                      {s.description}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

                  {/* Icon row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, justifyContent: "flex-end", flexWrap: "wrap" }}>
                    {s.icons.map((icon, j) => (
                      <div key={j} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div
                          style={{
                            width: 40, height: 40,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: 10,
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.09)",
                          }}
                        >
                          {icon.svg}
                        </div>
                        <span style={{ fontSize: "0.55rem", color: "#555", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {icon.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          MOBILE stacked layout
      ════════════════════════════════════════ */}
      <div className="md:hidden block w-full px-5 py-16 flex flex-col gap-16">
        <div className="mb-2">
          <h2 className="text-[2.2rem] font-[800] text-white tracking-tight leading-none">My Tech Stack</h2>
          <p className="text-neutral-500 text-sm mt-2 font-medium">Built across the full spectrum</p>
        </div>

        {sections.map((s, i) => (
          <div key={i} className="mob-tech-block flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div style={{ width: 3, height: 22, borderRadius: 2, backgroundColor: s.accentColor, boxShadow: `0 0 8px ${s.shadowColor}` }} />
              <h3 className="text-lg font-bold text-white tracking-tight">{s.label}</h3>
            </div>
            <div className="w-full aspect-[16/10] flex items-center justify-center overflow-hidden">
              <img src={s.image} alt={s.label} loading="lazy" className="w-full h-full object-contain pointer-events-none" style={{ filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.8))" }} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-[0.65rem] uppercase tracking-[0.18em] font-bold pl-1" style={{ color: "#555" }}>{s.iconsLabel}</div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                {s.icons.map((icon, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">{icon.svg}</div>
                    <span className="font-mono text-xs text-neutral-300 font-medium">{icon.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
