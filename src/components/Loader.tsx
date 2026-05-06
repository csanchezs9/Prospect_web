"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Replica del loader de juanmora.co:
 * - container-loader: full viewport, fixed, pointer-events none
 * - orange-intro: overlay GRIS con texto "Camilo • Sanchez" (pequeño, naranja)
 * - grow-line: línea naranja diminuta que crece en height (no scaleX)
 * - Al final: overlay sale hacia arriba, line fade.
 */
export default function Loader() {
  const overlay = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Anchor: keep line centered while size grows (xPercent/yPercent -50)
    gsap.set(line.current, { xPercent: -50, yPercent: -50 });

    const tl = gsap.timeline();
    tl.fromTo(
      line.current,
      { height: "1%", width: "2%" },
      { height: "60%", duration: 1.2, ease: "power3.inOut" },
      0.2
    )
      .to(text.current, { autoAlpha: 0, duration: 0.4, ease: "power2.out" }, 1.0)
      .to(line.current, { width: "100%", height: "100%", duration: 0.6, ease: "expo.inOut" }, 1.1)
      .to(overlay.current, { yPercent: -100, duration: 1.0, ease: "expo.inOut" }, 1.6)
      .to(line.current, { autoAlpha: 0, duration: 0.4 }, 1.6)
      .set([overlay.current, line.current], { display: "none" });
  }, []);

  return (
    <div className="container-loader">
      <div ref={overlay} className="orange-intro">
        <div ref={text} className="cont-juan-intro">
          <span className="nav-name-jm intro">Camilo</span>
          <span className="dot-jm intro" />
          <span className="nav-name-jm intro">Sanchez</span>
        </div>
      </div>
      <div ref={line} className="grow-line" />
    </div>
  );
}
