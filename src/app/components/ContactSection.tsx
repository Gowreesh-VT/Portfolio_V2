"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import { soundManager } from "../utils/SoundEffects";

const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export default function ContactSection() {
  const containerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(".contact-reveal");
    
    gsap.fromTo(elements, 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      }
    );
  }, { scope: containerRef });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        if (formRef.current) formRef.current.reset();
        
        // Reset success state after 5 seconds
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        const result = await res.json();
        throw new Error(result.error || "Failed to send message.");
      }
    } catch (error: unknown) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
  };

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="relative w-full bg-[#f0ede8] text-[#1a1a1a] py-24 md:py-32 px-6 md:px-12 overflow-hidden"
    >
      {/* Background visual element */}
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-[#58a6ff] blur-[120px] opacity-[0.03] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-start relative z-10">
        
        {/* Left Side: Copy & Info */}
        <div className="flex flex-col items-start text-left max-w-lg">
          <p className={`contact-reveal ${mono.className} text-[#58a6ff] text-xs font-bold tracking-widest uppercase mb-4`}>
            [05] Next Steps
          </p>
          
          <h2 className={`contact-reveal ${bebasNeue.className} text-[12vw] md:text-[7vw] leading-[0.85] mb-6`}>
            Let&apos;s build<br/>something<br/>together.
          </h2>
          
          <p className={`contact-reveal ${inter.className} text-lg text-[#1a1a1a]/70 leading-relaxed mb-10`}>
            Have a project in mind, a question about my work, or just want to say hi? 
            My inbox is always open. I&apos;ll try my best to get back to you!
          </p>
          
          <div className="contact-reveal flex flex-col gap-4">
            <h4 className={`${inter.className} text-sm font-bold uppercase tracking-wider opacity-50`}>
              Direct Contact
            </h4>
            <div className="flex items-center gap-3">
              <a 
                href="mailto:vt.gowreesh43@gmail.com" 
                className={`${inter.className} text-xl font-semibold hover:text-[#58a6ff] transition-colors`}
              >
                vt.gowreesh43@gmail.com
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("vt.gowreesh43@gmail.com");
                  soundManager.playClick();
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
                }}
                className="px-3 py-1 text-xs font-mono rounded-full bg-[#1a1a1a]/10 hover:bg-[#1a1a1a]/20 border border-[#1a1a1a]/15 text-[#1a1a1a] transition-all cursor-pointer"
                title="Copy email address"
              >
                {copied ? "✓ Copied" : "Copy Email"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="contact-reveal bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm relative">
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className={`${mono.className} text-[10px] uppercase tracking-widest text-[#1a1a1a]/60`}>
                Name
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                placeholder="John Doe"
                className={`bg-transparent border-b border-[#1a1a1a]/20 py-2 text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-[#58a6ff] transition-colors ${inter.className}`}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={`${mono.className} text-[10px] uppercase tracking-widest text-[#1a1a1a]/60`}>
                Email
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                placeholder="john@example.com"
                className={`bg-transparent border-b border-[#1a1a1a]/20 py-2 text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-[#58a6ff] transition-colors ${inter.className}`}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className={`${mono.className} text-[10px] uppercase tracking-widest text-[#1a1a1a]/60`}>
                Message
              </label>
              <textarea 
                id="message" 
                name="message" 
                required 
                rows={4}
                placeholder="Tell me about your project..."
                className={`bg-transparent border-b border-[#1a1a1a]/20 py-2 text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-[#58a6ff] transition-colors resize-none ${inter.className}`}
              />
            </div>

            <button 
              type="submit" 
              disabled={status === "loading" || status === "success"}
              className={`${inter.className} relative overflow-hidden bg-[#1a1a1a] text-[#f0ede8] font-bold text-sm tracking-wide uppercase py-4 rounded-lg mt-4 hover:bg-[#333] transition-colors disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {status === "idle" && "Send Message"}
              {status === "loading" && "Sending..."}
              {status === "success" && "Message Sent!"}
              {status === "error" && "Try Again"}
            </button>

            {/* Status Messages */}
            {status === "success" && (
              <p className={`${inter.className} text-sm text-[#3fb950] text-center mt-2`}>
                Thanks for reaching out! I&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className={`${inter.className} text-sm text-[#f85149] text-center mt-2`}>
                {errorMessage}
              </p>
            )}
          </form>
        </div>
        
      </div>
    </section>
  );
}
