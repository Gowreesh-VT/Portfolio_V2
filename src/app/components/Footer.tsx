"use client";

import React from "react";
import Image from "next/image";
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

export default function Footer() {
  return (
    <footer className="w-full bg-[#f0ede8] text-[#1a1a1a] pt-20 overflow-hidden relative flex flex-col justify-between">
      
      {/* 4-Column Layout Top Section */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start mb-16">
        
        {/* Column 1: Brand details (occupies 4 cols on md) */}
        <div className="md:col-span-5 flex flex-col items-start text-left max-w-sm">
          {/* Custom SVG Developer Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] text-[#f0ede8] flex items-center justify-center mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
            </svg>
          </div>
          
          <h4 className={`${inter.className} text-xl font-bold tracking-tight mb-2`}>
            Gowreesh
          </h4>
          
          <p className={`${dmSerif.className} text-[15px] text-[#1a1a1a]/70 leading-relaxed mb-6`}>
            IIT Madras × VIT Chennai. Crafting fluid, high-performance web applications with absolute visual precision and elegant backend architectures.
          </p>
          
          {/* Dark pill button: Resume Link */}
          <a
            href="#"
            className={`${inter.className} inline-flex items-center gap-2 bg-[#1a1a1a] text-[#f0ede8] rounded-full px-6 py-2.5 text-xs font-bold tracking-wide uppercase hover:bg-[#2a2a2a] transition-colors mb-8`}
          >
            Download Resume
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </a>
          
          <div className={`${inter.className} text-[11px] font-bold tracking-wide uppercase opacity-40 flex flex-col gap-1`}>
            <span>© 2026 Gowreesh. All rights reserved.</span>
            <span>Built with 💛 by Gowreesh.</span>
          </div>
        </div>

        {/* Column 2: Menu (2 cols) */}
        <div className="md:col-span-2 flex flex-col items-start text-left md:pl-6">
          <h5 className={`${inter.className} text-xs font-bold tracking-widest uppercase opacity-40 mb-6`}>
            Menu
          </h5>
          <div className={`${inter.className} flex flex-col gap-4 text-sm font-semibold`}>
            <a href="#" className="hover:opacity-60 transition-opacity">Home</a>
            <a href="#" className="hover:opacity-60 transition-opacity">About</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Video</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Drops</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>
        </div>

        {/* Column 3: Navigation / Socials (2 cols) */}
        <div className="md:col-span-2 flex flex-col items-start text-left">
          <h5 className={`${inter.className} text-xs font-bold tracking-widest uppercase opacity-40 mb-6`}>
            Navigation
          </h5>
          <div className={`${inter.className} flex flex-col gap-4 text-sm font-semibold`}>
            <a href="#" className="hover:opacity-60 transition-opacity">GitHub</a>
            <a href="#" className="hover:opacity-60 transition-opacity">LinkedIn</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Twitter/X</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Medium</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Email</a>
          </div>
        </div>

        {/* Column 4: More Products / Works (3 cols) */}
        <div className="md:col-span-3 flex flex-col items-start text-left">
          <h5 className={`${inter.className} text-xs font-bold tracking-widest uppercase opacity-40 mb-6`}>
            More products
          </h5>
          <div className={`${inter.className} flex flex-col gap-4 text-sm font-semibold`}>
            <a href="#" className="hover:opacity-60 transition-opacity">SyncFlow.com</a>
            <a href="#" className="hover:opacity-60 transition-opacity">NovaPay.app</a>
            <a href="#" className="hover:opacity-60 transition-opacity">EchoStore.ai</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Selected.site</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Portfolio.mjs</a>
          </div>
        </div>

      </div>

      {/* Landscape Image and Overlapping Big Signature */}
      <div className="relative w-full h-[280px] md:h-[450px] overflow-hidden flex items-end justify-center select-none pointer-events-none mt-auto">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/footer_landscape.png"
            alt="Golden Hour Landscape Footer"
            fill
            sizes="100vw"
            className="object-cover object-bottom"
            priority
          />
          {/* Top Gradient Overlay to blend text/columns into image */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f0ede8] via-[#f0ede8]/30 to-transparent z-10" />
          
          {/* Bottom Gradient Overlay to mask text into bottom border */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f0ede8] via-[#f0ede8]/90 to-transparent z-10" />
        </div>

        {/* Massive Signature "Gowreesh" */}
        <h2
          className={`${bebasNeue.className} text-[30vw] leading-none text-white select-none pointer-events-none z-20 text-center tracking-tighter whitespace-nowrap`}
          style={{
            transform: "translateY(12%)",
            textShadow: "0 10px 40px rgba(26,26,26,0.08)",
          }}
        >
          Gowreesh
        </h2>
      </div>

    </footer>
  );
}
