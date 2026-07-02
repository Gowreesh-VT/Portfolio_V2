"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── Types ────────────────────────────────────────────────────────────────────
type JourneyItem = {
  id: string;
  index: string;
  category: "story" | "experience";
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  nodeSide: "left" | "right"; // which side the NODE/DOT sits on
  nodeXPct: number;           // exact x% of container (varies for "random" feel)
};

// ─── Content ──────────────────────────────────────────────────────────────────
// nodeSide = where the dot sits; card is always on the OPPOSITE side.
const journeyItems: JourneyItem[] = [
  {
    id: "s1", index: "01", category: "story",
    title: "Background", subtitle: "Who I Am",
    description: "Born in 2007. Discovered code in 2023 and never stopped. Building has been the constant — from tiny scripts to full production systems deployed on the cloud.",
    tags: [],
    nodeSide: "right", nodeXPct: 73,
  },
  {
    id: "s2", index: "02", category: "story",
    title: "Full-Stack", subtitle: "What I Build",
    description: "Both sides of the stack. React, Next.js, Three.js, and Node.js on the front. MongoDB, REST APIs, and TypeScript on the back. One person, the whole pipeline.",
    tags: ["React", "Next.js", "Node.js", "Three.js", "TypeScript"],
    nodeSide: "left", nodeXPct: 27,
  },
  {
    id: "s3", index: "03", category: "story",
    title: "Cloud & DevOps", subtitle: "How I Scale",
    description: "The infrastructure layer. AWS, Docker, Firebase, CI/CD pipelines, and Linux. I design and maintain systems that scale — because great products need rock-solid foundations.",
    tags: ["AWS", "Docker", "Firebase", "Linux", "CI/CD"],
    nodeSide: "right", nodeXPct: 76,
  },
  {
    id: "e1", index: "04", category: "experience",
    title: "CS Academy, Erode", subtitle: "2018 — 2025",
    description: "Schooling. Completed secondary education with a core focus on computer science, physics, and mathematics.",
    tags: ["High School", "Basic Coding", "CS Foundations"],
    nodeSide: "left", nodeXPct: 24,
  },
  {
    id: "e2", index: "05", category: "experience",
    title: "VIT Chennai", subtitle: "2025 — 2029",
    description: "B.Tech in Computer Science Engineering. Active member of the coding club, organising hackathons, and shipping portals.",
    tags: ["Computer Science", "Algorithms", "Java", "Web Dev"],
    nodeSide: "right", nodeXPct: 71,
  },
  {
    id: "e3", index: "06", category: "experience",
    title: "IIT Madras", subtitle: "2025 — 2029",
    description: "Bachelor of Science, Data Science and Applications. Pursuing core data science, machine learning workflows, and database architectures.",
    tags: ["Data Science", "ML", "Python", "SQL"],
    nodeSide: "left", nodeXPct: 28,
  },
  {
    id: "e4", index: "07", category: "experience",
    title: "Microsoft Innovations Club", subtitle: "Oct 2024 — Present",
    description: "Web Development Lead at VIT Chennai. Led architecture and development of the official website, admin portal, and event systems.",
    tags: ["React", "Next.js", "Firebase", "Leadership"],
    nodeSide: "right", nodeXPct: 74,
  },
  {
    id: "e5", index: "08", category: "experience",
    title: "Turfingo", subtitle: "Dec 2025 — Present",
    description: "SDE Intern. Designed and developed multiple full-stack applications with responsive UI, auth, and multi-cloud deployments.",
    tags: ["React", "Next.js", "MongoDB", "MySQL", "Firebase"],
    nodeSide: "left", nodeXPct: 26,
  },
];

// ─── SVG path builder ─────────────────────────────────────────────────────────
// Builds a smooth S/zigzag cubic-bezier path through all node points.
// viewBox width = SVG_W, height = numItems * ROW_H
const SVG_W = 1000;
const ROW_H = 340; // CSS px per row (also SVG units — 1:1 in y axis)
const TOTAL_H = journeyItems.length * ROW_H;

function buildPath(): string {
  const cx = SVG_W / 2; // center x = 500
  // Node center coordinates in viewBox units
  const pts = journeyItems.map((item, i) => ({
    x: (item.nodeXPct / 100) * SVG_W,
    y: i * ROW_H + ROW_H / 2,
  }));

  let d = `M ${cx} 0`;

  pts.forEach((pt, i) => {
    const prevX = i === 0 ? cx : pts[i - 1].x;
    const prevY = i === 0 ? 0 : pts[i - 1].y;
    const midY = (prevY + pt.y) / 2;
    // Cubic bezier: hold prev-x until midpoint, then pull to node-x
    d += ` C ${prevX} ${midY} ${pt.x} ${midY} ${pt.x} ${pt.y}`;
  });

  // Tail back to center
  const last = pts[pts.length - 1];
  const midY = (last.y + TOTAL_H) / 2;
  d += ` C ${last.x} ${midY} ${cx} ${midY} ${cx} ${TOTAL_H}`;

  return d;
}

const PATH_D = buildPath();

// ─── Component ────────────────────────────────────────────────────────────────
export default function AboutJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const pathEl = pathRef.current;
    if (!pathEl || !trackRef.current) return;

    // ── Draw the S-curve as user scrolls ─────────────────────────────────────
    const pathLen = pathEl.getTotalLength();
    gsap.set(pathEl, { strokeDasharray: pathLen, strokeDashoffset: pathLen });

    gsap.to(pathEl, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: trackRef.current,
        start: "top 55%",
        end: "bottom 80%",
        scrub: true,
      },
    });

    // ── Per-row reveal animations ─────────────────────────────────────────────
    const rows = gsap.utils.toArray<HTMLElement>(".journey-row");
    rows.forEach((row) => {
      const dot = row.querySelector(".journey-dot");
      const card = row.querySelector(".journey-card");
      const ghost = row.querySelector(".journey-ghost");
      const nodeIsRight = row.dataset.nodeSide === "right";
      // Card is on opposite side from node
      const cardFromX = nodeIsRight ? -55 : 55;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(dot,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }
      );
      tl.fromTo(card,
        { x: cardFromX, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.2"
      );
      if (ghost) {
        tl.fromTo(ghost,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.4"
        );
      }
    });
  }, { scope: sectionRef });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-[#09090b] text-[#f0ede8] py-28 md:py-36 overflow-hidden"
    >
      {/* Ambient center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(88,166,255,0.04) 0%, transparent 70%)" }}
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-16 relative z-10">

        {/* ── Section header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-24">
          <p
            className="text-[#58a6ff] text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            [02] Story &amp; Journey
          </p>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(52px, 8vw, 110px)",
              lineHeight: 1,
            }}
          >
            Who I Am &amp; Where I&apos;ve Been
          </h2>
        </div>

        <div id="about-story">
          {/* ── Desktop timeline ────────────────────────────────────────────────── */}
          <div
            ref={trackRef}
            className="relative hidden sm:block"
            style={{ height: TOTAL_H }}
          >
            {/* SVG zigzag overlay */}
            <svg
              className="absolute inset-0 w-full pointer-events-none"
              style={{ height: TOTAL_H }}
              viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="zigGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#58a6ff" />
                  <stop offset="50%" stopColor="#d2a8ff" />
                  <stop offset="100%" stopColor="#3fb950" />
                </linearGradient>
              </defs>

              {/* Ghost (dim) path — always visible as guide */}
              <path
                d={PATH_D}
                fill="none"
                stroke="rgba(240,237,232,0.05)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Animated glowing path */}
              <path
                ref={pathRef}
                d={PATH_D}
                fill="none"
                stroke="url(#zigGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 5px rgba(88,166,255,0.6))" }}
              />
            </svg>

            {/* Journey rows — absolutely positioned */}
            {journeyItems.map((item, i) => {
              const isNodeRight = item.nodeSide === "right";
              // Card is on opposite side from node
              const cardOnRight = !isNodeRight;

              return (
                <div
                  key={item.id}
                  className="journey-row absolute w-full flex items-center"
                  data-node-side={item.nodeSide}
                  style={{ top: i * ROW_H, height: ROW_H }}
                >
                  {/* ── Ghost chapter number (behind card, outside it) ──────── */}
                  <div
                    className="journey-ghost absolute bottom-0 pointer-events-none select-none z-0"
                    style={{
                      [cardOnRight ? "right" : "left"]: 0,
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(90px, 13vw, 180px)",
                      lineHeight: 1,
                      color: "rgba(240,237,232,0.045)",
                      opacity: 0,
                    }}
                  >
                    {item.index}
                  </div>

                  {/* ── Node dot (sits exactly on the path kink) ───────────── */}
                  <div
                    className="journey-dot absolute z-20 w-4 h-4 rounded-full border-2 border-[#58a6ff] bg-[#09090b]"
                    style={{
                      left: `${item.nodeXPct}%`,
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      boxShadow: "0 0 16px rgba(88,166,255,0.8), 0 0 4px rgba(88,166,255,0.4)",
                      opacity: 0,
                    }}
                  />

                  {/* ── Card (opposite side from node) ─────────────────────── */}
                  <div
                    className="journey-card absolute top-1/2 -translate-y-1/2 z-10"
                    style={{
                      ...(cardOnRight
                        ? { right: 0, left: "auto" }
                        : { left: 0, right: "auto" }),
                      width: "45%",
                      opacity: 0,
                    }}
                  >
                    <div className="group bg-white/[0.025] border border-white/[0.06] rounded-2xl p-6 md:p-8 hover:bg-white/[0.04] transition-colors duration-300 backdrop-blur-sm">

                      {/* Category badge */}
                      <span
                        className="text-[9px] font-bold tracking-[0.28em] text-white/30 uppercase block mb-4"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {item.category === "story" ? "— About" : "— Journey"}
                      </span>

                      {/* Title */}
                      <h3
                        className="text-white leading-none mb-1 group-hover:text-[#58a6ff] transition-colors duration-300"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "clamp(28px, 3.5vw, 48px)",
                        }}
                      >
                        {item.title}
                      </h3>

                      {/* Subtitle */}
                      <p
                        className="text-white/40 mb-4"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}
                      >
                        {item.subtitle}
                      </p>

                      <div className="w-6 h-px bg-white/10 mb-4" />

                      {/* Description */}
                      <p
                        className="text-white/50 leading-relaxed mb-5"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "13.5px" }}
                      >
                        {item.description}
                      </p>

                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] text-white/35 px-2.5 py-1 rounded border border-white/10 bg-white/[0.04]"
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Mobile: stacked list with left border ───────────────────────────── */}
          <div className="sm:hidden flex flex-col gap-10 border-l-2 border-white/5 pl-6">
            {journeyItems.map((item) => (
              <div key={item.id} className="relative">
                {/* Mobile dot */}
                <div
                  className="absolute -left-[30px] top-5 w-3 h-3 rounded-full border-2 border-[#58a6ff] bg-[#09090b]"
                  style={{ boxShadow: "0 0 10px rgba(88,166,255,0.7)" }}
                />

                {/* Ghost number */}
                <div
                  className="absolute bottom-0 right-0 pointer-events-none select-none"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "80px",
                    lineHeight: 1,
                    color: "rgba(240,237,232,0.04)",
                  }}
                >
                  {item.index}
                </div>

                <div className="bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 overflow-hidden">
                  <span
                    className="text-[9px] font-bold tracking-[0.25em] text-white/30 uppercase block mb-3"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {item.category === "story" ? "— About" : "— Journey"}
                  </span>
                  <h3
                    className="text-white leading-none mb-1"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "36px" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-white/40 mb-3 text-[12px]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.subtitle}
                  </p>
                  <p
                    className="text-white/50 text-[13px] leading-relaxed mb-4"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.description}
                  </p>
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] text-white/35 px-2 py-0.5 rounded border border-white/10"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
