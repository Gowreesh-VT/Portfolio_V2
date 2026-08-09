"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Pipeline Stages ────────────────────────────────────────────────────────
const stages = [
  {
    id: "code",
    num: "01",
    title: "Code",
    description:
      "Where it all starts. React, Next.js, and TypeScript power the interfaces people actually touch — fast, typed, and pixel-perfect.",
    techs: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    color: "#58a6ff",
    glow: "rgba(88,166,255,0.3)",
    dimGlow: "rgba(88,166,255,0.08)",
  },
  {
    id: "build",
    num: "02",
    title: "Build",
    description:
      "Scalable APIs and databases behind the UI. Node.js, Express.js, and GraphQL handle backend flows; MongoDB and PostgreSQL store it.",
    techs: ["Node.js", "GraphQL", "PostgreSQL", "MongoDB"],
    color: "#3fb950",
    glow: "rgba(63,185,80,0.3)",
    dimGlow: "rgba(63,185,80,0.08)",
  },
  {
    id: "test",
    num: "03",
    title: "Test",
    description:
      "Automated testing and DevOps practices that validate and prepare the codebase. Containers and pipelines make every release reproducible.",
    techs: ["Docker", "Kubernetes", "GitHub Actions", "CI/CD"],
    color: "#d2a8ff",
    glow: "rgba(210,168,255,0.3)",
    dimGlow: "rgba(210,168,255,0.08)",
  },
  {
    id: "deploy",
    num: "04",
    title: "Deploy",
    description:
      "Production-grade infrastructure that scales without breaking. AWS, GCP, and Firebase environments provisioned via Terraform.",
    techs: ["AWS", "GCP", "Firebase", "Terraform"],
    color: "#ff9f1c",
    glow: "rgba(255,159,28,0.3)",
    dimGlow: "rgba(255,159,28,0.08)",
  },
  {
    id: "live",
    num: "05",
    title: "Live",
    description:
      "Delivered to users — monitored, fast, and always on. Prometheus, Grafana, and CloudWatch keep production environments observable.",
    techs: ["Vercel", "Prometheus", "Grafana", "CloudWatch"],
    color: "#f85149",
    glow: "rgba(248,81,73,0.3)",
    dimGlow: "rgba(248,81,73,0.08)",
  },
];

export default function TechStackSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  // ── Three.js background ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b);
    scene.fog = new THREE.FogExp2(0x09090b, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── Pipeline Geometry (CatmullRomCurve3) ─────────────────────────────
    const points = [
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(5, 2, 0),
      new THREE.Vector3(15, -4, -15),
      new THREE.Vector3(5, -8, -30),
      new THREE.Vector3(-10, 0, -45),
      new THREE.Vector3(-25, 10, -60),
      new THREE.Vector3(-10, 20, -75),
      new THREE.Vector3(10, 10, -90),
      new THREE.Vector3(25, -5, -110),
      new THREE.Vector3(10, -15, -130),
      new THREE.Vector3(0, 0, -150)
    ];
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.6);
    
    const tubeGeo = new THREE.TubeGeometry(curve, 300, 2.5, 16, false);

    // ── Flowing Energy Material (Shader) ──────────────────────────────────
    const tubeMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x3b82f6) } // Blue glow
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        
        void main() {
          // vUv.x is along tube length, vUv.y is around tube radius
          float flow = sin(vUv.x * 60.0 - uTime * 8.0) * 0.5 + 0.5;
          float lines = sin(vUv.y * 50.0) * 0.5 + 0.5;
          
          float intensity = flow * lines;
          // Soft edge glow to make it look like a tube
          float edge = pow(1.0 - abs(vUv.y - 0.5) * 2.0, 2.0);
          
          vec3 finalColor = uColor * (intensity * 1.5 + 0.5);
          gl_FragColor = vec4(finalColor, (intensity * 0.6 + 0.1) * edge);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tube);

    // Outer wireframe for structure
    const wireMat = new THREE.MeshBasicMaterial({ 
      color: 0x1e3a8a, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.15 
    });
    const wireTube = new THREE.Mesh(tubeGeo, wireMat);
    scene.add(wireTube);

    // ── Checkpoint Rings & Orbiting Tech Geometries for Stages ───────────
    const rings: THREE.Mesh[] = [];
    const orbitingMeshes: { mesh: THREE.Mesh; center: THREE.Vector3; speed: number; axis: THREE.Vector3 }[] = [];
    const stageColors = [0x58a6ff, 0x3fb950, 0xd2a8ff, 0xff9f1c, 0xf85149];
    
    // Polyhedron geometries for stage tech badges
    const badgeGeos = [
      new THREE.IcosahedronGeometry(1.2, 0),
      new THREE.OctahedronGeometry(1.4, 0),
      new THREE.DodecahedronGeometry(1.2, 0),
      new THREE.TetrahedronGeometry(1.5, 0),
      new THREE.TorusKnotGeometry(0.9, 0.25, 64, 16)
    ];

    for (let i = 0; i < 5; i++) {
      // 0.1, 0.3, 0.5, 0.7, 0.9 - centers of the 5 scroll zones
      const t = 0.1 + (i * 0.2); 
      const pt = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      
      const ringGeo = new THREE.TorusGeometry(3.2, 0.15, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: stageColors[i], 
        transparent: true, 
        opacity: 0.9 
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      
      ring.position.copy(pt);
      // Face along the tube
      ring.lookAt(pt.clone().add(tangent));
      
      scene.add(ring);
      rings.push(ring);

      // Add a soft glow behind the ring
      const glowGeo = new THREE.TorusGeometry(3.5, 0.6, 16, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: stageColors[i],
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.copy(pt);
      glow.lookAt(pt.clone().add(tangent));
      scene.add(glow);

      // Add 2 orbiting 3D tech badge meshes around each ring
      const badgeMat = new THREE.MeshStandardMaterial({
        color: stageColors[i],
        wireframe: true,
        transparent: true,
        opacity: 0.75,
        emissive: stageColors[i],
        emissiveIntensity: 0.4
      });
      
      const bMesh1 = new THREE.Mesh(badgeGeos[i], badgeMat);
      bMesh1.position.copy(pt).add(new THREE.Vector3(4.5, 2, 0));
      scene.add(bMesh1);

      orbitingMeshes.push({
        mesh: bMesh1,
        center: pt.clone(),
        speed: 1.2 + i * 0.2,
        axis: new THREE.Vector3(0, 1, 0.5).normalize()
      });
    }

    // ── Particles around the pipeline ─────────────────────────────────────
    const COUNT = 1500;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // distribute along curve
      const t = Math.random();
      const pt = curve.getPointAt(t);
      
      // random spread around the point
      pos[i*3] = pt.x + (Math.random() - 0.5) * 40;
      pos[i*3+1] = pt.y + (Math.random() - 0.5) * 40;
      pos[i*3+2] = pt.z + (Math.random() - 0.5) * 40;
      
      col[i*3] = 0.2; col[i*3+1] = 0.4; col[i*3+2] = 0.8;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.4 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Scroll camera drift ───────────────────────────────────────────────
    let scrollProg = 0;
    let targetScroll = 0;
    
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      snap: {
        snapTo: [0.1, 0.3, 0.5, 0.7, 0.9], // Stop at each stage
        duration: { min: 0.2, max: 0.8 },
        delay: 0.1,
        ease: "power2.inOut"
      },
      onUpdate: (self) => {
        scrollProg = self.progress;
      },
    });

    // ── Animation loop ────────────────────────────────────────────
    const startTime = performance.now();
    let raf: number;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = (performance.now() - startTime) / 1000; // elapsed seconds

      // Flowing energy shader update
      tubeMat.uniforms.uTime.value = t;
      
      // Slowly rotate rings and orbiting tech polyhedra
      rings.forEach(ring => {
        ring.rotation.z = t * 0.5;
      });

      orbitingMeshes.forEach((item) => {
        item.mesh.rotation.x = t * item.speed * 0.8;
        item.mesh.rotation.y = t * item.speed * 1.2;
        const angle = t * item.speed * 0.6;
        item.mesh.position.x = item.center.x + Math.cos(angle) * 5;
        item.mesh.position.y = item.center.y + Math.sin(angle) * 5;
      });

      // Smooth camera interpolation
      targetScroll += (scrollProg - targetScroll) * 0.08;
      
      // Map scroll progress (0-1) to curve path (0-0.98 to not go off edge)
      const camT = Math.min(targetScroll * 0.98, 0.98);
      const camPos = curve.getPointAt(camT);
      const lookAtPos = curve.getPointAt(Math.min(camT + 0.02, 1.0));
      
      camera.position.copy(camPos);
      
      // Slight camera wiggle for a realistic float
      camera.position.x += Math.sin(t * 1.2) * 0.2;
      camera.position.y += Math.cos(t * 1.5) * 0.2;
      
      camera.lookAt(lookAtPos);
      // Tilt camera around z based on movement
      camera.rotation.z += Math.sin(t * 0.8) * 0.05;

      renderer.render(scene, camera);
    };
    tick();

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      st.kill();
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
      wireMat.dispose();
    };
  }, []);

  // ── GSAP scroll animations ─────────────────────────────────────────────────
  useGSAP(
    () => {
      // ── Node staggered entry ─────────────────────────────────────────────
      nodeRefs.current.forEach((node, i) => {
        if (!node) return;
        gsap.fromTo(
          node,
          { opacity: 0, scale: 0.85, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => `top+=${i * window.innerHeight} top`,
              end: () => `top+=${(i + 1) * window.innerHeight} top`,
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // ── Active index from scroll progress ────────────────────────────────
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const idx = Math.floor(self.progress * 5);
          setActiveIndex(Math.min(Math.max(idx, 0), 4));
        },
      });

      // ── Connection lines flow animation ──────────────────────────────────
      const tl = gsap.timeline({ repeat: -1 });
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        tl.to(dot, { left: "100%", duration: 1.5, ease: "none" }, i * 0.8);
      });

      // ── Sync Active Description Glow/Fade ─────────────────────────────────
      const descEl = descRef.current;
      if (descEl && activeIndex >= 0) {
        gsap.fromTo(
          descEl,
          { opacity: 0, y: 15, filter: "blur(4px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }
        );
      }
    },
    { dependencies: [activeIndex], scope: sectionRef }
  );

  const onNodeMove = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const card = nodeRefs.current[i];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Tilts card towards cursor
    gsap.to(card, {
      rotateY: x * 0.12,
      rotateX: -y * 0.12,
      transformPerspective: 600,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const onNodeLeave = (i: number) => {
    const card = nodeRefs.current[i];
    if (!card) return;
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power2.out" });
  };

  // ── Detect touch/low-memory devices to skip heavy WebGL on mobile ──────────
  const [canvasEnabled, setCanvasEnabled] = React.useState(true);
  useEffect(() => {
    const isTouchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const lowMemory = typeof (navigator as unknown as { deviceMemory?: number }).deviceMemory === "number"
      && (navigator as unknown as { deviceMemory: number }).deviceMemory < 4;
    if (isTouchOnly || lowMemory) setCanvasEnabled(false);
  }, []);

  return (
    <section
      id="tech-stack"
      ref={sectionRef}
      className="relative"
      style={{ height: "600vh", background: "#09090b" }}
    >
      {/* ── Sticky viewport ─────────────────────────────────────────────── */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* Three.js canvas — the living background (skipped on touch/low-memory devices) */}
        {canvasEnabled && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 0 }}
          />
        )}
        {/* Fallback solid bg for mobile */}
        {!canvasEnabled && (
          <div className="absolute inset-0" style={{ background: "#09090b", zIndex: 0 }} />
        )}

        {/* Subtle vignette to keep edges dark */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background:
              "radial-gradient(circle at center, transparent 35%, rgba(9,9,11,0.85) 100%)",
          }}
        />

        {/* Analog film grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.07]"
          style={{ zIndex: 1 }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full opacity-40">
            <filter id="tsGrain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#tsGrain)" />
          </svg>
        </div>

        {/* ── Content layer ─────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col"
          style={{ zIndex: 2 }}
        >
          {/* Top meta bar */}
          <div className="flex justify-between items-center px-8 md:px-12 pt-7">
            <p
              className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/18"
            >
              Tech Stack
            </p>
            <p
              className="font-mono text-[9px] tracking-[0.2em] text-white/12"
            >
              {stages.length}-stage pipeline
            </p>
          </div>

          {/* Section headline */}
          <div className="flex flex-col items-center text-center mt-8 mb-4">
            <p
              className="font-mono text-[#58a6ff] text-[10px] font-bold tracking-[0.25em] uppercase mb-2.5"
            >
              [03] Tech Stack
            </p>
            <h2
              className="text-white leading-none"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(36px, 5.5vw, 76px)",
              }}
            >
              What I Use &amp; How I Build
            </h2>
          </div>

          {/* ── Pipeline row ──────────────────────────────────────────────── */}
          {/* Mobile: vertical stack (hidden on md+) */}
          <div className="md:hidden flex flex-col items-stretch gap-4 px-5 flex-shrink-0 mt-auto pb-4 w-full max-w-sm mx-auto">
            {stages.map((stage, i) => {
              const isActive = i === activeIndex;
              const isPast = i < activeIndex;
              return (
                <div
                  key={stage.id}
                  className="rounded-xl border px-5 py-4 transition-all duration-500"
                  style={{
                    background: isActive
                      ? `radial-gradient(ellipse at 50% 0%, ${stage.glow} 0%, rgba(9,9,11,0.96) 65%)`
                      : `radial-gradient(ellipse at 50% 0%, ${stage.dimGlow} 0%, rgba(9,9,11,0.92) 65%)`,
                    border: `1px solid ${
                      isActive ? stage.color : isPast ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.055)"
                    }`,
                    boxShadow: isActive ? `0 0 20px ${stage.glow}` : "none",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-mono text-[9px] tracking-[0.18em]" style={{ color: stage.color, opacity: isActive ? 0.9 : 0.4 }}>
                      {stage.num}
                    </p>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: stage.color, boxShadow: `0 0 8px ${stage.color}` }} />
                    )}
                  </div>
                  <h3 className="font-bebas text-2xl leading-none mb-2" style={{ color: isActive ? stage.color : "rgba(255,255,255,0.75)" }}>
                    {stage.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {stage.techs.map((tech) => (
                      <span key={tech} className="font-mono text-[10px]" style={{ color: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.22)" }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: horizontal pipeline row (hidden on mobile) */}
          <div className="hidden md:flex items-center justify-center px-4 md:px-6 flex-shrink-0 mt-auto">
            {stages.map((stage, i) => {
              const isActive = i === activeIndex;
              const isPast = i < activeIndex;

              return (
                <React.Fragment key={stage.id}>
                  {/* ── Node card ─────────────────────────────────────────── */}
                  <div
                    ref={(el) => { nodeRefs.current[i] = el; }}
                    className="relative flex-shrink-0 cursor-pointer"
                    style={{
                      opacity: 0, // entry starts hidden
                      transformStyle: "preserve-3d",
                    }}
                    onMouseMove={(e) => onNodeMove(e, i)}
                    onMouseLeave={() => onNodeLeave(i)}
                  >
                    {/* Card body */}
                    <div
                      className="relative rounded-2xl border transition-[border-color,box-shadow,background] duration-500"
                      style={{
                        width: "clamp(120px, 14vw, 180px)",
                        padding: "clamp(12px, 1.8vw, 22px)",
                        background: isActive
                          ? `radial-gradient(ellipse at 50% 0%, ${stage.glow} 0%, rgba(9,9,11,0.96) 65%)`
                          : `radial-gradient(ellipse at 50% 0%, ${stage.dimGlow} 0%, rgba(9,9,11,0.92) 65%)`,
                        border: `1px solid ${
                          isActive
                            ? stage.color
                            : isPast
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(255,255,255,0.055)"
                        }`,
                        boxShadow: isActive
                          ? `0 0 28px ${stage.glow}, 0 0 56px ${stage.glow.replace("0.3", "0.12")}, inset 0 0 20px ${stage.glow.replace("0.3", "0.06")}`
                          : "none",
                        backdropFilter: "blur(14px)",
                      }}
                    >
                      {/* Active pulse indicator */}
                      {isActive && (
                        <div
                          className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full"
                          style={{
                            background: stage.color,
                            boxShadow: `0 0 8px ${stage.color}, 0 0 16px ${stage.color}`,
                            animation: "ping-dot 1.5s ease-in-out infinite",
                          }}
                        />
                      )}

                      {/* Stage number */}
                      <p
                        className="font-mono mb-2.5"
                        style={{
                          fontSize: "clamp(9px, 0.95vw, 12px)",
                          color: stage.color,
                          opacity: isActive ? 0.8 : 0.4,
                          letterSpacing: "0.18em",
                          transition: "opacity 0.4s",
                        }}
                      >
                        {stage.num}
                      </p>

                      {/* Title */}
                      <h3
                        className="font-bebas leading-none mb-3.5"
                        style={{
                          fontSize: "clamp(24px, 2.8vw, 36px)",
                          color: isActive ? stage.color : "rgba(255,255,255,0.75)",
                          transition: "color 0.4s",
                        }}
                      >
                        {stage.title}
                      </h3>

                      {/* Tech list */}
                      <div className="flex flex-col gap-[4px]">
                        {stage.techs.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono block"
                            style={{
                              fontSize: "clamp(8.5px, 0.9vw, 11px)",
                              color: isActive
                                ? "rgba(255,255,255,0.6)"
                                : isPast
                                ? "rgba(255,255,255,0.22)"
                                : "rgba(255,255,255,0.18)",
                              letterSpacing: "0.04em",
                              transition: "color 0.4s",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── Connection between nodes ───────────────────────────── */}
                  {i < stages.length - 1 && (
                    <div
                      className="relative flex-shrink-0 flex items-center overflow-hidden"
                      style={{
                        width: "clamp(20px, 3.5vw, 52px)",
                        height: "2px",
                      }}
                    >
                      {/* Static track */}
                      <div
                        className="absolute inset-0 transition-colors duration-500"
                        style={{
                          background:
                            i < activeIndex
                              ? `linear-gradient(90deg, ${stage.color}55, ${stages[i + 1].color}55)`
                              : "rgba(255,255,255,0.05)",
                        }}
                      />

                      {/* Travelling data packet */}
                      <div
                        ref={(el) => { dotRefs.current[i] = el; }}
                        className="absolute top-1/2 -translate-y-1/2"
                        style={{
                          width: "clamp(16px, 2.5vw, 28px)",
                          height: "1.5px",
                          left: "-30px",
                          background: `linear-gradient(90deg, transparent, ${stage.color}, ${stages[i + 1].color}, transparent)`,
                          boxShadow: `0 0 8px ${stage.color}, 0 0 16px ${stage.color}50`,
                        }}
                      />

                      {/* Arrow head */}
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors duration-500"
                        style={{
                          width: 0,
                          height: 0,
                          borderTop: "3px solid transparent",
                          borderBottom: "3px solid transparent",
                          borderLeft: `4px solid ${
                            i < activeIndex ? stages[i + 1].color : "rgba(255,255,255,0.1)"
                          }`,
                        }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>{/* end desktop pipeline row */}

          {/* ── Active stage description ───────────────────────────────────── */}
          <div
            className="flex-shrink-0 text-center mt-8 px-8"
            style={{ minHeight: "4.5rem" }}
          >
            {activeIndex >= 0 && (
              <p
                ref={descRef}
                className="font-sans text-white/80 mx-auto leading-relaxed"
                style={{
                  fontSize: "clamp(13px, 1.5vw, 17px)",
                  maxWidth: "600px",
                  opacity: 0,
                }}
              >
                {stages[activeIndex].description}
              </p>
            )}
          </div>

          {/* Bottom status bar */}
          <div className="flex justify-between items-center px-8 md:px-12 mt-auto pb-7">
            <p
              className="font-mono text-[8px] tracking-[0.25em] uppercase transition-colors duration-500"
              style={{ color: activeIndex >= 0 ? stages[activeIndex].color : "rgba(255,255,255,0.08)", opacity: 0.6 }}
            >
              {activeIndex >= 0 ? `stage ${stages[activeIndex].num} / ${stages[activeIndex].id}` : "—"}
            </p>
            <p
              className="font-sans text-[8px] tracking-[0.25em] uppercase text-white/10"
            >
              Scroll ↓
            </p>
          </div>
        </div>
      </div>

      {/* Keyframe for the active pulse dot — injected via style tag */}
      <style>{`
        @keyframes ping-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.8); opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
