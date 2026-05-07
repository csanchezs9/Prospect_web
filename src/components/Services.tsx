"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Auditoría de Marca",
    body: "Diagnóstico de tu presencia actual y qué falta para destacar.",
    tiles: [
      { type: "photo", v: "/aud-marca/IN.png", bg: "#faf6ef" },
      { type: "photo", v: "/aud-marca/90dias.png", bg: "#faf6ef" },
      { type: "photo", v: "/aud-marca/infografia.png", bg: "#faf6ef" },
      { type: "photo", v: "/aud-marca/cliente.png", bg: "#faf6ef" },
    ],
  },
  {
    title: "Narrativa & Storytelling",
    body: "Tu historia clara, memorable y que conecta con tu audiencia.",
    tiles: [
      { type: "photo", v: "/narrativa/quout.png", bg: "#faf6ef" },
      { type: "photo", v: "/narrativa/carrusel.png", bg: "#faf6ef" },
      { type: "photo", v: "/narrativa/grabaccion.png", bg: "#faf6ef" },
      { type: "photo", v: "/narrativa/arc.png", bg: "#faf6ef" },
    ],
  },
  {
    title: "Autoridad & Posicionamiento",
    body: "Te conviertes en referente obligado de tu nicho.",
    tiles: [
      { type: "photo", v: "/autoridadimg/IMG_1576.PNG", bg: "#faf6ef" },
      { type: "photo", v: "/autoridadimg/IMG_1577.PNG", bg: "#faf6ef" },
      { type: "photo", v: "/autoridadimg/IMG_1578.PNG", bg: "#faf6ef" },
      { type: "photo", v: "/autoridadimg/IMG_1579.PNG", bg: "#faf6ef" },
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
    <section id="services" ref={ref} data-nav="grey" className="bg-[var(--bg-warm)] px-6 md:px-10 py-14 md:py-32 space-y-12 md:space-y-24">
      <div className="srv-head text-center">
        <p className="srv-tag text-xs uppercase tracking-widest text-[var(--orange2)] mb-4">Personal Brand Strategist</p>
        <h2 className="srv-h h-display text-[12vw] md:text-[7vw] leading-[1.05] flex flex-wrap justify-center gap-x-[0.25em] gap-y-[0.05em]">
          {"Ayudo a emprendedores a construir marca personal que atrae clientes.".split(" ").map((w, i) => (
            <span key={i} className="inline-block overflow-hidden">
              <span className="word inline-block">{w}</span>
            </span>
          ))}
        </h2>
      </div>

      <ul className="space-y-16 md:space-y-32">
        {services.map((s, i) => (
          <li key={i} className="service-row grid md:grid-cols-12 gap-8 border-t border-[var(--grey)]/30 pt-10">
            <div className="md:col-span-4 space-y-3 md:sticky md:top-32 self-start">
              <div className="flex items-center gap-3">
                <span className="dot-srv w-2 h-2 rounded-full bg-[var(--orange1)]" />
                <h3 className="s-title h-display text-[8vw] md:text-[3.5vw] leading-[1.05]">{s.title}</h3>
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
                    ) : t.type === "photo" ? (
                      <img src={t.v} alt="" className="tile-fill w-full h-full object-cover" />
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
