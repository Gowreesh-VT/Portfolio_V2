"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


const projectList = [
  {
    num: "01",
    title: "Fleet Pilot",
    subtitle: "Automotive SaaS Platform",
    desc: "A vehicle tracking PWA serving 200+ customers and 6,000+ vehicles in production. Featuring automated data extraction and OCR.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "AWS", "Playwright"],
    accent: "shadow-blue-500/10 border-blue-500/20",
    glow: "bg-blue-400",
    link: "https://fleetpilot.gowreesh.me",
    details: [
      "Production B2C vehicle tracking PWA serving 200+ customers and 6,000+ vehicles.",
      "Automated vehicle data extraction using a Playwright and Tesseract.js OCR pipeline.",
      "Fully managed cloud infrastructure utilizing AWS RDS, SES, Route 53, and CloudWatch.",
      "Integrated Razorpay payment gateway, Twilio SMS alerts, and browser VAPID push notifications."
    ]
  },
  {
    num: "02",
    title: "Postly",
    subtitle: "Self-Hosted Email & SMTP",
    desc: "A secure self-hosted SMTP email platform with rich-text editing, open tracking, scheduled sending, and AES-256-GCM encryption.",
    tech: ["Next.js", "Node.js", "SMTP", "AES-256-GCM", "JWT"],
    accent: "shadow-emerald-500/10 border-emerald-500/20",
    glow: "bg-emerald-400",
    link: "https://postly.gowreesh.me",
    details: [
      "Self-hosted SMTP server and email campaign manager with detailed open tracking links.",
      "Modular email designer powered by the Tiptap rich-text editor engine.",
      "Automated sending schedule processing via local system cron triggers.",
      "High-security structure with AES-256-GCM data encryption and httpOnly JWT authentication."
    ]
  },
  {
    num: "03",
    title: "Lumi Link",
    subtitle: "Hybrid Li-Fi & Wi-Fi System",
    desc: "A hybrid communication dashboard combining visible light communication (Li-Fi) and Wi-Fi to establish interference-free networking.",
    tech: ["React", "TypeScript", "ESP32", "MQTT", "Recharts"],
    accent: "shadow-purple-500/10 border-purple-500/20",
    glow: "bg-purple-400",
    details: [
      "Academic engineering project implementing Visible Light Communication (VLC) technology.",
      "Establishes an interference-free, secure alternative network combining Li-Fi and Wi-Fi.",
      "Real-time light signal modulation and demodulation monitoring via ESP32 microcontrollers.",
      "Interactive Recharts telemetry showing signal intensity, throughput, and packet loss rate."
    ]
  },
  {
    num: "04",
    title: "Campus Flow",
    subtitle: "Academic Workflow Automation",
    desc: "An automated campus workflow and event approval portal. Streamlines venue bookings, schedule planning, and coordination.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
    accent: "shadow-rose-500/10 border-rose-500/20",
    glow: "bg-rose-400",
    link: "https://campus-flow-mu.vercel.app",
    details: [
      "Academic schedule planning and venue booking approval automation software.",
      "Real-time request workflow notifications and authorization logs.",
      "Robust backend database queries and models powered by Prisma and PostgreSQL.",
      "Fully responsive client interface built on React Server Components, Next.js, and Tailwind CSS."
    ]
  },
  {
    num: "05",
    title: "Club Websites",
    subtitle: "Official Web Development",
    desc: "Developed and maintained the official websites of Microsoft Innovation Club (MIC) and IEEE Electron Devices Society (EDS) chapters at VIT Chennai.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
    accent: "shadow-amber-500/10 border-amber-500/20",
    glow: "bg-amber-400",
    links: [
      { label: "MIC Website", url: "https://www.microsoftinnovations.club" },
      { label: "IEEE EDS Website", url: "https://ieee-eds.vercel.app" },
    ],
    details: [
      "Led end-to-end full-stack portal development for Microsoft Innovations Club VIT Chennai.",
      "Integrated role-based access control, event registration modules, and user authentication.",
      "Maintained and designed the IEEE EDS student chapter showcase portal.",
      "Utilized Next.js, Firebase auth, Firestore databases, and GSAP animations."
    ]
  },
];

export default function ProjectsSection() {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<typeof projectList[0] | null>(null);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    const sheen = card.querySelector(".card-sheen") as HTMLElement;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      scale: 1.03,
      duration: 0.3,
      ease: "power2.out",
    });

    if (sheen) {
      gsap.to(sheen, {
        opacity: 0.8,
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`,
        duration: 0.2,
      });
    }
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const sheen = card.querySelector(".card-sheen") as HTMLElement;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    if (sheen) {
      gsap.to(sheen, {
        opacity: 0,
        duration: 0.4,
      });
    }
  };

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!track.current) return;

      const panels = gsap.utils.toArray(".project-panel") as HTMLElement[];

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
      panels.forEach((panel) => {
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
        <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#58a6ff]">
          [04] Projects Section · Selected Works
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
            className="project-panel w-screen h-screen flex items-center justify-center relative px-6 md:px-24 select-none overflow-hidden flex-shrink-0"
          >
            {/* Giant Background Parallax Number */}
            <div
              className={`project-bg-num absolute right-[5%] bottom-[-5%] text-[32vw] font-bold text-transparent leading-none pointer-events-none select-none font-bebas`}
              style={{
                WebkitTextStroke: "2px rgba(26, 26, 26, 0.12)",
              }}
            >
              {project.num}
            </div>

            {/* Content Cards Container */}
            <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20 items-center z-10 h-full md:h-auto overflow-y-auto md:overflow-visible py-20 md:py-0">
              
              {/* Left Column: Metadata & Copy */}
              <div className="flex flex-col items-start text-left flex-shrink-0">
                <span className="font-sans text-sm font-bold text-[#1a1a1a]/60 uppercase tracking-wider mb-2">
                  {project.subtitle}
                </span>
                
                <h4 className="font-bebas text-[6vw] md:text-[5vw] leading-none mb-6">
                  {project.title}
                </h4>
                
                <p className="font-serif text-lg md:text-xl text-[#1a1a1a]/80 leading-relaxed mb-8 max-w-[480px]">
                  {project.desc}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="font-sans text-xs font-semibold px-3 py-1 bg-[#1a1a1a]/5 rounded-full border border-[#1a1a1a]/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center gap-6">
                  {/* View Link */}
                  {project.links ? (
                    <div className="flex gap-4">
                      {project.links.map((lnk, idx) => (
                        <a
                          key={idx}
                          href={lnk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans group relative inline-flex items-center gap-2 text-sm font-bold tracking-wide uppercase overflow-hidden py-1"
                        >
                          {lnk.label}
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
                      ))}
                    </div>
                  ) : project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans group relative inline-flex items-center gap-2 text-sm font-bold tracking-wide uppercase overflow-hidden py-1"
                    >
                      Visit Project
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
                  ) : (
                    <div className="font-mono text-xs opacity-50 uppercase tracking-widest border border-[#1a1a1a]/20 rounded-full px-4 py-1.5 inline-block select-none">
                      VLC Hardware Project
                    </div>
                  )}

                  {/* Read More Button */}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="font-sans group inline-flex items-center gap-2 bg-[#1a1a1a] text-[#f0ede8] hover:bg-[#2d2d2d] border border-white/5 rounded-full px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-md"
                  >
                    Read More
                    <svg
                      className="w-3.5 h-3.5 text-[#58a6ff] transform group-hover:translate-y-0.5 transition-transform duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Mockup Showcase */}
              <div className="flex justify-center md:justify-end">
                <div
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className={`relative w-[80vw] max-w-[450px] aspect-[4/3] rounded-2xl bg-[#eae7e1]/80 backdrop-blur-md border border-[#1a1a1a]/5 p-8 flex flex-col justify-between shadow-2xl transition-all duration-500 will-change-transform ${project.accent}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Dynamic Glass Sheen Layer */}
                  <div className="card-sheen absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300 z-20" />

                  {/* Subtle Glowing Gradient Sphere */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full filter blur-[40px] opacity-25 mix-blend-multiply ${project.glow}`} />

                  {/* Browser-style Top Bar */}
                  <div className="flex gap-1.5 items-center pb-4 border-b border-[#1a1a1a]/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a]/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a]/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a]/20" />
                  </div>

                  {/* Mock UI Sketch Inside Container */}
                  <div className="flex-1 flex flex-col justify-center py-6">
                    {project.num === "01" && (
                      /* Fleet Pilot Vehicle Tracking */
                      <div className="relative flex-1 border border-dashed border-[#1a1a1a]/15 rounded-xl p-4 overflow-hidden flex flex-col justify-between bg-white/30">
                        <div className="absolute inset-0 p-3 flex flex-col justify-between">
                          <div className="flex justify-between items-center">
                            <div className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-700 text-[9px] font-bold border border-blue-500/30 shadow-sm flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              Fleet Tracking Active
                            </div>
                            <div className="px-2 py-0.5 rounded bg-[#1a1a1a]/5 text-[#1a1a1a]/60 text-[8px] font-bold border border-[#1a1a1a]/10">
                              PWA v1.4
                            </div>
                          </div>

                          {/* Vehicle stats */}
                          <div className="flex flex-col gap-1 my-auto text-left">
                            <span className="text-[9px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Total Fleet</span>
                            <div className="flex items-baseline gap-2">
                              <h5 className="text-2xl font-bold font-mono text-[#1a1a1a] leading-none">6,124</h5>
                              <span className="text-[9px] text-[#3fb950] font-bold">+200 Customers</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-end border-t border-[#1a1a1a]/10 pt-2 text-[8px] font-mono text-[#1a1a1a]/60">
                            <span>SSM Keys: Secured</span>
                            <span className="text-blue-600 font-bold">Amplify SSR</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {project.num === "02" && (
                      /* Postly SMTP Email Platform */
                      <div className="flex-1 rounded-xl p-4 flex flex-col justify-between bg-[#151b23] text-[#f0f6fc] border border-[#30363d] overflow-hidden">
                        <div className="flex justify-between items-center pb-2 border-b border-[#30363d]">
                          <span className="text-[9px] text-[#8b949e] font-mono tracking-wider">Postly Mailer</span>
                          <span className="px-1.5 py-0.5 text-[8px] bg-emerald-500/20 text-[#3fb950] border border-emerald-500/30 rounded font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]" /> AES-256
                          </span>
                        </div>
                        
                        <div className="py-2 flex flex-col items-start gap-1">
                          <span className="text-[8px] text-[#8b949e] uppercase font-bold tracking-wider">Tiptap Rich-Text Editor</span>
                          <div className="w-full text-[9px] text-white/70 bg-white/5 border border-white/10 rounded p-1.5 font-sans italic text-left">
                            Subject: Reaching out...
                          </div>
                        </div>

                        {/* Open Rate Tracker */}
                        <div className="h-8 w-full flex items-end gap-[3px] border-b border-[#30363d] pb-2">
                          {[25, 40, 55, 65, 80, 75, 85, 95, 99].map((val, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-gradient-to-t from-emerald-500 to-[#3fb950] rounded-t-sm"
                              style={{ height: `${val}%` }}
                            />
                          ))}
                        </div>

                        <div className="flex justify-between items-center text-[7px] font-mono text-[#8b949e] pt-1.5">
                          <span>Cron Queues: Active</span>
                          <span className="text-[#58a6ff]">Open Tracking</span>
                        </div>
                      </div>
                    )}

                    {project.num === "05" && (
                      /* Club Websites (MIC & IEEE EDS) */
                      <div className="flex-1 flex gap-3 h-full overflow-hidden">
                        {/* MIC Panel */}
                        <div className="flex-1 rounded-xl p-3 flex flex-col justify-between bg-[#0a0f1d] text-[#58a6ff] border border-blue-500/20 text-left">
                          <div className="flex justify-between items-center pb-1.5 border-b border-blue-500/10">
                            <span className="text-[8px] font-bold uppercase tracking-wider text-blue-400">MIC VITC</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          </div>
                          <div className="flex-1 flex flex-col justify-center gap-1 my-2">
                            <span className="text-[10px] font-bold text-white leading-none">Microsoft</span>
                            <span className="text-[8px] text-[#8b949e] leading-tight">Innovations Club Portal</span>
                            <div className="mt-1 w-full bg-blue-500/10 rounded h-1.5 overflow-hidden">
                              <div className="bg-blue-500 h-full w-3/4" />
                            </div>
                          </div>
                          <div className="text-[7px] font-mono text-blue-400/70 font-bold">
                            microsoftinnovations.club
                          </div>
                        </div>
                        {/* IEEE EDS Panel */}
                        <div className="flex-1 rounded-xl p-3 flex flex-col justify-between bg-[#1f1614] text-[#f85149] border border-red-500/20 text-left">
                          <div className="flex justify-between items-center pb-1.5 border-b border-red-500/10">
                            <span className="text-[8px] font-bold uppercase tracking-wider text-red-400">IEEE EDS</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          </div>
                          <div className="flex-1 flex flex-col justify-center gap-1 my-2">
                            <span className="text-[10px] font-bold text-white leading-none">Electron Devices</span>
                            <span className="text-[8px] text-[#8b949e] leading-tight">EDS Student Chapter</span>
                            <div className="mt-1 w-full bg-red-500/10 rounded h-1.5 overflow-hidden">
                              <div className="bg-red-500 h-full w-1/2" />
                            </div>
                          </div>
                          <div className="text-[7px] font-mono text-red-400/70 font-bold">
                            ieee-eds.vercel.app
                          </div>
                        </div>
                      </div>
                    )}

                    {project.num === "03" && (
                      /* Lumi Link - Hybrid Li-Fi & Wi-Fi System */
                      <div className="flex-1 rounded-xl p-4 flex flex-col justify-between bg-[#0b0f19] text-[#f0f6fc] border border-blue-900/30 overflow-hidden text-left font-sans">
                        <div className="flex justify-between items-center pb-2 border-b border-blue-900/20">
                          <span className="text-[9px] text-blue-400 font-mono tracking-wider font-bold">Lumi Link Control</span>
                          <span className="px-1.5 py-0.5 text-[8px] bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded font-semibold flex items-center gap-1 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Li-Fi Link: 9.6 Kbps
                          </span>
                        </div>
                        
                        <div className="py-2.5 flex-1 flex flex-col justify-center gap-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[8px] text-gray-400 font-mono">
                              <span>Signal Intensity (VLC)</span>
                              <span className="text-emerald-400">92%</span>
                            </div>
                            <div className="w-full bg-blue-950/50 rounded-full h-2 overflow-hidden border border-blue-900/20">
                              <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full w-[92%]" />
                            </div>
                          </div>

                          <div className="flex gap-2 mt-1">
                            <div className="flex-1 bg-white/5 rounded p-1.5 border border-white/5 flex flex-col">
                              <span className="text-[7px] text-gray-400 font-mono uppercase">Transmitter</span>
                              <span className="text-[9px] font-bold text-white font-mono mt-0.5">LED Modulated</span>
                            </div>
                            <div className="flex-1 bg-white/5 rounded p-1.5 border border-white/5 flex flex-col">
                              <span className="text-[7px] text-gray-400 font-mono uppercase">Receiver</span>
                              <span className="text-[9px] font-bold text-emerald-400 font-mono mt-0.5">Demodulating</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-blue-900/20 text-[8px] font-mono text-gray-400">
                          <span>ESP32 Server Status</span>
                          <span className="text-blue-400">Hybrid Mode</span>
                        </div>
                      </div>
                    )}

                    {project.num === "04" && (
                      /* Campus Flow - University Management System */
                      <div className="flex-1 rounded-xl p-4 flex flex-col justify-between bg-[#0a0f1d] text-[#58a6ff] border border-blue-900/30 overflow-hidden text-left font-sans">
                        <div className="flex justify-between items-center pb-2 border-b border-blue-900/20">
                          <span className="text-[9px] text-blue-400 font-mono tracking-wider font-bold">Campus Flow Portal</span>
                          <span className="px-1.5 py-0.5 text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded font-semibold flex items-center gap-1 font-mono font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> System Online
                          </span>
                        </div>
                        
                        <div className="py-2.5 flex-1 flex flex-col justify-center gap-2">
                          {/* Approval status items */}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center bg-blue-950/20 border border-blue-900/10 px-2 py-1 rounded">
                              <span className="text-[8px] font-bold text-white font-mono">Event Approval</span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[7px] font-bold font-mono">
                                Approved
                              </span>
                            </div>
                            <div className="flex justify-between items-center bg-blue-950/10 border border-blue-900/5 px-2 py-1 rounded opacity-80">
                              <span className="text-[8px] font-bold text-white font-mono">Venue Booking (Audi-2)</span>
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[7px] font-bold font-mono">
                                Pending
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-blue-900/20 text-[8px] font-mono text-gray-400">
                          <span>Active Requests: 12</span>
                          <span className="text-blue-400">campus-flow</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Decorative Details */}
                  <div className="flex justify-between items-center pt-4 border-t border-[#1a1a1a]/10">
                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase opacity-40">
                      Prototype v1.0
                    </span>
                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase opacity-40">
                      {project.num}/{String(projectList.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ── Detailed Project Modal ────────────────────────────────────────── */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedProject(null)}
        >
          {/* Modal Container */}
          <div
            className="relative w-full max-w-[700px] bg-[#1a1a1a] text-[#f0ede8] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col gap-6 max-h-[85vh] overflow-y-auto animate-modal-scale text-left font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Header */}
            <div>
              <p className="font-mono text-[#58a6ff] text-xs font-bold tracking-widest uppercase mb-1">
                Project {selectedProject.num}
              </p>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1.5">
                {selectedProject.title}
              </h3>
              <p className="text-sm font-semibold tracking-wide text-white/50 uppercase">
                {selectedProject.subtitle}
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10" />

            {/* Description */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs uppercase tracking-wider font-bold text-white/40 font-mono">
                Overview &amp; Features
              </h4>
              <p className="text-sm md:text-[15px] text-white/80 leading-relaxed">
                {selectedProject.desc}
              </p>
              
              {/* Detailed Points */}
              <ul className="flex flex-col gap-2.5 mt-2">
                {selectedProject.details.map((pt, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-xs md:text-sm text-white/70 leading-relaxed">
                    <span className="text-[#58a6ff] mt-1 font-bold">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-white/40 font-mono">
                Technology Architecture
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[10px] md:text-xs font-bold px-3 py-1 bg-white/5 rounded-full border border-white/10 text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10 mt-2" />

            {/* Links / Action Footer */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <div>
                {!selectedProject.link && !selectedProject.links && (
                  <span className="font-mono text-[10px] text-purple-400 font-bold border border-purple-500/20 bg-purple-500/5 rounded-full px-4 py-1.5 inline-block">
                    Physical Hardware System
                  </span>
                )}
              </div>
              
              <div className="flex gap-3 justify-end">
                {selectedProject.links ? (
                  <div className="flex gap-3">
                    {selectedProject.links.map((lnk, idx) => (
                      <a
                        key={idx}
                        href={lnk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#f0ede8] text-[#1a1a1a] hover:bg-[#eae7e1] text-xs font-bold uppercase tracking-wider py-3 px-5 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        {lnk.label}
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                        </svg>
                      </a>
                    ))}
                  </div>
                ) : selectedProject.link ? (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#f0ede8] text-[#1a1a1a] hover:bg-[#eae7e1] text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    Visit Project
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles for mock animations and modal transitions */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s forwards ease-out;
        }
        .animate-modal-scale {
          animation: modalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
      `}</style>
    </section>
  );
}
