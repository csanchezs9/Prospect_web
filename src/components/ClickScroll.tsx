"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Click + Scroll section
 * Estructura: 1 sección 300vh con escena pinneada (sticky h-screen).
 * Fases (scroll progress):
 *   0–10%   headline solo
 *   10–45%  shape A entra (izq) + línea A se dibuja desde primera L hasta shape, ilumina
 *   45–55%  shape A se aleja
 *   55–90%  shape B entra (der) + línea B desde segunda L, ilumina
 *   90–100% salida
 *
 * Líneas se reconstruyen cada frame con rects vivos (L anchor + shape rect).
 */
const TARGETS = [
  { src: "/shapes/big-circle-scroll1.png", className: "left-[6vw] top-1/2 -translate-y-1/2 w-[28vw] max-w-[440px]" },
  { src: "/shapes/big-circle-scroll3.png", className: "right-[6vw] top-1/2 -translate-y-1/2 w-[28vw] max-w-[440px]" },
];

export default function ClickScroll() {
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLSpanElement>(null);
  const lAnchor1 = useRef<HTMLSpanElement>(null);
  const lAnchor2 = useRef<HTMLSpanElement>(null);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shapeRefs = useRef<(HTMLImageElement | null)[]>([]);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const headRefs = useRef<(SVGCircleElement | null)[]>([]);
  const haloRefs = useRef<(SVGCircleElement | null)[]>([]);

  const [, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = ref.current!;
      const pin = pinRef.current!;

      // estado de progreso por línea (0 → 1)
      const prog = { a: 0, b: 0 };

      // fases por shape: entrada, dibujo línea, salida
      // shape A
      gsap.set(wrapRefs.current[0], { opacity: 0, y: 80, scale: 0.9 });
      gsap.to(wrapRefs.current[0], {
        opacity: 1, y: 0, scale: 1, ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top+=10% top", end: "top+=25% top", scrub: 1.2 },
      });
      gsap.to(prog, {
        a: 1, ease: "none",
        scrollTrigger: { trigger: section, start: "top+=12% top", end: "top+=20% top", scrub: 0.2 },
      });
      gsap.to(wrapRefs.current[0], {
        opacity: 0, y: -60, scale: 0.92, ease: "power2.in",
        scrollTrigger: { trigger: section, start: "top+=48% top", end: "top+=58% top", scrub: 1 },
      });

      // shape B
      gsap.set(wrapRefs.current[1], { opacity: 0, y: 80, scale: 0.9 });
      gsap.to(wrapRefs.current[1], {
        opacity: 1, y: 0, scale: 1, ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top+=14% top", end: "top+=24% top", scrub: 1.2 },
      });
      gsap.to(prog, {
        b: 1, ease: "none",
        scrollTrigger: { trigger: section, start: "top+=16% top", end: "top+=24% top", scrub: 0.2 },
      });
      gsap.to(wrapRefs.current[1], {
        opacity: 0, y: -60, ease: "power2.in",
        scrollTrigger: { trigger: section, start: "top+=92% top", end: "bottom bottom", scrub: 1 },
      });

      // headline reveal entry — dispara al entrar la sección al viewport
      gsap.from(".cs-headline .word", {
        yPercent: 110, stagger: 0.06, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });

      // ticker — reconstruye paths cada frame desde L anchor → shape rect (live)
      const anchors = [lAnchor1, lAnchor2];
      const draw = () => {
        const pinRect = pin.getBoundingClientRect();
        for (let i = 0; i < 2; i++) {
          const anchor = anchors[i].current;
          const shape = shapeRefs.current[i];
          const line = lineRefs.current[i];
          const head = headRefs.current[i];
          const halo = haloRefs.current[i];
          if (!anchor || !shape || !line || !head || !halo) continue;
          const aRect = anchor.getBoundingClientRect();
          const tRect = shape.getBoundingClientRect();
          const sx = aRect.left + aRect.width / 2 - pinRect.left;
          const sy = aRect.bottom - pinRect.top;
          const ex = tRect.left + tRect.width / 2 - pinRect.left;
          const ey = tRect.top + tRect.height / 2 - pinRect.top;
          const dx = ex - sx;
          const dy = ey - sy;
          const bow = i === 0 ? -1 : 1;
          const cp1x = sx + dx * 0.08 + bow * 30;
          const cp1y = sy + Math.max(80, Math.abs(dy) * 0.4);
          const cp2x = sx + dx * 0.7 - bow * 50;
          const cp2y = sy + dy * 0.88;
          line.setAttribute("d", `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`);
          const len = line.getTotalLength();
          const p = Math.max(0, Math.min(1, i === 0 ? prog.a : prog.b));
          line.style.strokeDasharray = `${len}`;
          line.style.strokeDashoffset = `${len * (1 - p)}`;
          if (p > 0.001) {
            const pt = line.getPointAtLength(len * p);
            head.setAttribute("cx", `${pt.x}`); head.setAttribute("cy", `${pt.y}`);
            halo.setAttribute("cx", `${pt.x}`); halo.setAttribute("cy", `${pt.y}`);
          }
          const visible = p > 0.02 && p < 0.985;
          head.style.opacity = visible ? "1" : "0";
          halo.style.opacity = visible ? "0.4" : "0";
          if (p > 0.95) shape.classList.add("lit");
          else shape.classList.remove("lit");
        }
      };
      gsap.ticker.add(draw);
      // cleanup ticker on revert
      return () => gsap.ticker.remove(draw);
    }, ref);
    return () => ctx.revert();
  }, []);

  const onClick = () => {
    countRef.current += 1;
    setCount(countRef.current);
    const h = hoverRef.current;
    if (!h) return;
    h.innerText = countRef.current === 1 ? "another click!" : `clicks: ${countRef.current}`;
    gsap.fromTo(h, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
  };
  const onEnter = () => {
    const h = hoverRef.current;
    if (!h) return;
    h.innerText = countRef.current === 0 ? "who is curious?" : `clicks: ${countRef.current}`;
    gsap.to(h, { opacity: 1, duration: 0.3, delay: 0.15 });
  };
  const onLeave = () => { gsap.to(hoverRef.current, { opacity: 0, duration: 0.3 }); };

  const headline = "15 years making people click and scroll my designs".split(" ");

  return (
    <section
      ref={ref}
      data-nav="grey"
      className="relative bg-white"
      style={{ height: "150vh" }}
    >
      <div ref={pinRef} className="sticky top-0 h-screen overflow-hidden">
        {/* SVG líneas — encima de shapes */}
        <svg className="absolute inset-0 w-full h-full z-[20] pointer-events-none" fill="none" aria-hidden>
          <defs>
            <filter id="cs-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[0, 1].map((i) => (
            <g key={i}>
              <path
                ref={(el) => { lineRefs.current[i] = el; }}
                stroke="var(--orange1)"
                strokeWidth={1.6}
                strokeLinecap="round"
              />
              <g filter="url(#cs-glow)">
                <circle ref={(el) => { haloRefs.current[i] = el; }} r={10} fill="var(--orange1)" opacity={0} />
                <circle ref={(el) => { headRefs.current[i] = el; }} r={3.6} fill="var(--orange1)" opacity={0} />
              </g>
            </g>
          ))}
        </svg>

        {/* shapes — cada una en su fase */}
        {TARGETS.map((t, i) => (
          <div
            key={i}
            ref={(el) => { wrapRefs.current[i] = el; }}
            className={`absolute ${t.className} z-[5] pointer-events-none`}
          >
            <img
              ref={(el) => { shapeRefs.current[i] = el; }}
              src={t.src}
              alt=""
              className="cs-shape w-full"
            />
          </div>
        ))}

        {/* headline centrado */}
        <div className="absolute inset-0 z-[10] flex items-center justify-center px-6 md:px-10">
          <h2 className="cs-headline h-display text-[14vw] md:text-[9vw] leading-[1.05] flex flex-wrap items-center justify-center text-center gap-x-[0.25em] gap-y-[0.05em] max-w-[1600px]">
            {headline.map((w, i) => {
              if (w === "click") {
                return (
                  <span key={i} className="inline-block overflow-hidden">
                    <span
                      onClick={onClick}
                      onMouseEnter={onEnter}
                      onMouseLeave={onLeave}
                      className="word click-btn"
                    >
                      click
                      <span ref={hoverRef} className="click-hover-text">who is curious?</span>
                    </span>
                  </span>
                );
              }
              if (w === "scroll") {
                const letters = "scroll".split("");
                return (
                  <span key={i} className="inline-block overflow-hidden">
                    <span className="word inline-flex px-6 py-1 rounded-full border-2 border-[var(--ink)] text-[var(--ink)]">
                      {letters.map((c, j) => {
                        const r = j === 4 ? lAnchor1 : j === 5 ? lAnchor2 : undefined;
                        return (
                          <span key={j} ref={r} className="relative inline-block">
                            {c}
                          </span>
                        );
                      })}
                    </span>
                  </span>
                );
              }
              return (
                <span key={i} className="inline-block overflow-hidden">
                  <span className="word inline-block">{w}</span>
                </span>
              );
            })}
          </h2>
        </div>
      </div>
    </section>
  );
}
