"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function Nav() {
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between">
      <Link href="/" className="flex items-baseline gap-2 font-medium tracking-tight">
        <span className="nav-name-jm">Camilo</span>
        <span className="w-2 h-2 rounded-full bg-[var(--orange1)] inline-block translate-y-[-2px]" />
        <span className="nav-name-jm">Sanchez</span>
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-sm">
        <Link href="/about" className="nav-link" data-hover data-hover-text="About me">About</Link>
        <Link href="/work" className="nav-link" data-hover data-hover-text="See work">Work</Link>
      </nav>
      <ul className="hidden md:flex items-center gap-5 text-sm">
        <li><a className="nav-social-link" href="mailto:camilosanchezwwe@gmail.com">Email</a></li>
        <li><a className="nav-social-link" href="https://linkedin.com" target="_blank">in</a></li>
        <li><a className="nav-social-link" href="https://x.com" target="_blank">x</a></li>
        <li><a className="nav-social-link" href="https://behance.net" target="_blank">Be</a></li>
      </ul>
    </header>
  );
}
