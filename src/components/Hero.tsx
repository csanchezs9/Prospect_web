"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-tag", { autoAlpha: 0, y: 20, delay: 2.2, duration: 0.8 });
      gsap.from(".hero-curve", { scaleY: 0, transformOrigin: "bottom center", duration: 1.4, ease: "expo.out", delay: 2.0 });

      // Parallax on hero text out
      gsap.to(".hero-content", {
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      data-nav="peach"
      className="relative min-h-[100svh] flex flex-col justify-end px-6 md:px-10 pb-24 md:pb-32 overflow-hidden"
    >
      {/* Hero bg image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/brand/hero.webp')" }}
      />
      {/* Dark overlay para legibilidad del texto */}
      <div className="absolute inset-0 z-[1] bg-black/40" />

      <div className="hero-content space-y-2 relative z-10">
        <div className="hero-tag flex items-end justify-between pt-6">
          <p className="text-base md:text-xl text-white/90">Mentor &amp; Director Creativo</p>
          <p className="text-base md:text-xl text-right text-white/90">2026</p>
        </div>
      </div>

      <div className="hero-curve" />
    </section>
  );
}
