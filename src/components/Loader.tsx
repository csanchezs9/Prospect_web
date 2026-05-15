"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Minimal loader inspired by juanmora.co.
 * - Cream overlay, small centered wordmark with peach dot between "Ron" and "Lach".
 * - Tiny live counter for progress signal.
 * - Dot expands to paint the screen, overlay slides up off screen.
 */
export default function Loader() {
  const overlay = useRef<HTMLDivElement>(null);
  const wordmark = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const foot = useRef<HTMLDivElement>(null);
  const paint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = { v: 0 };

    const chars = Array.from(
      wordmark.current?.querySelectorAll<HTMLSpanElement>(".loader-char") ?? []
    );
    const stopBounce = () => {
      chars.forEach((el) => el.classList.add("is-stopped"));
      wordmark.current?.querySelector(".loader-name-dot")?.classList.add("is-stopped");
    };

    const positionPaint = () => {
      const dotEl = wordmark.current?.querySelector<HTMLElement>(".loader-name-dot");
      const p = paint.current;
      if (!dotEl || !p) return { cx: window.innerWidth / 2, cy: window.innerHeight / 2, r: 0 };
      const r = dotEl.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const radius = Math.max(r.width, r.height) / 2;
      const startCp = `circle(${radius}px at ${cx}px ${cy}px)`;
      p.style.clipPath = startCp;
      (p.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = startCp;
      p.style.opacity = "1";
      return { cx, cy, r: radius };
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
      .add(() => {
        const { cx, cy, r } = positionPaint();
        const maxR = Math.hypot(
          Math.max(cx, window.innerWidth - cx),
          Math.max(cy, window.innerHeight - cy)
        ) * 1.05;
        gsap.set(".loader-name-dot", { autoAlpha: 0 });
        gsap.fromTo(
          paint.current,
          { clipPath: `circle(${r}px at ${cx}px ${cy}px)`, webkitClipPath: `circle(${r}px at ${cx}px ${cy}px)` },
          {
            clipPath: `circle(${maxR}px at ${cx}px ${cy}px)`,
            webkitClipPath: `circle(${maxR}px at ${cx}px ${cy}px)`,
            duration: 1.0,
            ease: "expo.inOut",
          }
        );
      }, 1.7)
      .to(overlay.current, { yPercent: -100, duration: 1.0, ease: "expo.inOut" }, 2.55)
      .set(overlay.current, { display: "none" });
  }, []);

  return (
    <div ref={overlay} className="loader-root">
      <div ref={wordmark} className="loader-wordmark">
        <span className="loader-text">
          {"Ron".split("").map((ch, i) => (
            <span key={`s-${i}`} className="loader-char">{ch}</span>
          ))}
        </span>
        <span className="loader-name-dot" />
        <span className="loader-text">
          {"Lach".split("").map((ch, i) => (
            <span key={`c-${i}`} className="loader-char">{ch}</span>
          ))}
        </span>
      </div>
      <div ref={paint} className="loader-paint" />
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
