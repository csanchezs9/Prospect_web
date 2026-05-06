"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const stack = ["Figma", "Next.js", "GSAP", "Lenis", "Tailwind"];
  const links = [
    { label: "Email", href: "mailto:camilosanchezwwe@gmail.com" },
    { label: "Linkedin", href: "https://linkedin.com" },
    { label: "X", href: "https://x.com" },
    { label: "Behance", href: "https://behance.net" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".f-stack li, .f-links li", {
        y: 24, autoAlpha: 0, stagger: 0.06,
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
      gsap.from(".f-name .letter", {
        yPercent: 110, stagger: 0.05, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".f-name", start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={ref} data-nav="peach" className="bg-[var(--orange1)] text-[var(--ink)] px-6 md:px-10 py-16 space-y-16">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h4 className="text-xs uppercase tracking-widest opacity-60 mb-4">Hecho con:</h4>
          <ul className="f-stack space-y-1">
            {stack.map((s) => <li key={s} className="text-2xl">{s}</li>)}
          </ul>
        </div>
        <div className="md:text-right">
          <h4 className="text-xs uppercase tracking-widest opacity-60 mb-4">Contacto:</h4>
          <ul className="f-links space-y-1">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} data-hover data-hover-text={l.label} className="text-2xl hover:text-[var(--blue)] transition-colors">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="f-name flex items-baseline justify-between border-t border-[var(--ink)]/30 pt-8">
        <h2 className="h-display text-[20vw] md:text-[12vw] leading-none flex">
          {"Camilo".split("").map((c, i) => (
            <span key={i} className="inline-block overflow-hidden"><span className="letter inline-block">{c}</span></span>
          ))}
        </h2>
        <span className="w-6 h-6 rounded-full bg-[var(--blue)] inline-block" />
        <h2 className="h-display text-[20vw] md:text-[12vw] leading-none flex">
          {"Sanchez".split("").map((c, i) => (
            <span key={i} className="inline-block overflow-hidden"><span className="letter inline-block">{c}</span></span>
          ))}
        </h2>
      </div>
      <div className="flex flex-col md:flex-row justify-between text-sm opacity-70">
        <span>Freelance Designer & Developer · 2026</span>
        <span>Studio · [Coming Soon]</span>
      </div>
    </footer>
  );
}
