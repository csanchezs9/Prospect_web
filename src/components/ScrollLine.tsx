"use client";
import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/**
 * Carretera serpenteante:
 *  - Cuerpo grueso (road body) + borde oscuro (edge)
 *  - Línea central blanca discontinua (lane markings)
 *  - "Headlight": círculo brillante que recorre el path con el scroll
 *  - Reveal vía <mask> con stroke-dashoffset animado, scrub
 *
 * Variantes:
 *   scroll  → loops dramáticos
 *   benefit → curva suave
 */
type Variant = "scroll" | "benefit";

const PATHS: Record<Variant, { d: string; viewBox: string }> = {
  scroll: {
    viewBox: "0 0 400 1600",
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
  strokeWidth = 14,
  onProgress,
}: {
  trigger?: string;
  className?: string;
  color?: string;
  variant?: Variant;
  strokeWidth?: number;
  onProgress?: (p: number) => void;
}) {
  const maskRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const bodyPathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/[:]/g, "");

  useEffect(() => {
    const mask = maskRef.current;
    const head = headRef.current;
    const body = bodyPathRef.current;
    if (!mask || !head || !body) return;

    const len = mask.getTotalLength();
    gsap.set(mask, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(head, { opacity: 0 });

    const t = trigger
      ? document.querySelector(trigger)
      : svgRef.current?.closest("section");
    if (!t) return;

    const reveal = gsap.to(mask, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: t,
        start: "top 90%",
        end: "bottom 10%",
        scrub: 1.2,
        onUpdate: (self) => onProgress?.(self.progress),
      },
    });

    const headTween = gsap.to(head, {
      motionPath: {
        path: body,
        align: body,
        alignOrigin: [0.5, 0.5],
        autoRotate: false,
      },
      ease: "none",
      scrollTrigger: {
        trigger: t,
        start: "top 90%",
        end: "bottom 10%",
        scrub: 1.2,
        onEnter: () => gsap.to(head, { opacity: 1, duration: 0.4 }),
        onLeaveBack: () => gsap.to(head, { opacity: 0, duration: 0.3 }),
      },
    });

    // halo pulse (independent of scroll)
    const pulse = gsap.to(head.querySelector(".rl-halo"), {
      scale: 1.4,
      opacity: 0.15,
      duration: 1.2,
      transformOrigin: "center",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      reveal.scrollTrigger?.kill();
      reveal.kill();
      headTween.scrollTrigger?.kill();
      headTween.kill();
      pulse.kill();
    };
  }, [trigger, onProgress]);

  const cfg = PATHS[variant];
  const d = cfg.d.replace(/\s+/g, " ").trim();
  const maskId = `roadmask-${uid}`;
  const glowId = `roadglow-${uid}`;

  return (
    <svg
      ref={svgRef}
      className={`absolute pointer-events-none ${className}`}
      viewBox={cfg.viewBox}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <defs>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <path
            ref={maskRef}
            d={d}
            stroke="white"
            strokeWidth={strokeWidth * 2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        {/* edge / shadow */}
        <path
          d={d}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* road body */}
        <path
          ref={bodyPathRef}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* lane markings */}
        <path
          d={d}
          stroke="white"
          strokeWidth={Math.max(1.5, strokeWidth * 0.18)}
          strokeLinecap="round"
          strokeDasharray={`${strokeWidth * 1.2} ${strokeWidth * 1.4}`}
          vectorEffect="non-scaling-stroke"
          opacity={0.85}
        />
      </g>

      {/* headlight */}
      <g ref={headRef} filter={`url(#${glowId})`}>
        <circle className="rl-halo" r={strokeWidth * 1.6} fill={color} opacity={0.35} />
        <circle r={strokeWidth * 0.55} fill="white" />
      </g>
    </svg>
  );
}
