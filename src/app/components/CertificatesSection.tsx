"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const badges = [
  { id: 1, name: "AWS Educate Introduction to Generative AI", issuer: "Amazon Web Services", image: "https://images.credly.com/images/e50c657a-edd9-4c93-b1cf-2b6634b54abf/blob", url: "https://www.credly.com/badges/f201db70-adcf-4d37-ada0-5d636f4600a1/public_url" },
  { id: 2, name: "Analyze Speech and Language with Google APIs", issuer: "Google Cloud", image: "https://images.credly.com/images/b82729b9-8f1f-4362-8b71-fb08f2cea6c2/image.png", url: "https://www.credly.com/badges/2e8b5556-fac0-4078-b2e3-5660b4d4f879/public_url" },
  { id: 3, name: "App Engine: 3 Ways", issuer: "Google Cloud", image: "https://images.credly.com/images/0943ce78-1ef7-4ff4-8ad7-4b60f6de5e5f/image.png", url: "https://www.credly.com/badges/9cdf56e2-c295-42a7-8d08-37c351e24eaa/public_url" },
  { id: 4, name: "Cloud Functions: 3 Ways", issuer: "Google Cloud", image: "https://images.credly.com/images/12ca3878-2560-4d84-a3a5-c317db9ca549/image.png", url: "https://www.credly.com/badges/894e2631-cbcc-4a04-94bd-15745fac4bcb/public_url" },
  { id: 5, name: "Develop GenAI Apps with Gemini and Streamlit", issuer: "Google Cloud", image: "https://images.credly.com/images/1dbef1bd-cdb0-40e1-bff4-8200448c3161/blob", url: "https://www.credly.com/badges/7595a2d0-d59e-42c2-9e03-1e2b09965b2f/public_url" },
  { id: 6, name: "Monitoring in Google Cloud", issuer: "Google Cloud", image: "https://images.credly.com/images/5a9654e8-37e5-4043-8a94-eeb0f98a2a9c/image.png", url: "https://www.credly.com/badges/4e5117ef-8db9-4583-ac5c-ac3ca9932b9a/public_url" },
  { id: 7, name: "Prompt Design in Vertex AI", issuer: "Google Cloud", image: "https://images.credly.com/images/cef82b2e-970a-4318-8e59-c3e26b7f5c19/image.png", url: "https://www.credly.com/badges/83d8be48-b17a-4d87-9432-f7517c51dfec/public_url" },
  { id: 8, name: "Build a Website on Google Cloud", issuer: "Google Cloud", image: "https://images.credly.com/images/cfcacbf1-1f76-40ad-be09-a5b057e31ebf/image.png", url: "https://www.credly.com/badges/b8bc331b-0826-477e-8e87-d9df4fbf3306/public_url" },
  { id: 9, name: "Cloud Speech API: 3 Ways", issuer: "Google Cloud", image: "https://images.credly.com/images/4ddcd71a-7d89-4f86-bb85-adab564f16f1/image.png", url: "https://www.credly.com/badges/e4231447-9f7d-45c3-a5c4-cbd121a99544/public_url" },
  { id: 10, name: "Set Up a Google Cloud Network", issuer: "Google Cloud", image: "https://images.credly.com/images/189c5c31-67c6-4eae-87dc-3b8185a99043/image.png", url: "https://www.credly.com/badges/4b3b0501-21b3-4c1b-8fc7-fb31b576e526/public_url" },
  { id: 11, name: "App Building with AppSheet", issuer: "Google Cloud", image: "https://images.credly.com/images/cdd80963-5ccb-4981-b01c-5344a9a3e8df/image.png", url: "https://www.credly.com/badges/776ef4cc-417b-4838-9f15-dd80fa9b6ee7/public_url" },
  { id: 12, name: "Develop with Apps Script and AppSheet", issuer: "Google Cloud", image: "https://images.credly.com/images/c99de4cf-a2fe-4c34-9b38-43ea165ea0f4/image.png", url: "https://www.credly.com/badges/2a1310d7-6922-4aa6-9deb-4c5e86bd3351/public_url" },
  { id: 13, name: "Get Started with Dataplex", issuer: "Google Cloud", image: "https://images.credly.com/images/1aa38026-5e9d-45f5-becc-288601568ad5/image.png", url: "https://www.credly.com/badges/138de6ab-38c4-418b-856d-eb5c4a868d7d/public_url" },
  { id: 14, name: "Get Started with Google Workspace Tools", issuer: "Google Cloud", image: "https://images.credly.com/images/7e78d94e-d10b-4699-a75a-96115b24c238/image.png", url: "https://www.credly.com/badges/25f8df79-e516-4adf-91fa-962b7f00ad01/public_url" },
  { id: 15, name: "Store, Process, and Manage Data on Google Cloud - Console", issuer: "Google Cloud", image: "https://images.credly.com/images/449ee94a-268c-4a6d-9983-0507fbdeaf46/image.png", url: "https://www.credly.com/badges/d9264504-7dd9-46a6-ad87-c623fb9354d7/public_url" },
  { id: 16, name: "Get Started with Looker", issuer: "Google Cloud", image: "https://images.credly.com/images/6f45928f-206d-4340-98fd-ef9605fd8606/image.png", url: "https://www.credly.com/badges/f90eae44-a8c6-44cb-9d4f-feab0049e0e0/public_url" },
  { id: 17, name: "Get Started with API Gateway", issuer: "Google Cloud", image: "https://images.credly.com/images/79d45afd-9552-447b-96d0-b4c2037f59be/image.png", url: "https://www.credly.com/badges/14550c67-72cb-4e65-b5f3-0d6dbfea6e45/public_url" },
  { id: 18, name: "Get Started with Cloud Storage", issuer: "Google Cloud", image: "https://images.credly.com/images/8fae0693-0a1a-4c15-b3b6-10b4104d0e30/image.png", url: "https://www.credly.com/badges/18028e19-2182-4723-9fef-a8ed6af4c13d/public_url" },
  { id: 19, name: "Get Started with Pub/Sub", issuer: "Google Cloud", image: "https://images.credly.com/images/4b9b3bd9-02b8-4243-8def-893557125497/image.png", url: "https://www.credly.com/badges/32df1846-3d35-4602-9809-5a55c0821374/public_url" },
  { id: 20, name: "Meta Full-Stack Engineer Certificate", issuer: "Coursera", image: "https://images.credly.com/images/997d4586-e7b2-4174-9c76-5c7304953e2c/image.png", url: "https://www.credly.com/badges/086f259b-45a8-4ee4-8472-efc57ef7e4e7/public_url" },
  { id: 21, name: "The Basics of Google Cloud Compute", issuer: "Google Cloud", image: "https://images.credly.com/images/7623fefd-ebbd-4d8f-a053-f41dca852d9e/image.png", url: "https://www.credly.com/badges/fa0ebf5c-b6f8-4584-980d-4235b40b7838/public_url" },
  { id: 22, name: "Meta Front-End Developer Professional Certificate", issuer: "Coursera", image: "https://images.credly.com/images/99da6577-cbee-4a69-9ee9-0680a44649de/blob", url: "https://www.credly.com/badges/d1f8e75f-8695-4f4b-a559-9dff5228d35e/public_url" },
  { id: 23, name: "GitHub Foundations", issuer: "GitHub", image: "https://images.credly.com/images/024d0122-724d-4c5a-bd83-cfe3c4b7a073/image.png", url: "https://www.credly.com/badges/0367b736-4d40-4024-bc7a-311b07103795/public_url" },
];

export default function CertificatesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Split badges into two rows
  const row1Badges = badges.slice(0, Math.ceil(badges.length / 2));
  const row2Badges = badges.slice(Math.ceil(badges.length / 2));

  useGSAP(
    () => {
      // Fade in title and rows when scrolled into view
      gsap.fromTo(
        [titleRef.current, row1Ref.current, row2Ref.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  const BadgeCard = ({ badge }: { badge: typeof badges[0] }) => (
    <a
      href={badge.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-4 p-4 min-w-[320px] max-w-[380px] rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
    >
      <div className="w-16 h-16 flex-shrink-0 bg-white/10 rounded-xl overflow-hidden shadow-lg p-2 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        <img
          src={badge.image}
          alt={badge.name}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col justify-center overflow-hidden">
        <h4 className="text-[#f0ede8] font-bold text-sm leading-tight truncate-multiline group-hover:text-blue-400 transition-colors">
          {badge.name}
        </h4>
        <p className="text-white/50 text-xs mt-1.5 flex items-center gap-1.5 font-mono">
          <span>{badge.issuer}</span>
        </p>
        <span className="text-[10px] uppercase tracking-wider text-green-400/80 font-bold mt-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Verify on Credly &rarr;
        </span>
      </div>
    </a>
  );

  return (
    <section
      id="certificates"
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#09090b] pt-24 pb-32"
    >
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 mb-16 relative z-10 text-center">
        <p className="font-mono text-[#58a6ff] text-[10px] font-bold tracking-[0.25em] uppercase mb-4">
          [04] Credentials
        </p>
        <h2
          ref={titleRef}
          className="text-white leading-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(48px, 6vw, 84px)",
          }}
        >
          Certifications & Badges
        </h2>
        <p className="text-white/60 mt-4 max-w-xl mx-auto text-sm md:text-base">
          A collection of {badges.length} verified achievements demonstrating proficiency across Cloud, AI, and Full-Stack Development.
        </p>
      </div>

      <div className="relative w-full flex flex-col gap-6 select-none z-10">
        {/* Row 1 - Marquee left */}
        <div ref={row1Ref} className="flex gap-6 overflow-hidden w-full group">
          <div className="flex gap-6 w-max animate-marquee group-hover:[animation-play-state:paused]">
            {/* Original */}
            {row1Badges.map((b) => (
              <BadgeCard key={b.id} badge={b} />
            ))}
            {/* Duplicate for seamless loop */}
            {row1Badges.map((b) => (
              <BadgeCard key={b.id + "-dup"} badge={b} />
            ))}
          </div>
        </div>

        {/* Row 2 - Marquee right */}
        <div ref={row2Ref} className="flex gap-6 overflow-hidden w-full group">
          <div className="flex gap-6 w-max animate-marquee-reverse group-hover:[animation-play-state:paused]">
            {/* Original */}
            {row2Badges.map((b) => (
              <BadgeCard key={b.id} badge={b} />
            ))}
            {/* Duplicate for seamless loop */}
            {row2Badges.map((b) => (
              <BadgeCard key={b.id + "-dup"} badge={b} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full flex justify-center mt-16">
        <a
          href="https://www.credly.com/users/gowreesh-vt"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 transition-all duration-300 font-mono text-xs uppercase tracking-widest hover:scale-105"
        >
          View Credly Profile
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </section>
  );
}
