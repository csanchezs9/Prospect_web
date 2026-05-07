"use client";
import { useLayoutEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// Detect in-app browsers (Instagram, Facebook, TikTok, Line). Their top chrome
// shows/hides on scroll which resizes the viewport and makes the page
// auto-scroll ("teleport"). Inside IAB we lock root scroll and let the inner
// #scroll-wrapper own the scroll: window stays at 0 so chrome never toggles.
const isInAppBrowser = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || (navigator as Navigator & { vendor?: string }).vendor || "";
  return /Instagram|FBAN|FBAV|FB_IAB|Line\//i.test(ua) || /TikTok/i.test(ua);
};

export default function SmoothScroll() {
  // useLayoutEffect runs synchronously before paint AND before deeper page
  // effects, so ScrollTrigger.defaults({ scroller }) is set before children
  // (Hero, ClickScroll, PersonalBrand, ...) create their triggers.
  useLayoutEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const iab = isInAppBrowser();

    const onOrientation = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("orientationchange", onOrientation);

    if (iab) {
      const wrapper = document.getElementById("scroll-wrapper");
      document.documentElement.classList.add("iab");
      if (wrapper) {
        ScrollTrigger.defaults({ scroller: wrapper });
      }
      return () => {
        window.removeEventListener("orientationchange", onOrientation);
        document.documentElement.classList.remove("iab");
        ScrollTrigger.defaults({ scroller: undefined });
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
