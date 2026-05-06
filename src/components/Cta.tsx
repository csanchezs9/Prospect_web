"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const EMAIL = "camilosanchezwwe@gmail.com";

export default function Cta() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;
    const first = link.querySelector(".cta-icon-first") as HTMLElement;
    const last = link.querySelector(".cta-icon-last") as HTMLElement;

    const onIn = () => {
      gsap.to(first, { width: "2.8rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.5, 0.3)", overwrite: true });
      gsap.to(last, { width: "0rem", rotation: -90, opacity: 0, duration: 0.2, ease: "power2.out", overwrite: true });
    };
    const onOut = () => {
      gsap.to(first, { width: "0rem", rotation: -90, opacity: 0, duration: 0.3, ease: "power2.inOut", overwrite: true });
      gsap.to(last, { width: "2.8rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.6, 0.3)", overwrite: true });
    };
    link.addEventListener("mouseenter", onIn);
    link.addEventListener("mouseleave", onOut);
    return () => {
      link.removeEventListener("mouseenter", onIn);
      link.removeEventListener("mouseleave", onOut);
    };
  }, []);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section data-nav="grey" className="bg-[var(--bg-grey)] px-6 md:px-10 py-40 text-center">
      <h2 className="h-display text-[10vw] md:text-[6vw] leading-[0.95]">
        Construyamos algo
        <br />
        que la gente <em className="not-italic text-[var(--orange2)]">recuerde</em>.
      </h2>
      <p className="mt-6 text-lg">desde startups hasta empresas globales.</p>

      <a
        ref={linkRef}
        href={`mailto:${EMAIL}`}
        onClick={onClick}
        data-hover
        data-hover-text={copied ? "copied!" : "copy email"}
        className="cta-link inline-flex items-center mt-16 px-10 py-6 rounded-full bg-[var(--ink)] text-[var(--bg-warm)] h-display text-3xl md:text-5xl"
      >
        <span className="cta-icon-first"><img src="/shapes/arrow-grey.svg" alt="" /></span>
        <span className="px-3">{copied ? "¡Copiado!" : "Hablemos"}</span>
        <span className="cta-icon-last"><img src="/shapes/arrow-grey.svg" alt="" /></span>
      </a>
    </section>
  );
}
