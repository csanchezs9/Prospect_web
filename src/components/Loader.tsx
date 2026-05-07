"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Minimal loader inspired by juanmora.co.
 * - Cream overlay, small centered wordmark with peach dot between "Santi" and "Chill".
 * - Tiny live counter for progress signal.
 * - Dot expands to paint the screen, overlay slides up off screen.
 */
export default function Loader() {
  const overlay = useRef<HTMLDivElement>(null);
  const wordmark = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const foot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = { v: 0 };

    const chars = Array.from(
      wordmark.current?.querySelectorAll<HTMLSpanElement>(".loader-char") ?? []
    );
    // CSS-driven hop (more reliable across HMR + paint scheduling)
    chars.forEach((el, i) => {
      el.style.display = "inline-block";
      el.style.willChange = "transform";
      el.style.animation = `loaderHop 0.9s ease-in-out ${i * 0.08}s infinite`;
    });
    const stopBounce = () => {
      chars.forEach((el) => {
        el.style.animation = "none";
        el.style.transform = "translateY(0)";
      });
    };

    const tl = gsap.timeline();

    tl.to(c, {
      v: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counter.current) counter.current.textContent = String(Math.floor(c.v)).padStart(3, "0");
      },
    }, 0.2)
      .add(stopBounce, 1.55)
      .to(".loader-text, .loader-foot", { autoAlpha: 0, duration: 0.35, ease: "power2.out" }, 1.6)
      .to(
        ".loader-name-dot",
        { scale: 220, duration: 1.0, ease: "expo.inOut", transformOrigin: "50% 50%" },
        1.7
      )
      .to(overlay.current, { yPercent: -100, duration: 1.0, ease: "expo.inOut" }, 2.55)
      .set(overlay.current, { display: "none" });
  }, []);

  return (
    <div ref={overlay} className="loader-root">
      <div ref={wordmark} className="loader-wordmark">
        <span className="loader-text">
          {"Santi".split("").map((ch, i) => (
            <span key={`s-${i}`} className="loader-char">{ch}</span>
          ))}
        </span>
        <span className="loader-name-dot" />
        <span className="loader-text">
          {"Chill".split("").map((ch, i) => (
            <span key={`c-${i}`} className="loader-char">{ch}</span>
          ))}
        </span>
      </div>
      <div ref={foot} className="loader-foot">
        <span className="loader-foot-tag">Personal Brand Strategist</span>
        <span className="loader-foot-num">
          <span ref={counter}>000</span>
          <span className="loader-foot-pct">%</span>
        </span>
      </div>
    </div>
  );
}
