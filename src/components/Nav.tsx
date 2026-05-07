"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Nav() {
  const headerRef = useRef<HTMLElement>(null);

  const scrollToServices = () => {
    const target = document.getElementById("services");
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-nav]");
    const els = document.querySelectorAll(".nav-link, .nav-name-jm, .nav-social-link");
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const theme = e.target.getAttribute("data-nav");
            els.forEach((el) =>
              theme === "peach" ? el.classList.add("is-peach") : el.classList.remove("is-peach")
            );
          }
        });
      },
      { rootMargin: "-50px 0px -90% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let lastY = window.scrollY;
    let ticking = false;
    const THRESHOLD = 8;
    const TOP_OFFSET = 80;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (y < TOP_OFFSET) {
        el.classList.remove("nav-hidden");
      } else if (delta > THRESHOLD) {
        el.classList.add("nav-hidden");
      } else if (delta < -THRESHOLD) {
        el.classList.remove("nav-hidden");
      }
      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={headerRef} className="nav-header fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-7 flex items-center justify-between text-lg">
      <Link href="/" className="flex items-baseline gap-2.5 font-medium tracking-tight text-xl">
        <span className="nav-name-jm">Santi</span>
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--orange1)] inline-block translate-y-[-2px]" />
        <span className="nav-name-jm">Chill </span>
      </Link>
      <nav className="hidden md:flex items-center gap-10 text-base">
        <button type="button" onClick={scrollToServices} className="nav-link cursor-pointer" data-hover data-hover-text="Servicios">About</button>
        <button type="button" onClick={scrollToServices} className="nav-link cursor-pointer" data-hover data-hover-text="Servicios">Work</button>
      </nav>
      <ul className="hidden md:flex items-center gap-6 text-base">
        <li><a className="nav-social-link" href="mailto:santichill@gmail.com">Email</a></li>
        <li><a className="nav-social-link" href="https://linkedin.com" target="_blank">in</a></li>
        <li><a className="nav-social-link" href="https://x.com" target="_blank">x</a></li>
        <li><a className="nav-social-link" href="https://behance.net" target="_blank">Be</a></li>
      </ul>
    </header>
  );
}
