"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Minimal loader inspired by juanmora.co.
 * - Cream overlay, small centered wordmark, thin vertical peach line that grows.
 * - Tiny live counter to give signal of progress.
 * - Line expands to fill, overlay slides up off screen.
 */
export default function Loader() {
  const overlay = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const wordmark = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.set(line.current, { xPercent: -50, yPercent: -50 });

    const c = { v: 0 };
    const tl = gsap.timeline();

    tl.to(c, {
      v: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counter.current) counter.current.textContent = String(Math.floor(c.v)).padStart(3, "0");
      },
    }, 0.2)
      .fromTo(
        line.current,
        { height: "0%", width: "1px" },
        { height: "55%", duration: 1.6, ease: "power3.inOut" },
        0.2
      )
      .to(wordmark.current, { autoAlpha: 0, duration: 0.4, ease: "power2.out" }, 1.6)
      .to(line.current, { autoAlpha: 0, duration: 0.3 }, 1.7)
      .to(overlay.current, { yPercent: -100, duration: 1.0, ease: "expo.inOut" }, 1.9)
      .set(overlay.current, { display: "none" });
  }, []);

  return (
    <div ref={overlay} className="loader-root">
      <div ref={wordmark} className="loader-wordmark">
        <span>Santi</span>
        <span className="loader-name-dot" />
        <span>Chill</span>
      </div>
      <div ref={line} className="loader-line" />
      <div className="loader-foot">
        <span className="loader-foot-tag">Personal Brand Strategist</span>
        <span className="loader-foot-num">
          <span ref={counter}>000</span>
          <span className="loader-foot-pct">%</span>
        </span>
      </div>
    </div>
  );
}
