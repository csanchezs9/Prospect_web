"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let lockTimeout: number | null = null;

    const lockScroll = (duration: number) => {
      if (lockTimeout !== null) return;
      lenis.stop();
      lockTimeout = window.setTimeout(() => {
        lenis.start();
        lockTimeout = null;
      }, duration);
    };

    const onLock = (event: Event) => {
      const detail = (event as CustomEvent<{ duration?: number }>).detail;
      lockScroll(detail?.duration ?? 1000);
    };

    window.addEventListener("lenis:lock", onLock as EventListener);

    // integracion oficial Lenis + GSAP ScrollTrigger (necesaria para pin sin jitter)
    lenis.on("scroll", ScrollTrigger.update);
    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("lenis:lock", onLock as EventListener);
      if (lockTimeout !== null) window.clearTimeout(lockTimeout);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);
  return null;
}
