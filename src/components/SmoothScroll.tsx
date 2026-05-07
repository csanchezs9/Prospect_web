"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// Detect in-app browsers (Instagram, Facebook, TikTok, Line) — they resize the
// viewport when their chrome shows/hides which makes scrubbed ScrollTriggers
// jump. We disable smooth scroll there and fall back to native scroll.
const isInAppBrowser = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || (navigator as Navigator & { vendor?: string }).vendor || "";
  return /Instagram|FBAN|FBAV|FB_IAB|Line\//i.test(ua) || /TikTok/i.test(ua);
};

export default function SmoothScroll() {
  useEffect(() => {
    // Ignore the small height-only viewport changes caused by mobile browser
    // chrome (URL bar collapse/expand). ScrollTrigger still refreshes on real
    // width changes / orientation flips.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const iab = isInAppBrowser();

    // Refresh ScrollTrigger only on orientation change (not on every URL-bar
    // resize). Helps Instagram IAB stop "teleporting".
    const onOrientation = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("orientationchange", onOrientation);

    if (iab) {
      // Native scroll only — keeps iOS momentum/physics. Do NOT use
      // ScrollTrigger.normalizeScroll here: it disables touch momentum and
      // tanks FPS inside Instagram/Facebook in-app browsers.
      return () => {
        window.removeEventListener("orientationchange", onOrientation);
      };
    }

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
      window.removeEventListener("orientationchange", onOrientation);
      window.removeEventListener("lenis:lock", onLock as EventListener);
      if (lockTimeout !== null) window.clearTimeout(lockTimeout);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);
  return null;
}
