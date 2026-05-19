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
      // start 28% antes en mobile (responsive)
      const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
      const startMain = isMobile ? "top 66%" : "top 38%";
      const endMain = isMobile ? "center 56%" : "center 28%";
// anim on-enter solo, sin pin/sticky — imagen scrollea natural
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: startMain,
          end: endMain,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl
        .fromTo(
          ".pb-text",
          { x: "-45vw", autoAlpha: 1 },
          { x: "4vw", autoAlpha: 1, ease: "none", duration: 0.5 },
          0
        )
        .fromTo(
          ".pb-text-top",
          { x: "45vw", autoAlpha: 1 },
          { x: "0vw", autoAlpha: 1, ease: "none", duration: 0.5 },
          0
        )
        .fromTo(".pb-oscuro", { opacity: 1 }, { opacity: 0, ease: "none", duration: 0.5 }, 0.5);

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
      {/* contenedor con aspect ratio nativo — scrollea natural */}
      <div
        ref={pinRef}
        className="relative w-full overflow-hidden"
      >
        <div
          ref={frameRef}
          className="relative w-full"
          style={{ height: "calc(100vw * 1403 / 1600)" }}
        >
          {/* z-1 base brillante */}
          <img
            src="/gsap3/normalita.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 z-[1] w-full h-full select-none pointer-events-none"
          />
          {/* z-2 overlay oscuro — fade out reveal */}
          <img
            src="/gsap3/opaca-negra.webp"
            alt=""
            aria-hidden
            className="pb-oscuro absolute inset-0 z-[2] w-full h-full pointer-events-none"
          />
          {/* z-4 recorte persona — Ron Lach (z-3) pasa por detras, Creador Digital (z-6) por delante */}
          <img
            src="/gsap3/sin-fondo.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 z-[4] w-full h-full select-none pointer-events-none"
          />
          {/* texto centrado en imagen */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <div
              className="absolute inset-x-0 z-[3] flex justify-center"
              style={{ top: "32%" }}
            >
              <div
                className="pb-text"
                style={{ whiteSpace: "nowrap", willChange: "transform" }}
              >
                <span
                  className="h-display"
                  style={{
                    fontSize: "min(15vw, 19.2rem)",
                    letterSpacing: "-0.04em",
                    color: "#a64333",
                    fontWeight: 500,
                    lineHeight: 0.92,
                    display: "inline-flex",
                    gap: "1.8em",
                  }}
                >
                  <span className="pb-lach inline-block">Lach</span>
                  <span className="pb-ron inline-block">Ron</span>
                </span>
              </div>
            </div>

            <div
              className="absolute inset-x-0 z-[6] flex justify-center"
              style={{ top: "48%" }}
            >
              <div
                className="pb-text-top"
                style={{ whiteSpace: "nowrap", willChange: "transform" }}
              >
                <span
                  className="h-display"
                  style={{
                    fontSize: "min(15vw, 19.2rem)",
                    letterSpacing: "-0.04em",
                    color: "#a64333",
                    fontWeight: 500,
                    lineHeight: 0.92,
                    display: "inline-block",
                  }}
                >
                  Creador Digital
                </span>
              </div>
            </div>
          </div>

          {/* Curve mask — sits at bottom of frame (pies). Only visible when reveal completes. */}
          <div className="pb-curve" />
        </div>
      </div>
    </section>
  );
}
