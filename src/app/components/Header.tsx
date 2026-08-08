"use client";

import React, { useState } from 'react';
import { soundManager } from '../utils/SoundEffects';

export default function Header() {
  const [isSoundOn, setIsSoundOn] = useState(soundManager.isEnabled());

  const navItems = [
    { label: "Home", href: "#hero-section" },
    { label: "About", href: "#about" },
    { label: "Tech Stack", href: "#tech-stack" },
    { label: "Projects", href: "#projects-pin-container" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    soundManager.playClick();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleSoundHandler = () => {
    const active = soundManager.toggleSound();
    setIsSoundOn(active);
  };

  return (
    <nav
      id="navbar"
      className="fixed top-6 left-1/2 -translate-x-1/2 flex items-center justify-between px-6 py-3 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-xl text-white/90 opacity-0 pointer-events-auto z-50 w-[92vw] md:w-auto md:gap-8"
    >
      <div className="font-bold text-sm tracking-widest uppercase nav-item">
        Gowreesh
      </div>
      <div className="flex gap-4 md:gap-6 text-[12px] md:text-[13px] font-medium nav-item">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => handleScroll(e, item.href)}
            className="hover:text-white/70 transition-colors relative group"
          >
            {item.label}
            <span className="absolute bottom-[-4px] left-0 w-full h-[1.5px] bg-[#58a6ff] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3 nav-item">
        <button
          onClick={toggleSoundHandler}
          className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          title={isSoundOn ? "Mute UI Sounds" : "Enable UI Sounds"}
          aria-label="Toggle Sound"
        >
          {isSoundOn ? (
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          ) : (
            <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          )}
        </button>
        <a
          href="#contact"
          onClick={(e) => handleScroll(e, "#contact")}
          className="hidden md:inline-block bg-white text-black font-semibold rounded-full px-4 py-1.5 text-xs hover:bg-white/80 transition-colors"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
