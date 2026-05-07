"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function WorkCta() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPaused(false); }
    else { v.pause(); setPaused(true); }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".work-text", {
        y: 30, autoAlpha: 0, stagger: 0.15, duration: 0.9, ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
      gsap.from(".ipad-frame", {
        scale: 0.85, autoAlpha: 0, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 65%" },
      });
      gsap.fromTo(".big-work .letter", { yPercent: 110 }, {
        yPercent: 0, stagger: 0.1, duration: 1.4, ease: "expo.out",
        scrollTrigger: { trigger: ".big-work", start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      data-nav="grey"
      className="bg-[var(--bg-grey)] px-2 md:px-4 pt-16 pb-24 flex flex-col items-center text-center gap-4 relative overflow-hidden"
    >
      <h2 className="big-work h-display text-[28vw] md:text-[20vw] leading-none text-[var(--ink)] flex justify-center">
        <span className="inline-block overflow-hidden"><span className="letter inline-block">W</span></span>
        <span className="inline-block overflow-hidden"><span className="letter inline-block text-[var(--orange1)]">o</span></span>
        <span className="inline-block overflow-hidden"><span className="letter inline-block">r</span></span>
        <span className="inline-block overflow-hidden"><span className="letter inline-block">k</span></span>
      </h2>
      <p className="work-text text-base">Mira Mi Trabajo</p>
      <div className="ipad-frame">
        <span className="ipad-camera" aria-hidden />
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? "Reanudar" : "Pausar"}
          className="ipad-screen ipad-screen-btn"
        >
          <video
            ref={videoRef}
            className="ipad-video"
            autoPlay
            loop
            muted
            playsInline
            src="/Work.mp4"
          />
          <span className={`ipad-playicon ${paused ? "is-paused" : ""}`} aria-hidden>
            {paused ? "▶" : "❚❚"}
          </span>
        </button>
      </div>
    </section>
  );
}
