"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Línea decorativa estilo "scribble" que serpentea entre las shapes.
 * - Path con varios bucles/curvas (no recto).
 * - Se dibuja con stroke-dashoffset según scroll progress (scrub).
 * - viewBox amplio para soportar escala vertical larga.
 *
 * Variantes:
 *   variant="scroll"  → bucle dramático con loops para sección click+scroll.
 *   variant="benefit" → curva suave para la sección about/benefits.
 */
type Variant = "scroll" | "benefit";

const PATHS: Record<Variant, { d: string; viewBox: string }> = {
  scroll: {
    viewBox: "0 0 400 1600",
    // Path serpentea: arranca arriba centro, baja con curvas amplias,
    // hace 2 loops alrededor de zonas de shapes, termina abajo centro.
    d: `
      M 200 0
      C 220 80, 320 120, 340 220
      S 280 360, 180 380
      S 60 420, 80 540
      C 100 640, 240 660, 300 740
      S 360 900, 240 940
      S 80 980, 90 1080
      C 100 1180, 260 1220, 300 1320
      S 220 1480, 200 1600
    `,
  },
  benefit: {
    viewBox: "0 0 200 1200",
    d: `
      M 100 0
      C 120 120, 40 220, 100 340
      S 160 520, 100 660
      S 40 860, 100 1000
      S 120 1120, 100 1200
    `,
  },
};

export default function ScrollLine({
  trigger,
  className = "",
  color = "var(--orange1)",
  variant = "scroll",
  strokeWidth = 1.4,
}: {
  trigger?: string;
  className?: string;
  color?: string;
  variant?: Variant;
  strokeWidth?: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    const t = trigger
      ? document.querySelector(trigger)
      : svgRef.current?.closest("section");
    if (!t) return;

    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: t,
        start: "top 90%",
        end: "bottom 10%",
        scrub: 1.2,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [trigger]);

  const cfg = PATHS[variant];

  return (
    <svg
      ref={svgRef}
      className={`absolute pointer-events-none ${className}`}
      viewBox={cfg.viewBox}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <path
        ref={pathRef}
        d={cfg.d.replace(/\s+/g, " ").trim()}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
