"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function WorkCta() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".work-text", {
        y: 30, autoAlpha: 0, stagger: 0.15, duration: 0.9, ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
      gsap.from(".folder", {
        scale: 0.6, autoAlpha: 0, duration: 1.2, ease: "expo.out",
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
      className="bg-[var(--bg-grey)] px-6 md:px-10 py-40 flex flex-col items-center text-center gap-8 relative overflow-hidden"
    >
      <p className="work-text text-base">¿Curioso?... Mira mi</p>
      <Link href="/work" className="folder" data-hover data-hover-text="See work">
        <img src="/shapes/folder-icon-back.png" alt="" className="back-img" />
        <img src="/shapes/projects-folder.png" alt="" className="papers-img" />
        <img src="/shapes/folder-icon-front.png" alt="" className="front-img" />
      </Link>
      <p className="work-text text-base">o sigue scrolleando</p>
      <h2 className="big-work h-display text-[28vw] md:text-[20vw] leading-none mt-10 text-[var(--ink)] flex justify-center">
        <span className="inline-block overflow-hidden"><span className="letter inline-block">W</span></span>
        <span className="inline-block overflow-hidden"><span className="letter inline-block text-[var(--orange1)]">o</span></span>
        <span className="inline-block overflow-hidden"><span className="letter inline-block">r</span></span>
        <span className="inline-block overflow-hidden"><span className="letter inline-block">k</span></span>
      </h2>
    </section>
  );
}
