"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function PersonalBrand() {
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".pb-parallax", { xPercent: 110 });

      // pinRef = h-screen (matchea viewport, sin trailing).
      // frameRef = aspect-based, taller than pinRef. Translada Y durante scroll
      // para revelar pies de Santi. Parallax entra encima de pies al final.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          pin: pinRef.current,
          pinType: "transform",
          anticipatePin: 1,
          start: "top top",
          end: "+=161%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // offset Y para mover frame y mostrar pies (= aspect_height - viewport_height)
      const frameY = () => {
        const f = frameRef.current;
        if (!f) return 0;
        return -(f.offsetHeight - window.innerHeight);
      };

      tl
        // ===== LOCK 1 — texto SANTICHILL + CREADOR DIGITAL — 0..0.2 =====
        // contorno.png queda visible durante texto + hold + inicio reveal, fade out justo antes del parallax
        .fromTo(".pb-oscuro", { opacity: 1 }, { opacity: 0, ease: "none", duration: 0.15 }, 0.5)
        .fromTo(
          ".pb-text",
          { x: "-45vw", autoAlpha: 1 },
          { x: "0vw", autoAlpha: 1, ease: "none", duration: 0.2 },
          0
        )
        .fromTo(
          ".pb-text-top",
          { x: "45vw", autoAlpha: 1 },
          { x: "0vw", autoAlpha: 1, ease: "none", duration: 0.2 },
          0
        )

        // ===== HOLD 1 — texto LOCK 1 sostenido — 0.2..0.35 =====
        .to(frameRef.current, { y: 0, ease: "none", duration: 0.15 }, 0.2)

        // ===== REVEAL — frame translada Y, revela pies de Santi — 0.35..0.65 =====
        .to(
          frameRef.current,
          { y: frameY, ease: "none", duration: 0.3 },
          0.35
        )

        // ===== LOCK 2 — parallax oscuro.png entra desde derecha — 0.39..0.5925 =====
        .to(
          ".pb-parallax",
          { xPercent: 0, ease: "none", duration: 0.2025 },
          0.39
        )

        // ===== HOLD final 0.5925..0.64 — frame con pies + oscuro.png congelado al final =====
        .to({}, { duration: 0.0475 }, 0.5925);
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      data-nav="peach"
      className="relative w-screen left-1/2 -translate-x-1/2"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* pin viewport: h-screen para alinear pin range exacto con scroll */}
      <div
        ref={pinRef}
        className="relative w-full h-screen overflow-hidden"
      >
        {/* frame interno: altura aspect, mas alto que viewport. Translada Y para revelar pies */}
        <div
          ref={frameRef}
          className="absolute inset-x-0 top-0 w-full will-change-transform"
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

          {/* mitad superior — texto */}
          <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none select-none">
            <div
              className="absolute inset-x-0 z-[3] flex justify-center"
              style={{ top: "20%" }}
            >
              <div
                className="pb-text"
                style={{
                  whiteSpace: "nowrap",
                  willChange: "transform",
                  filter:
                    "drop-shadow(0 4px 12px rgba(0,0,0,0.55)) drop-shadow(0 0 40px rgba(255,150,90,0.45))",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(5rem, 17vw, 16rem)",
                    letterSpacing: "-0.045em",
                    color: "#ffbc95",
                    fontWeight: 900,
                    lineHeight: 1,
                    display: "inline-block",
                  }}
                >
                  Santi Chill
                </span>
              </div>
            </div>

            <div
              className="absolute inset-x-0 z-[6] flex justify-center"
              style={{ top: "72%" }}
            >
              <div
                className="pb-text-top"
                style={{
                  whiteSpace: "nowrap",
                  willChange: "transform",
                  filter:
                    "drop-shadow(0 3px 10px rgba(0,0,0,0.55)) drop-shadow(0 0 32px rgba(255,150,90,0.45))",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(2.4rem, 8vw, 7rem)",
                    letterSpacing: "-0.02em",
                    color: "#ffbc95",
                    fontWeight: 500,
                    fontStyle: "italic",
                    lineHeight: 1,
                    display: "inline-block",
                  }}
                >
                  Creador Digital
                </span>
              </div>
            </div>
          </div>

          {/* mitad inferior — parallax oscuro.png — encima de pies */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 z-[7] pointer-events-none select-none overflow-hidden">
            <img
              src="/brand/oscuro.png"
              alt=""
              aria-hidden
              className="pb-parallax absolute inset-0 w-full h-full object-cover will-change-transform"
            />
          </div>

          {/* Curve mask — sits at bottom of frame (pies). Only visible when reveal completes. */}
          <div className="pb-curve" />
        </div>
      </div>
    </section>
  );
}
