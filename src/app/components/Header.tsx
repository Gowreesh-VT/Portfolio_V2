"use client";

import React from 'react';

export default function Header() {
  const navItems = [
    { label: "Home", href: "#hero-section" },
    { label: "About", href: "#about" },
    { label: "Tech Stack", href: "#tech-stack" },
    { label: "Projects", href: "#projects-pin-container" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      id="navbar"
      className="fixed top-6 left-1/2 -translate-x-1/2 flex items-center justify-between px-6 py-3 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-xl text-white/90 opacity-0 pointer-events-auto z-50 w-[92vw] md:w-auto md:gap-10"
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
      <div className="hidden md:flex items-center nav-item">
        <a
          href="#contact"
          onClick={(e) => handleScroll(e, "#contact")}
          className="bg-white text-black font-semibold rounded-full px-4 py-1.5 text-xs hover:bg-white/80 transition-colors"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
