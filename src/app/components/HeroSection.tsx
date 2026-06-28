"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DM_Serif_Display, Inter, Bebas_Neue } from "next/font/google";
import Header from "./Header";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
});

const slides = [
  {
    role: "Full-Stack Developer",
    bgText: "DEVELOPER",
  },
  {
    role: "UI/UX Designer",
    bgText: "DESIGNER",
  },
  {
    role: "Creative Engineer",
    bgText: "CREATIVE",
  },
];

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentSlideRef = useRef(0);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  // Keep ref in sync with state for access in intervals
  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  // Master Slide Transition Function
  const transitionToSlide = (targetIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
      },
    });

    // 1. Slide and fade out current text
    tl.to("#hero-subtitle", {
      y: 25,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
    });

    tl.to(
      "#bg-creative-text",
      {
        y: 40,
        opacity: 0,
        duration: 0.45,
        ease: "power2.in",
      },
      0
    );

    // 2. Change the state so DOM renders new slide content
    tl.call(() => {
      setCurrentSlide(targetIndex);
    });

    // 3. Slide and fade in new text from top to bottom
    tl.fromTo(
      "#hero-subtitle",
      { y: -25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" }
    );

    tl.fromTo(
      "#bg-creative-text",
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
      "<"
    );
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
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }
  };

  // Setup Autoplay after intro finished
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("introAnimationPlayed");
    const delay = hasPlayed ? 0 : 3600;

    const timer = setTimeout(() => {
      startAutoplay();
    }, delay);

    return () => {
      clearTimeout(timer);
      stopAutoplay();
    };
  }, []);

  useGSAP(
    () => {
      const hasPlayed = sessionStorage.getItem("introAnimationPlayed");
      const tl = gsap.timeline();

      if (hasPlayed) {
        // Skip animation, set immediate final state
        tl.set("#hello-screen", { display: "none" })
          .set("#bg-layer", { backgroundColor: "#f0ede8" })
          .set("#navbar", { opacity: 1, y: 0 })
          .set("#bg-creative-text", { opacity: 1, y: 0 })
          .set("#hero-name", { opacity: 1, y: 0 })
          .set("#hero-subtitle", { opacity: 1, y: 0 })
          .set("#slide-dots", { opacity: 1 })
          .set(".nav-item", { opacity: 1, y: 0 });
      } else {
        sessionStorage.setItem("introAnimationPlayed", "true");

        // Intro Zoom Animation
        tl.to(
          "#hello-text-svg",
          {
            scale: 45,
            duration: 1.2,
            ease: "power4.in",
            transformOrigin: "center center",
            color: "transparent",
            stroke: "#e8e3da",
            strokeWidth: "0.5px",
          },
          1.2
        );

        tl.to(
          "#bg-layer",
          {
            backgroundColor: "#f0ede8",
            duration: 0.9,
            ease: "power2.inOut",
          },
          1.5
        );

        tl.to("#hello-text-svg", { opacity: 0, duration: 0.3 }, 2.1);

        tl.set("#hello-screen", { display: "none" }, 2.4);

        // Staggered Reveals
        tl.fromTo(
          "#navbar",
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          2.4
        );

        tl.fromTo(
          ".nav-item",
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
          2.6
        );

        tl.fromTo(
          "#bg-creative-text",
          { opacity: 0, y: -40 },
          { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
          2.5
        );

        tl.fromTo(
          "#hero-name",
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
          2.6
        );

        tl.fromTo(
          "#hero-subtitle",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
          2.7
        );

        tl.fromTo(
          "#slide-dots",
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          3.0
        );
      }

      // Mouse Parallax
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;

        // Parallax for huge background text
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to("#bg-creative-text", {
          x: xPos,
          y: yPos,
          duration: 1,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: container }
  );

  return (
    <div
      id="hero-section"
      ref={container}
      className="relative w-full h-screen overflow-hidden text-[#1a1a1a]"
    >
      {/* Film Grain Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-[0.25]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-50">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Background Layer */}
      <div id="bg-layer" className="absolute inset-0 bg-[#0a0a0a] -z-20"></div>

      {/* Intro Screen */}
      <div
        id="hello-screen"
        className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden pointer-events-none"
      >
        {/* Crisp SVG Text for infinite zoom */}
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
            className={`${bebasNeue.className} text-[180px] tracking-widest text-[#e8e3da]`}
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

      {/* Main Hero Content */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        {/* Navbar Component */}
        <Header />

        {/* Hero Background Text */}
        <div
          id="bg-creative-text-wrapper"
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden -z-10"
        >
          <div
            id="bg-creative-text"
            className={`${inter.className} w-full text-center text-[18vw] font-bold text-transparent opacity-0 leading-none select-none tracking-tighter`}
            style={{
              WebkitTextStroke: "1px rgba(26, 26, 26, 0.25)",
              whiteSpace: "nowrap",
            }}
          >
            {slides[currentSlide].bgText}
          </div>
        </div>

        {/* Centered Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto">
          <div className="overflow-hidden">
            <h1
              id="hero-name"
              className={`${inter.className} text-[7vw] font-bold uppercase tracking-tighter opacity-0 leading-none`}
            >
              Gowreesh
            </h1>
          </div>
          <div className="overflow-hidden pt-2">
            <h2
              id="hero-subtitle"
              className={`${dmSerif.className} text-[4.5vw] opacity-0 leading-none`}
            >
              {slides[currentSlide].role}
            </h2>
          </div>
        </div>

        {/* Bottom UI Elements */}
        <div className="absolute bottom-0 left-0 w-full px-8 py-8 md:px-12 flex justify-center items-end pointer-events-auto z-50">
          <div id="slide-dots" className="flex gap-3 items-center opacity-0 mb-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDashClick(index)}
                className={`h-[2px] transition-all duration-500 cursor-pointer ${
                  index === currentSlide ? "w-10 bg-[#1a1a1a]" : "w-6 bg-[#1a1a1a]/30 hover:bg-[#1a1a1a]/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
