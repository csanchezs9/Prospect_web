"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Websites & Landing Pages",
    body: "Sitios premium, rápidos, pensados para convertir.",
    tiles: [
      { type: "color", v: "#ffbc95" },
      { type: "shape", v: "/shapes/big-pill-scroll1.png", bg: "#2e54fe" },
      { type: "color", v: "#f99e76" },
      { type: "shape", v: "/shapes/big-circle-scroll3.png", bg: "#e8e9ef" },
    ],
  },
  {
    title: "Visual Branding",
    body: "Identidad visual con personalidad y sistema escalable.",
    tiles: [
      { type: "shape", v: "/shapes/blue-hexagon-scroll.svg", bg: "#ffbc95" },
      { type: "color", v: "#2a2a2a" },
      { type: "shape", v: "/shapes/big-square-scroll1.png", bg: "#faf6ef" },
      { type: "color", v: "#2e54fe" },
    ],
  },
  {
    title: "Product Design",
    body: "Interfaces complejas, simplificadas con criterio.",
    tiles: [
      { type: "color", v: "#e8e9ef" },
      { type: "shape", v: "/shapes/big-circle-scroll1.png", bg: "#2e54fe" },
      { type: "color", v: "#f99e76" },
      { type: "shape", v: "/shapes/big-hexagon-scroll1.png", bg: "#ffbc95" },
    ],
  },
  {
    title: "Webflow & Framer",
    body: "Implementación con micro-interacciones y CMS limpio.",
    tiles: [
      { type: "frame", v: "/shapes/webflow-frame.svg" },
      { type: "color", v: "#ffbc95" },
      { type: "frame", v: "/shapes/framer-frame.svg" },
      { type: "color", v: "#2a2a2a" },
    ],
  },
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline reveal
      gsap.from(".srv-tag", { y: 30, autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: ".srv-head", start: "top 80%" } });
      gsap.from(".srv-h .word", {
        yPercent: 110,
        stagger: 0.04,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".srv-head", start: "top 75%" },
      });

      gsap.utils.toArray<HTMLElement>(".service-row").forEach((row) => {
        // Mask reveal each tile
        row.querySelectorAll(".mask-img").forEach((m, j) => {
          gsap.to(m, {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.1,
            ease: "expo.out",
            delay: j * 0.08,
            scrollTrigger: { trigger: row, start: "top 80%" },
          });
          gsap.to(m.querySelector("img, .tile-fill"), {
            scale: 1,
            duration: 1.4,
            ease: "expo.out",
            delay: j * 0.08,
            scrollTrigger: { trigger: row, start: "top 80%" },
          });
        });
        gsap.from(row.querySelectorAll(".s-title, .s-body, .dot-srv"), {
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: row, start: "top 80%" },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} data-nav="grey" className="bg-[var(--bg-warm)] px-6 md:px-10 py-32 space-y-24">
      <div className="srv-head max-w-4xl">
        <p className="srv-tag text-xs uppercase tracking-widest text-[var(--orange2)] mb-4">Design Expert</p>
        <h2 className="srv-h h-display text-[8vw] md:text-[4.5vw] leading-[1.0] flex flex-wrap gap-x-3 gap-y-2">
          {"Ayudo a marcas a crecer con proyectos como:".split(" ").map((w, i) => (
            <span key={i} className="inline-block overflow-hidden">
              <span className="word inline-block">{w}</span>
            </span>
          ))}
        </h2>
      </div>

      <ul className="space-y-32">
        {services.map((s, i) => (
          <li key={i} className="service-row grid md:grid-cols-12 gap-8 border-t border-[var(--grey)]/30 pt-10">
            <div className="md:col-span-4 space-y-3 md:sticky md:top-32 self-start">
              <div className="flex items-center gap-3">
                <span className="dot-srv w-2 h-2 rounded-full bg-[var(--orange1)]" />
                <h3 className="s-title h-display text-3xl md:text-4xl">{s.title}</h3>
              </div>
              <p className="s-body text-base max-w-md">{s.body}</p>
            </div>
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {s.tiles.map((t, j) => (
                <div key={j} className="tile aspect-[4/5] rounded-lg overflow-hidden">
                  <div
                    className="mask-img w-full h-full flex items-center justify-center"
                    style={{ background: t.type === "color" ? t.v : (t as any).bg ?? "#faf6ef" }}
                  >
                    {t.type === "color" ? (
                      <div className="tile-fill w-full h-full" style={{ background: t.v }} />
                    ) : (
                      <img src={t.v} alt="" className="w-2/3 h-2/3 object-contain" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
