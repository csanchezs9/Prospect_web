"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function PersonalBrand() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // parallax img empieza fuera de pantalla; queda asi durante LOCK 1 + gap
      gsap.set(".pb-parallax", { xPercent: 110 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      tl
        // ===== LOCK 1 — mitad superior — primer 40% scroll =====
        .fromTo(".pb-oscuro", { opacity: 1 }, { opacity: 0, ease: "none", duration: 0.4 }, 0)
        .fromTo(
          ".pb-text",
          { x: "-45vw", autoAlpha: 1 },
          { x: "0vw", autoAlpha: 1, ease: "none", duration: 0.4 },
          0
        )
        .fromTo(
          ".pb-text-top",
          { x: "45vw", autoAlpha: 1 },
          { x: "0vw", autoAlpha: 1, ease: "none", duration: 0.4 },
          0
        )

        // ===== GAP 0.4 → 0.75 — user baja libre, sin animacion =====

        // ===== LOCK 2 — parallax oscuro.png — ultimo 25% scroll =====
        .to(
          ".pb-parallax",
          { xPercent: 0, ease: "none", duration: 0.25 },
          0.75
        );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      data-nav="peach"
      className="relative w-screen left-1/2 -translate-x-1/2"
      style={{ backgroundColor: "#0a0a0a", height: "430vh" }}
    >
      {/* sticky frame: alto = aspect imagen → imagen completa visible, sin crop */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "calc(100vw * 1174 / 1339)" }}
      >
        {/* z-1 base */}
        <img
          src="/gsap2/him.png"
          alt=""
          aria-hidden
          className="absolute inset-0 z-[1] w-full h-full select-none pointer-events-none"
        />
        {/* z-2 overlay oscuro */}
        <img
          src="/gsap2/contorno.png"
          alt=""
          aria-hidden
          className="pb-oscuro absolute inset-0 z-[2] w-full h-full pointer-events-none"
        />
        {/* z-4 recorte persona (texto pasa detras) */}
        <img
          src="/gsap2/no_bg.png"
          alt=""
          aria-hidden
          className="absolute inset-0 z-[4] w-full h-full select-none pointer-events-none"
        />

        {/* mitad superior de la imagen — zona de animacion de texto */}
        <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none select-none">
          {/* z-3 SANTICHILL detras del sujeto */}
          <div
            className="absolute inset-x-0 z-[3] flex justify-center"
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

          {/* z-6 CREADOR DIGITAL siempre encima */}
          <div
            className="absolute inset-x-0 z-[6] flex justify-center"
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

        {/* mitad inferior — parallax oscuro.png encima de gsap2 */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 z-[7] pointer-events-none select-none overflow-hidden">
          <img
            src="/brand/oscuro.png"
            alt=""
            aria-hidden
            className="pb-parallax absolute inset-0 w-full h-full object-cover will-change-transform"
          />
        </div>
      </div>
    </section>
  );
}
