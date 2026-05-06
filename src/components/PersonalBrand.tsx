"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function PersonalBrand() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      tl
        .fromTo(".pb-oscuro", { opacity: 1 }, { opacity: 0, ease: "none", duration: 0.55 }, 0)
        .fromTo(
          ".pb-text",
          { x: "-45vw", autoAlpha: 1 },
          { x: "40vw", autoAlpha: 1, ease: "none", duration: 0.55 },
          0
        )
        .fromTo(
          ".pb-text-top",
          { x: "45vw", autoAlpha: 1 },
          { x: "-40vw", autoAlpha: 1, ease: "none", duration: 0.55 },
          0
        )
        .to(".pb-text", { x: "40vw", ease: "none", duration: 0.1 }, 0.55)
        .to(".pb-text-top", { x: "-40vw", ease: "none", duration: 0.1 }, 0.55)
        .to([".pb-text", ".pb-text-top"], { autoAlpha: 0, ease: "none", duration: 0.1 }, 0.65);
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      data-nav="peach"
      className="relative w-screen left-1/2 -translate-x-1/2"
      style={{ backgroundColor: "#0a0a0a", height: "400vh" }}
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

        {/* mitad inferior de la imagen — placeholder para contenido futuro */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 z-[7] pointer-events-none">
          {/* TBD */}
        </div>
      </div>
    </section>
  );
}
