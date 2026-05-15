"use client";
import { useRef, useState } from "react";
import gsap from "gsap";

const EMAIL = "ronlach@gmail.com";

export default function Cta() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    if (copied) return;
    try { await navigator.clipboard.writeText(EMAIL); } catch {}
    setCopied(true);

    gsap.fromTo(
      btnRef.current,
      { scale: 0.94 },
      { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.45)" }
    );

    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section data-nav="grey" className="bg-[var(--bg-grey)] px-6 md:px-10 py-40 text-center">
      <h2 className="h-display text-[10vw] md:text-[6vw] leading-[0.95]">
        Construyamos algo
        <br />
        que la gente <em className="not-italic text-[var(--orange2)]">recuerde</em>.
      </h2>
      <p className="mt-6 text-lg">desde startups hasta empresas globales.</p>

      <button
        ref={btnRef}
        type="button"
        onClick={onClick}
        aria-label={copied ? "Email copiado" : "Copiar email"}
        className="inline-flex items-center justify-center gap-3 mt-16 px-10 py-6 rounded-full h-display text-2xl md:text-4xl will-change-transform transition-colors duration-300 appearance-none border-0 cursor-pointer"
        style={{
          background: copied ? "var(--orange1)" : "var(--ink)",
          color: copied ? "var(--ink)" : "var(--bg-warm)",
        }}
      >
        <span className="relative w-7 h-7 inline-block">
          <svg
            className={`absolute inset-0 transition-all duration-300 ${copied ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          <svg
            className={`absolute inset-0 transition-all duration-300 ${copied ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M4 12l5 5L20 6" />
          </svg>
        </span>
        <span className="leading-none">{copied ? "copied!" : "copy email"}</span>
      </button>
    </section>
  );
}
