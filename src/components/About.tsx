"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Replica del bloque "benefits" de juanmora.co
 *
 * STEP 1
 *   - "Good design" (palabras suben en mask) — col izquierda
 *   - silueta JM (jm-siluete-img) entre rows
 *   - "takes time" — col derecha
 *   - line.step1 horizontal (1px, opacity .3) que se expande width 0→100%
 *   - "and working with me saves it" abajo, centrado
 *
 * STEP 2 (pinned)
 *   - headline 2 líneas, segunda en naranja "perspective + sharp instincts"
 *   - line-step2 horizontal naranja width 0→100%
 *   - 4 bullets (check + texto + line-benefit naranja debajo cada uno)
 *   - CTA "Learn more about me" con doble icono arrow
 *
 * Background
 *   - dark-jm-img (cover oscuro JM)
 *   - light-jm-img (overlay claro encima al hacer scroll, fade in)
 */

const bullets = [
  "Aporto dirección visual premium y única que hace destacar tu marca.",
  "Cuido el craft, del concepto al producto final.",
  "Defino sistemas de diseño escalables que mantienen tu marca consistente.",
  "Alineo tus objetivos con mi experiencia para tomar las decisiones correctas.",
];

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Light overlay fade-in
      gsap.fromTo(
        ".light-jm",
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".step2",
            start: "top 80%",
            end: "top 30%",
            scrub: true,
          },
        }
      );

      // ---- STEP 2 (sticky scrub) ----
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".step2-wrap",
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          });
          tl.from(".s2-h1 .word", { yPercent: 110, stagger: 0.05, ease: "none" })
            .from(".s2-h2 .word", { yPercent: 110, stagger: 0.05, ease: "none" }, ">-0.3")
            .fromTo(".line-step2", { width: 0 }, { width: "100%", ease: "none" }, ">-0.1")
            .from(".bullet-row", { autoAlpha: 0, x: -30, stagger: 0.35, ease: "none" }, ">-0.05")
            .from(".s2-cta", { autoAlpha: 0, y: 24, ease: "none" }, ">-0.05");
        },
        "(max-width: 767px)": () => {
          gsap.from(".s2-h1 .word, .s2-h2 .word", {
            yPercent: 110,
            stagger: 0.04,
            scrollTrigger: { trigger: ".step2", start: "top 80%" },
          });
          gsap.fromTo(
            ".line-step2",
            { width: 0 },
            { width: "100%", scrollTrigger: { trigger: ".step2", start: "top 70%" } }
          );
          gsap.from(".bullet-row", {
            autoAlpha: 0,
            x: -20,
            stagger: 0.15,
            scrollTrigger: { trigger: ".list-benefits", start: "top 80%" },
          });
        },
      });

      // CTA hover (doble flecha)
      const cta = document.querySelector<HTMLAnchorElement>(".about-cta");
      if (cta) {
        const f = cta.querySelector(".cta-icon-first") as HTMLElement;
        const l = cta.querySelector(".cta-icon-last") as HTMLElement;
        const onIn = () => {
          gsap.to(f, { width: "2.8rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.5,0.3)", overwrite: true });
          gsap.to(l, { width: "0rem", rotation: -90, opacity: 0, duration: 0.2, ease: "power2.out", overwrite: true });
        };
        const onOut = () => {
          gsap.to(f, { width: "0rem", rotation: -90, opacity: 0, duration: 0.3, ease: "power2.inOut", overwrite: true });
          gsap.to(l, { width: "2.8rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.6,0.3)", overwrite: true });
        };
        cta.addEventListener("mouseenter", onIn);
        cta.addEventListener("mouseleave", onOut);
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      data-nav="peach"
      className="benefits-main relative bg-[var(--orange1)] text-[var(--ink)] overflow-hidden"
    >
      {/* Backgrounds JM (oscuro fijo + claro fade) */}
      <div className="dark-jm absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,#5a3a28_0%,transparent_60%),radial-gradient(ellipse_at_70%_70%,#3d2418_0%,transparent_55%)] mix-blend-multiply opacity-30 pointer-events-none" />
      <div className="light-jm absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,236,220,.6)_0%,transparent_70%)] pointer-events-none" />

      {/* ============ STEP 2 (sticky scrub) ============ */}
      <div className="step2-wrap relative md:h-[240vh]">
       <div className="step2 relative md:sticky md:top-0 md:h-screen md:overflow-hidden px-6 md:px-12 py-24 flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto w-full grid md:grid-cols-12 gap-10 items-start">
          {/* Headline 2 lineas */}
          <div className="md:col-span-6 space-y-2">
            <h2 className="s2-h1 h-display text-3xl md:text-5xl leading-[1.1] flex flex-wrap gap-x-2">
              {"Las marcas confían en mí por mi".split(" ").map((w, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <span className="word inline-block">{w}</span>
                </span>
              ))}
            </h2>
            <h2 className="s2-h2 h-display text-3xl md:text-5xl leading-[1.1] flex flex-wrap gap-x-2 text-[var(--blue)]">
              {"perspectiva + instinto agudo".split(" ").map((w, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <span className="word inline-block">{w}</span>
                </span>
              ))}
            </h2>

            {/* línea naranja step2 */}
            <div className="relative w-full mt-8 h-px">
              <span className="line-step2 absolute left-0 top-0 h-px bg-[var(--blue)] block" />
            </div>
          </div>

          {/* Lista bullets + CTA */}
          <ul className="list-benefits md:col-span-6 space-y-1">
            {bullets.map((b, i) => (
              <li key={i} className="bullet-row pt-5 pb-4">
                <div className="flex gap-4 items-start">
                  <img
                    src="/shapes/check-mark-icon.svg"
                    alt=""
                    className="check-icon w-5 h-5 mt-1 shrink-0"
                  />
                  <p className="text-lg md:text-xl leading-snug">{b}</p>
                </div>
                <span className="line-benefit block w-full h-px bg-[var(--blue)] opacity-20 mt-4" />
              </li>
            ))}
            <li className="s2-cta pt-8">
              <a
                href="/about"
                data-hover
                data-hover-text="conóceme"
                className="about-cta cta-link inline-flex items-center gap-1 px-1 py-2 group"
              >
                <span className="cta-icon-first inline-flex items-center justify-center bg-[var(--orange2)] rounded-full h-[2.8rem]">
                  <img src="/shapes/arrow-grey.svg" alt="" className="w-4 h-4" />
                </span>
                <span className="px-3 text-lg md:text-xl underline-offset-4 group-hover:underline">
                  Conóceme más
                </span>
                <span className="cta-icon-last inline-flex items-center justify-center bg-[var(--orange2)] rounded-full h-[2.8rem]">
                  <img src="/shapes/arrow-grey.svg" alt="" className="w-4 h-4" />
                </span>
              </a>
            </li>
          </ul>
        </div>
       </div>
      </div>
    </section>
  );
}
