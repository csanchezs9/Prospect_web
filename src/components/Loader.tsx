"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Editorial loader for a personal brand strategist.
 * - Cream overlay, ink typography, peach progress accents.
 * - Bottom-left: counter 00 → 100.
 * - Bottom-right: rotating phase label (Auditando / Narrando / Posicionando / Construyendo).
 * - Top-right: name reveal at the end before exit.
 * - Thin peach progress bar bottom edge.
 * - Overlay slides up on completion.
 */
export default function Loader() {
  const overlay = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const phase = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLDivElement>(null);
  const meta = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const phases = ["AUDITANDO", "NARRANDO", "POSICIONANDO", "CONSTRUYENDO"];
    const c = { v: 0 };

    const tl = gsap.timeline();

    // Bar fills + counter ticks in sync
    tl.to(bar.current, { scaleX: 1, duration: 2.6, ease: "power2.inOut" }, 0)
      .to(
        c,
        {
          v: 100,
          duration: 2.6,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counter.current) counter.current.textContent = String(Math.floor(c.v)).padStart(3, "0");
          },
        },
        0
      );

    // Phase labels rotate (each label swaps in over 0.65s)
    phases.forEach((p, i) => {
      tl.set(phase.current, { textContent: p }, i * 0.65)
        .fromTo(phase.current, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "expo.out" }, i * 0.65)
        .to(phase.current, { yPercent: -100, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, i * 0.65 + 0.45);
    });

    // Name reveal at the end
    tl.fromTo(
      name.current,
      { yPercent: 110, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "expo.out" },
      2.4
    );

    // Exit
    tl.to(meta.current, { autoAlpha: 0, duration: 0.4, ease: "power2.out" }, 3.0)
      .to(overlay.current, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 3.2)
      .set(overlay.current, { display: "none" });
  }, []);

  return (
    <div ref={overlay} className="loader-root">
      <div ref={meta} className="loader-meta">
        <span className="loader-tag top-left">Personal Brand Strategist</span>
        <span className="loader-tag top-right">2026 — Bogotá / Remote</span>

        <div className="loader-counter bottom-left">
          <span ref={counter}>000</span>
          <span className="loader-counter-pct">%</span>
        </div>

        <div className="loader-phase bottom-right">
          <div className="loader-phase-mask">
            <div ref={phase} className="loader-phase-text">AUDITANDO</div>
          </div>
        </div>
      </div>

      <div ref={name} className="loader-name">
        <span>Santi</span>
        <span className="loader-name-dot" />
        <span>Chill</span>
      </div>

      <div className="loader-bar-track">
        <div ref={bar} className="loader-bar-fill" />
      </div>
    </div>
  );
}
