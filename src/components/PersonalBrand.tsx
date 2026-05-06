"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// Mask radial cabeza con fade largo invisible:
// - Núcleo sólido 0-55% cubre cara firme (texto totalmente oculto)
// - Fade 55-100% se extiende fuera de cabeza al fondo
// - Como mask aplica a santichill ENCIMA de santichill bg: el fade es invisible
//   (mismas pixeles arriba y abajo) → no se ve óvalo
// Centro cabeza ≈ 43% horizontal, 25% vertical
const HEAD_MASK =
  "radial-gradient(ellipse 18% 28% at 43% 25%, #000 55%, rgba(0,0,0,0.7) 78%, transparent 100%)";

export default function PersonalBrand() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl
        // oscuro full + oscuro head fade juntos → revela santichill
        .fromTo([".pb-oscuro", ".pb-oscuro-head"], { opacity: 1 }, { opacity: 0, ease: "none" }, 0)
        // texto cruza de izquierda a derecha pasando por la cabeza
        .fromTo(".pb-text", { x: "-70vw" }, { x: "70vw", ease: "none" }, 0)
        // línea divisora
        .fromTo(".pb-line-bar", { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0.62)
        // "trabaja conmigo" reveal
        .from(".pb-trabaja .wi", { yPercent: 115, stagger: 0.07, ease: "none" }, 0.68)
        // CTA
        .from(".pb-cta-btn", { autoAlpha: 0, y: 14, ease: "none" }, 0.86);
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      data-nav="peach"
      className="relative w-full min-h-screen"
      style={{ backgroundColor: "#0a0a0a", overflow: "hidden" }}
    >
      {/* z-1 — santichill base (siempre visible) */}
      <div
        className="absolute inset-0 z-[1] bg-cover bg-center"
        style={{ backgroundImage: "url('/brand/santichill.png')" }}
      />

      {/* z-2 — texto SANTICHILL: cruza horizontalmente a la altura de la cabeza */}
      <div
        className="absolute inset-x-0 z-[2] flex justify-center pointer-events-none select-none"
        style={{ top: "20%" }}
      >
        <div className="pb-text" style={{ whiteSpace: "nowrap" }}>
          <span
            style={{
              fontSize: "clamp(5rem, 17vw, 16rem)",
              letterSpacing: "-0.045em",
              color: "#ffbc95",
              fontWeight: 900,
              lineHeight: 1,
              textShadow: "0 0 100px rgba(255,188,149,0.22)",
              display: "inline-block",
            }}
          >
            SANTICHILL
          </span>
        </div>
      </div>

      {/*
       * z-3 — capa cabeza (santichill enmascarado con radial-gradient)
       * Bordes suaves → no se ve óvalo, fusión limpia con el fondo
       * Encima del texto → tapa el texto donde está la cabeza
       */}
      <div
        className="absolute inset-0 z-[3] bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: "url('/brand/santichill.png')",
          maskImage: HEAD_MASK,
          WebkitMaskImage: HEAD_MASK,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />

      {/* z-4 — oscuro overlay completo (se desvanece) */}
      <div
        className="pb-oscuro absolute inset-0 z-[4] bg-cover bg-center"
        style={{ backgroundImage: "url('/brand/oscuro.png')" }}
      />

      {/* z-5 — oscuro cabeza enmascarado (se desvanece junto al overlay) */}
      <div
        className="pb-oscuro-head absolute inset-0 z-[5] bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: "url('/brand/oscuro.png')",
          maskImage: HEAD_MASK,
          WebkitMaskImage: HEAD_MASK,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />

      {/* z-6 — barra inferior */}
      <div className="absolute bottom-0 inset-x-0 z-[6] px-6 md:px-10 pb-7 md:pb-9">
        <div className="relative h-px w-full mb-5 overflow-hidden">
          <span
            className="pb-line-bar absolute inset-0 block"
            style={{
              backgroundColor: "#ffffff",
              opacity: 0.28,
              transformOrigin: "left center",
              transform: "scaleX(0)",
            }}
          />
        </div>
        <div className="flex items-end justify-between gap-6">
          <h2
            className="pb-trabaja leading-none uppercase"
            style={{
              fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)",
              letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.95)",
              fontWeight: 500,
            }}
          >
            {"trabaja conmigo".split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.4em]">
                <span className="wi inline-block">{word}</span>
              </span>
            ))}
          </h2>
          <a
            href="/contact"
            data-hover
            data-hover-text="hablemos"
            className="pb-cta-btn cta-link inline-flex items-center shrink-0"
          >
            <span
              className="inline-flex items-center justify-center rounded-full h-[2.7rem] px-5 gap-2"
              style={{ backgroundColor: "rgba(255,255,255,0.92)" }}
            >
              <span
                className="text-[var(--ink)] font-medium"
                style={{ fontSize: "0.95rem", letterSpacing: "0.05em" }}
              >
                Hablemos
              </span>
              <img src="/shapes/arrow-grey.svg" alt="" className="w-4 h-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
