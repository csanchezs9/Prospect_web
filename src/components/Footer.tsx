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
    <footer
      ref={ref}
      data-nav="peach"
      className="relative overflow-hidden bg-[var(--ink)] text-[var(--bg-warm)] px-6 md:px-10 py-16"
    >
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/animacion.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-[1] bg-black/45" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

      <div className="relative z-10 space-y-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-xs uppercase tracking-widest opacity-70 mb-4">Hecho con:</h4>
            <ul className="f-stack space-y-1">
              {stack.map((s) => <li key={s} className="text-2xl opacity-90">{s}</li>)}
            </ul>
          </div>
          <div className="md:text-right">
            <h4 className="text-xs uppercase tracking-widest opacity-70 mb-4">Contacto:</h4>
            <ul className="f-links space-y-1">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    data-hover
                    data-hover-text={l.label}
                    className="text-2xl hover:text-[var(--orange1)] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="f-name flex items-baseline justify-between border-t border-white/20 pt-8">
          <h2 className="h-display text-[22vw] md:text-[13vw] leading-none flex text-[var(--orange1)]">
            {"Santi".split("").map((c, i) => (
              <span key={i} className="inline-block overflow-hidden"><span className="letter inline-block">{c}</span></span>
            ))}
          </h2>
          <h2 className="h-display text-[22vw] md:text-[13vw] leading-none flex text-[var(--orange1)]">
            {"Chill".split("").map((c, i) => (
              <span key={i} className="inline-block overflow-hidden"><span className="letter inline-block">{c}</span></span>
            ))}
          </h2>
        </div>
        <div className="flex flex-col md:flex-row justify-between text-sm opacity-80">
          <span>Freelance Design Director · 2026</span>
          <span>Santi Chill Studio · [Coming Soon]</span>
        </div>
      </div>
    </footer>
  );
}
