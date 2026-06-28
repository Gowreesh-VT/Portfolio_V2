"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bebas_Neue, DM_Serif_Display, Inter } from "next/font/google";

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

const projectList = [
  {
    num: "01",
    title: "SyncFlow",
    subtitle: "Collaborative Workspace Platform",
    desc: "A real-time workspace featuring interactive whiteboards, vector canvas nodes, and conflict-free offline replication.",
    tech: ["Next.js", "WebRTC", "Y.js", "Tailwind CSS"],
    accent: "shadow-blue-500/10 border-blue-500/20",
    glow: "bg-blue-400",
  },
  {
    num: "02",
    title: "NovaPay",
    subtitle: "Multi-Chain Crypto Gateway",
    desc: "Seamless custodial transaction routing featuring instant gas estimation and zero-knowledge history proof generators.",
    tech: ["React Native", "Solidity", "Ethers.js", "Node.js"],
    accent: "shadow-purple-500/10 border-purple-500/20",
    glow: "bg-purple-400",
  },
  {
    num: "03",
    title: "EchoStore",
    subtitle: "AI-Powered Semantic Search Engine",
    desc: "Sub-millisecond semantic product exploration utilizing vector databases and neural representation embeddings.",
    tech: ["FastAPI", "Python", "Qdrant", "OpenAI API"],
    accent: "shadow-emerald-500/10 border-emerald-500/20",
    glow: "bg-emerald-400",
  },
];

export default function ProjectsSection() {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!track.current) return;

      const panels = gsap.utils.toArray(".project-panel");

      // Master Pin & Horizontal Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
          start: "top top",
          // We travel (n-1) viewport widths: panel 1 is already in view at x=0
          end: () => `+=${window.innerWidth * (projectList.length - 1)}`,
          invalidateOnRefresh: true,
        },
      });

      // Animate track horizontally using function-based calculation to handle dynamic layout shifts
      tl.to(track.current, {
        x: () => {
          return -(window.innerWidth * (projectList.length - 1));
        },
        ease: "none",
      });

      // Subtle parallax shift for the giant background numbers
      panels.forEach((panel: any) => {
        const bgNum = panel.querySelector(".project-bg-num");
        if (bgNum) {
          gsap.to(bgNum, {
            xPercent: -20,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tl,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          });
        }
      });

      // Translate horizontal swipe / trackpad wheel to vertical scrolling
      const containerEl = container.current;
      if (!containerEl) return;

      const handleWheel = (e: WheelEvent) => {
        // If the wheel event is horizontal scroll (e.g. on trackpad or shift+wheel)
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          e.preventDefault();
          window.scrollBy({
            top: e.deltaX,
            behavior: "auto",
          });
        }
      };

      let touchStartX = 0;
      let touchStartY = 0;

      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!touchStartX || e.touches.length === 0) return;

        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;

        const deltaX = touchStartX - touchX;
        const deltaY = touchStartY - touchY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // If predominantly horizontal swipe, translate to vertical scrolling
          e.preventDefault();
          window.scrollBy({
            top: deltaX * 1.5, // 1.5x multiplier for responsive swiping feel
            behavior: "auto",
          });
        }

        touchStartX = touchX;
        touchStartY = touchY;
      };

      containerEl.addEventListener("wheel", handleWheel, { passive: false });
      containerEl.addEventListener("touchstart", handleTouchStart, { passive: true });
      containerEl.addEventListener("touchmove", handleTouchMove, { passive: false });

      return () => {
        containerEl.removeEventListener("wheel", handleWheel);
        containerEl.removeEventListener("touchstart", handleTouchStart);
        containerEl.removeEventListener("touchmove", handleTouchMove);
      };
    },
    { scope: container }
  );

  return (
    <section
      id="projects-pin-container"
      ref={container}
      className="relative w-full h-screen overflow-hidden bg-[#f0ede8] text-[#1a1a1a] flex items-center"
    >
      {/* Header Label */}
      <div className="absolute top-8 left-6 md:left-10 z-20 pointer-events-none">
        <h3 className={`${inter.className} text-xs font-bold uppercase tracking-widest opacity-40`}>
          Selected Works
        </h3>
      </div>

      {/* Horizontal Sliding Track */}
      <div
        ref={track}
        className="flex h-full w-max items-center will-change-transform"
      >
        {projectList.map((project, index) => (
          <div
            key={index}
            className="project-panel w-screen h-screen flex items-center justify-center relative px-8 md:px-24 select-none overflow-hidden flex-shrink-0"
          >
            {/* Giant Background Parallax Number */}
            <div
              className={`project-bg-num absolute right-[5%] bottom-[-5%] text-[32vw] font-bold text-transparent leading-none pointer-events-none select-none ${bebasNeue.className}`}
              style={{
                WebkitTextStroke: "2px rgba(26, 26, 26, 0.04)",
              }}
            >
              {project.num}
            </div>

            {/* Content Cards Container */}
            <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center z-10">
              
              {/* Left Column: Metadata & Copy */}
              <div className="flex flex-col items-start text-left">
                <span className={`${inter.className} text-sm font-bold text-[#1a1a1a]/60 uppercase tracking-wider mb-2`}>
                  {project.subtitle}
                </span>
                
                <h4 className={`${bebasNeue.className} text-[6vw] md:text-[5vw] leading-none mb-6`}>
                  {project.title}
                </h4>
                
                <p className={`${dmSerif.className} text-lg md:text-xl text-[#1a1a1a]/80 leading-relaxed mb-8 max-w-[480px]`}>
                  {project.desc}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className={`${inter.className} text-xs font-semibold px-3 py-1 bg-[#1a1a1a]/5 rounded-full border border-[#1a1a1a]/10`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* View Link */}
                <a
                  href="#"
                  className={`${inter.className} group relative inline-flex items-center gap-2 text-sm font-bold tracking-wide uppercase overflow-hidden py-1`}
                >
                  View Case Study
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#1a1a1a] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </a>
              </div>

              {/* Right Column: Visual Mockup Showcase */}
              <div className="flex justify-center md:justify-end">
                <div
                  className={`relative w-[80vw] max-w-[450px] aspect-[4/3] rounded-2xl bg-[#eae7e1]/80 backdrop-blur-md border border-[#1a1a1a]/5 p-8 flex flex-col justify-between shadow-2xl transition-all duration-500 hover:scale-[1.02] ${project.accent}`}
                >
                  {/* Subtle Glowing Gradient Sphere */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full filter blur-[40px] opacity-25 mix-blend-multiply ${project.glow}`} />

                  {/* Browser-style Top Bar */}
                  <div className="flex gap-1.5 items-center pb-4 border-b border-[#1a1a1a]/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a]/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a]/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a]/20" />
                  </div>

                  {/* Mock UI Sketch Inside Container */}
                  <div className="flex-1 flex flex-col justify-center gap-4 py-8">
                    <div className="w-2/3 h-4 bg-[#1a1a1a]/10 rounded-full" />
                    <div className="w-full h-8 bg-[#1a1a1a]/5 rounded-xl border border-[#1a1a1a]/5" />
                    <div className="w-4/5 h-4 bg-[#1a1a1a]/10 rounded-full animate-pulse" />
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="h-10 bg-[#1a1a1a]/5 rounded-lg border border-[#1a1a1a]/5" />
                      <div className="h-10 bg-[#1a1a1a]/5 rounded-lg border border-[#1a1a1a]/5 animate-pulse" />
                      <div className="h-10 bg-[#1a1a1a]/5 rounded-lg border border-[#1a1a1a]/5" />
                    </div>
                  </div>

                  {/* Bottom Decorative Details */}
                  <div className="flex justify-between items-center pt-4 border-t border-[#1a1a1a]/10">
                    <span className={`${inter.className} text-[10px] font-bold tracking-widest uppercase opacity-40`}>
                      Prototype v1.0
                    </span>
                    <span className={`${inter.className} text-[10px] font-bold tracking-widest uppercase opacity-40`}>
                      {project.num}/03
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
