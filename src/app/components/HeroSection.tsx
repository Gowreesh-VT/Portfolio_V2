"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const slides = [
  { role: "Full-Stack Engineer", bgText: "ENGINEER" },
  { role: "DevOps", bgText: "DEVOPS" },
  { role: "Cloud Enthusiast", bgText: "CLOUD" },
];

const stats = [
  { label: "Role", value: "Full-Stack + DevOps / Cloud" },
  { label: "Education", value: "VIT Chennai · IIT Madras" },
  { label: "Major", value: "CSE" },
  {label: "Minor", value: "Semi-conductors"},
  { label: "Since", value: "2020" },
];

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentSlideRef = useRef(0);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  // Scroll-phase refs (About Section layers)
  const textPhotoRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  const transitionToSlide = (targetIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });
    tl.to("#hero-subtitle", { y: 25, opacity: 0, duration: 0.35, ease: "power2.in" });
    tl.to("#bg-role-text", { y: 40, opacity: 0, duration: 0.45, ease: "power2.in" }, 0);
    tl.call(() => setCurrentSlide(targetIndex));
    tl.fromTo("#hero-subtitle", { y: -25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" });
    tl.fromTo("#bg-role-text", { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, "<");
  };

  const handleDashClick = (index: number) => {
    if (index === currentSlide || isAnimating) return;
    stopAutoplay();
    transitionToSlide(index);
    startAutoplay();
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer.current = setInterval(() => {
      const next = (currentSlideRef.current + 1) % slides.length;
      transitionToSlide(next);
    }, 5000);
  };

  const stopAutoplay = () => {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
  };

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("introAnimationPlayed");
    const delay = hasPlayed ? 0 : 3600;
    const timer = setTimeout(() => startAutoplay(), delay);
    return () => {
      clearTimeout(timer);
      stopAutoplay();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // ── INTRO ANIMATION ───────────────────────────────────────────────
      const hasPlayed = sessionStorage.getItem("introAnimationPlayed");
      const introTl = gsap.timeline();

      const navbarEl = document.getElementById("navbar");
      const navItems = document.querySelectorAll("#navbar .nav-item");

      if (hasPlayed) {
        introTl
          .set("#hello-screen", { display: "none" })
          .set("#bg-layer", { backgroundColor: "#f0ede8" })
          .set("#bg-role-text", { opacity: 1, y: 0 })
          .set("#hero-name", { opacity: 1, y: 0 })
          .set("#hero-subtitle", { opacity: 1, y: 0 })
          .set("#slide-dots", { opacity: 1 });
        
        if (navbarEl) introTl.set(navbarEl, { opacity: 1, y: 0 });
        if (navItems.length > 0) introTl.set(navItems, { opacity: 1, y: 0 });
      } else {
        sessionStorage.setItem("introAnimationPlayed", "true");
        introTl
          .to("#hello-text-svg", { scale: 45, duration: 1.2, ease: "power4.in", transformOrigin: "center center", color: "transparent", stroke: "#e8e3da", strokeWidth: "0.5px" }, 1.2)
          .to("#bg-layer", { backgroundColor: "#f0ede8", duration: 0.9, ease: "power2.inOut" }, 1.5)
          .to("#hello-text-svg", { opacity: 0, duration: 0.3 }, 2.1)
          .set("#hello-screen", { display: "none" }, 2.4);

        if (navbarEl) {
          introTl.fromTo(navbarEl, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 2.4);
        }
        if (navItems.length > 0) {
          introTl.fromTo(navItems, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }, 2.6);
        }

        introTl
          .fromTo("#bg-role-text", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }, 2.5)
          .fromTo("#hero-name", { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }, 2.6)
          .fromTo("#hero-subtitle", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }, 2.7)
          .fromTo("#slide-dots", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 3.0);
      }

      // ── MOUSE PARALLAX ────────────────────────────────────────────────
      // Only parallax the bg text — keeping hero-name out prevents it from
      // competing with the scroll-driven animation and causing shake.
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;
        gsap.to("#bg-role-text", { x: xPos, y: yPos, duration: 1, ease: "power2.out" });
      };
      window.addEventListener("mousemove", handleMouseMove);

      // ── SCROLL-DRIVEN PHASES ──────────────────────────────────────────
      // The scroll timeline covers the full 500vh section.
      // Scrub 1.8 gives the same feel as the old AboutSection.
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.8,
        },
      });

      // Phase 0 (0→2): Hero chrome (subtitle, dots, bg-text) fades out;
      //   hero name scales up from its small hero size to the large reveal size.
      scrollTl.to(
        ["#hero-subtitle", "#slide-dots", "#bg-role-text"],
        { opacity: 0, duration: 1.5, ease: "none" },
        0
      );
      scrollTl.to(
        "#hero-name",
        {
          fontSize: "clamp(68px, 18.5vw, 220px)",
          letterSpacing: "-0.01em",
          duration: 2,
          ease: "none",
        },
        0
      );

      // Phase 1 (2→4): Photo-clip layer fades in over the now-large name;
      //   solid name simultaneously fades to invisible.
      scrollTl.to(
        "#hero-name",
        { opacity: 0, scale: 0.96, duration: 2, ease: "none" },
        2
      );
      scrollTl.fromTo(
        textPhotoRef.current,
        { opacity: 0, scale: 1 },
        { opacity: 1, scale: 1, duration: 2, ease: "none" },
        2
      );

      // Phase 2 (4→6.5): Photo-clip letters explode outward + portrait fades in.
      scrollTl.to(
        textPhotoRef.current,
        { opacity: 0, scale: 1.55, letterSpacing: "0.12em", duration: 2.5, ease: "none" },
        4
      );
      scrollTl.fromTo(
        photoRef.current,
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 2.5, ease: "none" },
        4
      );

      // Phase 3 (6.5→8.5): Bio content rises up over the portrait.
      scrollTl.fromTo(
        bioRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 2, ease: "none" },
        6.5
      );

      return () => window.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: container }
  );

  return (
    // 500vh total: 100vh is sticky viewport, 400vh is scroll canvas
    <div
      id="hero-section"
      ref={container}
      className="relative w-full text-[#1a1a1a]"
      style={{ height: "500vh" }}
    >
      {/* Film Grain Overlay — fixed so it stays across the full scroll */}
      <div className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-[0.08]">
        <svg
          viewBox="0 0 200 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-50"
        >
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* ── STICKY INNER VIEWPORT ───────────────────────────────── */}
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100vh" }}>

        {/* Background Layer — starts dark for intro, transitions to cream */}
        <div id="bg-layer" className="absolute inset-0 -z-10" style={{ background: "#0a0a0a" }} />
        {/* Cream base sits on top of the bg-layer once intro is done */}
        <div className="absolute inset-0 -z-20" style={{ background: "#f0ede8" }} />

        {/* ── INTRO SCREEN ──────────────────────────────────────── */}
        <div
          id="hello-screen"
          className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden pointer-events-none"
        >
          <svg
            id="hello-text-svg"
            viewBox="0 0 800 200"
            className="w-full max-w-[80vw] h-auto overflow-visible will-change-transform"
            style={{ transformOrigin: "center center" }}
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="currentColor"
              className="font-bebas text-[180px] tracking-widest text-[#e8e3da]"
            >
              HELLO
            </text>
          </svg>
        </div>

        {/* Scattered Dots */}
        <div id="scattered-dots" className="absolute inset-0 pointer-events-none -z-10">
          {[...Array(15)].map((_, i) => {
            const pseudoRandom = (seed: number) => {
              const x = Math.sin(seed) * 10000;
              return x - Math.floor(x);
            };
            return (
              <span
                key={i}
                className="absolute bg-current rounded-full opacity-10"
                style={{
                  width: `${(pseudoRandom(i + 1) * 6 + 3).toFixed(2)}px`,
                  height: `${(pseudoRandom(i + 20) * 6 + 3).toFixed(2)}px`,
                  top: `${(pseudoRandom(i + 40) * 100).toFixed(2)}%`,
                  left: `${(pseudoRandom(i + 60) * 100).toFixed(2)}%`,
                }}
              />
            );
          })}
        </div>



        {/* ── HERO BACKGROUND ELEMENTS (bg text, name, subtitle, dots) ─
             These live at z-1 so the photo layers (z-10+) can cover them
             once the scroll-driven reveal begins. */}
        <div className="absolute top-0 left-0 w-full h-full z-[1] pointer-events-none">

          {/* Large cycling background text */}
          <div
            id="bg-role-text-wrapper"
            className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
          >
            <div
              id="bg-role-text"
              className="font-sans w-full text-center text-[18vw] font-bold text-transparent opacity-0 leading-none select-none tracking-tighter"
              style={{ WebkitTextStroke: "1px rgba(26, 26, 26, 0.25)", whiteSpace: "nowrap" }}
            >
              {slides[currentSlide].bgText}
            </div>
          </div>

          {/* Hero name */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1
              id="hero-name"
              className="font-bebas text-center leading-none opacity-0"
              style={{
                fontSize: "clamp(60px, 14vw, 200px)",
                letterSpacing: "-0.01em",
                willChange: "opacity, transform, font-size, letter-spacing",
                color: "#1a1a1a",
              }}
            >
              GOWREESH
            </h1>
          </div>

          {/* Subtitle */}
          <div
            className="absolute left-0 right-0 flex flex-col items-center pointer-events-auto"
            style={{ top: "calc(50% + 7vw + 12px)" }}
          >
            <h2
              id="hero-subtitle"
              className="font-serif text-[3.5vw] opacity-0 leading-none text-[#1a1a1a]"
            >
              {slides[currentSlide].role}
            </h2>
          </div>

          {/* Slide dots */}
          <div className="absolute bottom-0 left-0 w-full px-8 py-8 md:px-12 flex justify-center items-end pointer-events-auto">
            <div id="slide-dots" className="flex gap-3 items-center opacity-0 mb-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDashClick(index)}
                  className={`h-[2px] transition-all duration-500 cursor-pointer ${
                    index === currentSlide
                      ? "w-10 bg-[#1a1a1a]"
                      : "w-6 bg-[#1a1a1a]/30 hover:bg-[#1a1a1a]/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── SCROLL LAYER 1: Photo-clipped name (z-10, above hero bg) ── */}
        <div
          ref={textPhotoRef}
          className="font-bebas absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{
            opacity: 0,
            fontSize: "clamp(68px, 18.5vw, 220px)",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            userSelect: "none",
            backgroundImage: "url('/images/edited-photo.png')",
            backgroundSize: "cover",
            backgroundPosition: "center 15%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            willChange: "opacity, transform, letter-spacing",
          }}
        >
          GOWREESH
        </div>

        {/* ── SCROLL LAYER 2: Full-bleed portrait (z-20) ───────────── */}
        <div
          ref={photoRef}
          className="absolute inset-0 z-20"
          style={{ opacity: 0, willChange: "opacity, transform" }}
        >
          <Image
            src="/images/edited-photo.png"
            alt="Gowreesh VT — Full-Stack Engineer, DevOps and Cloud Enthusiast"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 15%" }}
          />
          {/* Gradient for bio legibility */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top,
                #f0ede8 0%,
                rgba(240,237,232,0.82) 22%,
                rgba(240,237,232,0.20) 52%,
                transparent 75%
              )`,
            }}
          />
        </div>

        {/* ── SCROLL LAYER 3: Bio content (z-30) ───────────────────── */}
        <div
          ref={bioRef}
          className="absolute bottom-0 left-0 right-0 z-30 px-8 md:px-14 pb-10 md:pb-14"
          style={{ opacity: 0, willChange: "opacity, transform" }}
        >
          <h2
            className="font-sans font-bold uppercase tracking-tighter leading-none text-[#1a1a1a]"
            style={{ fontSize: "clamp(36px, 7vw, 96px)", marginBottom: "0.15em" }}
          >
            Gowreesh VT
          </h2>
          <p
            className="font-serif text-[#1a1a1a]/52"
            style={{ fontSize: "clamp(15px, 1.9vw, 26px)", marginBottom: "1.4rem" }}
          >
            Full-Stack Developer · DevOps &amp; Cloud Enthusiast
          </p>
          <div className="flex flex-wrap gap-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="font-sans flex items-center gap-2 rounded-full px-4 py-2 border border-[#1a1a1a]/10"
                style={{ background: "rgba(240,237,232,0.7)", backdropFilter: "blur(8px)" }}
              >
                <span className="text-[8.5px] uppercase tracking-[0.22em] text-[#1a1a1a]/35 font-semibold">
                  {s.label}
                </span>
                <span className="w-[1px] h-3 bg-[#1a1a1a]/15 inline-block" />
                <span className="text-[11.5px] text-[#1a1a1a]/65 font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
