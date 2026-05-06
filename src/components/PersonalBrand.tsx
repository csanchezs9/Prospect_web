"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function PersonalBrand() {
  const ref = useRef<HTMLElement>(null);
  const imgRatio = 1174 / 1339;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=320%",
          scrub: 1,
        },
      });

      tl
        // oscuro full fade → revela santichill
        .fromTo(".pb-oscuro", { opacity: 1 }, { opacity: 0, ease: "none", duration: 0.55 }, 0)
        // texto cruza de izquierda a derecha pasando por la cabeza
        .fromTo(
          ".pb-text",
          { x: "-45vw", autoAlpha: 1 },
          { x: "40vw", autoAlpha: 1, ease: "none", duration: 0.55 },
          0
        )
        // texto superior cruza de derecha a izquierda por encima del sujeto
        .fromTo(
          ".pb-text-top",
          { x: "45vw", autoAlpha: 1 },
          { x: "-40vw", autoAlpha: 1, ease: "none", duration: 0.55 },
          0
        )
        // mantener un momento sin salirse
        .to(".pb-text", { x: "40vw", ease: "none", duration: 0.1 }, 0.55)
        .to(".pb-text-top", { x: "-40vw", ease: "none", duration: 0.1 }, 0.55)
        // fade out final para dejar continuar el scroll
        .to([".pb-text", ".pb-text-top"], { autoAlpha: 0, ease: "none", duration: 0.1 }, 0.65)
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
      className="relative w-screen left-1/2 -translate-x-1/2"
      style={{ backgroundColor: "#0a0a0a", overflow: "visible", height: `calc(100vw * ${imgRatio})` }}
    >
      <div className="absolute inset-0">
        {/* z-1 — foto base */}
        <img
          src="/gsap2/him.png"
          alt=""
          aria-hidden
          className="absolute inset-0 z-[1] w-full h-full object-fill select-none pointer-events-none"
        />

        {/* z-2 — overlay oscuro (debajo del texto para mantener opacidad constante) */}
        <img
          src="/gsap2/contorno.png"
          alt=""
          aria-hidden
          className="pb-oscuro absolute inset-0 z-[2] w-full h-full object-fill pointer-events-none"
        />

        {/* z-4 — recorte de la persona (texto pasa por detras de la cabeza) */}
        <img
          src="/gsap2/no_bg.png"
          alt=""
          aria-hidden
          className="absolute inset-0 z-[4] w-full h-full object-fill select-none pointer-events-none"
        />
      </div>

      {/* z-3 — texto SANTICHILL: pasa POR DETRAS del sujeto (entre overlay z-2 y persona z-4) */}
      <div
        className="absolute inset-x-0 z-[3] flex justify-center pointer-events-none select-none"
        style={{ top: "10%" }}
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

      {/* texto superior: siempre encima del sujeto */}
      <div className="absolute inset-x-0 top-0 z-[6] h-1/2 pointer-events-none select-none">
        <div
          className="absolute inset-x-0 flex justify-center"
          style={{ top: "72%" }}
        >
          <div className="pb-text-top" style={{ whiteSpace: "nowrap" }}>
            <span
              style={{
                fontSize: "clamp(2.8rem, 10vw, 8.5rem)",
                letterSpacing: "-0.03em",
                color: "#ffbc95",
                fontWeight: 700,
                lineHeight: 1,
                textShadow: "0 0 80px rgba(255,188,149,0.18)",
                display: "inline-block",
              }}
            >
              CREADOR DIGITAL
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
