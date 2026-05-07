"use client";
import { useEffect, useRef } from "react";
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
  { src: "/shapes/big-circle-scroll1.png", className: "left-[4vw] bottom-[6vh] w-[24vw] max-w-[380px]" },
  { src: "/shapes/big-circle-scroll3.png", className: "right-[4vw] top-[6vh] w-[24vw] max-w-[380px]" },
];

export default function ClickScroll() {
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const lAnchor1 = useRef<HTMLSpanElement>(null);
  const lAnchor2 = useRef<HTMLSpanElement>(null);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shapeRefs = useRef<(HTMLImageElement | null)[]>([]);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const headRefs = useRef<(SVGCircleElement | null)[]>([]);
  const haloRefs = useRef<(SVGCircleElement | null)[]>([]);

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
        const headlineEl = pin.querySelector(".cs-headline") as HTMLElement | null;
        const hRect = headlineEl?.getBoundingClientRect();
        const hLeft = hRect ? hRect.left - pinRect.left - 16 : 0;
        const hRight = hRect ? hRect.right - pinRect.left + 16 : pinRect.width;
        const hTop = hRect ? hRect.top - pinRect.top - 16 : 0;
        const hBottom = hRect ? hRect.bottom - pinRect.top + 16 : pinRect.height;
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

          // Arc simetrico: cp1 y cp2 bowing perpendicular a la linea start->end,
          // mismo signo que dx. Resultado: arco redondo limpio, sin S-shape ni overshoot.
          const dx = ex - sx;
          const dy = ey - sy;
          const dist = Math.hypot(dx, dy) || 1;
          let nx = -dy / dist;
          let ny = dx / dist;
          // forzar perpendicular que apunte hacia el lado del shape (outward de text)
          if ((dx >= 0 && nx < 0) || (dx < 0 && nx > 0)) {
            nx = -nx; ny = -ny;
          }
          const arc = Math.min(dist * 0.32, 260);
          const cp1x = sx + dx * 0.2 + nx * arc;
          const cp1y = sy + dy * 0.2 + ny * arc;
          const cp2x = sx + dx * 0.8 + nx * arc;
          const cp2y = sy + dy * 0.8 + ny * arc;
          line.setAttribute(
            "d",
            `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`
          );
          const len = line.getTotalLength();
          const p = Math.max(0, Math.min(1, i === 0 ? prog.a : prog.b));
          line.style.strokeDasharray = `${len}`;
          line.style.strokeDashoffset = `${len * (1 - p)}`;
          if (p > 0.001) {
            const pt = line.getPointAtLength(len * p);
            head.setAttribute("cx", `${pt.x}`); head.setAttribute("cy", `${pt.y}`);
            halo.setAttribute("cx", `${pt.x}`); halo.setAttribute("cy", `${pt.y}`);
          }
          const visible = p > 0.02;
          head.style.opacity = visible ? "1" : "0";
          halo.style.opacity = visible ? "0.4" : "0";
          if (p > 0.95) shape.classList.add("lit");
          else shape.classList.remove("lit");
        }
      };
      gsap.ticker.add(draw);
      return () => gsap.ticker.remove(draw);
    }, ref);
    return () => ctx.revert();
  }, []);

  const headline = "Construyo marca personal que deja huella en tu nicho".split(" ");

  return (
    <section
      ref={ref}
      data-nav="grey"
      className="relative bg-white"
      style={{ height: "150vh" }}
    >
      <div ref={pinRef} className="sticky top-0 h-screen overflow-hidden">
        {/* SVG líneas clean — debajo del texto */}
        <svg className="absolute inset-0 w-full h-full z-[6] pointer-events-none" fill="none" aria-hidden style={{ opacity: 0.75 }}>
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
                strokeWidth={3.6}
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
              if (w === "huella") {
                const letters = "huella".split("");
                return (
                  <span key={i} className="inline-block overflow-hidden">
                    <span className="word inline-flex px-6 py-1 rounded-full border-2 border-[var(--ink)] text-[var(--ink)]">
                      {letters.map((c, j) => {
                        const r = j === 3 ? lAnchor1 : j === 4 ? lAnchor2 : undefined;
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
