import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Header() {
  return (
    <nav
      id="navbar"
      className={`${inter.className} absolute top-0 left-0 w-full flex items-center justify-between px-6 py-6 md:px-10 md:py-6 opacity-0 pointer-events-auto z-50`}
    >
      <div className="font-bold text-lg tracking-wide uppercase nav-item">
        DEVELOPER
      </div>
      <div className="hidden md:flex gap-8 text-[15px] font-medium">
        <a href="#" className="relative group nav-item">
          Home
          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#1a1a1a]"></span>
        </a>
        <a href="#" className="hover:opacity-70 transition-opacity nav-item">
          About
        </a>
        <a href="#" className="hover:opacity-70 transition-opacity nav-item">
          Video
        </a>
        <a href="#" className="hover:opacity-70 transition-opacity nav-item">
          Drops
        </a>
        <a href="#" className="hover:opacity-70 transition-opacity nav-item">
          Contact
        </a>
      </div>
      <div className="flex items-center gap-6">
        <button aria-label="Search" className="hover:opacity-70 nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21L16.65 16.65"></path>
          </svg>
        </button>
        <a href="#" className="text-[15px] font-medium hover:opacity-70 nav-item">
          Log in
        </a>
        <button className="border border-[#1a1a1a] rounded-full px-5 py-2 text-[15px] font-medium hover:bg-[#1a1a1a] hover:text-[#f0ede8] transition-colors nav-item">
          Sign Up
        </button>
      </div>
    </nav>
  );
}
