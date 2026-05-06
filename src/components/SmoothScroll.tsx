"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let raf = 0;
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
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("lenis:lock", onLock as EventListener);
      if (lockTimeout !== null) window.clearTimeout(lockTimeout);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}
